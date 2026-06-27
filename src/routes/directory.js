import { Router } from 'express';

import pagesRoutes from './public/pages.route.js';
import adminStepperRoutes from './admin/stepper.routes.js';
import adminAuthRoutes from './admin/auth.routes.js';
import userStepperRoutes from './user/stepper.routes.js';

const router = Router();

router.use('/', pagesRoutes);
router.use('/api/admin', adminStepperRoutes);
router.use('/api/auth', adminAuthRoutes);
router.use('/api/user', userStepperRoutes);

export default router;