import jwt from 'jsonwebtoken';

module.exports = (req, res, next) => {
    try {
        const token = req.headers.authorization.split(' ')[1];
        const { email, role } = jwt.verify(token, 'TOKEN_SECRET');
        req.user = { email, role };
        next();
    } catch {
        res.status(401).send({message: 'Invalid token'});
    }
};