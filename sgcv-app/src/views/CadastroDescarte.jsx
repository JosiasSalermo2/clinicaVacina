import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";

import Card from "../components/Card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import FormGroup from "../components/FormGroup";
import LoadingOverlay from "../LoadingOverlay";

import "../custom.css";
import axios from "axios";
import { BASE_URL } from "../config/axios";

function CadastroDescarte() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/descartes`;

  const[id, setId] = useState('');
  const [quantidadeDescarte, setQuantidadeDescarte] = useState("");
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState("");
  const [nomeDescarte, setNomeDescarte] = useState("");
  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({});

  // — IDs de relacionamento
  const [estoqueId, setEstoqueId] = useState("");
  // — Listas para selects (sempre arrays)
  const [estoques, setEstoques] = useState([]);

  async function salvar() {
    const novosErros = {};
    if (!quantidadeDescarte || isNaN(parseInt(quantidadeDescarte))) {
      novosErros.quantidadeDescarte = "Informe a quantidade a ser descartada.";
    }

    if (!quantidadeDisponivel || isNaN(parseInt(quantidadeDisponivel))) {
      novosErros.quantidadeDisponivel = "Informe a quantidade a disponível.";
    }

    if (!estoqueId) {
      novosErros.estoqueId = "Selecione o estoque.";
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      mensagemErro("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    const data = {
      quantidadeDescarte,
      quantidadeDisponivel,
      estoqueId: parseInt(estoqueId),
    };
    if (idParam) data.id = id;

    try {
      if (!idParam) {
        await axios.post(baseURL, data);
        mensagemSucesso(`Descarte cadastrado com sucesso!`);
        setQuantidadeDescarte("");
        setQuantidadeDisponivel("");
        setEstoqueId("");
        setErros({});
      } else {
        await axios.put(`${baseURL}/${idParam}`, data);
        mensagemSucesso("Descarte alterado com sucesso.");
        navigate("/ListagemDescarte");
      }
    } catch (error) {
      mensagemErro(error?.response?.data || "Erro ao salvar o descarte.");
    }
}

  function inicializar() {
    if (idParam == null) {
      setQuantidadeDescarte("");
      setQuantidadeDisponivel("");
    } else {
      buscarDescarte();
    }
  }

  //Estoques
  useEffect(() => {
    async function carregarEstoques() {
      try {
        const response = await axios.get(`${BASE_URL}/estoques`);
        setEstoques(response.data);
      } catch (error) {
        mensagemErro("Erro ao carregar lista de estoques.");
      }
    }
    carregarEstoques();
  }, []);

    const buscarDescarte = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/${idParam}`);
      const descarte = response.data;
      setQuantidadeDescarte(descarte.quantidadeDescarte);
      setQuantidadeDisponivel(descarte.quantidadeDisponivel);
      setEstoqueId(response.data.estoqueId);
    } catch (error) {
      mensagemErro("Erro ao buscar descarte.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (idParam) {
      buscarDescarte();
    } else {
      setLoading(false);
    }
  }, [idParam]);

  if (loading) return <LoadingOverlay loading={true} />;

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title={idParam ? "Editar Descarte" : "Cadastrar Descarte"}>
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <FormGroup
                label="Quantidade a ser descartada: *"
                htmlFor="inputQuantidadeDescarte"
              >
                <input
                  type="number"
                  id="inputQuantidadeDescarte"
                  className={`form-control ${
                    erros.quantidadeDescarte ? "is-invalid" : ""
                  }`}
                  value={quantidadeDescarte}
                  onChange={(e) => setQuantidadeDescarte(e.target.value)}
                  required
                />
                {erros.quantidadeDescarte && (
                  <div className="invalid-feedback">
                    {erros.quantidadeDescarte}
                  </div>
                )}
              </FormGroup>
            </div>
            <div className="col-md-6 mb-3">
              <FormGroup
                label="Quantidade disponível: "
                htmlFor="inputQuantidadeDisponivel"
              >
                <input
                  type="number"
                  id="inputQuantidadeDisponivel"
                  className={`form-control ${
                    erros.quantidadeDisponivel ? "is-invalid" : ""
                  }`}
                  value={quantidadeDisponivel}
                  onChange={(e) => setQuantidadeDisponivel(e.target.value)}
                  required
                />
              </FormGroup>
            </div>
          </div>

          <div className="row">
            <div className="col-md-12 mb-3">
              <FormGroup label="Estoque de: *" htmlFor="selectEstoque">
                <select
                  id="selectEstoque"
                  className={`form-select ${erros.estoqueId ? "is-invalid" : ""
                  }`}
                  value={estoqueId}
                  onChange={(e) => setEstoqueId(e.target.value)}
                  required
                >
                  <option value="">Selecione o estoque</option>
                  {estoques.map((estoque) => (
                    <option key={estoque.id} value={estoque.id}>
                      {`${estoque.nome}`}
                    </option>
                  ))}
                </select>
                {erros.estoqueId && (
                  <div className="invalid-feedback">{erros.estoqueId}</div>
                )}
              </FormGroup>
            </div>
          </div>

          <Stack spacing={1} padding={1} direction="row">
            <button type="button" className="btn btn-success" onClick={salvar}>
              Salvar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => navigate("/ListagemDescarte")}
            >
              Cancelar
            </button>
          </Stack>
        </form>
      </Card>
    </div>
  );
}

export default CadastroDescarte;
