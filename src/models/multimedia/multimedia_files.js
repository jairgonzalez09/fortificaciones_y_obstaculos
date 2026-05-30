import { DataTypes } from 'sequelize';
import sequelize from '../../db/connection.js';

export const MultimediaFiles = sequelize.define('MultimediaFiles', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    url: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    type: {
        type: DataTypes.ENUM('image', 'video'),
        allowNull: false
    }
}, {
    tableName: 'multimedia_files',
    timestamps: true
})