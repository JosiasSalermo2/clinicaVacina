import React, { useEffect, useState } from "react";
import Card from "../components/Card";
import { mensagemErro, mensagemSucesso } from "../components/toastr";

import { useNavigate } from "react-router-dom";
import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import axios from "axios";
import { BASE_URL } from "../config/axios";

function ListagemTiposVacinas() {
  const navigate = useNavigate();
  const [tiposVacinas, setTiposVacinas] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/tipos-vacinas`);
      setTiposVacinas(response.data);
    } catch (error) {
      mensagemErro("Erro ao carregar dados dos tipos de vacina.");
    }
  };

  const redirecionarCadastro = () => {
    navigate("/CadastroTipoVacina");
  };

  const redirecionarEdicao = (id) => {
    navigate(`/CadastroTipoVacina/${id}`);
  };

  const excluirTipoVacina = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/tipos-vacinas/${id}`);
      mensagemSucesso("Tipo de vacina excluído com sucesso!");
      setTiposVacinas((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      mensagemErro("Erro ao excluir tipo de vacina.");
    }
  };

  return (
    <div className="container">
      <Card title="Tipos de Vacinas">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning mb-3"
                onClick={redirecionarCadastro}
              >
                Novo Tipo de Vacina
              </button>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Tipo</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {tiposVacinas.map((tipo) => (
                    <tr key={tipo.id}>
                      <td>{tipo.tipoVacina}</td>
                      <td>{tipo.descricao}</td>
                      <td>
                        <Stack spacing={1} padding={0} direction="row">
                          <IconButton
                            onClick={() => redirecionarEdicao(tipo.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => excluirTipoVacina(tipo.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                  {tiposVacinas.length === 0 && (
                    <tr>
                      <td colSpan="3">Nenhum tipo de vacina encontrado.</td>
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

export default ListagemTiposVacinas;
