import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Stack from "@mui/material/Stack";

import Card from "../components/Card";
import FormGroup from "../components/FormGroup";
import LoadingOverlay from "../LoadingOverlay";
import { mensagemErro, mensagemSucesso } from "../components/toastr";

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

  const [pacientes, setPacientes] = useState([]);
  const [estoques, setEstoques] = useState([]);
  const [agendamentos, setAgendamentos] = useState([]);

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

  const carregarListas = async () => {
    try {
      const [resPac, resEst, resAg] = await Promise.all([
        axios.get(`${BASE_URL}/pacientes`),
        axios.get(`${BASE_URL}/estoques`),
        axios.get(`${BASE_URL}/agendamentos`),
      ]);
      setPacientes(resPac.data);
      setEstoques(resEst.data);
      setAgendamentos(resAg.data);
    } catch {
      mensagemErro("Erro ao carregar listas de apoio.");
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
      setDataAplicacao(dados.dataAplicacao || "");
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
    if (!dataAplicacao)
      novosErros.dataAplicacao = "Informe a data da vacinação.";
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
      dataAplicacao,
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
      <Card title={idParam ? "Editar Vacinação" : "Cadastrar Vacinação"}>
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <FormGroup label="Paciente *" htmlFor="pacienteId">
                <select
                  className={`form-control ${
                    erros.pacienteId ? "is-invalid" : ""
                  }`}
                  id="pacienteId"
                  value={pacienteId}
                  onChange={(e) => setPacienteId(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.nome}
                    </option>
                  ))}
                </select>
                {erros.pacienteId && (
                  <div className="invalid-feedback">{erros.pacienteId}</div>
                )}
              </FormGroup>
            </div>

            <div className="col-md-6 mb-3">
              <FormGroup label="Estoque *" htmlFor="estoqueId">
                <select
                  className={`form-control ${
                    erros.estoqueId ? "is-invalid" : ""
                  }`}
                  id="estoqueId"
                  value={estoqueId}
                  onChange={(e) => setEstoqueId(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {estoques.map((e) => (
                    <option key={e.id} value={e.id}>
                      {e.nome}
                    </option>
                  ))}
                </select>
                {erros.estoqueId && (
                  <div className="invalid-feedback">{erros.estoqueId}</div>
                )}
              </FormGroup>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <FormGroup label="Agendamento *" htmlFor="agendamentoId">
                <select
                  className={`form-control ${
                    erros.agendamentoId ? "is-invalid" : ""
                  }`}
                  id="agendamentoId"
                  value={agendamentoId}
                  onChange={(e) => setAgendamentoId(e.target.value)}
                >
                  <option value="">Selecione...</option>
                  {agendamentos.map((a) => (
                    <option key={a.id} value={a.id}>
                      {a.dataAgendamento} - {a.nomePaciente}
                    </option>
                  ))}
                </select>
                {erros.agendamentoId && (
                  <div className="invalid-feedback">{erros.agendamentoId}</div>
                )}
              </FormGroup>
            </div>

            <div className="col-md-3 mb-3">
              <FormGroup label="Data da Vacinação *" htmlFor="dataAplicacao">
                <input
                  type="date"
                  className={`form-control ${
                    erros.dataAplicacao ? "is-invalid" : ""
                  }`}
                  id="dataAplicacao"
                  value={dataAplicacao}
                  onChange={(e) => setDataAplicacao(e.target.value)}
                />
              </FormGroup>
            </div>
          </div>

          <Stack direction="row" spacing={2} padding={2}>
            <button type="button" className="btn btn-success" onClick={salvar}>
              Salvar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => navigate("/ListagemVacinacao")}
            >
              Cancelar
            </button>
          </Stack>
        </form>
      </Card>
    </div>
  );
}

export default CadastroVacinacao;
