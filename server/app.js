import express from 'express'
import jwt from 'jsonwebtoken';
import cookieParser from 'cookie-parser';
import fs from 'fs';
import cors from 'cors';

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({
    origin: 'http://localhost:5173',
    methods: ['GET', 'POST', 'PUT'],
    credentials: true
}));

const privateKey = fs.readFileSync('./private.key', 'utf8');
const publicKey = fs.readFileSync('./public.key', 'utf8');



app.post('/login', (req, res) => {
    const { username, password } = req.body;
    
    if (username !== '123' || password !== '321') {
        res.status(401).json({ message: 'Invalid username or password' });
    }

    const payload = {
        username: username,
        password: password
    }
    const token = jwt.sign(payload, privateKey, { algorithm: 'RS256', expiresIn: '10s' });

    res.cookie('token', token, { httpOnly: false, sameSite: 'lax', maxAge: 10000, secure: false });
    res.json({ message: 'Login successful' });
});

const authMiddleware = (req, res, next) => {
    const token = req.cookies.token;
    
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    jwt.verify(token, publicKey, (err, user) => {
        if (err) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        req.user = user;
        next();
    })
}

app.get('/protected-info', authMiddleware, (req, res) => {
    res.json({
        data: [
            { id: 1, name: 'John Doe', info: 'John Doe protected info' },
            { id: 2, name: 'Jane Doe', info: 'Jane Doe protected info' },
            { id: 3, name: 'John Smith', info: 'John Smith protected info' },
        ]
    })
})

app.post('/logout', (req, res) => {
    res.clearCookie('token');
    res.json({ message: 'Logout successful' });
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
})