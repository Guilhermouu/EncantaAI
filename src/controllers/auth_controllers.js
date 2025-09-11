// Em: src/controllers/auth_controller.js

const bcrypt = require('bcrypt');
const db = require('../config/database');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const UserModel=require('../models/user_model')

// Função de cadastro 
const registerClient = async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ success: false, message: 'E-mail e senha são obrigatórios.' });
    }
    try {
        const existingUser = await UserModel.findByEmail(email);
        if (existingUser) {
            return res.status(409).json({ success: false, message: 'E-mail já está cadastrado.' });
        }
        const hashedPassword = await bcrypt.hash(senha, 10);
        const newUser = await UserModel.create(email, hashedPassword);
        console.log(`Usuário ${email} cadastrado com ID: ${newUser.id}`);
        res.status(201).json({ success: true, message: 'Usuário cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro no processo de cadastro:', error.message);
        res.status(500).json({ success: false, message: 'Erro interno do servidor.' });
    }
};

// Função de login 
const loginClient = async (req, res) => {
    const { email, senha } = req.body;
    if (!email || !senha) {
        return res.status(400).json({ message: "Email e senha são obrigatórios" });
    }
    try {
        const usuario = await UserModel.findByEmail(email);
        if (!usuario) {
            return res.status(401).json({ message: "Usuário não encontrado" });
        }
        const senhaCorreta = await bcrypt.compare(senha, usuario.senha);
        if (senhaCorreta) {
            res.status(200).json({ message: "Login bem-sucedido", nome: usuario.email });
        } else {
            res.status(401).json({ message: "Senha incorreta" });
        }
    } catch (error) {
        console.error('Erro ao buscar usuário para login:', error.message);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
};

// Função de esqueci a senha refatorada
const forgotPassword = async (req, res) => {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "E-mail é obrigatório" });

    try {
        const user = await UserModel.findByEmail(email);
        if (!user) return res.status(404).json({ message: "Usuário não encontrado" });

        const token = crypto.randomBytes(32).toString("hex");
        const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min de validade

        await UserModel.saveResetToken(user.id, token, expiresAt);

        const resetLink = `http://localhost:3000/resetar-senha.html?token=${token}`;
        const transporter = nodemailer.createTransport({
            host: "smtp.gmail.com", port: 587, secure: false,
            auth: { user: "guiprogramadore@gmail.com", pass: "rxid uqrl vngy nakw" }
        });

        await transporter.sendMail({
            from: "guiprogramadore@gmail.com", to: email,
            subject: "Recuperação de senha - EncantaAI",
            text: `Clique no link para redefinir sua senha: ${resetLink}`
        });

        res.json({ message: "E-mail de recuperação enviado!" });
    } catch (error) {
        console.error("Erro no processo de esqueci a senha:", error.message);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
};

// Função de resetar a senha refatorada
const resetPassword = async (req, res) => {
    const { token, novaSenha } = req.body;
    if (!token || !novaSenha) return res.status(400).json({ message: "Token e nova senha são obrigatórios" });

    try {
        const validToken = await UserModel.findUserByValidToken(token);
        if (!validToken) return res.status(400).json({ message: "Token inválido ou expirado" });

        const hashedPassword = await bcrypt.hash(novaSenha, 10);
        await UserModel.updatePassword(validToken.user_id, hashedPassword);
        await UserModel.deleteToken(token); // Invalida o token após o uso

        res.json({ message: "Senha redefinida com sucesso!" });
    } catch (error) {
        console.error("Erro ao resetar a senha:", error.message);
        return res.status(500).json({ message: "Erro ao atualizar senha" });
    }
};
// No final, exportamos as funções que criamos
module.exports = {
    registerClient,
    loginClient,
    forgotPassword,
    resetPassword
};