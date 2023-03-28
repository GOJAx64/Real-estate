import express from 'express';
import { 
    forgotPasswordForm, 
    loginForm, 
    register, 
    registerForm } from '../controllers/userController.js';

const router =  express.Router();

router.get('/login', loginForm);
router.get('/register', registerForm);
router.post('/register', register);
router.get('/forgot-password', forgotPasswordForm);

export default router;