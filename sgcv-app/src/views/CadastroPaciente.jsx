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

function CadastroPaciente() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/pacientes`;

  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [cpf, setCpf] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [ddd, setDdd] = useState("");
  const [telefone, setTelefone] = useState("");
  const [fotoPerfil, setFotoPerfil] = useState();
  const [logradouro, setLogradouro] = useState("");
  const [numero, setNumero] = useState("");
  const [complemento, setComplemento] = useState("");
  const [cep, setCep] = useState("");
  const [uf, setUf] = useState("");
  const [cidades, setCidades] = useState([]);
  const [tipoSangue, setTipoSangue] = useState("");
  const [contraIndicacao, setContraIndicacao] = useState("");

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
      const paciente = response.data;
      setNome(paciente.nome || "");
      setEmail(paciente.email || "");
      setCpf(paciente.cpf || "");
      setDataNasc(paciente.dataNasc || "");
      setDdd(paciente.ddd || "");
      setTelefone(paciente.telefone || "");
      setFotoPerfil(paciente.fotoPerfil || "");
      setLogradouro(paciente.logradouro || "");
      setNumero(paciente.numero || "");
      setComplemento(paciente.complemento || "");
      setCep(paciente.cep || "");
      setUf(paciente.uf || "");
      setCidades(paciente.cidades || "");
      setTipoSangue(paciente.tipoSangue || "");
      setContraIndicacao(paciente.contraIndicacao || "");
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    const novosErros = {};

    if (!String(nome || "").trim()) {
      novosErros.nome = "O campo Nome é obrigatório.";
    }
    if (!String(email || "").trim()) {
      novosErros.email = "O campo Email é obrigatório.";
    }
    if (!String(cpf || "").trim()) {
      novosErros.cpf = "O campo CPF é obrigatório.";
    }
    if (!String(dataNasc || "").trim()) {
      novosErros.dataNasc = "O campo Data de Nascimento é obrigatório.";
    }
    if (!String(ddd || "").trim()) {
      novosErros.ddd = "O campo DDD é obrigatório.";
    }
    if (!String(telefone || "").trim()) {
      novosErros.telefone = "O campo Telefone é obrigatório.";
    }
    if (!String(fotoPerfil || "").trim()) {
      novosErros.fotoPerfil = "O campo Foto de Perfil é obrigatório.";
    }
    if (!String(logradouro || "").trim()) {
      novosErros.logradouro = "O campo Logradouro é obrigatório.";
    }
    if (!String(numero || "").trim()) {
      novosErros.numero = "O campo Número é obrigatório.";
    }
    if (!String(complemento || "").trim()) {
      novosErros.complemento = "O campo Complemento é obrigatório.";
    }
    if (!String(cep || "").trim()) {
      novosErros.cep = "O campo CEP é obrigatório.";
    }
    if (!String(uf || "").trim()) {
      novosErros.uf = "O campo UF é obrigatório.";
    }
    if (!String(cidades || "").trim()) {
      novosErros.cidades = "O campo Cidades é obrigatório.";
    }
    if (!String(tipoSangue || "").trim()) {
      novosErros.tipoSangue = "O campo Tipo Sanguíneo é obrigatório.";
    }
    if (!String(contraIndicacao || "").trim()) {
      novosErros.contraIndicacao = "O campo Contra Indicação é obrigatório.";
    }

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      mensagemErro("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    const data = {
      nome,
      email,
      cpf,
      dataNasc,
      ddd,
      telefone,
      fotoPerfil,
      logradouro,
      numero,
      complemento,
      cep,
      uf,
      cidades,
      tipoSangue,
      contraIndicacao,
    };

    try {
      if (!idParam) {
        await axios.post(baseURL, data);
        mensagemSucesso(`Paciente ${nome} cadastrado com sucesso!`);
        setNome("");
        setEmail("");
        setCpf("");
        setDataNasc("");
        setDdd("");
        setTelefone("");
        setFotoPerfil("");
        setLogradouro("");
        setNumero("");
        setComplemento("");
        setCep("");
        setUf("");
        setCidades("");
        setTipoSangue("");
        setContraIndicacao("");
      } else {
        await axios.put(`${baseURL}/${idParam}`, data);
        mensagemSucesso(`Paciente atualizado com sucesso!`);
        navigate(`/ListagemPacientes`);
      }
    } catch (error) {
      mensagemErro(error?.response?.data || "Erro ao salvar paciente.");
    }
  }

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title="Cadastrar Paciente">
        <div className="row">
          <div className="col-lg-12">
            <div className="form-row">
              <div className="col-md-12 mb-3">
                <FormGroup label="Nome: *" htmlFor="inputNome">
                  <input
                    type="text"
                    id="inputNome"
                    value={nome}
                    className="form-control"
                    name="nome"
                    onChange={(e) => setNome(e.target.value)}
                  />
                </FormGroup>
              </div>

              <div className="col-md-12 mb-3">
                <FormGroup label="Email: *" htmlFor="inputEmail">
                  <input
                    type="email"
                    id="inputEmail"
                    value={email}
                    className="form-control"
                    name="email"
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </FormGroup>
              </div>

              <div className="col-md-6 mb-3">
                <FormGroup label="CPF: *" htmlFor="inputCPF">
                  <input
                    type="text"
                    id="inputCPF"
                    value={cpf}
                    className="form-control"
                    name="cpf"
                    onChange={(e) => setCpf(e.target.value)}
                  />
                </FormGroup>
              </div>

              <div className="col-md-6 mb-3">
                <FormGroup
                  label="Data de Nascimento: "
                  htmlFor="inputDataNascimento"
                >
                  <input
                    type="date"
                    id="inputDataNascimento"
                    value={dataNasc}
                    className="form-control"
                    name="dataNascimento"
                    onChange={(e) => setDataNasc(e.target.value)}
                  />
                </FormGroup>
              </div>

              <div className="mesmaLinha">
                <div className="col-md-2 mb-3">
                  <FormGroup label="DDD:" htmlFor="inputDDD">
                    <input
                      type="tel"
                      maxLength="2"
                      id="inputDDD"
                      value={ddd}
                      className="form-control"
                      name="ddd"
                      onChange={(e) => setDdd(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-6 mb-3">
                  <FormGroup label="Telefone: " htmlFor="inputTelefone">
                    <input
                      type="tel"
                      maxLength="9"
                      id="inputTelefone"
                      value={telefone}
                      className="form-control"
                      name="telefone"
                      onChange={(e) => setTelefone(e.target.value)}
                    />
                  </FormGroup>
                </div>
                <div className="col-md-3 mb-3">
                  <FormGroup
                    label="Foto de perfil: "
                    htmlFor="selectFotoPerfil"
                  >
                    <input
                      type="file"
                      id="selectFotoPerfil"
                      value={fotoPerfil}
                      className="form-control"
                      name="idFotoPerfil"
                      onChange={(e) => setFotoPerfil(e.target.value)}
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <FormGroup label="Logradouro: " htmlFor="inputLogradouro">
                  <input
                    type="text"
                    maxLength="100"
                    id="inputEmail"
                    value={logradouro}
                    className="form-control"
                    name="logradouro"
                    onChange={(e) => setLogradouro(e.target.value)}
                  />
                </FormGroup>
              </div>

              <div className="mesmaLinha">
                <div className="col-md-2 mb-3">
                  <FormGroup label="Número: " htmlFor="inputNumero">
                    <input
                      type="text"
                      maxLength="4"
                      id="inputNumero"
                      className="form-control"
                      name="numero"
                    />
                  </FormGroup>
                </div>
                <div className="col-md-5 mb-3">
                  <FormGroup label="Complemento: " htmlFor="inputComplemento">
                    <input
                      type="text"
                      maxLength="100"
                      id="inputComplemento"
                      className="form-control"
                      name="complemento"
                    />
                  </FormGroup>
                </div>
                <div className="col-md-4 mb-3">
                  <FormGroup label="CEP: " htmlFor="inputCep">
                    <input
                      type="text"
                      maxLength="8"
                      id="inputCep"
                      className="form-control"
                      name="cep"
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="mesmaLinha mb-3">
                <div className="col-md-5">
                  <FormGroup label="Estado: " htmlFor="inputEstado">
                    <select
                      className="form-select"
                      id="selectUf"
                      name="uf"
                      value={uf}
                      onChange={(e) => setUf(e.target.value)}
                    >
                      <option key="0" value="0">
                        Selecione o Estado
                      </option>
                      {/* {dados2.map((estados) => (
                        <option key={estados.id} value={estados.uf}>
                          {estados.uf}
                        </option>
                      ))} */}
                    </select>
                  </FormGroup>
                </div>
                <div className="col-md-5">
                  <FormGroup label="Cidade: " htmlFor="selectCidade">
                    <select
                      className="form-select"
                      id="selectCidade"
                      name="cidade"
                      value={cidades}
                      onChange={(e) => setCidades(e.target.value)}
                    >
                      <option key="0" value="0">
                        Selecione a Cidade
                      </option>
                      {/* {dados2
                        .filter((estados) => estados.uf === uf)
                        .map((estados) =>
                          estados.cidades.map((cidades) => (
                            <option key={cidades} value={cidades}>
                              {cidades}
                            </option>
                          )),
                        )} */}
                    </select>
                  </FormGroup>
                </div>
              </div>

              <div className="mesmaLinha">
                <div className="col-md-5 mb-3">
                  <FormGroup
                    label="Tipo Sanguineo: "
                    htmlFor="selecttipoSangue"
                  >
                    <select
                      className="form-select"
                      id="inputTipoSangue"
                      name="tipoSangue"
                      value={tipoSangue}
                      onChange={(e) => setTipoSangue(e.target.value)}
                    >
                      <option key="0" value="0">
                        Selecione o Tipo de Sangue
                      </option>
                      {/* {dados3.map((dado) => (
                        <option key={dado.id} value={dado.id}>
                          {dado.tipoSangue}
                        </option>
                      ))} */}
                    </select>
                  </FormGroup>
                </div>

                <div className="col-md-5 mb-3">
                  <FormGroup
                    label="Contra Indicação: "
                    htmlFor="selectContraIndicacao"
                  >
                    <textarea
                      cols={15}
                      rows={3}
                      type="textarea"
                      id="selectContraIndicacao"
                      value={contraIndicacao}
                      className="form-control"
                      name="contraIndicacao"
                      onChange={(e) => setContraIndicacao(e.target.value)}
                    />
                  </FormGroup>
                </div>
              </div>
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
                onClick={() => navigate("/ListagemPacientes")}
                type="button"
                className="btn btn-danger"
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

export default CadastroPaciente;
