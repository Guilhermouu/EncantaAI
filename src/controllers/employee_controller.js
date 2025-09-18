const bcrypt = require('bcrypt');
const EmployeeModel = require('../models/employee_model');

const registerEmployee = async (req, res) => {
    const { nome, cpf, email, senha, telefone, cargo } = req.body;
    if (!nome || !cpf || !email || !senha || !telefone || !cargo) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios.' });
    }

    try {
        const existing = await EmployeeModel.findByCpf(cpf);
        if (existing) {
            return res.status(409).json({ message: 'Funcionário já cadastrado.' });
        }

        const hashedPassword = await bcrypt.hash(senha, 10);
        const employeeData = { ...req.body, hashedPassword };
        
        await EmployeeModel.create(employeeData);
        res.status(201).json({ message: 'Funcionário cadastrado com sucesso!' });
    } catch (error) {
        console.error('Erro ao cadastrar funcionário:', error.message);
        res.status(500).json({ message: 'Erro ao cadastrar funcionário.' });
    }
};

const loginEmployee = async (req, res) => {
    const { cpf, senha } = req.body;
    if (!cpf || !senha) {
        return res.status(400).json({ message: "CPF e senha são obrigatórios" });
    }

    try {
        const employee = await EmployeeModel.findByCpf(cpf);
        if (!employee) {
            return res.status(401).json({ message: "Funcionário não encontrado" });
        }

        const senhaCorreta = await bcrypt.compare(senha, employee.senha);
        if (senhaCorreta) {
            res.status(200).json({ message: "Login bem-sucedido", cargo: employee.cargo });
        } else {
            res.status(401).json({ message: "Senha incorreta" });
        }
    } catch (error) {
        console.error('Erro ao buscar funcionário para login:', error.message);
        return res.status(500).json({ message: "Erro interno do servidor" });
    }
};

const createUserByAdmin = async (req, res) => {
    // MUDANÇA: Removidos email e telefone da desestruturação
    const { nome, cpf, senha, cargo } = req.body;

    // Validação de back-end
    if (!nome || !cpf || !senha || !cargo) {
        return res.status(400).json({ message: 'Todos os campos são obrigatórios: nome, cpf, senha e cargo.' });
    }

    try {
        const existingByCpf = await EmployeeModel.findByCpf(cpf.replace(/\D/g, ''));
        if (existingByCpf) {
            return res.status(409).json({ message: 'Este CPF já está cadastrado.' });
        }
        
        // MUDANÇA: Verificação de e-mail removida

        const hashedPassword = await bcrypt.hash(senha, 10);
        
        const employeeData = {
            nome,
            cpf: cpf.replace(/\D/g, ''),
            hashedPassword,
            cargo: cargo.toUpperCase()
        };
        
        await EmployeeModel.create(employeeData);
        res.status(201).json({ message: 'Usuário cadastrado com sucesso!' });

    } catch (error) {
        console.error('Erro ao cadastrar usuário:', error.message);
        res.status(500).json({ message: 'Erro interno do servidor.' });
    }
};
const getAllFuncionarios = async (req, res) => {
    try {
        const funcionarios = await EmployeeModel.findAll();
        res.status(200).json(funcionarios);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar funcionários.' });
    }
};

// NOVA FUNÇÃO: para buscar um funcionário por ID
const getFuncionarioById = async (req, res) => {
    try {
        const { id } = req.params;
        const funcionario = await EmployeeModel.findById(id);
        if (!funcionario) return res.status(404).json({ message: 'Funcionário não encontrado.' });
        res.status(200).json(funcionario);
    } catch (error) {
        res.status(500).json({ message: 'Erro ao buscar funcionário.' });
    }
};

// NOVA FUNÇÃO: para atualizar um funcionário
const updateFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        const { nome, cpf, cargo, senha } = req.body;

        let hashedPassword = null;
        if (senha) {
            hashedPassword = await bcrypt.hash(senha, 10);
        }

        const result = await EmployeeModel.update(id, { nome, cpf, cargo, hashedPassword });

        if (result.changes === 0) return res.status(404).json({ message: 'Funcionário não encontrado.' });
        res.status(200).json({ message: 'Usuário atualizado com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário.' });
    }
};

// NOVA FUNÇÃO: para deletar um funcionário
const deleteFuncionario = async (req, res) => {
    try {
        const { id } = req.params;
        const result = await EmployeeModel.remove(id);
        if (result.changes === 0) return res.status(404).json({ message: 'Funcionário não encontrado.' });
        res.status(200).json({ message: 'Usuário excluído com sucesso!' });
    } catch (error) {
        res.status(500).json({ message: 'Erro ao excluir usuário.' });
    }
};

module.exports = {
    registerEmployee,
    loginEmployee,
    createUserByAdmin,
    getAllFuncionarios,
    getFuncionarioById,
    updateFuncionario,
    deleteFuncionario
};