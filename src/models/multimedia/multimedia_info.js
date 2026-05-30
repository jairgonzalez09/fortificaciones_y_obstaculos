import { DataTypes } from 'sequelize';
import sequelize from '../../db/connection.js';

export const MultimediaInfo = sequelize.define('MultimediaInfo', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },

    name: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    description: {
        type: DataTypes.STRING(255),
        allowNull: false
    },

    classification: {
        type: DataTypes.ENUM('fortificaciones', 'obstaculos'),
        allowNull: false
    },

    type: {
        type: DataTypes.STRING(50),
        allowNull: false
    },
    
    multimediaId: {
        type: DataTypes.INTEGER,
        allowNull: false
    }
}, {
    tableName: 'multimedia_info',
    timestamps: true,
    indexes: [
        {
            name: 'idx_multimedia_info_classification',
            fields: ['classification']
        },
        {
            name: 'idx_multimedia_info_type',
            fields: ['type']
        }
    ]
})