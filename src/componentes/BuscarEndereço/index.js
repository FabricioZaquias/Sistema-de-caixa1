import React, { useState } from "https://esm.sh/react";

function BuscarEndereco({ setEndereco }) {
    const [cep, setCep] = useState("");
    const [carregando, setCarregando] = useState(false);
    const [erro, setErro] = useState(null);
  
    const handleBuscar = async (e) => {
      e.preventDefault();
      const cepLimpo = cep.replace(/\D/g, "");
      if (cepLimpo.length !== 8) {
        setErro("CEP inválido. Deve conter 8 dígitos.");
        setEndereco(null);
        return;
      }
  
      setCarregando(true);
      setErro(null);
  
      try {
        const response = await fetch(
          `https://viacep.com.br/ws/${cepLimpo}/json/`
        );
        const data = await response.json();
        if (data.erro) {
          setErro("CEP não encontrado.");
          setEndereco(null);
        } else {
          setEndereco(data);
        }
      } catch (error) {
        setErro("Erro ao buscar CEP.");
        setEndereco(null);
      } finally {
        setCarregando(false);
      }
    };
  
    return (
      <div className="buscar-endereco">
        <h2>Buscar Endereço pelo CEP</h2>
        <form onSubmit={handleBuscar}>
          <input
            type="text"
            value={cep}
            onChange={(e) => setCep(e.target.value)}
            placeholder="Digite o CEP (ex: 01001-000)"
            maxLength="9"
            className="input-cep"
          />
          <button type="submit" className="botao-buscar" disabled={carregando}>
            {carregando ? "Buscando..." : "Buscar"}
          </button>
        </form>
        {carregando && <p>Buscando endereço...</p>}
        {erro && <p className="erro">{erro}</p>}
      </div>
    );
  }

export {BuscarEndereco}