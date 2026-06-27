import { DataTypes } from 'sequelize';
import sequelize from '../../db/connection.js';
import bcrypt from 'bcrypt';

export const User = sequelize.define('User', {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    username: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: true
    },
    password: {
        type: DataTypes.STRING(255),
        allowNull: false
    },
    role: {
        type: DataTypes.ENUM('user', 'admin'),
        defaultValue: 'user',
        allowNull: false
    },
    isSuperAdmin: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        allowNull: false,
        field: 'is_super_admin'
    }
}, {
    tableName: 'users',
    timestamps: true,
    defaultScope: {
        attributes: { exclude: ['password'] }
    },
    hooks: {
        beforeCreate: async (user) => {
            if (user.password) {
                user.password = await bcrypt.hash(user.password, 12);
            }
        },
        beforeUpdate: async (user) => {
            if (user.changed('password')) {
                user.password = await bcrypt.hash(user.password, 12);
            }
        }
    }
});

User.prototype.toJSON = function () {
    const values = { ...this.get() };
    delete values.password;
    return values;
};