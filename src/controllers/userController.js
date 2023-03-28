import { check, validationResult } from 'express-validator';
import User from '../models/User.js';

export const loginForm = (req, res) => {
    res.render('auth/login', {
        authenticated: true,
        page: 'Login'
    })
}

export const registerForm = (req, res) => {
    res.render('auth/register', {
        page: 'Create Account'
    })
}

export const register = async(req, res) => {
    //Validations
    await check('name').notEmpty().withMessage('The name must not be empty').run(req);
    await check('email').isEmail().withMessage('Not valid email format').run(req);
    await check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').run(req);
    await check('confirm_password').equals('password').withMessage('Passwords are not equals').run(req);
    
    let result = validationResult(req);

    if( !result.isEmpty() ) {
        return res.render('auth/register', {
            page: 'Create Account',
            errors: result.array()
        }) 
    };

    const user = await User.create(req.body);
    res.json(user);
}

export const forgotPasswordForm = (req, res) => {
    res.render('auth/forgot-password', {
        page: 'Restore your password'
    })
}