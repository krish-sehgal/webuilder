import type { Request, Response } from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken'

export async function createUser(req: Request, res: Response) {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({
                success: false,
                message: 'email and password are requied'
            })
        }

        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                success: false,
                message: 'email already exist'
            })
        }

        // hashing password
        const hashPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({ email, hashPassword });

        // create jwt token
        const secret = process.env.JWT_SECRET;
        if (!secret) throw new Error('JWT_SECRET not found');
        const token = jwt.sign(
            { _id: newUser._id, email: newUser.email },
            secret,
            { expiresIn: '1hr' }
        );

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        return res.status(201).json({
            success: true,
            message: 'User register successfully',
            token
        });
    } catch (error) {
    }
}