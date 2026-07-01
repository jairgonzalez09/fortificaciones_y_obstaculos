import express from 'express';
import 'dotenv/config';
import path from 'path';

import routes from './routes/directory.js';
import loadMiddlewares from './middlewares/index.js';
import { errorHandler } from './middlewares/errorHandling.js';
import startServer from './server.js';
import './models/index.js';

const app = express();

loadMiddlewares(app);

const fontPackages = {
    'plus-jakarta-sans': '@fontsource/plus-jakarta-sans',
    'inter': '@fontsource/inter',
    'hanken-grotesk': '@fontsource/hanken-grotesk',
    'archivo-narrow': '@fontsource/archivo-narrow',
    'jetbrains-mono': '@fontsource/jetbrains-mono',
    'material-symbols-outlined': '@fontsource/material-symbols-outlined',
};

for (const [route, pkg] of Object.entries(fontPackages)) {
    app.use(`/fonts/${route}`, express.static(
        path.join(process.cwd(), 'node_modules', pkg)
    ));
}

app.use('/', routes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(errorHandler);

startServer(app);

export default app;