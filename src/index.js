import React, { useState, useEffect } from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import './index.css';
import { dadosProdutosIniciais } from "./produtos/dados";
import { formatarPreco, gerarNumeroPedido, calcularFrete } from "./utilitarios/utilits";
import { BuscarEndereco } from "./componentes/BuscarEndereço";

function ListaProdutos({ produtos, adicionarAoCarrinho, itensCarrinho }) {
  const [quantidades, setQuantidades] = useState({});

  const handleQuantidadeChange = (id, value) => {
    setQuantidades((prev) => ({ ...prev, [id]: value }));
  };

  return (
    <div className="product-list">
      <ul className="produtos-lista">
        {produtos.map((produto) => {
          // Encontrar a quantidade já no carrinho para este produto
          const itemNoCarrinho = itensCarrinho.find(
            (item) => item.id === produto.id
          );
          const quantidadeNoCarrinho = itemNoCarrinho
            ? itemNoCarrinho.quantidade
            : 0;
          const quantidadeDisponivel = produto.estoque - quantidadeNoCarrinho;

          return (
            <li key={produto.id}>
              <p>{produto.nome}</p>
              <img
                src={produto.imagem}
                alt={produto.nome}
                className="produto-imagem"
              />
              <div className="produto-preco">
                Preço: {formatarPreco(produto.preco)}
              </div>
              <p>Validade: {produto.validade}</p>
              <input
                type="number"
                value={quantidades[produto.id] || 1}
                min="1"
                max={quantidadeDisponivel > 0 ? quantidadeDisponivel : 0}
                onChange={(e) => {
                  let valor = Number(e.target.value);
                  // Garantir que o valor não exceda a quantidade disponível
                  if (valor > quantidadeDisponivel) {
                    valor = quantidadeDisponivel;
                  }
                  if (valor < 1) {
                    valor = 1;
                  }
                  setQuantidades((prev) => ({ ...prev, [produto.id]: valor }));
                }}
                className="produto-quantidade"
                disabled={quantidadeDisponivel <= 0}
              />
              <button
                onClick={() => {
                  const quantidade = parseInt(quantidades[produto.id]) || 1;
                  if (quantidade > quantidadeDisponivel) {
                    alert(`Quantidade disponível: ${quantidadeDisponivel}`);
                  } else {
                    adicionarAoCarrinho(produto, quantidade);
                  }
                }}
                className="produto-botao"
                disabled={quantidadeDisponivel <= 0}
              >
                {quantidadeDisponivel > 0
                  ? "Adicionar ao Carrinho"
                  : "Estoque Esgotado"}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

function Carrinho({
  itensCarrinho,
  produtos,
  atualizarQuantidade,
  removerDoCarrinho,
  endereco
}) {
  const total = itensCarrinho.reduce(
    (acc, item) => acc + item.preco * item.quantidade,
    0
  );
  const valorFrete = endereco ? calcularFrete(total, endereco) : 0; // Calcular frete somente se o endereço estiver definido
  const temFreteGratis = total >= 20;

  const finalizarCompra = () => {
    if (!endereco) {
      alert("Por favor, informe o CEP para finalizar a compra.");
    } else {
      const numeroPedido = gerarNumeroPedido();
      const mensagem = `
        Pedido nº: ${numeroPedido}
        Endereço: ${endereco.logradouro}, ${endereco.bairro}, ${
        endereco.localidade
      } - ${endereco.uf}
        Produtos: ${itensCarrinho
          .map((item) => `${item.nome} (x${item.quantidade})`)
          .join(", ")}
        Total dos Produtos: ${formatarPreco(total)}
        Frete: ${temFreteGratis ? "Grátis" : formatarPreco(valorFrete)}
        Total da Compra: ${formatarPreco(
          total + (temFreteGratis ? 0 : valorFrete)
        )}
      `;
      alert(mensagem);
    }
  };

  return (
    <div className="carrinho">
      <h2>Carrinho de Compras</h2>
      {itensCarrinho.length === 0 ? (
        <p>Seu carrinho está vazio.</p>
      ) : (
        <>
          <ul>
            {itensCarrinho.map((item) => {
              const produtoAtual = produtos.find((p) => p.id === item.id);
              const estoqueDisponivel = produtoAtual ? produtoAtual.estoque : 0;
              return (
                <li key={item.id}>
                  <img
                    src={produtoAtual.imagem}
                    alt={item.nome}
                    className="produto-imagem"
                  />
                  {item.nome} - {formatarPreco(item.preco)} x
                  <input
                    type="number"
                    value={item.quantidade}
                    min="1"
                    max={estoqueDisponivel + item.quantidade}
                    onChange={(e) => {
                      let novaQuantidade = Number(e.target.value);
                      // Garantir que a nova quantidade não exceda o estoque
                      if (
                        novaQuantidade >
                        estoqueDisponivel + item.quantidade
                      ) {
                        novaQuantidade = estoqueDisponivel + item.quantidade;
                        alert(
                          `Quantidade disponível: ${
                            estoqueDisponivel + item.quantidade
                          }`
                        );
                      }
                      if (novaQuantidade < 1) {
                        novaQuantidade = 1;
                      }
                      atualizarQuantidade(item.id, novaQuantidade);
                    }}
                    style={{ width: "50px", marginLeft: "5px" }}
                  />
                  <button
                    onClick={() => removerDoCarrinho(item.id)}
                    className="remove-btn"
                  >
                    Remover
                  </button>
                </li>
              );
            })}
          </ul>
          <h3>Total: {formatarPreco(total)}</h3>
          {endereco ? (
            <>
              <h3>Frete: {formatarPreco(valorFrete)}</h3>
              {temFreteGratis ? (
                <p className="entrega-gratis">
                  Parabéns! Você ganhou frete grátis.
                </p>
              ) : (
                <p>
                  Adicione mais {formatarPreco(20 - total)} para ganhar frete
                  grátis (a partir de R$ 20).
                </p>
              )}
            </>
          ) : (
            <p>Por favor, informe seu CEP para calcular o frete.</p>
          )}
          {!temFreteGratis && endereco && (
            <p>
              Adicione mais {formatarPreco(20 - total)} para ganhar frete
              grátis.
            </p>
          )}
          <button onClick={finalizarCompra} className="finalizar-btn">
            Finalizar Compras
          </button>
        </>
      )}
    </div>
  );
}

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


