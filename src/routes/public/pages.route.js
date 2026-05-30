import { Router } from 'express';
import path from 'path';

const router = Router();
const pagesDirectory = path.join(process.cwd(), '/src/views')

router.get('/', (req, res) => {
    res.sendFile(path.join(pagesDirectory, 'index.html'))
})

export default router;