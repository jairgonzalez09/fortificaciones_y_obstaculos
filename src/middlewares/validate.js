// import { ValidationError } from '../utils/index.js';

// export const validateBody = (schema) => {
//     return async (req, res, next) => {
//         try {
//             const parsedBody = await schema.parseAsync(req.body);
            
//             req.body = parsedBody; 
            
//             next();
//         } catch (error) {
//             if (error.name === 'ZodError') {
                
//                 const formattedErrors = error.errors.map(err => ({
//                     path: err.path.join('.'),
//                     message: err.message
//                 }));

//                 return next(new ValidationError('Error de validación en los campos enviados', formattedErrors));
//             }
            
//             next(error);
//         }
//     };
// };
import { ValidationError } from '../utils/index.js';

export const validateBody = (schema) => {
    return async (req, res, next) => {
        try {
            const parsedBody = await schema.parseAsync(req.body);
            req.body = parsedBody; 
            next();
        } catch (error) {
            if (error.name === 'ZodError') {
                // Aseguramos que 'errors' sea un array antes de usar .map()
                const rawErrors = Array.isArray(error.errors) ? error.errors : [];
                
                const formattedErrors = rawErrors.map(err => ({
                    path: err.path ? err.path.join('.') : 'campo',
                    message: err.message
                }));

                // Si por alguna razón el mapeo quedó vacío pero hay un mensaje global
                if (formattedErrors.length === 0 && error.message) {
                    formattedErrors.push({ path: 'global', message: error.message });
                }

                return next(new ValidationError('Error de validación en los campos enviados', formattedErrors));
            }
            
            next(error);
        }
    };
};