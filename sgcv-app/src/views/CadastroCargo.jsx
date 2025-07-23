import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";

import Card from "../components/Card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import FormGroup from "../components/FormGroup";
import LoadingOverlay from "../LoadingOverlay";

import "../custom.css";
import axios from "axios";
import { BASE_URL } from "../config/axios";

function CadastroCargo() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/cargos`;

  const [id, setId] = useState("");
  const [cargo, setCargo] = useState("");
  const [descricao, setDescricao] = useState("");

  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({});

  async function salvar() {
    const novosErros = {};

    if (!cargo || !cargo.trim()) {
      novosErros.cargo = "O campo Cargo é obrigatório.";
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      mensagemErro("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    let data = { cargo, descricao };
    if (idParam) data.id = id;

    try {
      if (!idParam) {
        await axios.post(baseURL, data, {
          headers: { "Content-type": "application/json" },
        });
        mensagemSucesso(`Cargo ${cargo} cadastrado com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data, {
          headers: { "Content-Type": "application/json" },
        });
        mensagemSucesso(`Cargo ${cargo} alterado com sucesso!`);
        navigate(`/ListagemFuncionarios`);
      }
    } catch (error) {
      mensagemErro(error?.response?.data || "Erro ao salvar cargo.");
    }
  }

  async function buscar() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      setId(response.data.id);
      setCargo(response.data.cargo);
      setDescricao(response.data.descricao);
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
      <Card title="Cadastro de Cargo">
        <div className="row">
          <div className="col-lg-12">
            <div className="form-row">
              <div className="mesmaLinha">
                <div className="col-md-5 mb-3">
                  <FormGroup label="Nome do Cargo: *" htmlFor="inputCargo">
                    <input
                      type="text"
                      id="inputCargo"
                      value={cargo}
                      className={`form-control ${
                        erros.cargo ? "is-invalid" : ""
                      }`}
                      onChange={(e) => setCargo(e.target.value)}
                    />
                    {erros.cargo && (
                      <div className="invalid-feedback">{erros.cargo}</div>
                    )}
                  </FormGroup>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <FormGroup label="Descrição do Cargo:" htmlFor="inputDescricao">
                  <textarea
                    cols={30}
                    rows={6}
                    id="inputDescricao"
                    value={descricao}
                    className="form-control"
                    onChange={(e) => setDescricao(e.target.value)}
                  />
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
                  onClick={() => navigate("/ListagemCargos")}
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

export default CadastroCargo;
