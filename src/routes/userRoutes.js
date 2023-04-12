import express from 'express';
import { 
    forgotPasswordForm, 
    loginForm, 
    register, 
    registerForm, 
    confirm,
    resetPassword,
    verifyToken,
    newPassword,
    authenticate} from '../controllers/userController.js';

const router =  express.Router();

router.get('/login', loginForm);
router.post('/login', authenticate);
router.post('/logout', );
router.get('/register', registerForm);
router.post('/register', register);
router.get('/confirm/:token', confirm);
router.get('/forgot-password', forgotPasswordForm);
router.post('/forgot-password', resetPassword)
router.get('/forgot-password/:token', verifyToken);
router.post('/forgot-password/:token', newPassword);

export default router;