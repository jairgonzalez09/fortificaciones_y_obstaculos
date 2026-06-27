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

app.use('/', routes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

app.use(errorHandler);

startServer(app);

export default app;