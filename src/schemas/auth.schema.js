import { z } from 'zod';

export const loginSchema = z.object({
    username: z.string({ rquired_error: 'El username es obligatorio' })
    .min(3, "El username es muy corto")
    .max(50, "El username es muy largo"),

    password: z.string({ required_error: 'La contraseña es obligatoria' })
    .min(8, "La contraseña debe tener al menos 8 carácteres")
    .max(50, "La contraseña es muy larga")
});