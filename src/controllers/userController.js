import { check, validationResult } from 'express-validator';
import bcrypt from 'bcrypt';
import User from '../models/User.js';
import { generateId, generateJWT } from '../helpers/token.js';
import { registrationEmail, restorePasswordEmail } from '../helpers/emails.js';

export const loginForm = (req, res) => {
    res.render('auth/login', {
        page: 'Login',
        csrfToken: req.csrfToken()
    })
}

export const authenticate = async(req, res) => {
    await check('email').isEmail().withMessage('El Email es Obligatorio').run(req)
    await check('password').notEmpty().withMessage('El Password es Obligatorio').run(req)
    
    const { email, password} = req.body;
    let result = validationResult(req);
    
    if(!result.isEmpty()) {
        return res.render('auth/login', {
            page: 'Login',
            csrfToken : req.csrfToken(),
            errors: result.array()
        })
    }

    // Comprobar si el usuario existe
    const user = await User.findOne({ where:{ email } })
    if(!user) {
        return res.render('auth/login', {
            page: 'Login',
            csrfToken : req.csrfToken(),
            errors: [{msg: 'User does not exist'}]
        })
    }
    console.log('El usuario existe')

    // Comprobar si el usuario esta confirmado
    if(!user.confirmed) {
        return res.render('auth/login', {
            page: 'Login',
            csrfToken : req.csrfToken(),
            errors: [{msg: 'Your account has not been confirmed'}]
        })
    }

    // Revisar el password
    if(!user.verifyPassword(password)) {
        return res.render('auth/login', {
            page: 'Login',
            csrfToken : req.csrfToken(),
            errors: [{msg: 'Incorrect Password'}]
        })
    }

    // Autenticar al usuario
    const token = generateJWT({ id: user.id, name: user.name })

    // Almacenar en un cookie
    return res.cookie('_token', token, {
        httpOnly: true,
        // secure: true,
        // sameSite: true
    }).redirect('/my-properties')
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
        message: 'We send and email to confirm, look at your inbox'   
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
        page: 'Restore your password',
        csrfToken: req.csrfToken()
    })
}


export const resetPassword = async(req, res) => {
    const { email } = req.body;

    await check('email').isEmail().withMessage('Not valid email format').run(req);
    
    let result = validationResult(req);

    if( !result.isEmpty() ) {
        return res.render('auth/forgot-password', {
            page: 'Restore your access to Real Estate',
            csrfToken: req.csrfToken(),
            errors: result.array() 
        }) 
    };

    const user = await User.findOne({ where:{ email } });

    if(!user) {
        return res.render('auth/forgot-password', {
            page: 'Restore your access to Real Estate',
            csrfToken: req.csrfToken(),
            errors: [{msg: 'Email is no registered'}]
        })
    }

    user.token = generateId();
    await user.save();

    restorePasswordEmail({
        email: user.email,
        name: user.name,
        token: user.token
    });

    res.render('templates/message', {
        page: 'Restore your password',
        message: 'We sent an email with instructions, check your inbox'
    });

}

export const verifyToken = async(req, res) => {
    const { token } = req.params;

    const user = await User.findOne({ where:{ token } });
    
    if(!user) {
        return res.render('auth/confirm-account', {
            page: 'Restore your password',
            message: 'There was an error validating your information, please try again',
            error: true
        })
    }

    // Mostrar formulario para modificar el password
    res.render('auth/reset-password', {
        page: 'Restore your Password',
        csrfToken: req.csrfToken()
    })
}


export const newPassword = async(req, res) => {
    await check('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters').run(req);
    
    let result = validationResult(req);

    if(!result.isEmpty()) {
        return res.render('auth/reset-password', {
            pagina: 'Restore your password',
            csrfToken : req.csrfToken(),
            errors: result.array()
        })
    }

    const { token } = req.params
    const { password } = req.body;

    const user = await User.findOne({ where:{ token } })
    
    const salt = await bcrypt.genSalt(10)
    user.password = await bcrypt.hash( password, salt);
    user.token = null;

    await user.save();

    res.render('auth/confirm-account', {
        page: 'Password Restored',
        message: 'Password saved succesfully'
    })
}