import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Stack from "@mui/material/Stack";

import Card from "../components/Card";
import { mensagemErro, mensagemSucesso } from "../components/toastr";
import LoadingOverlay from "../LoadingOverlay";

import { IconButton } from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import "../custom.css";
import axios from "axios";
import { BASE_URL } from "../config/axios";

function ListagemVacinas() {
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/vacinas`;

  const [vacinas, setVacinas] = useState([]);
  const [tiposVacina, setTiposVacina] = useState([]);
  const [fabricantes, setFabricantes] = useState([]);
  const [fornecedores, setFornecedores] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarVacinas = async () => {
    try {
      const response = await axios.get(baseURL);
      setVacinas(response.data);
    } catch (error) {
      mensagemErro("Erro ao carregar vacinas.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarVacinas();
    carregarListas();
  }, []);

  const carregarListas = async () => {
    try {
      const [resTipos, resFabs, resForns] = await Promise.all([
        axios.get(`${BASE_URL}/tipos-vacinas`),
        axios.get(`${BASE_URL}/fabricantes`),
        axios.get(`${BASE_URL}/fornecedores`),
      ]);
      setTiposVacina(resTipos.data);
      setFabricantes(resFabs.data);
      setFornecedores(resForns.data);
    } catch {
      mensagemErro("Erro ao carregar listas auxiliares.");
    }
  };

  const redirecionarCadastro = () => {
    navigate("/CadastroVacina");
  };

  const redirecionarEdicao = (id) => {
    navigate(`/CadastroVacina/${id}`);
  };

  const excluirVacina = async (id) => {
    try {
      await axios.delete(`${baseURL}/${id}`);
      mensagemSucesso("Vacina excluída com sucesso!");
      setVacinas((prev) => prev.filter((vac) => vac.id !== id));
    } catch (error) {
      mensagemErro("Erro ao excluir vacina.");
      console.error(
        "Erro ao excluir vacina:",
        error.response?.data || error.message,
      );
    }
  };

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title="Vacinas">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning"
                onClick={redirecionarCadastro}
              >
                Nova Vacina
              </button>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Indicação</th>
                    <th>Contraindicação</th>
                    <th>Doses por Ampola</th>
                    <th>Tipo</th>
                    <th>Fabricante</th>
                    <th>Fornecedor</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {vacinas.map((vacina) => (
                    <tr key={vacina.id}>
                      <td>{vacina.vacina}</td>
                      <td>{vacina.indicacao}</td>
                      <td>{vacina.contraIndicacao}</td>
                      <td>{vacina.dosesAmpola}</td>
                      <td>
                        {tiposVacina.find((t) => t.id === vacina.tipoVacinaId)
                          ?.tipoVacina || "—"}
                      </td>
                      <td>
                        {fabricantes.find((f) => f.id === vacina.fabricanteId)
                          ?.nomeFantasia || "—"}
                      </td>
                      <td>
                        {fornecedores.find((f) => f.id === vacina.fornecedorId)
                          ?.nomeFantasia || "—"}
                      </td>
                      <td>
                        <Stack spacing={1} padding={0} direction="row">
                          <IconButton
                            onClick={() => redirecionarEdicao(vacina.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => excluirVacina(vacina.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                  {vacinas.length === 0 && (
                    <tr>
                      <td colSpan="8">Nenhuma vacina cadastrada.</td>
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

export default ListagemVacinas;
