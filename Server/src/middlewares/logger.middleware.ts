import { Request, Response, NextFunction } from 'express';
import fs from 'fs';

const loggerMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const log = `[${new Date().toISOString()}] ${req.method} ${req.url}\n`;
    fs.appendFile('./src/logs/logs.txt', log, (err) => {
        if (err) {
            console.error('Error writing to log file:', err);
        }
    });
    next();
};

export default loggerMiddleware;