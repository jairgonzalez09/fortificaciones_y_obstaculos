import { z } from 'zod';

export const catalogStepperSchema = z.object({
    name: z.string({ required_error: 'El nombre es obligatorio' })
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(255),

    description: z.string({ required_error: 'La descripción es obligatoria' })
        .max(2000, 'La descripción no puede superar los 2000 caracteres'),

    classification: z.enum(['fortificaciones', 'obstaculos'], {
        errorMap: () => ({ message: 'La clasificación debe ser: fortificaciones u obstaculos' })
    }),

    type: z.string({ required_error: 'El tipo es obligatorio' }).max(50),
    stepsText: z.array(
        z.object({
            title: z.string().min(1, 'El título del paso no puede estar vacío').optional(),
            description: z.string().optional()
        })
    ).min(1, 'Debes enviar al menos un paso en el stepper'),

    stepImages: z.array(z.string())
}).refine((data) => data.stepsText.length === data.stepImages.length, {
    message: 'Cada paso de texto debe tener obligatoriamente su imagen de referencia correspondiente.',
    path: ['stepImages']
});

export const catalogStepperUpdateSchema = z.object({
    name: z.string({ required_error: 'El nombre es obligatorio' })
        .min(3, 'El nombre debe tener al menos 3 caracteres')
        .max(255),

    description: z.string({ required_error: 'La descripción es obligatoria' })
        .max(2000, 'La descripción no puede superar los 2000 caracteres'),

    classification: z.enum(['fortificaciones', 'obstaculos'], {
        errorMap: () => ({ message: 'La clasificación debe ser: fortificaciones u obstaculos' })
    }),

    type: z.string({ required_error: 'El tipo es obligatorio' }).max(50),
    stepsText: z.array(
        z.object({
            title: z.string().min(1, 'El título del paso no puede estar vacío').optional(),
            description: z.string().optional()
        })
    ).min(1, 'Debes enviar al menos un paso en el stepper'),

    stepImages: z.array(z.string()).optional().default([])
});