
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

export const forgotPasswordForm = (req, res) => {
    res.render('auth/forgot-password', {
        page: 'Restore your password'
    })
}