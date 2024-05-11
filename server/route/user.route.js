const express=require('express')
const userRouter=express.Router()
const {db}=require('../model/index')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const User=db.users
const Question=db.questions

userRouter.get('/',async (req,res)=>{
try{
    const user=await User.findAll({})
    return res.status(200).json(user);
}
catch(err)
{
    res.status(500).json({ error: 'Internal server error' });
}
})
userRouter.get('/:id', async (req, res) => {
    try {
        const user = await User.findByPk(req.params.id, {
            include: [{
                model: Question,
                as: 'questionsINFO'
            }]
        });

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user);
    } catch (err) {
        console.error('Error occurred while fetching user details:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


userRouter.post('/signup', async (req, res) => {
    const { name, email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
           res.status(409).json({ error: 'User already exists, please log in.' });
        } else {
            const hash = await bcrypt.hash(password, 10);
            const newUser = await User.create({
                name,
                email,
                password: hash
            });
            res.status(200).json({ message: 'Signup successful', user: newUser });
        }
    } catch (error) {
        console.error('Error occurred during signup:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

userRouter.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const existingUser = await User.findOne({ where: { email: email } });
        if (existingUser) {
            const user = await bcrypt.compare(password, existingUser.password);
            if (user) {
                const token = jwt.sign({ userID: existingUser.id }, "password");
                res.status(201).json({ message: 'Login successful', token });
            } else {
                res.status(200).json({ error: 'Wrong credentials' });
            }
        } else {
            res.status(409).json({ error: 'User does not exist, please sign up.' });
        }
    } catch (err) {
        console.error('Error occurred during login:', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});


module.exports={
    userRouter
}