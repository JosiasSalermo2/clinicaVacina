import React from "react";
import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";

import Card from "../components/Card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import LoadingOverlay from "../LoadingOverlay";

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import "../custom.css";
import axios from "axios";
import { BASE_URL } from "../config/axios";

function ListagemPacientes() {
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/pacientes`;

  const [pacientes, setPacientes] = React.useState([]);
  const [loading, setLoading] = React.useState(true);

  const carregarPacientes = async () => {
    try {
      const response = await axios.get(baseURL);
      setPacientes(response.data);
    } catch (error) {
      mensagemErro("Erro ao carregar pacientes.");
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    carregarPacientes();
  }, []);

  const redirecionarCadastro = () => {
    navigate("/CadastroPaciente");
  };

  const redirecionarEdicao = (id) => {
    navigate(`/CadastroPaciente/${id}`);
  };

  const excluirPaciente = async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      mensagemSucesso("Paciente excluído com sucesso.");
      setPacientes((prev) => prev.filter((paciente) => paciente.id !== id));
    } catch (error) {
      mensagemErro("Erro ao excluir paciente.");
      console.error(
        "Erro ao excluir paciente.",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <div className="container">
      <Card title="Pacientes">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning"
                onClick={redirecionarCadastro}
              >
                Novo Paciente
              </button>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>E-mail</th>
                    <th>Data de Nascimento</th>
                    <th>Tipo de Sangue</th>
                    <th>DDD</th>
                    <th>Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {pacientes.map((paciente) => (
                    <tr key={paciente.id}>
                      <td>{paciente.nome}</td>
                      <td>{paciente.email}</td>
                      <td>{paciente.dataNascimento}</td>
                      <td>{paciente.tipoSanguineo}</td>
                      <td>{paciente.telefoneDDD}</td>
                      <td>{paciente.telefoneNumero}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction="row">
                          <IconButton
                            onClick={() => redirecionarEdicao(paciente.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => excluirPaciente(paciente.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemPacientes;
