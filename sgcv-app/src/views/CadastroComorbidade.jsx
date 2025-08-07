import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

import Card from "../components/Card";
import FormGroup from "../components/FormGroup";
import LoadingOverlay from "../LoadingOverlay";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import { BASE_URL } from "../config/axios";
import Stack from "@mui/material/Stack";

function CadastroComorbidade() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/comorbidades`;

  const [comorbidade, setComorbidade] = useState("");
  const [descricao, setDescricao] = useState("");
  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({});

  useEffect(() => {
    if (idParam) {
      buscar();
    } else {
      setLoading(false);
    }
  }, [idParam]);

  const buscar = async () => {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const data = response.data;
      setComorbidade(data.comorbidade || "");
      setDescricao(data.descricao || "");
    } catch (error) {
      mensagemErro("Erro ao buscar comorbidade.");
    } finally {
      setLoading(false);
    }
  };

  const validarCampos = () => {
    const novosErros = {};
    if (!comorbidade.trim()) {
      novosErros.comorbidade = "Comorbidade é obrigatória.";
    }
    if (!descricao.trim()) {
      novosErros.descricao = "Descrição é obrigatória.";
    }
    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvar = async () => {
    if (!validarCampos()) {
      mensagemErro("Preencha todos os campos obrigatórios.");
      return;
    }

    const dados = { comorbidade, descricao };

    try {
      if (idParam) {
        await axios.put(`${baseURL}/${idParam}`, dados);
        mensagemSucesso("Comorbidade atualizada com sucesso!");
      } else {
        await axios.post(baseURL, dados);
        mensagemSucesso("Comorbidade cadastrada com sucesso!");
        setComorbidade("");
        setDescricao("");
      }
      navigate("/ListagemComorbidades");
    } catch (error) {
      mensagemErro(error.response?.data || "Erro ao salvar comorbidade.");
    }
  };

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title={idParam ? "Editar Comorbidade" : "Cadastrar Comorbidade"}>
        <div className="row">
          <div className="col-md-12 mb-3">
            <FormGroup label="Comorbidade: *" htmlFor="inputComorbidade">
              <input
                type="text"
                className="form-control"
                id="inputComorbidade"
                value={comorbidade}
                onChange={(e) => setComorbidade(e.target.value)}
              />
              {erros.comorbidade && (
                <div className="invalid-feedback d-block">
                  {erros.comorbidade}
                </div>
              )}
            </FormGroup>
          </div>

          <div className="col-md-12 mb-3">
            <FormGroup label="Descrição: *" htmlFor="inputDescricao">
              <textarea
                rows={4}
                className="form-control"
                id="inputDescricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
              />
              {erros.descricao && (
                <div className="invalid-feedback d-block">
                  {erros.descricao}
                </div>
              )}
            </FormGroup>
          </div>

          <Stack spacing={1} padding={1} direction="row">
            <button onClick={salvar} type="button" className="btn btn-success">
              Salvar
            </button>
            <button
              onClick={() => navigate("/ListagemComorbidades")}
              type="button"
              className="btn btn-danger"
            >
              Cancelar
            </button>
          </Stack>
        </div>
      </Card>
    </div>
  );
}

export default CadastroComorbidade;
