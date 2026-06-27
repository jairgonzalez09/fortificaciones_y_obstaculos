import { Router } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import { User } from '../../models/index.js';
import { validateBody } from '../../middlewares/validate.js';
import { loginSchema } from '../../schemas/auth.schema.js';
import { AppError } from '../../utils/index.js';

const router = Router();

router.post('/login', validateBody(loginSchema), (req, res, next) => {
    const { username, password } = req.body;

    User.unscoped().findOne({ where: { username } })
        .then(async (user) => {
            if (!user) throw new AppError('Credenciales incorrectas.', 401);

            const isPasswordCorrect = await bcrypt.compare(password, user.password);
            
            if (!isPasswordCorrect) throw new AppError('Credenciales incorrectas.', 401);

            const token = jwt.sign(
                { id: user.id }, 
                process.env.JWT_SECRET, 
                { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
            );

            console.log(`TOKEN: ${token}`);

            res.status(200).json({
                status: 'success',
                token,
                data: {
                    user
                }
            });
        })
        .catch(next);
});

export default router;