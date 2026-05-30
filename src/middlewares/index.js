import express from 'express';
import cors from 'cors';
import path from 'path';

let corsOptions = {
    methods: ['GET', 'POST', 'PUT', 'DELETE']
};

export default function loadMiddlewares(app) {
    app.use(express.static(path.join(process.cwd(), 'src/public')));
    app.use(express.urlencoded({ extended: true }));
    app.use(express.json());
    app.use(cors(corsOptions));
};