import { check, validationResult } from 'express-validator';
import { generateId } from '../helpers/token.js';
import User from '../models/User.js';
import { registrationEmail } from '../helpers/emails.js';

export const loginForm = (req, res) => {
    res.render('auth/login', {
        authenticated: true,
        page: 'Login'
    })
}


export const registerForm = (req, res) => {
    res.render('auth/register', {
        page: 'Create Account',
        csrfToken: req.csrfToken()
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
            csrfToken: req.csrfToken(),
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
            csrfToken: req.csrfToken(),
            errors: [{ msg: 'The user email is already registered' }],
            user: {
                name,
                email
            } 
        }) 
    }

    const user = await User.create({ 
        name, 
        email, 
        password, 
        token: generateId() 
    });
    
    //sent email for confirmation
    registrationEmail({
        name: user.name,
        email: user.email,
        token: user.token,
    });

    res.render('templates/message', {
        page: 'Account Created Successfully',
        errors: 'We send and email to confirm, click on the link'   
    }) 
}


export const confirm = async(req, res) => {
    const { token } = req.params;
    const user = await User.findOne({ where:{ token } });
    
    if(!user) {
        return res.render('auth/confirm-account', {
            page: 'Failed to confirm account',
            message: 'There was an error confirming the account',
            error: true
        })
    }

    user.token = null;
    user.confirmed = true;
    await user.save();
    
    return res.render('auth/confirm-account', {
        page: 'Confirmed Account',
        message: 'Account confirmed successfully',
    })
}


export const forgotPasswordForm = (req, res) => {
    res.render('auth/forgot-password', {
        page: 'Restore your password'
    })
}