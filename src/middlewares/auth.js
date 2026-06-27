import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';
import { AppError } from '../utils/index.js';

export const protect = (req, res, next) => {
    let token;

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        token = req.headers.authorization.split(' ')[1];
    }

    if (!token) {
        return next(new AppError('No autenticado. Por favor, inicie sesión para obtener acceso.', 401));
    }

    new Promise((resolve, reject) => {
        jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
            if (err) reject(err);
            resolve(decoded);
        });
    })
    .then(decoded => {
        return User.findByPk(decoded.id);
    })
    .then(currentUser => {
        if (!currentUser) throw new AppError('El usuario que posee este token ya no existe.', 401);

        req.user = currentUser;
        next();
    })
    .catch(err => {
        if (err.name === 'JsonWebTokenError') {
            return next(new AppError('Token inválido. Por favor, inicie sesión de nuevo.', 401));
        }
        if (err.name === 'TokenExpiredError') {
            return next(new AppError('Su sesión ha expirado. Por favor, inicie sesión de nuevo.', 401));
        }
        next(err);
    });
};

export const restrictToAdmin = (req, res, next) => {
    if (!req.user) {
        return next(new AppError('No autenticado. Inicie sesión.', 401));
    }

    if (req.user.role !== 'admin' && !req.user.isSuperAdmin) {
        return next(new AppError('No tienes permisos para realizar esta acción.', 403));
    }

    next();
};