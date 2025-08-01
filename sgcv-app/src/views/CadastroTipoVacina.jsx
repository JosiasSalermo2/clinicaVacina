import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";

import Card from "../components/Card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import FormGroup from "../components/FormGroup";
import LoadingOverlay from "../LoadingOverlay";

import "../custom.css";
import axios from "axios";
import { BASE_URL } from "../config/axios";

function CadastroTipoVacina() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/tipos-vacinas`;

  const [tipoVacina, setTipoVacina] = useState("");
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

  async function buscar() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const dados = response.data;
      setTipoVacina(dados.tipoVacina || "");
      setDescricao(dados.descricao || "");
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      mensagemErro("Erro ao buscar os dados");
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    const novosErros = {};

    if (!String(tipoVacina || "").trim()) {
      novosErros.tipoVacina = "Informe o tipo de vacina.";
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      mensagemErro("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    const data = {
      tipoVacina,
      descricao,
    };

    try {
      if (idParam) {
        await axios.put(`${baseURL}/${idParam}`, data);
        mensagemSucesso("Tipo de vacina atualizada com sucesso!");
      } else {
        await axios.post(baseURL, data);
        mensagemSucesso("Tipo de vacina cadastrada com sucesso!");
      }
      navigate("/ListagemTiposVacinas");
    } catch (error) {
      mensagemErro(error?.response?.data || "Erro ao salvar tipo de vacina");
    }
  }

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title="Cadastro Tipo de Vacina">
        <div className="row">
          <div className="col-lg-12">
            <div className="form-row">
              <div className="mesmaLinha">
                <div className="col-md-5 mb-3">
                  <FormGroup label="Tipo: *" htmlFor="inputNomeTipo">
                    <input
                      type="text"
                      id="inputTipoVacina"
                      value={tipoVacina}
                      className={`form-control ${
                        erros.tipoVacina ? "is-invalid" : ""
                      }`}
                      onChange={(e) => setTipoVacina(e.target.value)}
                    />
                    {erros.tipoVacina && (
                      <div className="invalid-feedback">{erros.tipoVacina}</div>
                    )}
                  </FormGroup>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <FormGroup
                  label="Descrição do Tipo de Vacina: "
                  htmlFor="inputDescricao"
                >
                  <textarea
                    cols={30}
                    rows={6}
                    type="textarea"
                    id="inputDescricao"
                    value={descricao}
                    className={`form-control ${
                      erros.descricao ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setDescricao(e.target.value)}
                  />
                  {erros.descricao && (
                    <div className="invalid-feedback">{erros.descricao}</div>
                  )}
                </FormGroup>
              </div>

              <Stack spacing={2} direction="row" className="mb-3">
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={salvar}
                >
                  Salvar
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => navigate("/ListagemTiposVacinas")}
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

export default CadastroTipoVacina;
