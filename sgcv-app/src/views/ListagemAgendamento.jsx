import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { mensagemErro, mensagemSucesso } from '../components/toastr';

import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL } from '../config/axios';


function ListagemAgendamento() {
  const navigate = useNavigate();
  const [agendamentos, setAgendamentos] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resAgendamento, resPacientes, resVacinas] = await Promise.all([
        axios.get(`${BASE_URL}/agendamentos`),
        axios.get(`${BASE_URL}/pacientes`),
        axios.get(`${BASE_URL}/vacinas`)
      ]);

      const mapaPacientes = resPacientes.data.reduce((map, p) => {
        map[p.id] = p.nome;
        return map;
      }, {});

      const mapaVacinas = resVacinas.data.reduce((map, vacina) => {
        map[vacina.id] = vacina.vacina;
        return map;
      }, {});

      const agendamentosComNome = resAgendamento.data.map((agendamento) => ({
        ...agendamento,
        nomePaciente: agendamento.pacienteId ? mapaPacientes[agendamento.pacienteId] : 'Não encontrado',
        nomeVacina: agendamento.vacinaId ? mapaVacinas[agendamento.vacinaId] : 'Não encontrado'
      }));

      setAgendamentos(agendamentosComNome);
    } catch (error) {
      mensagemErro('Erro ao carregar dados dos agendamentos ou pacientes.');
    }
  };

  const redirecionarCadastro = () => {
    navigate('/CadastroAgendamento');
  };

  const redirecionarEdicao = (id) => {
    navigate(`/CadastroAgendamento/${id}`);
  };

  const excluirAgendamento = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/agendamentos/${id}`);
      mensagemSucesso('Agendamento excluído com sucesso!');
      setAgendamentos((prev) => prev.filter((a) => a.id !== id));
    } catch (error) {
      mensagemErro('Erro ao excluir agendamento.');
    }
  };

  return (
    <div className="container">
      <Card title="Agendamentos">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning mb-3"
                onClick={redirecionarCadastro}
              >
                Novo Agendamento
              </button>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Horário</th>
                    <th>Paciente</th>
                    <th>Vacina</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {agendamentos.map((agendamento) => (
                    <tr key={agendamento.id}>
                      <td>{agendamento.dataAgendamento}</td>
                      <td>{agendamento.horarioAgendamento}</td>
                      <td>{agendamento.nomePaciente}</td>
                      <td>{agendamento.nomeVacina}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction="row">
                          <IconButton onClick={() => redirecionarEdicao(agendamento.id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => excluirAgendamento(agendamento.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                  {agendamentos.length === 0 && (
                    <tr>
                      <td colSpan="5">Nenhum agendamento encontrado.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemAgendamento;
