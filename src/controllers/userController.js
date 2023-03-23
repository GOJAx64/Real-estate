
export const loginForm = (req, res) => {
    res.render('auth/login', {
        authenticated: true,
    })
}

export const registerForm = (req, res) => {
    res.render('auth/register', {
        
    })
}