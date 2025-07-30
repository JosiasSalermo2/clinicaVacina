import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";

import Card from "../components/Card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import FormGroup from "../components/FormGroup";

import "../custom.css";
import LoadingOverlay from "../LoadingOverlay";

import axios from "axios";

import { BASE_URL } from '../config/axios';

function CadastroEstoque() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/estoques`;

  const [id, setId] = useState('');
  const [nome, setNome] = useState('');
  const [quantidadeDisponivel, setQuantidadeDisponivel] = useState('');
  const [quantidadeMinima, setQuantidadeMinima] = useState('');
  const [quantidadeMaxima, setQuantidadeMaxima] = useState('');
  const [pontoRessuprimento, setPontoRessuprimento] = useState('');
  const [nomeFabricante, setNomeFabricante] = useState('');
  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({});

  // — IDs de relacionamento
  const [fabricanteId, setFabricanteId] = useState('');

  // — Listas para selects (sempre arrays)
  const [fabricantes, setFabricantes] = useState([]);


async function salvar() {
  const novosErros = {};

  if (!nome || !nome.trim()) {
    novosErros.nome = "O nome do estoque é obrigatório.";
  }

  if (!quantidadeDisponivel || isNaN(quantidadeDisponivel)) {
    novosErros.quantidadeDisponivel = "Quantidade disponível é obrigatória.";
  }

  if (!quantidadeMinima || isNaN(quantidadeMinima)) {
    novosErros.quantidadeMinima = "Quantidade mínima é obrigatória.";
  }

  if (!quantidadeMaxima || isNaN(quantidadeMaxima)) {
    novosErros.quantidadeMaxima = "Quantidade máxima é obrigatória.";
  }

  if (!pontoRessuprimento || isNaN(pontoRessuprimento)) {
    novosErros.pontoRessuprimento = "Ponto de ressuprimento é obrigatório.";
  }

  if (!fabricanteId) {
      novosErros.fabricanteId = "Selecione o fabricante.";
    }

  setErros(novosErros);
  if (Object.keys(novosErros).length > 0) {
    mensagemErro("Preencha todos os campos obrigatórios corretamente.");
    return;
  }

  const data = {
    nome,
    quantidadeDisponivel,
    quantidadeMinima,
    quantidadeMaxima,
    pontoRessuprimento,
    fabricanteId: parseInt(fabricanteId),
  };
  if (idParam) data.id = id;

  try {
    if (!idParam) {
      await axios.post(baseURL, data);
      mensagemSucesso(`Estoque de ${nome} cadastrado com sucesso!`);
      setNome("");
      setQuantidadeDisponivel("");
      setQuantidadeMinima("");
      setQuantidadeMaxima("");
      setPontoRessuprimento("");
      setFabricanteId("");
      setErros({});
    } else {
      await axios.put(`${baseURL}/${idParam}`, data);
      mensagemSucesso(`Estoque de ${nome} alterado com sucesso!`);
      navigate(`/ListagemEstoques`);
    }
  } catch (error) {
    mensagemErro(error?.response?.data || "Erro ao salvar o estoque.");
  }
}

// - Fabricantes 
  useEffect(() => {
  async function carregarFabricantes() {
    try {
      const response = await axios.get(`${BASE_URL}/fabricantes`);
      setFabricantes(response.data);
    } catch (error) {
      mensagemErro("Erro ao carregar fabricantes.");
    }
  }

  carregarFabricantes();

  if (idParam) {
    buscar();
  } else {
    setLoading(false);
  }
}, [idParam]);




  async function buscar() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      setId(response.data.id);
      setNome(response.data.nome);
      setQuantidadeDisponivel(response.data.quantidadeDisponivel);
      setQuantidadeMinima(response.data.quantidadeMinima);
      setQuantidadeMaxima(response.data.quantidadeMaxima);
      setPontoRessuprimento(response.data.pontoRessuprimento);
      setFabricanteId(response.data.fabricanteId);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      mensagemErro("Erro ao buscar os dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (idParam) {
      buscar();
    } else {
      setLoading(false);
    }
  }, [idParam]);

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title="Cadastro de Estoque">
        <div className="row">
          <div className="col-lg-12">
            <div className="form-row">
              <div className="mesmaLinha">
                <div className="col-md-12 mb-3">
                  <FormGroup label="Nome do estoque: *" htmlFor="inputNome">
                    <input
                      type="text"
                      id="inputNome"
                      value={nome}
                      className={`form-control ${erros.nome ? "is-invalid" : ""}`}
                      onChange={(e) => setNome(e.target.value)}
                    />
                    {erros.nome && (
                      <div className="invalid-feedback">{erros.nome}</div>
                    )}
                  </FormGroup>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <FormGroup
                  label="Quantidade disponível: *"
                  htmlFor="inputQuantidadeDisponivel"
                >
                  <input
                    type="number"
                    id="inputQuantidadeDisponivel"
                    value={quantidadeDisponivel}
                    className={`form-control ${erros.quantidadeDisponivel ? "is-invalid" : ""}`}
                    onChange={(e) => setQuantidadeDisponivel(e.target.value)}
                    min="0"
                  />
                  {erros.quantidadeDisponivel && (
                    <div className="invalid-feedback">
                      {erros.quantidadeDisponivel}
                    </div>
                  )}
                </FormGroup>

                <FormGroup
                  label="Quantidade mínima: *"
                  htmlFor="inputQuantidadeMinima"
                >
                  <input
                    type="number"
                    id="inputQuantidadeMinima"
                    value={quantidadeMinima}
                    className={`form-control ${erros.quantidadeMinima ? "is-invalid" : ""}`}
                    onChange={(e) => setQuantidadeMinima(e.target.value)}
                    min="0"
                  />
                  {erros.quantidadeMinima && (
                    <div className="invalid-feedback">
                      {erros.quantidadeMinima}
                    </div>
                  )}
                </FormGroup>

                <FormGroup
                  label="Quantidade máxima: *"
                  htmlFor="inputQuantidadeMaxima"
                >
                  <input
                    type="number"
                    id="inputQuantidadeMaxima"
                    value={quantidadeMaxima}
                    className={`form-control ${erros.quantidadeMaxima ? "is-invalid" : ""}`}
                    onChange={(e) => setQuantidadeMaxima(e.target.value)}
                    min="0"
                  />
                  {erros.quantidadeMaxima && (
                    <div className="invalid-feedback">
                      {erros.quantidadeMaxima}
                    </div>
                  )}
                </FormGroup>

                <FormGroup
                  label="Ponto ressuprimento: *"
                  htmlFor="inputPontoRessuprimento"
                >
                  <input
                    type="number"
                    id="inputPontoRessuprimento"
                    value={pontoRessuprimento}
                    className={`form-control ${erros.pontoRessuprimento ? "is-invalid" : ""}`}
                    onChange={(e) => setPontoRessuprimento(e.target.value)}
                    min="0"
                  />
                  {erros.pontoRessuprimento && (
                    <div className="invalid-feedback">
                      {erros.pontoRessuprimento}
                    </div>
                  )}
                </FormGroup>

                <FormGroup label="Fabricante: *" htmlFor="selectFabricante">
                <select
                  className={`form-select ${erros.fabricanteId ? 'is-invalid' : ''}`}
                  id="selectFabricante"
                  value={fabricanteId}
                  onChange={e => setFabricanteId(e.target.value)}
                >
                  <option value="">Selecione o Fabricante</option>
                  {fabricantes.map(fab => (
                    <option key={fab.id} value={fab.id}>
                      {fab.nomeFantasia}
                    </option>
                  ))}
                </select>
                {erros.fabricanteId && <div className="invalid-feedback">{erros.fabricanteId}</div>}

              </FormGroup>
              </div>

              <Stack spacing={1} padding={1} direction="row">
                <button
                  onClick={salvar}
                  type="button"
                  className="btn btn-success"
                >
                  Salvar
                </button>
                <button
                  onClick={() => navigate("/ListagemEstoques")}
                  type="button"
                  className="btn btn-danger"
                >
                  Cancelar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroEstoque;
