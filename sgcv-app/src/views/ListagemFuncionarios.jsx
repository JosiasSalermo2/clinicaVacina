import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";

import Card from "../components/Card";
import { mensagemErro, mensagemSucesso } from "../components/toastr";
import LoadingOverlay from "../LoadingOverlay";

import IconButton from "@mui/material/IconButton";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import "../custom.css";
import axios from "axios";
import { BASE_URL } from "../config/axios";

function ListagemFuncionarios() {
  const navigate = useNavigate();
  const [funcionarios, setFuncionarios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resFuncionarios, resCargos] = await Promise.all([
        axios.get(`${BASE_URL}/funcionarios`),
        axios.get(`${BASE_URL}/cargos`),
      ]);

      const mapaCargos = resCargos.data.reduce((map, cargo) => {
        map[cargo.id] = cargo.cargo;
        return map;
      }, {});

      const funcionariosComCargo = resFuncionarios.data.map((func) => {
        const nomeCargo =
          func.cargoId && mapaCargos[func.cargoId]
            ? mapaCargos[func.cargoId]
            : "Não informado";

        return {
          ...func,
          nomeCargo,
        };
      });

      setFuncionarios(funcionariosComCargo);
    } catch (error) {
      mensagemErro("Erro ao carregar dados dos funcionários ou cargos.");
    } finally {
      setLoading(false);
    }
  };

  const redirecionarCadastro = () => {
    navigate("/CadastroFuncionario");
  };

  const redirecionarEdicao = (id) => {
    navigate(`/CadastroFuncionario/${id}`);
  };

  const excluirFuncionario = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/funcionarios/${id}`);
      mensagemSucesso("Funcionário excluído com sucesso!");
      setFuncionarios((prev) => prev.filter((f) => f.id !== id));
    } catch (error) {
      mensagemErro("Erro ao excluir funcionário.");
    }
  };

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title="Funcionários">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning mb-3"
                onClick={redirecionarCadastro}
              >
                Novo Funcionário
              </button>

              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>CPF</th>
                    <th>Email</th>
                    <th>RG</th>
                    <th>Data Nasc.</th>
                    <th>Admissão</th>
                    <th>Especialidade</th>
                    <th>Cargo</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {funcionarios.map((funcionario) => (
                    <tr key={funcionario.id}>
                      <td>{funcionario.nome}</td>
                      <td>{funcionario.cpf}</td>
                      <td>{funcionario.email}</td>
                      <td>{funcionario.rg}</td>
                      <td>{funcionario.dataNascimento}</td>
                      <td>{funcionario.dataAdmissao}</td>
                      <td>{funcionario.especialidade}</td>
                      <td>{funcionario.nomeCargo}</td>
                      <td>
                        <Stack spacing={1} direction="row" padding={0}>
                          <IconButton
                            onClick={() => redirecionarEdicao(funcionario.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => excluirFuncionario(funcionario.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                  {funcionarios.length === 0 && (
                    <tr>
                      <td colSpan="9">Nenhum funcionário encontrado.</td>
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

export default ListagemFuncionarios;
