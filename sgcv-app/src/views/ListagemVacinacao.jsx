import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

import Card from "../components/Card";
import LoadingOverlay from "../LoadingOverlay";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import { BASE_URL } from "../config/axios";
import "../custom.css";

function ListagemVacinacoes() {
  const navigate = useNavigate();
  const [vacinacoes, setVacinacoes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resVacinacoes, resPacientes] = await Promise.all([
        axios.get(`${BASE_URL}/vacinacoes`),
        axios.get(`${BASE_URL}/pacientes`),
      ]);

      const mapaPacientes = resPacientes.data.reduce((map, p) => {
        map[p.id] = p.nome;
        return map;
      }, {});

      const vacinacoesComNome = resVacinacoes.data.map((v) => ({
        ...v,
        nome: v.pacienteId ? mapaPacientes[v.pacienteId] : "Não encontrado",
        data: v.dataAplicacao || "—",
      }));

      setVacinacoes(vacinacoesComNome);
    } catch (error) {
      mensagemErro("Erro ao carregar dados de vacinação.");
    } finally {
      setLoading(false);
    }
  };

  const redirecionarCadastro = () => {
    navigate("/CadastroVacinacao");
  };

  const redirecionarEdicao = (id) => {
    navigate(`/CadastroVacinacao/${id}`);
  };

  const excluirVacinacao = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/vacinacoes/${id}`);
      mensagemSucesso("Vacinação excluída com sucesso.");
      setVacinacoes((prev) => prev.filter((v) => v.id !== id));
    } catch (error) {
      mensagemErro("Erro ao excluir vacinação.");
    }
  };

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title="Vacinações Registradas">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning mb-3"
                onClick={redirecionarCadastro}
              >
                Nova Vacinação
              </button>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nome do Paciente</th>
                    <th>Data</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {vacinacoes.map((v) => (
                    <tr key={v.id}>
                      <td>{v.nome}</td>
                      <td>{v.data}</td>
                      <td>
                        <Stack spacing={1} direction="row">
                          <IconButton onClick={() => redirecionarEdicao(v.id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => excluirVacinacao(v.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                  {vacinacoes.length === 0 && !loading && (
                    <tr>
                      <td colSpan="3">Nenhum registro encontrado.</td>
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

export default ListagemVacinacoes;
