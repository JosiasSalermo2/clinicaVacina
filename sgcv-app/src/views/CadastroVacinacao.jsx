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

function CadastroVacinacao() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [pacienteId, setPacienteId] = useState("");
  const [estoqueId, setEstoqueId] = useState("");
  const [agendamentoId, setAgendamentoId] = useState("");
  const [dataAplicacao, setDataAplicacao] = useState("");
  const [horaAplicacao, setHoraAplicacao] = useState("");

  const [pacientes, setPacientes] = useState([]);
  const [estoques, setEstoques] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);

  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({});

  useEffect(() => {
    carregarPacientes();
    carregarEstoques();
    carregarAgendamentos();

    if (idParam) {
      buscar();
    } else {
      setLoading(false);
    }
  }, [idParam]);

  const carregarPacientes = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/pacientes`);
      setPacientes(res.data);
    } catch {
      mensagemErro("Erro ao carregar pacientes.");
    }
  };

  const carregarEstoques = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/estoques`);
      setEstoques(res.data);
    } catch {
      mensagemErro("Erro ao carregar estoques.");
    }
  };

  const carregarAgendamentos = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/agendamentos`);
      setAgendamentos(res.data);
    } catch {
      mensagemErro("Erro ao carregar agendamentos.");
    }
  };

  const buscar = async () => {
    try {
      const res = await axios.get(`${BASE_URL}/vacinacoes/${idParam}`);
      const dados = res.data;

      setId(dados.id);
      setPacienteId(dados.pacienteId || "");
      setEstoqueId(dados.estoqueId || "");
      setAgendamentoId(dados.agendamentoId || "");

      const [data, hora] = (dados.dataAplicacao || "").split("T");
      setDataAplicacao(data);
      setHoraAplicacao(hora || "");
    } catch {
      mensagemErro("Erro ao buscar os dados da vacinação.");
    } finally {
      setLoading(false);
    }
  };

  const salvar = async () => {
    const novosErros = {};

    if (!pacienteId) novosErros.pacienteId = "Selecione o paciente.";
    if (!estoqueId) novosErros.estoqueId = "Selecione o estoque.";
    if (!agendamentoId) novosErros.agendamentoId = "Selecione o agendamento.";
    if (!dataAplicacao || !horaAplicacao)
      novosErros.dataAplicacao = "Informe data e hora da vacinação.";

    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      mensagemErro("Preencha todos os campos obrigatórios.");
      return;
    }

    const data = {
      id,
      pacienteId,
      estoqueId,
      agendamentoId,
      dataAplicacao: `${dataAplicacao}T${horaAplicacao}`,
    };

    try {
      if (idParam) {
        await axios.put(`${BASE_URL}/vacinacoes/${idParam}`, data);
        mensagemSucesso("Vacinação atualizada com sucesso.");
      } else {
        await axios.post(`${BASE_URL}/vacinacoes`, data);
        mensagemSucesso("Vacinação cadastrada com sucesso.");
      }

      navigate("/ListagemVacinacao");
    } catch (error) {
      mensagemErro(error?.response?.data || "Erro ao salvar vacinação.");
    }
  };

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title="Cadastro de Vacinação">
        <div className="row">
          <div className="col-lg-12">
            <div className="form-row">
              <div className="mesmaLinha">
                <div className="col-md-5 mb-3">
                  <FormGroup label="Paciente *" htmlFor="pacienteId">
                    <select
                      className="form-control"
                      id="pacienteId"
                      value={pacienteId}
                      onChange={(e) => setPacienteId(e.target.value)}
                    >
                      <option value="">Selecione um paciente</option>
                      {pacientes.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.nome}
                        </option>
                      ))}
                    </select>
                  </FormGroup>
                </div>

                <div className="col-md-5 mb-3">
                  <FormGroup label="Estoque *" htmlFor="estoqueId">
                    <select
                      className="form-control"
                      id="estoqueId"
                      value={estoqueId}
                      onChange={(e) => setEstoqueId(e.target.value)}
                    >
                      <option value="">Selecione um estoque</option>
                      {estoques.map((e) => (
                        <option key={e.id} value={e.id}>
                          {e.nome}
                        </option>
                      ))}
                    </select>
                  </FormGroup>
                </div>
              </div>

              <div className="mesmaLinha">
                <div className="col-md-5 mb-3">
                  <FormGroup label="Agendamento *" htmlFor="agendamentoId">
                    <select
                      className="form-control"
                      id="agendamentoId"
                      value={agendamentoId}
                      onChange={(e) => setAgendamentoId(e.target.value)}
                    >
                      <option value="">Selecione um agendamento</option>
                      {agendamentos.map((a) => (
                        <option key={a.id} value={a.id}>
                          {a.dataAgendamento} - {a.nomePaciente}
                        </option>
                      ))}
                    </select>
                  </FormGroup>
                </div>
              </div>

              <div className="mesmaLinha">
                <div className="col-md-5 mb-3">
                  <FormGroup
                    label="Data da Vacinação *"
                    htmlFor="dataAplicacao"
                  >
                    <input
                      type="date"
                      className="form-control"
                      id="dataAplicacao"
                      value={dataAplicacao}
                      onChange={(e) => setDataAplicacao(e.target.value)}
                    />
                  </FormGroup>
                </div>

                <div className="col-md-5 mb-3">
                  <FormGroup
                    label="Hora da Vacinação *"
                    htmlFor="horaAplicacao"
                  >
                    <input
                      type="time"
                      className="form-control"
                      id="horaAplicacao"
                      value={horaAplicacao}
                      onChange={(e) => setHoraAplicacao(e.target.value)}
                    />
                  </FormGroup>
                </div>
              </div>

              <Stack spacing={1} direction="row" padding={1}>
                <button className="btn btn-success" onClick={salvar}>
                  Salvar
                </button>
                <button
                  className="btn btn-danger"
                  onClick={() => navigate("/ListagemVacinacao")}
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

export default CadastroVacinacao;
