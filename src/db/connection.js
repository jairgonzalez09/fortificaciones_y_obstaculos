import { Sequelize } from 'sequelize';
import { AppError } from '../utils/index.js';

export const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: 'postgres',
        logging: false
    }
);

export async function connectionDatabase() {
    return sequelize.authenticate()
        .then(() => sequelize.sync({ alter: true }))
        .catch((err) => { throw new AppError(err.message, 500) });
}

export default sequelize;