import { check, validationResult } from 'express-validator';
import { generateId } from '../helpers/token.js';
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
    const { name, email, password } = req.body;
    
    //Validations
    await check('name').notEmpty().withMessage('The name must not be empty').run(req);
    await check('email').isEmail().withMessage('Not valid email format').run(req);
    await check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').run(req);
    await check('confirm_password').equals(password).withMessage('Passwords are not equals').run(req);
    
    let result = validationResult(req);

    if( !result.isEmpty() ) {
        return res.render('auth/register', {
            page: 'Create Account',
            errors: result.array(),
            user: {
                name,
                email
            } 
        }) 
    };

    //Verification for user email duplication
    const userExist =  await User.findOne({ where:{ email } });

    if(userExist) {
        return res.render('auth/register', {
            page: 'Create Account',
            errors: [{ msg: 'The user email is already registered' }],
            user: {
                name,
                email
            } 
        }) 
    }
    await User.create({ name, email, password, token: generateId() });
    
    res.render('templates/message', {
        page: 'Account Created Successfully',
        errors: 'We send and email to confirm, click on the link'   
    }) 
}

export const forgotPasswordForm = (req, res) => {
    res.render('auth/forgot-password', {
        page: 'Restore your password'
    })
}