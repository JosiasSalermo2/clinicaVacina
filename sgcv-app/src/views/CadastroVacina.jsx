import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import Card from "../components/Card";
import { mensagemErro, mensagemSucesso } from "../components/toastr";
import FormGroup from "../components/FormGroup";
import LoadingOverlay from "../LoadingOverlay";

import "../custom.css";
import axios from "axios";
import { BASE_URL } from "../config/axios";

function CadastroVacina() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/vacinas`;

  const [vacina, setVacina] = useState("");
  const [indicacao, setIndicacao] = useState("");
  const [contraIndicacao, setContraIndicacao] = useState("");
  const [dosesAmpola, setDosesAmpola] = useState("");
  const [tipoVacinaId, setTipoVacinaId] = useState("");
  const [fabricanteId, setFabricanteId] = useState("");
  const [fornecedorId, setFornecedorId] = useState("");

  const [tiposVacina, setTiposVacina] = useState([]);
  const [fabricantes, setFabricantes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);

  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({});

  useEffect(() => {
    carregarListas();
    if (idParam) {
      buscar();
    } else {
      setLoading(false);
    }
  }, [idParam]);

  async function buscar() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const vacina = response.data;
      setVacina(vacina.vacina || "");
      setIndicacao(vacina.indicacao || "");
      setContraIndicacao(vacina.contraIndicacao || "");
      setDosesAmpola(vacina.dosesAmpola || "");
      setTipoVacinaId(vacina.tipoVacinaId?.toString() || "");
      setFabricanteId(vacina.fabricanteId?.toString() || "");
      setFornecedorId(vacina.fornecedorId?.toString() || "");
    } catch (error) {
      console.error("Erro ao buscar vacina:", error);
      mensagemErro("Erro ao buscar os dados da vacina.");
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    const novosErros = {};

    if (!String(vacina || "").trim()) {
      novosErros.vacina = "Informe o nome da vacina.";
    }

    if (!String(indicacao || "").trim()) {
      novosErros.indicacao = "Informe a indicação.";
    }

    if (!String(contraIndicacao || "").trim()) {
      novosErros.contraIndicacao = "Informe a contraindicação.";
    }

    if (!dosesAmpola || isNaN(dosesAmpola) || parseInt(dosesAmpola) <= 0) {
      novosErros.dosesAmpola = "Informe um número válido de doses por ampola.";
    }

    if (!tipoVacinaId) novosErros.tipoVacinaId = "Selecione o tipo da vacina.";

    if (!fabricanteId) novosErros.fabricanteId = "Selecione o fabricante.";

    if (!fornecedorId) novosErros.fornecedorId = "Selecione o fornecedor.";

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      mensagemErro("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    const data = {
      vacina,
      indicacao,
      contraIndicacao,
      dosesAmpola: parseInt(dosesAmpola),
      tipoVacinaId: parseInt(tipoVacinaId),
      fabricanteId: parseInt(fabricanteId),
      fornecedorId: parseInt(fornecedorId),
    };

    try {
      if (idParam) {
        await axios.put(`${baseURL}/${idParam}`, data);
        mensagemSucesso("Vacina atualizada com sucesso!");
      } else {
        await axios.post(baseURL, data);
        mensagemSucesso("Vacina cadastrada com sucesso!");
      }
      navigate("/ListagemVacinas");
    } catch (error) {
      mensagemErro(error?.response?.data || "Erro ao salvar a vacina.");
    }
  }

  async function carregarListas() {
    try {
      const [tipos, fabs, fornecs] = await Promise.all([
        axios.get(`${BASE_URL}/tipos-vacinas`),
        axios.get(`${BASE_URL}/fabricantes`),
        axios.get(`${BASE_URL}/fornecedores`),
      ]);
      console.log("👉 Tipos de Vacina:", tipos.data);
      console.log("👉 Fabricantes:", fabs.data);
      console.log("👉 Fornecedores:", fornecs.data);
      console.table(fabs.data);

      setTiposVacina(tipos.data);
      setFabricantes(fabs.data);
      setFornecedores(fornecs.data);
    } catch {
      mensagemErro("Erro ao carregar tipos, fabricantes ou fornecedores.");
    }
  }

  if (loading) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title={idParam ? "Editar Vacina" : "Cadastro de Vacina"}>
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <FormGroup label="Nome da Vacina *" htmlFor="vacina">
                <input
                  id="vacina"
                  className={`form-control ${erros.vacina ? "is-invalid" : ""}`}
                  value={vacina}
                  onChange={(e) => setVacina(e.target.value)}
                  required
                />
                {erros.vacina && (
                  <div className="invalid-feedback">{erros.vacina}</div>
                )}
              </FormGroup>
            </div>

            <div className="col-md-6 mb-3">
              <FormGroup label="Indicação *" htmlFor="indicacao">
                <input
                  id="indicacao"
                  className={`form-control ${
                    erros.indicacao ? "is-invalid" : ""
                  }`}
                  value={indicacao}
                  onChange={(e) => setIndicacao(e.target.value)}
                  required
                />
                {erros.indicacao && (
                  <div className="invalid-feedback">{erros.indicacao}</div>
                )}
              </FormGroup>
            </div>

            <div className="col-md-6 mb-3">
              <FormGroup label="Contraindicação *" htmlFor="contraIndicacao">
                <input
                  id="contraIndicacao"
                  className={`form-control ${
                    erros.contraIndicacao ? "is-invalid" : ""
                  }`}
                  value={contraIndicacao}
                  onChange={(e) => setContraIndicacao(e.target.value)}
                />
                {erros.contraIndicacao && (
                  <div className="invalid-feedback">
                    {erros.contraIndicacao}
                  </div>
                )}
              </FormGroup>
            </div>

            <div className="col-md-6 mb-3">
              <FormGroup label="Doses por Ampola *" htmlFor="dosesAmpola">
                <input
                  id="dosesAmpola"
                  type="number"
                  className={`form-control ${
                    erros.dosesAmpola ? "is-invalid" : ""
                  }`}
                  value={dosesAmpola}
                  onChange={(e) => setDosesAmpola(e.target.value)}
                  required
                  min={1}
                />
                {erros.dosesAmpola && (
                  <div className="invalid-feedback">{erros.dosesAmpola}</div>
                )}
              </FormGroup>
            </div>

            <div className="col-md-6 mb-3">
              <FormGroup label="Tipo da Vacina *" htmlFor="tipoVacinaId">
                <select
                  id="tipoVacinaId"
                  className={`form-control ${
                    erros.tipoVacinaId ? "is-invalid" : ""
                  }`}
                  value={tipoVacinaId}
                  onChange={(e) => setTipoVacinaId(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {tiposVacina.map((tipo) => (
                    <option key={tipo.id} value={tipo.id}>
                      {tipo.tipoVacina}
                    </option>
                  ))}
                </select>
                {erros.tipoVacinaId && (
                  <div className="invalid-feedback">{erros.tipoVacinaId}</div>
                )}
              </FormGroup>
            </div>

            <div className="col-md-6 mb-3">
              <FormGroup label="Fabricante *" htmlFor="fabricanteId">
                <select
                  id="fabricanteId"
                  className={`form-control ${
                    erros.fabricanteId ? "is-invalid" : ""
                  }`}
                  value={fabricanteId}
                  onChange={(e) => setFabricanteId(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {fabricantes.map((fab) => (
                    <option key={fab.id} value={fab.id}>
                      {fab.nomeFantasia}
                    </option>
                  ))}
                </select>
                {erros.fabricanteId && (
                  <div className="invalid-feedback">{erros.fabricanteId}</div>
                )}
              </FormGroup>
            </div>

            <div className="col-md-6 mb-3">
              <FormGroup label="Fornecedor *" htmlFor="fornecedorId">
                <select
                  id="fornecedorId"
                  className={`form-control ${
                    erros.fornecedorId ? "is-invalid" : ""
                  }`}
                  value={fornecedorId}
                  onChange={(e) => setFornecedorId(e.target.value)}
                >
                  <option value="">Selecione</option>
                  {fornecedores.map((forn) => (
                    <option key={forn.id} value={forn.id}>
                      {forn.nomeFantasia}
                    </option>
                  ))}
                </select>
                {erros.fornecedorId && (
                  <div className="invalid-feedback">{erros.fornecedorId}</div>
                )}
              </FormGroup>
            </div>
          </div>

          <Stack spacing={2} direction="row" className="mt-3">
            <button type="button" className="btn btn-success" onClick={salvar}>
              Salvar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => navigate("/ListagemVacinas")}
            >
              Cancelar
            </button>
          </Stack>
        </form>
      </Card>
    </div>
  );
}

export default CadastroVacina;
