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
import { BASE_URL } from '../config/axios';



function CadastroAgendamento() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/agendamentos`;

  // 🧠 STATES
  const [dataAgendamento, setDataAgendamento] = useState('');
  const [horarioAgendamento, setHorarioAgendamento] = useState('');
  const [descricao, setDescricao] = useState('');
  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({});

  const [pacientes, setPacientes] = useState([]);
  const [pacienteId, setPacienteId] = useState(null);

  const [vacinas, setVacinas] = useState([]);
  const [vacinaId, setVacinaId] = useState(null);

  const [inputValue, setInputValue] = useState('');
  const [vacinaInputValue, setVacinaInputValue] = useState('');


  // 🔄 CARREGAR LISTA DE PACIENTES
  useEffect(() => {
    axios.get(`${BASE_URL}/pacientes`)
      .then(response => setPacientes(response.data))
      .catch(error => console.error("Erro ao buscar pacientes", error));
  }, []);

    // 🔄 CARREGAR LISTA DE VACINAS
  useEffect(() => {
    axios.get(`${BASE_URL}/vacinas`)
      .then(response => setVacinas(response.data))
      .catch(error => console.error("Erro ao buscar as vacinas", error));
  }, []);

  // 🔄 BUSCAR AGENDAMENTO PARA EDIÇÃO
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
      const agendamento = response.data;
      setDataAgendamento(agendamento.dataAgendamento || '');
      setHorarioAgendamento(agendamento.horarioAgendamento || '');
      setPacienteId(agendamento.pacienteId || '');
      setVacinaId(agendamento.vacinaId || '');
      setDescricao(agendamento.descricao || '');
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      mensagemErro("Erro ao buscar os dados");
    } finally {
      setLoading(false);
    }
  }


  async function salvar() {
    const novosErros = {};

    if (!String(dataAgendamento || '').trim()) {
      novosErros.dataAgendamento = "Informe a data do agendamento.";
    }

    if (!String(horarioAgendamento || '').trim()) {
      novosErros.horarioAgendamento = "Informe o horário do agendamento.";
    }

    if (!String(pacienteId || '').trim()) {
      novosErros.pacienteId = "Informe o paciente.";
    }

    if (!String(vacinaId || '').trim()) {
      novosErros.vacinaId = "Informe a vacina.";
    }


    setErros(novosErros);
    if (Object.keys(novosErros).length > 0) {
      mensagemErro("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    const data = {
      dataAgendamento,
      horarioAgendamento,
      pacienteId: parseInt(pacienteId, 10),
      vacinaId: parseInt(vacinaId, 10),
      descricao
    };

    try {
      if (!idParam) {
        await axios.post(baseURL, data);
        mensagemSucesso(`Agendamento cadastrado com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data);
        mensagemSucesso(`Agendamento atualizado com sucesso!`);
        navigate(`/ListagemAgendamento`);
      }
    } catch (error) {
      mensagemErro(error?.response?.data || "Erro ao salvar agendamento.");
    }
  }


  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title="Cadastro de Agendamento">
        <div className="row">
          <div className="col-lg-12">
            <div className="form-row">
              <div className="mesmaLinha">
                <div className="col-md-5 mb-3">
                  <FormGroup
                    label="Data do Agendamento: *"
                    htmlFor="dataAgendamento"
                  >
                    <input
                      type="date"
                      id="dataAgendamento"
                      value={dataAgendamento}
                      className={`form-control ${
                        erros.dataAgendamento ? "is-invalid" : ""
                      }`}
                      onChange={(e) => setDataAgendamento(e.target.value)}
                    />
                    {erros.dataAgendamento && (
                      <div className="invalid-feedback">
                        {erros.dataAgendamento}
                      </div>
                    )}
                  </FormGroup>
                </div>
              </div>

              <div className="mesmaLinha">
                <div className="col-md-5 mb-3">
                  <FormGroup label="Horário: *" htmlFor="horarioAgendamento">
                    <input
                      type="time"
                      id="horarioAgendamento"
                      value={horarioAgendamento}
                      className={`form-control ${
                        erros.horarioAgendamento ? "is-invalid" : ""
                      }`}
                      onChange={(e) => setHorarioAgendamento(e.target.value)}
                    />
                    {erros.horarioAgendamento && (
                      <div className="invalid-feedback">
                        {erros.horarioAgendamento}
                      </div>
                    )}
                  </FormGroup>
                </div>
              </div>

              <div className="mesmaLinha">
                <div className="col-md-5 mb-3">
                  <FormGroup label="Paciente: *" htmlFor="pacienteId">
                    <Autocomplete
                      id="paciente-autocomplete"
                      options={pacientes}
                      getOptionLabel={(option) => option.nome}
                      filterOptions={(options, { inputValue }) =>
                        inputValue.trim().length >= 2
                          ? options.filter((option) =>
                              option.nome
                                .toLowerCase()
                                .includes(inputValue.toLowerCase())
                            )
                          : []
                      }
                      inputValue={inputValue}
                      onInputChange={(event, newInputValue) =>
                        setInputValue(newInputValue)
                      }
                      value={
                        pacientes.find(
                          (p) => String(p.id) === String(pacienteId)
                        ) || null
                      }
                      onChange={(event, newValue) => {
                        setPacienteId(newValue ? newValue.id.toString() : "");
                      }}
                      isOptionEqualToValue={(option, value) =>
                        option.id === value.id
                      }
                      noOptionsText=""
                      renderInput={(params) => (
                        <div ref={params.InputProps.ref}>
                          <input
                            type="text"
                            {...params.inputProps}
                            className={`form-control ${
                              erros.pacienteId ? "is-invalid" : ""
                            }`}
                            placeholder="Digite o nome do paciente"
                          />
                          {erros.pacienteId && (
                            <div className="invalid-feedback">
                              {erros.pacienteId}
                            </div>
                          )}
                        </div>
                      )}
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="mesmaLinha">
                <div className="col-md-5 mb-3">
                  <FormGroup label="Vacina: *" htmlFor="vacinaId">
                    <Autocomplete
                      openOnFocus
                      options={vacinas}
                      getOptionLabel={(opt) => opt.vacina ?? ""}
                      inputValue={vacinaInputValue}
                      onInputChange={(_, v) => setVacinaInputValue(v)}
                      value={
                        vacinas.find((v) => String(v.id) === vacinaId) || null
                      }
                      onChange={(_, newVal) =>
                        setVacinaId(newVal ? newVal.id.toString() : "")
                      }
                      filterOptions={(options, { inputValue }) => {
                        const v = (inputValue ?? "").trim().toLowerCase();
                        if (!v) return options;
                        return options.filter((opt) =>
                          (opt.nome ?? "").toLowerCase().includes(v)
                        );
                      }}
                      renderInput={(params) => (
                        <TextField
                          {...params}
                          placeholder="Digite o nome da vacina"
                          error={!!erros.vacinaId}
                          helperText={erros.vacinaId}
                        />
                      )}
                    />
                  </FormGroup>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <FormGroup label="Descrição (opcional):" htmlFor="descricao">
                  <textarea
                    cols={30}
                    rows={4}
                    id="descricao"
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
                  onClick={() => navigate("/ListagemAgendamento")}
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

export default CadastroAgendamento;
