import React from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Stack } from "@mui/material";
import Card from '../components/Card';
import FormGroup from '../components/FormGroup';
import { mensagemErro, mensagemSucesso } from '../components/toastr';
import '../custom.css';

import { BASE_URL } from '../config/axios';
import { withRouter } from '../withRouter';

class Login extends React.Component {
  state = {
    login: '',
    senha: '',
    carregando: false
  };

  logar = async () => {
  const { login, senha } = this.state;

  if (!login || !senha) {
    mensagemErro("Preencha login e senha");
    return;
  }

  this.setState({ carregando: true });

  try {
    const response = await axios.post(`${BASE_URL}/usuarios/auth`, {
      login,
      senha,
    });

    const token = response.data.token;
    localStorage.setItem('token', token);
    localStorage.setItem('usuario_logado', login);

    const decoded = jwtDecode(token);
    const role = decoded.role || "USER";
    localStorage.setItem('role', role);

    mensagemSucesso(`Bem-vindo, ${login}!`);
    this.props.navigate("/ListagemVacinacao");
  } catch (error) {
    mensagemErro("Login ou senha inválidos");
  } finally {
    this.setState({ carregando: false });
  }
};


  cancelar = () => {
    this.setState({
      login: '',
      senha: '',
    });
  };

  render() {
    return (
      <div className="login-wrapper">
        <div className="login-card">
          <Card title="Acesso">
            <div className="bs-component">
              <FormGroup label="Login: *" htmlFor="inputLogin">
                <input
                  type="text"
                  id="inputLogin"
                  value={this.state.login}
                  className="form-control"
                  name="login"
                  onChange={(e) => this.setState({ login: e.target.value })}
                />
              </FormGroup>
              <FormGroup label="Senha: *" htmlFor="inputSenha">
                <input
                  type="password"
                  id="inputSenha"
                  value={this.state.senha}
                  className="form-control"
                  name="senha"
                  onChange={(e) => this.setState({ senha: e.target.value })}
                />
              </FormGroup>
              <Stack spacing={1} padding={1} direction="row" justifyContent="center">
                <button
                  onClick={this.logar}
                  type="button"
                  className="btn btn-success"
                  disabled={this.state.carregando}
                >
                  Entrar
                </button>
                <button
                  onClick={this.cancelar}
                  type="button"
                  className="btn btn-danger"
                >
                  Cancelar
                </button>
              </Stack>
            </div>
          </Card>
        </div>
      </div>
    );
  }
}

export default withRouter(Login);
