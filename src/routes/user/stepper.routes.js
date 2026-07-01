import { Router } from 'express';
import { MultimediaFiles, MultimediaInfo } from '../../models/index.js';
import { AppError } from '../../utils/index.js';

const router = Router();

router.get('/catalog', (req, res, next) => {
    MultimediaInfo.findAll({
        where: { parentId: null, isActive: true },
        include: [{
            model: MultimediaFiles,
            as: 'file',
            attributes: ['url', 'type']
        }]
    })
    .then(catalog => {
        res.status(200).json({
            status: 'success',
            data: catalog
        });
    })
    .catch(next);
});

router.get('/catalog/all', (req, res, next) => {
    MultimediaInfo.findAll({
        where: { parentId: null, isActive: true },
        include: [
            {
                model: MultimediaFiles,
                as: 'file',
                attributes: ['url', 'type']
            },
            {
                model: MultimediaInfo,
                as: 'steps',
                include: [{ 
                    model: MultimediaFiles, 
                    as: 'file', 
                    attributes: ['url', 'type'] 
                }]
            }
        ],
        order: [
            [{ model: MultimediaInfo, as: 'steps' }, 'stepOrder', 'ASC']
        ]
    })
    .then(catalog => {
        res.status(200).json({
            status: 'success',
            data: catalog
        });
    })
    .catch(next);
});

router.get('/catalog/fortificaciones/all', (req, res, next) => {
    MultimediaInfo.findAll({
        where: { parentId: null, classification: 'fortificaciones', isActive: true },
        include: [
            {
                model: MultimediaFiles,
                as: 'file',
                attributes: ['url', 'type']
            },
            {
                model: MultimediaInfo,
                as: 'steps',
                include: [{ 
                    model: MultimediaFiles, 
                    as: 'file', 
                    attributes: ['url', 'type'] 
                }]
            }
        ],
        order: [
            [{ model: MultimediaInfo, as: 'steps' }, 'stepOrder', 'ASC']
        ]
    })
    .then(catalog => {
        res.status(200).json({
            status: 'success',
            data: catalog
        });
    })
    .catch(next);
});

router.get('/catalog/obstaculos/all', (req, res, next) => {
    MultimediaInfo.findAll({
        where: { parentId: null, classification: 'obstaculos', isActive: true },
        include: [
            {
                model: MultimediaFiles,
                as: 'file',
                attributes: ['url', 'type']
            },
            {
                model: MultimediaInfo,
                as: 'steps',
                include: [{ 
                    model: MultimediaFiles, 
                    as: 'file', 
                    attributes: ['url', 'type'] 
                }]
            }
        ],
        order: [
            [{ model: MultimediaInfo, as: 'steps' }, 'stepOrder', 'ASC']
        ]
    })
    .then(catalog => {
        res.status(200).json({
            status: 'success',
            data: catalog
        });
    })
    .catch(next);
});

router.get('/catalog/:id', (req, res, next) => {
    const { id } = req.params;

    MultimediaInfo.findOne({
        where: { id, parentId: null, isActive: true },
        include: [
            {
                model: MultimediaFiles,
                as: 'file',
                attributes: ['url', 'type']
            },
            {
                model: MultimediaInfo,
                as: 'steps',
                include: [{ model: MultimediaFiles, as: 'file', attributes: ['url', 'type'] }]
            }
        ],
        order: [
            [{ model: MultimediaInfo, as: 'steps' }, 'stepOrder', 'ASC']
        ]
    })
    .then(catalogItem => {
        if (!catalogItem) throw new AppError('El elemento del catálogo no existe', 404);

        res.status(200).json({
            status: 'success',
            data: catalogItem
        });
    })
    .catch(next);
});

export default router;