import { AppError } from '../utils/index.js';

// export const prepareStepperData = (req, res, next) => {
//     try {
//         if (req.body && typeof req.body.stepsText === 'string') {
//             req.body.stepsText = JSON.parse(req.body.stepsText);
//         }

//         const stepImagesFiles = req.files && req.files['stepImages'] ? req.files['stepImages'] : [];
//         req.body.stepImages = stepImagesFiles.map(file => file.filename);
        
//         next();
//     } catch (error) {
//         next(new AppError('El formato de los pasos (stepsText) no es un JSON válido.', 400));
//     }
// };
// export const prepareStepperData = (req, res, next) => {
//     try {
//         console.log("=== ENTRANDO A PREPARE STEPPER DATA ===");
//         console.log("BODY ORIGINAL:", req.body);
//         console.log("FILES RECIBIDOS:", req.files);

//         if (req.body && typeof req.body.stepsText === 'string') {
//             req.body.stepsText = JSON.parse(req.body.stepsText);
//         }

//         const stepImagesFiles = req.files && req.files['stepImages'] ? req.files['stepImages'] : [];
        
//         // ◄ ESTA ES LA INYECCIÓN CLAVE PARA ZOD
//         req.body.stepImages = stepImagesFiles.map(file => file.filename); 
        
//         console.log("BODY MODIFICADO PARA ZOD:", req.body);
//         next();
//     } catch (error) {
//         console.error("CRASH EN EL MIDDLEWARE STEPPERFIELDS:", error);
//         next(new AppError('El formato de los pasos (stepsText) no es un JSON válido.', 400));
//     }
// };

export const prepareStepperData = (req, res, next) => {
    try {
        if (req.body && typeof req.body.stepsText === 'string') {
            req.body.stepsText = JSON.parse(req.body.stepsText);
        }
        if (req.body && !Array.isArray(req.body.stepsText)) {
            req.body.stepsText = [req.body.stepsText];
        }

        const files = req.files || {};
        let stepImagesFiles = files['stepImages'] || [];

        if (stepImagesFiles && !Array.isArray(stepImagesFiles)) {
            stepImagesFiles = [stepImagesFiles];
        }

        req.body.stepImages = stepImagesFiles.map(file => file.filename);
        
        next();
    } catch (error) {
        next(new AppError('Error procesando el formato del stepper dinámico.', 400));
    }
};