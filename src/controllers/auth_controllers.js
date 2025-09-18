// Importa as dependências necessárias
const bcrypt = require('bcrypt');
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const UserModel=require('../models/user_model')

// Função de cadastro 
const registerClient = async (req, res) => {
    // 1. Recebe todos os novos campos do corpo da requisição
    const { nome, cpf, email, senha, cep, rua, numero, bairro, cidade, estado, complemento } = req.body;

    // 2. Validação de back-end (mínimo necessário)
    if (!nome || !cpf || !email || !senha) {
        return res.status(400).json({ success: false, message: 'Campos obrigatórios (nome, cpf, email, senha) não foram preenchidos.' });
    }

    try {
        // 3. Verifica se e-mail OU CPF já existem no banco
        const existingUserByEmail = await UserModel.findByEmail(email);
        if (existingUserByEmail) {
            return res.status(409).json({ success: false, message: 'Este e-mail já está cadastrado.' });
        }
        
        const cpfNumeros = cpf.replace(/\D/g, ''); // Limpa a máscara do CPF
        const existingUserByCpf = await UserModel.findByCpf(cpfNumeros);
        if (existingUserByCpf) {
            return res.status(409).json({ success: false, message: 'Este CPF já está cadastrado.' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);

        // 4. Monta o objeto de dados para enviar ao Model
        const userData = {
            nome,
            cpf: cpfNumeros, // Salva o CPF sem máscara
            email,
            hashedPassword,
            cep, rua, numero, bairro, cidade, estado, complemento
        };
        
        const newUser = await UserModel.create(userData);

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
            res.status(200).json({ message: "Login bem-sucedido", nome: usuario.nome, id: usuario.id});
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
            auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
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