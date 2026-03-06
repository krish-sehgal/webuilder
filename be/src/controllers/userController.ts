import type { Request, Response } from 'express';
import User from '../models/user.js';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwtToken.js';

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
        const payload = { _id: newUser._id, email: newUser.email };
        const token = generateToken(payload);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        return res.status(201).json({
            success: true,
            message: 'User register successfully'
        });
    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || error || 'something went wrong'
        })
    }
}

export async function loginUser(req: Request, res: Response) {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: 'email and password are required'
        });
    }

    try {
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const compareHash = await bcrypt.compare(password, user.hashPassword);

        if (!compareHash) {
            return res.status(401).json({
                success: false,
                message: 'Invalid email or password'
            });
        }

        const payload = { _id: user._id, email: user.email };
        const token = generateToken(payload);

        res.cookie('token', token, {
            httpOnly: true,
            secure: true,
            sameSite: 'strict'
        });

        res.json({
            success: true,
            message: 'Logged in successfully'
        });

    } catch (error: any) {
        return res.status(500).json({
            success: false,
            message: error.message || error || 'something went wrong'
        })
    }
}