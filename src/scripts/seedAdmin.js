import 'dotenv/config';
import sequelize from '../db/connection.js';
import { User } from '../models/index.js';

const seedSuperAdmin = async () => {
    try {
        
        const adminUsername = process.env.ADMIN_USERNAME || 'superadmin';
        const adminPassword = process.env.ADMIN_PASSWORD || 'AdminSecure2026!';

        const existingAdmin = await User.findOne({ where: { username: adminUsername } });

        if (existingAdmin) {
            console.log(`[-] El usuario administrador "${adminUsername}" ya existe en la base de datos.`);
            process.exit(0);
        }

        await User.create({
            username: adminUsername,
            password: adminPassword,
            role: 'admin',
            isSuperAdmin: true
        });

        console.log(`[+] SuperAdmin "${adminUsername}" creado exitosamente.`);
        process.exit(0);
    } catch (error) {
        console.error('[X] Error al ejecutar el seed del administrador:', error);
        process.exit(1);
    }
};

seedSuperAdmin();