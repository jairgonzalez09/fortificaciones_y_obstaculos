import { Router } from 'express';
import path from 'path';

const router = Router();
const pagesDirectory = path.join(process.cwd(), '/src/views')

router.get('/', (req, res) => {
    res.sendFile(path.join(pagesDirectory, 'index.html'))
});

router.get('/fortificaciones', (req, res) => {
    res.sendFile(path.join(pagesDirectory, 'fortificaciones.html'))
});

router.get('/obstaculos', (req, res) => {
    res.sendFile(path.join(pagesDirectory, 'obstaculos.html'))
});

router.get('/login', (req, res) => {
    res.sendFile(path.join(pagesDirectory, 'login.html'))
});

router.get('/admin', (req, res) => {
    res.sendFile(path.join(pagesDirectory, 'admin.html'))
});

export default router;