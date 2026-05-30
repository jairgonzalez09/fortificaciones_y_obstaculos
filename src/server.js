import { connectionDatabase } from './db/connection.js';

async function startServer(app) {
    try {
        await connectionDatabase();
        console.log('Base de datos conectada');

        app.listen(process.env.PORT || 3000, () => {
            console.log(`Servidor funcionando en puerto ${process.env.PORT || 3000}`);
        });
    } catch (error) {
        console.error('Error iniciando el servidor: ', error.message);
        process.exit(1)
    }
}

export default startServer;