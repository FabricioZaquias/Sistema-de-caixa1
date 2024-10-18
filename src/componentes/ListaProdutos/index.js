
import React, { useState } from "https://esm.sh/react";
import { formatarPreco } from "../../utilitarios/utilits";


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

  export {ListaProdutos}