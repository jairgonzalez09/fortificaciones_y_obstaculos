import { Router } from 'express';
import path from 'path';
import fs from 'fs/promises';
import sequelize from '../../db/connection.js';
import { MultimediaFiles, MultimediaInfo } from '../../models/index.js';
import { uploadStepperFiles } from '../../middlewares/upload.js';
import { validateBody } from '../../middlewares/validate.js';
import { protect, restrictToAdmin } from '../../middlewares/auth.js';
import { catalogStepperSchema } from '../../schemas/stepper.schema.js';
import { prepareStepperData } from '../../middlewares/stepperFields.js';
import { AppError } from '../../utils/index.js';

const router = Router();

router.post('/catalog-stepper', protect, restrictToAdmin, uploadStepperFiles, prepareStepperData, validateBody(catalogStepperSchema), async (req, res, next) => {
    const t = await sequelize.transaction();

    const processCatalog = async () => {
        const { name, description, classification, type, stepsText: parsedSteps } = req.body;
        const files = req.files || {};

        if (!files['coverImage'] || !files['coverImage'][0]) {
            throw new AppError('La imagen de portada es obligatoria', 400);
        }

        const coverImagePath = files['coverImage'][0].path.replace(/\\/g, '/');
        const coverFile = await MultimediaFiles.create({
            url: coverImagePath,
            type: 'image'
        }, { transaction: t });

        const catalogParent = await MultimediaInfo.create({
            name,
            description,
            classification,
            type,
            multimediaId: coverFile.id,
            parentId: null,
            stepOrder: null
        }, { transaction: t });

        const stepImagesFiles = files['stepImages'] || [];

        for (let i = 0; i < parsedSteps.length; i++) {
            const stepData = parsedSteps[i];
            const stepImage = stepImagesFiles[i];

            if (!stepImage || !stepImage.path) {
                throw new AppError(`Falta la imagen física para el paso número ${i + 1}`, 400);
            }

            const stepImagePath = stepImage.path.replace(/\\/g, '/');

            const stepFile = await MultimediaFiles.create({
                url: stepImagePath,
                type: 'image'
            }, { transaction: t });

            await MultimediaInfo.create({
                name: stepData.title || `Paso ${i + 1}`,
                description: stepData.description || '',
                classification,
                type,
                multimediaId: stepFile.id,
                parentId: catalogParent.id,
                stepOrder: i + 1,
            }, { transaction: t });
        }

        await t.commit();

        res.status(201).json({
            status: 'success',
            message: 'Catálogo y pasos secuenciales creados exitosamente.'
        });
    };

    processCatalog().catch(async (error) => {
        if (t && !t.finished) await t.rollback().catch(() => {});
        next(error); 
    });
});

router.put('/catalog/:id', protect, restrictToAdmin, uploadStepperFiles, prepareStepperData, validateBody(catalogStepperSchema), async (req, res, next) => {
    const { id } = req.params;
    const t = await sequelize.transaction();

    const processUpdate = async () => {
        const { name, description, classification, type, stepsText: parsedSteps } = req.body;
        const files = req.files || {}; // Evita lecturas accidentales de 'undefined'

        const catalogParent = await MultimediaInfo.findOne({
            where: { id, parentId: null },
            include: [{ model: MultimediaFiles, as: 'file' }]
        });

        if (!catalogParent) throw new AppError('El catálogo especificado no existe', 404);

        const parentUpdateData = { name, description, classification, type };

        if (files && files['coverImage'] && files['coverImage'][0]) {
            const oldCoverPath = path.join(process.cwd(), catalogParent.file.url);
            await fs.unlink(oldCoverPath).catch(() => {});

            const newCoverPath = files['coverImage'][0].path.replace(/\\/g, '/');
            await MultimediaFiles.update(
                { url: newCoverPath },
                { where: { id: catalogParent.multimediaId }, transaction: t }
            );
        }

        await catalogParent.update(parentUpdateData, { transaction: t });

        const oldSteps = await MultimediaInfo.findAll({
            where: { parentId: id },
            include: [{ model: MultimediaFiles, as: 'file' }]
        });

        const oldStepsFilesToDelete = oldSteps.map(step => path.join(process.cwd(), step.file.url));
        await Promise.all(oldStepsFilesToDelete.map(filePath => fs.unlink(filePath).catch(() => {})));

        await MultimediaInfo.destroy({ where: { parentId: id }, transaction: t });

        const stepImagesFiles = files['stepImages'] || [];

        for (let i = 0; i < parsedSteps.length; i++) {
            const stepData = parsedSteps[i];
            const stepImage = stepImagesFiles[i];

            if (!stepImage || !stepImage.path) {
                throw new AppError(`Falta la imagen para el paso número ${i + 1}`, 400);
            }

            const stepImagePath = stepImage.path.replace(/\\/g, '/');

            const stepFile = await MultimediaFiles.create({
                url: stepImagePath,
                type: 'image'
            }, { transaction: t });

            await MultimediaInfo.create({
                name: stepData.title || `Paso ${i + 1}`,
                description: stepData.description || '',
                classification,
                type,
                multimediaId: stepFile.id,
                parentId: catalogParent.id,
                stepOrder: i + 1,
            }, { transaction: t });
        }

        await t.commit();

        res.status(200).json({
            status: 'success',
            message: 'Catálogo y secuencia de pasos actualizados exitosamente.'
        });
    };

    processUpdate().catch(async (error) => {
        if (t && !t.finished) await t.rollback().catch(() => {});
        next(error);
    });
});

router.delete('/catalog/:id', protect, restrictToAdmin, (req, res, next) => {
    const { id } = req.params;

    MultimediaInfo.findOne({
        where: { id, parentId: null },
        include: [
            { model: MultimediaFiles, as: 'file' },
            { 
                model: MultimediaInfo, 
                as: 'steps', 
                include: [{ model: MultimediaFiles, as: 'file' }] 
            }
        ]
    })
    .then(async (catalog) => {
        if (!catalog) throw new AppError('El elemento del catálogo no existe', 404);

        const filesToDelete = [];

        if (catalog.file && catalog.file.url) {
            filesToDelete.push(path.join(process.cwd(), catalog.file.url));
        }

        if (catalog.steps && Array.isArray(catalog.steps)) {
            catalog.steps.forEach(step => {
                if (step.file && step.file.url) {
                    filesToDelete.push(path.join(process.cwd(), step.file.url));
                }
            });
        }

        await Promise.all(
            filesToDelete.map(filePath => 
                fs.unlink(filePath).catch(() => {})
            )
        );

        return catalog.destroy();
    })
    .then(() => {
        res.status(200).json({
            status: 'success',
            message: 'Catálogo, pasos secuenciales y archivos físicos eliminados exitosamente.'
        });
    })
    .catch(next);
});

export default router;