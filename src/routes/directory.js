import { Router } from 'express';

import pagesRoutes from './public/pages.route.js';

const router = Router();

router.use('/', pagesRoutes);

export default router;