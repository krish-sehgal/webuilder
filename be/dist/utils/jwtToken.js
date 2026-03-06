import jwt from 'jsonwebtoken';
export function generateToken(payload) {
    const secret = process.env.JWT_SECRET;
    if (!secret)
        throw new Error('JWT_SECRET not found');
    return jwt.sign(payload, secret, { expiresIn: '1h' });
}
//# sourceMappingURL=jwtToken.js.map