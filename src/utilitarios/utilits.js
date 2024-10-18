function formatarPreco(preco) {
    return `R$ ${preco.toFixed(2)}`;
  }
  
  function calcularFrete(total, endereco) {
    let valorFrete = 10; // Valor base do frete
    const regiao = endereco ? endereco.uf : null;
  
    if (total < 20) {
      if (regiao === "RJ") {
        valorFrete = 5;
      } else if (regiao === "SP") {
        valorFrete = 7;
      } else {
        valorFrete = 10;
      }
    } else {
      valorFrete = 0; // Frete grátis acima de R$ 20
    }
  
    if (valorFrete > total * 0.5) {
      valorFrete = total * 0.5;
    }
  
    return valorFrete;
  }
  function gerarNumeroPedido() {
    return Math.floor(Math.random() * 1000000); // Gera um número aleatório de pedido
  }

  export {formatarPreco,calcularFrete,gerarNumeroPedido}  