import React, { useState } from "https://esm.sh/react";

// Componentes de Login e Cadastro
function LoginCliente({ setClienteLogado, clientes }) {
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
  
    const handleLogin = () => {
      const clienteEncontrado = clientes.find(
        (cliente) => cliente.email === email && cliente.senha === senha
      );
  
      if (clienteEncontrado) {
        alert("Login de Cliente bem-sucedido!");
        setClienteLogado(true);
      } else {
        alert("Credenciais inválidas.");
      }
    };
  
    return (
      <div className="login-container login-form">
        <h2>Login Cliente</h2>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button onClick={handleLogin}>Entrar</button>
      </div>
    );
  }
  
  function CadastroCliente({ setShowCadastro, setClientes, clientes }) {
    const [nome, setNome] = useState("");
    const [email, setEmail] = useState("");
    const [senha, setSenha] = useState("");
  
    const handleCadastro = () => {
      if (!nome || !email || !senha) {
        alert("Por favor, preencha todos os campos.");
        return;
      }
  
      // Verificar se o email já está cadastrado
      const emailExistente = clientes.find((cliente) => cliente.email === email);
      if (emailExistente) {
        alert("Email já cadastrado.");
        return;
      }
  
      // Adiciona o cliente ao estado
      setClientes((prev) => [...prev, { nome, email, senha }]);
      alert(`Cliente cadastrado: ${nome}, ${email}`);
      setNome("");
      setEmail("");
      setSenha("");
      setShowCadastro(false); // Voltar para a tela de login após cadastro
    };
  
    return (
      <div className="login-container login-form">
        <h2>Cadastro Cliente</h2>
        <input
          type="text"
          placeholder="Nome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button onClick={handleCadastro}>Cadastrar</button>
        <button onClick={() => setShowCadastro(false)} className="botao-voltar">
          Voltar
        </button>
      </div>
    );
  }
  
  function LoginAdmin({ setAdminLogado, setShowLoginAdmin }) {
    const [senha, setSenha] = useState("");
  
    const handleLogin = () => {
      if (senha === "admin123") {
        alert("Login de Admin bem-sucedido!");
        setAdminLogado(true);
        setShowLoginAdmin(false); // Esconder o formulário de login do admin
      } else {
        alert("Credenciais inválidas.");
      }
    };
  
    return (
      <div className="login-container login-form">
        <h2>Login Admin</h2>
        <input
          type="password"
          placeholder="Senha"
          value={senha}
          onChange={(e) => setSenha(e.target.value)}
        />
        <button onClick={handleLogin}>Entrar</button>
        <button onClick={() => setShowLoginAdmin(false)} className="botao-voltar">
          Voltar
        </button>
      </div>
    );
  }
  
  // Componente Adicional para Dashboard Admin
  function AdminDashboard({ adicionarProduto }) {
    const [nome, setNome] = useState("");
    const [preco, setPreco] = useState("");
    const [imagem, setImagem] = useState("");
    const [estoque, setEstoque] = useState("");
    const [validade, setValidade] = useState("");
  
    const handleAdicionarProduto = () => {
      if (!nome || !preco || !imagem || !estoque || !validade) {
        alert("Por favor, preencha todos os campos.");
        return;
      }
  
      // Criar um novo ID para o produto
      const novoId = Date.now(); // Utiliza timestamp como ID único
  
      const novoProduto = {
        id: novoId,
        nome,
        preco: parseFloat(preco),
        imagem,
        estoque: parseInt(estoque),
        validade
      };
  
      adicionarProduto(novoProduto);
      alert(`Produto "${nome}" adicionado com sucesso!`);
  
      // Limpar os campos
      setNome("");
      setPreco("");
      setImagem("");
      setEstoque("");
      setValidade("");
    };
  
    return (
      <div className="admin-dashboard">
        <h3>Dashboard do Administrador</h3>
        <h4>Cadastrar Novo Produto</h4>
        <div className="cadastro-produto">
          <input
            type="text"
            placeholder="Nome do Produto"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
          />
          <input
            type="number"
            step="0.01"
            placeholder="Preço (R$)"
            value={preco}
            onChange={(e) => setPreco(e.target.value)}
          />
          <input
            type="text"
            placeholder="URL da Imagem"
            value={imagem}
            onChange={(e) => setImagem(e.target.value)}
          />
          <input
            type="number"
            placeholder="Estoque"
            value={estoque}
            onChange={(e) => setEstoque(e.target.value)}
          />
          <input
            type="text"
            placeholder="Validade (dd/mm/yyyy)"
            value={validade}
            onChange={(e) => setValidade(e.target.value)}
          />
          <button onClick={handleAdicionarProduto}>Adicionar Produto</button>
        </div>
      </div>
    );
  }

  export { LoginCliente,LoginAdmin, AdminDashboard, CadastroCliente }