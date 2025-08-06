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

function CadastroFornecedor() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/fornecedores`;

  const [id, setId] = useState("");
  const [nomeFantasia, setNomeFantasia] = useState("");
  const [email, setEmail] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [razaoSocial, setRazaoSocial] = useState("");
  const [telefoneDdd, setTelefoneDdd] = useState("");
  const [telefoneNumero, setTelefoneNumero] = useState("");
  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({});

  const [telefones, setTelefones] = useState([]);
  const [telefoneId, setTelefoneId] = useState("");

async function salvar() {
  const novosErros = {};

  if (!nomeFantasia || !nomeFantasia.trim()) {
    novosErros.nomeFantasia = "O nome do fornecedor é obrigatório.";
  }

  if (!email || !email.trim()) {
    novosErros.email = "O e-mail do fornecedor é obrigatório.";
  }

  if (!cnpj || !cnpj.trim()) {
    novosErros.cnpj = "O CNPJ do fornecedor é obrigatório.";
  }

  setErros(novosErros);
  if (Object.keys(novosErros).length > 0) {
    mensagemErro("Preencha todos os campos obrigatórios corretamente.");
    return;
  }

  try {
    let idTelefoneCriado = telefoneId;

    if (!idParam && !telefoneId) {
      const responseTelefone = await axios.post(`${BASE_URL}/telefones`, {
        ddd: telefoneDdd,
        numero: telefoneNumero,
      });
      idTelefoneCriado = responseTelefone.data.id;
    }

  const data = {
    nomeFantasia: nomeFantasia,
    email,
    cnpj,
    razaoSocial,
    telefoneId: idTelefoneCriado,
    telefoneDDD: telefoneDdd,
    telefoneNumero,
  };
  if (idParam) data.id = id;

  try {
    if (!idParam) {
      await axios.post(baseURL, data);
      mensagemSucesso(`Fornecedor ${nomeFantasia} cadastrado com sucesso!`);
      setNomeFantasia("");
      setEmail("");
      setCnpj("");
      setRazaoSocial("");
      setTelefoneDdd("");
      setTelefoneNumero("");
      setTelefoneId("");
      setErros({});
    } else {
      await axios.put(`${baseURL}/${idParam}`, data);
      mensagemSucesso(`Fornecedor ${nomeFantasia} alterado com sucesso!`);
      navigate(`/ListagemFornecedores`);
    }
  } catch (error) {
      console.error("Erro ao salvar fabricante:", error);
      mensagemErro(error?.response?.data?.message || "Erro ao salvar o fabricante.");
  }

    } catch (error) {
    console.error("Erro interno ao salvar:", error);
    mensagemErro("Erro inesperado no salvamento.");
  }
}


  async function buscar() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      setId(response.data.id);
      setNomeFantasia(response.data.nomeFantasia);
      setEmail(response.data.email);
      setCnpj(response.data.cnpj);
      setRazaoSocial(response.data.razaoSocial);
      setTelefoneId(response.data.telefoneId);
      setTelefoneDdd(response.data.telefoneDdd);
      setTelefoneNumero(response.data.telefoneNumero);
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
      <Card title="Cadastro de Fornecedor">
        <div className="row">
          <div className="col-lg-12">
            <div className="form-row">
              <div className="mesmaLinha">
                <div className="col-md-12 mb-3">
                  <FormGroup
                    label="Fornecedor: *"
                    htmlFor="inputFornecedor"
                  >
                    <input
                      type="text"
                      id="inputFornecedor"
                      value={nomeFantasia}
                      className={`form-control ${erros.nomeFantasia ? "is-invalid" : ""}`}
                      onChange={(e) => setNomeFantasia(e.target.value)}
                    />
                    {erros.nomeFantasia && (
                      <div className="invalid-feedback">{erros.nomeFantasia}</div>
                    )}
                  </FormGroup>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <FormGroup label="Email: *" htmlFor="inputEmail">
                  <input
                    type="text"
                    id="inputEmail"
                    value={email}
                    className={`form-control ${
                      erros.email ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  {erros.email && (
                    <div className="invalid-feedback">{erros.email}</div>
                  )}
                </FormGroup>

                <FormGroup label="CNPJ: *" htmlFor="inputCnpj">
                  <input
                    type="text"
                    id="inputCnpj"
                    value={cnpj}
                    className={`form-control ${erros.cnpj ? "is-invalid" : ""}`}
                    onChange={(e) => setCnpj(e.target.value)}
                  />
                  {erros.cnpj && (
                    <div className="invalid-feedback">{erros.cnpj}</div>
                  )}
                </FormGroup>

                <div className="row">
                  <div className="col-md-6 mb-3">
                    <FormGroup label="DDD: *" htmlFor="telefoneDdd">
                      <input
                        type="text"
                        id="telefoneDdd"
                        value={telefoneDdd}
                        onChange={(e) => setTelefoneDdd(e.target.value)}
                        className={`form-control ${
                          erros.telefoneDdd ? "is-invalid" : ""
                        }`}
                      />
                      {erros.telefoneDdd && (
                        <div className="invalid-feedback">
                          {erros.telefoneDdd}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                  <div className="col-md-6 mb-3">
                    <FormGroup label="Numero: *" htmlFor="telefoneNumero">
                      <input
                        type="text"
                        id="telefoneNumero"
                        value={telefoneNumero}
                        onChange={(e) => setTelefoneNumero(e.target.value)}
                        className={`form-control ${
                          erros.telefoneNumero ? "is-invalid" : ""
                        }`}
                      />
                      {erros.telefoneNumero && (
                        <div className="invalid-feedback">
                          {erros.telefoneNumero}
                        </div>
                      )}
                    </FormGroup>
                  </div>
                </div>

                <FormGroup label="Razão social: " htmlFor="inputRazaoSocial">
                  <input
                    type="text"
                    id="inputRazaoSocial"
                    value={razaoSocial}
                    className="form-control"
                    onChange={(e) => setRazaoSocial(e.target.value)}
                  />
                  {erros.razaoSocial && (
                    <div className="invalid-feedback">{erros.razaoSocial}</div>
                  )}
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
                  onClick={() => navigate("/ListagemFornecedores")}
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

export default CadastroFornecedor;
