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
  const [administrador, setAdministrador] = useState(false);

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
      setAdministrador(usuario.administrador || false);
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
    } else if (!validarCpf(cpf)) {
      novosErros.cpf = "CPF inválido. Use o formato Ex: 123.456.789-09";
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      mensagemErro("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    const data = { login, cpf, administrador };

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

  function formatarCpf(valor) {
    return valor
      .replace(/\D/g, "") // Remove tudo que não é número
      .replace(/(\d{3})(\d)/, "$1.$2") // Coloca ponto depois dos 3 primeiros dígitos
      .replace(/(\d{3})(\d)/, "$1.$2") // Segundo ponto
      .replace(/(\d{3})(\d{1,2})$/, "$1-$2") // Traço antes dos dois últimos dígitos
      .substring(0, 14); // Limita ao tamanho do CPF com formatação
  }

  function validarCpf(cpf) {
    cpf = cpf.replace(/[^\d]+/g, "");
    if (cpf.length !== 11 || /^(\d)\1{10}$/.test(cpf)) return false;

    let soma = 0;
    for (let i = 0; i < 9; i++) soma += parseInt(cpf.charAt(i)) * (10 - i);
    let resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    if (resto !== parseInt(cpf.charAt(9))) return false;

    soma = 0;
    for (let i = 0; i < 10; i++) soma += parseInt(cpf.charAt(i)) * (11 - i);
    resto = (soma * 10) % 11;
    if (resto === 10 || resto === 11) resto = 0;
    return resto === parseInt(cpf.charAt(10));
  }

  return (
    <div className="container">
      <LoadingOverlay active={loading} />
      <Card title={idParam ? "Editar Usuário" : "Cadastrar Usuário"}>
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <FormGroup label="Login: *" htmlFor="inputLogin">
                <input
                  type="text"
                  id="inputLogin"
                  value={login}
                  className={`form-control ${erros.login ? "is-invalid" : ""}`}
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
                  value={cpf}
                  className={`form-control ${erros.cpf ? "is-invalid" : ""}`}
                  onChange={(e) => setCpf(formatarCpf(e.target.value))}
                  placeholder="Ex: 123.456.789-09"
                  required
                />
              </FormGroup>
            </div>
          </div>

          <div className="form-check mb-3">
            <input
              className="form-check-input"
              type="checkbox"
              checked={administrador}
              onChange={(e) => setAdministrador(e.target.checked)}
              id="checkAdministrador"
            />
            <label className="form-check-label" htmlFor="checkAdministrador">
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
