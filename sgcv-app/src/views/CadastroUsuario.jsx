import React, { useEffect, useState } from "react";
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
import { BASE_URL } from "../config/axios";

function CadastroUsuario() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/usuarios`;

  const [login, setLogin] = useState("");
  const [cpf, setCpf] = useState("");
  const [admin, setAdmin] = useState(false);

  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({});

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
      const usuario = response.data;
      setLogin(usuario.login || "");
      setCpf(usuario.cpf || "");
      setAdmin(usuario.admin || false);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      mensagemErro("Erro ao buscar os dados");
    } finally {
      setLoading(false);
    }
  }

  async function salvar() {
    const novosErros = {};

    if (!String(login || "").trim()) {
      novosErros.login = "Informe o login.";
    }
    if (!String(cpf || "").trim()) {
      novosErros.cpf = "Informe o CPF.";
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      mensagemErro("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    const data = { login, cpf, admin };

    try {
      if (idParam) {
        await axios.put(`${baseURL}/${idParam}`, data);
        mensagemSucesso("Usuário atualizado com sucesso!");
      } else {
        await axios.post(baseURL, data);
        mensagemSucesso("Usuário cadastrado com sucesso!");
      }
      navigate("/ListagemUsuarios");
    } catch (error) {
      mensagemErro(error?.response?.data || "Erro ao salvar usuário.");
    }
  }

  if (loading) {
    return <div className="container">Carregando...</div>;
  }

  return (
    <div className="container">
      <Card title={idParam ? "Editar Usuário" : "Cadastrar Usuário"}>
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <FormGroup label="Login: *" htmlFor="inputLogin">
                <input
                  type="text"
                  id="inputLogin"
                  className="form-control"
                  value={login}
                  onChange={(e) => setLogin(e.target.value)}
                  required
                />
              </FormGroup>
            </div>
            <div className="col-md-6 mb-3">
              <FormGroup label="CPF: *" htmlFor="inputCpf">
                <input
                  type="text"
                  id="inputCpf"
                  className="form-control"
                  value={cpf}
                  onChange={(e) => setCpf(e.target.value)}
                  required
                />
              </FormGroup>
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={admin}
              onChange={(e) => setAdmin(e.target.checked)}
              id="checkAdmin"
            />
            <label className="form-check-label" htmlFor="checkAdmin">
              Administrador
            </label>
          </div>

          <Stack spacing={1} padding={1} direction="row">
            <button type="button" className="btn btn-success" onClick={salvar}>
              Salvar
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={() => navigate("/ListagemUsuarios")}
            >
              Cancelar
            </button>
          </Stack>
        </form>
      </Card>
    </div>
  );
}

export default CadastroUsuario;
