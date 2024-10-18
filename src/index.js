import React, { useState, useEffect } from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import './index.css';
import { dadosProdutosIniciais } from "./produtos/dados";
import { BuscarEndereco } from "./componentes/BuscarEndereço";
import { ListaProdutos } from "./componentes/ListaProdutos"
import { Carrinho } from "./componentes/Carrinho";




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

// Componente Principal
function App() {
  const [produtos, setProdutos] = useState(() => {
    // Carrega os produtos do localStorage se existirem, caso contrário, usa os dados iniciais
    const produtosSalvos = localStorage.getItem("produtos");
    return produtosSalvos ? JSON.parse(produtosSalvos) : dadosProdutosIniciais;
  });

  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [endereco, setEndereco] = useState(null);

  const [clientes, setClientes] = useState([]); // Estado para armazenar clientes cadastrados
  const [clienteLogado, setClienteLogado] = useState(false);
  const [showCadastro, setShowCadastro] = useState(false);
  const [showLoginAdmin, setShowLoginAdmin] = useState(false);
  const [adminLogado, setAdminLogado] = useState(false);

  // useEffect para salvar produtos no localStorage sempre que 'produtos' mudar
  useEffect(() => {
    localStorage.setItem("produtos", JSON.stringify(produtos));
  }, [produtos]);

  const adicionarAoCarrinho = (produto, quantidade) => {
    setItensCarrinho((prevItens) => {
      const itemExistente = prevItens.find((item) => item.id === produto.id);
      if (itemExistente) {
        // Verificar se a nova quantidade não excede o estoque
        if (itemExistente.quantidade + quantidade > produto.estoque) {
          alert(
            `Quantidade disponível: ${
              produto.estoque - itemExistente.quantidade
            }`
          );
          return prevItens;
        }
        return prevItens.map((item) =>
          item.id === produto.id
            ? { ...item, quantidade: item.quantidade + quantidade }
            : item
        );
      } else {
        return [...prevItens, { ...produto, quantidade }];
      }
    });
  };

  const atualizarQuantidade = (id, novaQuantidade) => {
    setItensCarrinho((prevItens) =>
      prevItens.map((item) =>
        item.id === id ? { ...item, quantidade: novaQuantidade } : item
      )
    );
  };

  const removerDoCarrinho = (id) => {
    setItensCarrinho((prevItens) => prevItens.filter((item) => item.id !== id));
  };

  const adicionarProduto = (novoProduto) => {
    setProdutos((prevProdutos) => [...prevProdutos, novoProduto]);
  };

  const logoutCliente = () => {
    setClienteLogado(false);
    setItensCarrinho([]); // Opcional: Limpar o carrinho ao logout
    setEndereco(null); // Opcional: Limpar o endereço ao logout
  };

  const logoutAdmin = () => {
    setAdminLogado(false);
  };

  const renderizarConteudo = () => {
    if (clienteLogado) {
      return (
        <div>
          <button onClick={logoutCliente} className="botao-logout">
            Logout Cliente
          </button>
          <ListaProdutos
            produtos={produtos}
            adicionarAoCarrinho={adicionarAoCarrinho}
            itensCarrinho={itensCarrinho}
          />
          <Carrinho
            itensCarrinho={itensCarrinho}
            produtos={produtos}
            atualizarQuantidade={atualizarQuantidade}
            removerDoCarrinho={removerDoCarrinho}
            endereco={endereco}
          />
          <BuscarEndereco setEndereco={setEndereco} />
          {endereco && (
            <div className="resultado-endereco">
              <p>
                <strong>Endereço:</strong> {endereco.logradouro},{" "}
                {endereco.bairro}
              </p>
              <p>
                <strong>Cidade:</strong> {endereco.localidade} - {endereco.uf}
              </p>
            </div>
          )}
        </div>
      );
    } else if (adminLogado) {
      return (
        <div>
          <button onClick={logoutAdmin} className="botao-logout">
            Logout Admin
          </button>
          <h2>Bem-vindo, Administrador!</h2>
          <AdminDashboard adicionarProduto={adicionarProduto} />
        </div>
      );
    } else {
      return (
        <div>
          {showCadastro ? (
            <CadastroCliente
              setShowCadastro={setShowCadastro}
              setClientes={setClientes}
              clientes={clientes}
            />
          ) : showLoginAdmin ? (
            <div>
              <LoginAdmin
                setAdminLogado={setAdminLogado}
                setShowLoginAdmin={setShowLoginAdmin}
              />
            </div>
          ) : (
            <div>
              <LoginCliente
                setClienteLogado={setClienteLogado}
                clientes={clientes}
              />
              <button
                onClick={() => setShowCadastro(true)}
                className="botao-cadastro"
              >
                Cadastrar Cliente
              </button>
              <button
                onClick={() => setShowLoginAdmin(true)}
                className="botao-login-admin"
              >
                Login Admin
              </button>
            </div>
          )}
        </div>
      );
    }
  };

  return (
    <div>
      <img
        src="https://github.com/zetuppi/CURSO-UNICARIOCA---DEV.-APLICA-ES-M-VEIS/blob/main/unnamed.png?raw=true"
        className="imagem-banner"
        alt="Banner"
      />
      {renderizarConteudo()}
    </div>
  );
}

const rootElement = document.getElementById("root");
ReactDOM.render(<App />, rootElement);


