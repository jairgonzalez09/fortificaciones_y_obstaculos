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
        type: DataTypes.TEXT,
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
        allowNull: false,
        field: 'multimedia_id'
    },

    parentId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'parent_id',
        references: {
            model: 'multimedia_info',
            key: 'id'
        }
    },
    stepOrder: {
        type: DataTypes.INTEGER,
        allowNull: true,
        field: 'step_order'
    },

    isActive: {
        type: DataTypes.BOOLEAN,
        defaultValue: true,
        field: 'is_active'
    }
}, {
    tableName: 'multimedia_info',
    timestamps: true,
    indexes: [
        { name: 'idx_multimedia_info_classification', fields: ['classification'] },
        { name: 'idx_multimedia_info_type', fields: ['type'] },
        { name: 'idx_multimedia_info_parent', fields: ['parent_id'] },
        {
            name: 'unique_catalog_main_title',
            unique: true,
            fields: ['name'],
            where: {
                parent_id: null,
                is_active: true
            }
        }
    ]
})