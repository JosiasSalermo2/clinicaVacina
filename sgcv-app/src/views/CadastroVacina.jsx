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

  const [id, setId] = useState("");
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

  // 🔄 Carregar listas
  useEffect(() => {
    axios
      .get(`${BASE_URL}/tipoVacina`)
      .then((response) => setTiposVacina(response.data))
      .catch((error) =>
        console.error("Erro ao buscar tipos de vacina:", error),
      );
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/fabricante`)
      .then((response) => setFabricantes(response.data))
      .catch((error) => console.error("Erro ao buscar fabricantes", error));
  }, []);

  useEffect(() => {
    axios
      .get(`${BASE_URL}/fornecedores`)
      .then((response) => setFornecedores(response.data))
      .catch((error) => console.error("Erro ao buscar fornecedores:", error));
  }, []);

  // 🔄 Buscar vacina para edição
  useEffect(() => {
    if (idParam) {
      buscar();
    } else {
      setLoading(false);
    }
  }, [idParam]);

  async function buscar() {
    try {
      const response = await axios.get(`${BASE_URL}/vacinas/${idParam}`);
      const vacina = response.data;
      setId(vacina.id || "");
      setVacina(vacina.vacina || "");
      setIndicacao(vacina.indicacao || "");
      setContraIndicacao(vacina.contraIndicacao || "");
      setDosesAmpola(vacina.dosesAmpola || "");
      setTipoVacinaId(vacina.tipoVacinaId || "");
      setFabricanteId(vacina.fabricanteId || "");
      setFornecedorId(vacina.fornecedorId || "");
    } catch (error) {
      console.error("Erro ao buscar vacina:", error);
      mensagemErro("Erro ao buscar os dados da vacina.");
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    const novosErros = {};

    if (!String(indicacao || "").trim()) {
      novosErros.indicacao = "Informe a indicação.";
    }

    if (!String(contraIndicacao || "").trim()) {
      novosErros.contraIndicacao = "Informe a contra-indicação.";
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      mensagemErro("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    const data = {
      id,
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
        await axios.put(`${BASE_URL}/vacinas/${idParam}`, data);
        mensagemSucesso("Vacina atualizada com sucesso!");
      } else {
        await axios.post(`${BASE_URL}/vacinas`, data);
        mensagemSucesso("Vacina cadastrada com sucesso!");
        navigate("/ListagemVacinas");
      }
    } catch (error) {
      console.error(error);
      mensagemErro(error?.response?.data || "Erro ao salvar a vacina.");
    }
  }

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title={idParam ? "Editar Vacina" : "Cadastro de Vacina"}>
        <div className="row">
          <div className="col-lg-12">
            <FormGroup label="Nome da Vacina *" htmlFor="vacina">
              <input
                id="vacina"
                className="form-control"
                value={vacina}
                onChange={(e) => setVacina(e.target.value)}
              />
            </FormGroup>

            <FormGroup label="Indicação *" htmlFor="indicacao">
              <input
                id="indicacao"
                className="form-control"
                value={indicacao}
                onChange={(e) => setIndicacao(e.target.value)}
              />
            </FormGroup>

            <FormGroup label="Contraindicação *" htmlFor="contraIndicacao">
              <input
                id="contraIndicacao"
                className="form-control"
                value={contraIndicacao}
                onChange={(e) => setContraIndicacao(e.target.value)}
              />
            </FormGroup>

            <FormGroup label="Doses por Ampola *" htmlFor="dosesAmpola">
              <input
                id="dosesAmpola"
                type="number"
                className="form-control"
                value={dosesAmpola}
                onChange={(e) => setDosesAmpola(e.target.value)}
              />
            </FormGroup>

            <FormGroup label="Tipo da Vacina *" htmlFor="tipoVacinaId">
              <select
                id="tipoVacinaId"
                className="form-control"
                value={tipoVacinaId}
                onChange={(e) => setTipoVacinaId(e.target.value)}
              >
                <option value="">Selecione</option>
                {tiposVacina.map((tipo) => (
                  <option key={tipo.id} value={tipo.id}>
                    {tipo.nome}
                  </option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="Fabricante *" htmlFor="fabricanteId">
              <select
                id="fabricanteId"
                className="form-control"
                value={fabricanteId}
                onChange={(e) => setFabricanteId(e.target.value)}
              >
                <option value="">Selecione</option>
                {fabricantes.map((fab) => (
                  <option key={fab.id} value={fab.id}>
                    {fab.nome}
                  </option>
                ))}
              </select>
            </FormGroup>

            <FormGroup label="Fornecedor *" htmlFor="fornecedorId">
              <select
                id="fornecedorId"
                className="form-control"
                value={fornecedorId}
                onChange={(e) => setFornecedorId(e.target.value)}
              >
                <option value="">Selecione</option>
                {fornecedores.map((forn) => (
                  <option key={forn.id} value={forn.id}>
                    {forn.nome}
                  </option>
                ))}
              </select>
            </FormGroup>

            <Stack spacing={2} direction="row" className="mt-3">
              <button className="btn btn-success" onClick={salvar}>
                Salvar
              </button>
              <button
                className="btn btn-danger"
                onClick={() => navigate("/ListagemVacinas")}
              >
                Cancelar
              </button>
            </Stack>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroVacina;
