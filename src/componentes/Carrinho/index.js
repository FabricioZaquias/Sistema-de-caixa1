import React from "https://esm.sh/react";
import { formatarPreco, gerarNumeroPedido, calcularFrete } from "../../utilitarios/utilits";



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
                     max={estoqueDisponivel}
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

  export {Carrinho}