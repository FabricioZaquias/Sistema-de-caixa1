/* import React, { useState, useEffect } from "https://esm.sh/react";
import ReactDOM from "https://esm.sh/react-dom";
import './index.css';
 import { dadosProdutosIniciais } from "./produtos/dados";
import { BuscarEndereco } from "./componentes/BuscarEndereço";
import { ListaProdutos } from "./componentes/ListaProdutos"
import { Carrinho } from "./componentes/Carrinho";
import { LoginCliente,LoginAdmin, AdminDashboard, CadastroCliente } from "./componentes/User"; 


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
*/

