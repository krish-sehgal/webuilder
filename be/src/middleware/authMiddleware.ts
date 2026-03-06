import type { Request, Response, NextFunction } from "express";
import jwt from 'jsonwebtoken';

export function requireAuth(req: Request, res: Response, next: NextFunction) {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).json({
            success: false,
            message: 'Not authenticated'
        })
    }

    try {
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET not found');

        const decoded = jwt.verify(token, secret) as { _id: string, email: string };
        req.user = decoded;
        next();

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || error || 'Invalid or expired token'
        })
    }
}