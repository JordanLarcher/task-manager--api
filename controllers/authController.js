const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

const generateToken = (user) => {
    return jwt.sign(
        {id: user._id, role: user.role},
        process.env.JWT_SECRET,
        {expiresIn: '1h'}
    );
};

exports.register = async (req, res) => {
    try{
        const {email, password, role} = req.body;
        const existingUser = await User.findOne({email});
        if (existingUser) {
            return res.status(400).json({message: 'User already exists'});
        }

        const hashedPassword = await bcrypt.hash(password, 12);
        const user = await User.create({email, password: hashedPassword, role});
        res.status(201).json({message: 'User registered successfully'});

    }catch (error) {
        res.status(500).json({ message: 'Internal server Error'});
    }
}


exports.login = async (req, res) => {
    try {
        const {email, password} = req.body;
        const user = await User.findOne( {email});
        if (!user) return res.status(400).json({message: 'User does not exist'});

        const match = await bcrypt.compare(password, user.password);
        if(!match) return res.status(400).json({ message: 'Invalid credentials'});

        const token = generateToken(user);
        res.status(200).json({token});
    } catch (error) {
        res.status(500).json({ message: 'Internal server Error'});
    }
}