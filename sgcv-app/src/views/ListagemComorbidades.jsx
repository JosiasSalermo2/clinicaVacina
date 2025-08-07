import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Card from "../components/Card";
import LoadingOverlay from "../LoadingOverlay";
import { mensagemSucesso, mensagemErro } from "../components/toastr";

import Stack from "@mui/material/Stack";
import { IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { BASE_URL } from "../config/axios";

function ListagemComorbidades() {
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/comorbidades`;

  const [comorbidades, setComorbidades] = useState([]);
  const [loading, setLoading] = useState(true);

  const carregarComorbidades = async () => {
    try {
      const response = await fetch(baseURL);
      const data = await response.json();
      setComorbidades(data);
    } catch (error) {
      mensagemErro("Erro ao carregar comorbidades.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarComorbidades();
  }, []);

  const redirecionarCadastro = () => {
    navigate("/CadastroComorbidade");
  };

  const redirecionarEdicao = (id) => {
    navigate(`/CadastroComorbidade/${id}`);
  };

  const excluirComorbidade = async (id) => {
    try {
      await fetch(`${baseURL}/${id}`, { method: "DELETE" });
      mensagemSucesso("Comorbidade excluída com sucesso.");
      setComorbidades((prev) => prev.filter((c) => c.id !== id));
    } catch (error) {
      mensagemErro("Erro ao excluir comorbidade.");
    }
  };

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title="Comorbidades">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning"
                onClick={redirecionarCadastro}
              >
                Nova Comorbidade
              </button>

              <table className="table table-hover mt-3">
                <thead>
                  <tr>
                    <th>Comorbidade</th>
                    <th>Descrição</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {comorbidades.map((c) => (
                    <tr key={c.id}>
                      <td>{c.comorbidade}</td>
                      <td>{c.descricao}</td>
                      <td>
                        <Stack spacing={1} direction="row">
                          <IconButton
                            aria-label="edit"
                            onClick={() => redirecionarEdicao(c.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            aria-label="delete"
                            onClick={() => excluirComorbidade(c.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>

              {comorbidades.length === 0 && !loading && (
                <p>Nenhuma comorbidade cadastrada.</p>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default ListagemComorbidades;
