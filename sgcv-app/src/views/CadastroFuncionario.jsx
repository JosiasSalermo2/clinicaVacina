import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";

import Card from "../components/Card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import FormGroup from "../components/FormGroup";
import LoadingOverlay from "../LoadingOverlay";

import "../custom.css";
import axios from "axios";
import { BASE_URL } from "../config/axios";

function CadastroFuncionario() {
  const { idParam } = useParams();
  const navigate = useNavigate();

  const [id, setId] = useState("");
  const [nome, setNome] = useState("");
  const [cpf, setCpf] = useState("");
  const [email, setEmail] = useState("");
  const [rg, setRg] = useState("");
  const [dataNascimento, setDataNascimento] = useState("");
  const [dataAdmissao, setDataAdmissao] = useState("");
  const [especialidade, setEspecialidade] = useState("");
  const [registroConselho, setRegistroConselho] = useState("");
  const [salario, setSalario] = useState("");
  const [cargoId, setCargoId] = useState("");

  const [cargos, setCargos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({});

  useEffect(() => {
    carregarListas();
    if (idParam) {
      buscarFuncionario(idParam);
    } else {
      setLoading(false);
    }
  }, [idParam]);

  const carregarListas = async () => {
    try {
      const resCargos = await axios.get(`${BASE_URL}/cargos`);
      console.log("CARGOS:", resCargos.data); // VERIFIQUE AQUI
      setCargos(resCargos.data);
    } catch (error) {
      mensagemErro("Erro ao carregar lista de cargos.");
    }
  };

  const buscarFuncionario = async (id) => {
    try {
      const response = await axios.get(`${BASE_URL}/funcionarios/${id}`);
      const funcionario = response.data;

      setId(funcionario.id);
      setNome(funcionario.nome || "");
      setCpf(funcionario.cpf || "");
      setEmail(funcionario.email || "");
      setRg(funcionario.rg || "");
      setDataNascimento(funcionario.dataNascimento || "");
      setDataAdmissao(funcionario.dataAdmissao || "");
      setEspecialidade(funcionario.especialidade || "");
      setRegistroConselho(funcionario.registroConselho || "");
      setSalario(funcionario.salario || "");
      setCargoId(funcionario.cargoId || "");

      setLoading(false);
    } catch (error) {
      mensagemErro("Erro ao carregar dados do funcionário.");
    }
  };

  const validar = () => {
    const novosErros = {};
    if (!nome.trim()) novosErros.nome = "Informe o nome.";
    if (!email.trim()) novosErros.email = "Informe o email.";
    if (!rg.trim()) novosErros.rg = "Informe o RG.";
    if (!cpf.trim()) novosErros.cpf = "Informe o CPF.";
    if (!dataNascimento.trim())
      novosErros.dataNascimento = "Informe a data de nascimento.";
    if (!dataAdmissao.trim())
      novosErros.dataAdmissao = "Informe a data de admissão.";
    if (!especialidade.trim())
      novosErros.especialidade = "Informe a especialidade.";
    if (!registroConselho.trim())
      novosErros.registroConselho = "Informe o registro no conselho.";
    if (!salario.trim()) novosErros.salario = "Informe o salário.";
    if (!cargoId.trim()) novosErros.cargoId = "Informe o cargo.";

    setErros(novosErros);
    return Object.keys(novosErros).length === 0;
  };

  const salvar = async () => {
    if (!validar()) return;

    const funcionario = {
      nome,
      cpf,
      email,
      rg,
      dataNascimento,
      dataAdmissao,
      especialidade,
      registroConselho,
      salario,
      cargoId,
    };

    try {
      if (idParam) {
        await axios.put(`${BASE_URL}/funcionarios/${idParam}`, funcionario);
        mensagemSucesso("Funcionário atualizado com sucesso!");
      } else {
        await axios.post(`${BASE_URL}/funcionarios`, funcionario);
        mensagemSucesso("Funcionário cadastrado com sucesso!");
      }

      navigate("/ListagemFuncionarios");
    } catch (error) {
      mensagemErro("Erro ao salvar funcionário.");
    }
  };

  const cancelar = () => {
    navigate("/ListagemFuncionarios");
  };

  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title="Cadastro de Funcionário">
        <form>
          <div className="row">
            <div className="col-md-12 mb-3">
              <FormGroup label="Nome: *" htmlFor="inputNome">
                <input
                  type="text"
                  id="inputNome"
                  className={`form-control ${erros.nome ? "is-invalid" : ""}`}
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  required
                />
                {erros.nome && (
                  <div className="invalid-feedback">{erros.nome}</div>
                )}
              </FormGroup>
            </div>

            <div className="col-md-12 mb-3">
              <FormGroup label="Email: *" htmlFor="inputEmail">
                <input
                  type="email"
                  id="inputEmail"
                  className={`form-control ${erros.email ? "is-invalid" : ""}`}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                {erros.email && (
                  <div className="invalid-feedback">{erros.email}</div>
                )}
              </FormGroup>
            </div>

            <div>
              <div className="col-md-6 mb-3">
                <FormGroup label="RG: *" htmlFor="inputRg">
                  <input
                    type="text"
                    id="inputRg"
                    className={`form-control ${erros.rg ? "is-invalid" : ""}`}
                    value={rg}
                    onChange={(e) => setRg(e.target.value)}
                    required
                    maxLength="12"
                  />
                  {erros.rg && (
                    <div className="invalid-feedback">{erros.rg}</div>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-6 mb-3">
                <FormGroup label="CPF: *" htmlFor="inputCpf">
                  <input
                    type="text"
                    id="inputCpf"
                    className={`form-control ${erros.cpf ? "is-invalid" : ""}`}
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    required
                    maxLength="14"
                  />
                  {erros.cpf && (
                    <div className="invalid-feedback">{erros.cpf}</div>
                  )}
                </FormGroup>
              </div>
            </div>

            <div>
              <div className="col-md-6 mb-3">
                <FormGroup
                  label="Data de Nascimento:* "
                  htmlFor="inputDataNascimento"
                >
                  <input
                    type="date"
                    id="inputDataNascimento"
                    className={`form-control ${
                      erros.dataNascimento ? "is-invalid" : ""
                    }`}
                    value={dataNascimento}
                    onChange={(e) => setDataNascimento(e.target.value)}
                    required
                  />
                  {erros.dataNascimento && (
                    <div className="invalid-feedback">
                      {erros.dataNascimento}
                    </div>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-6 mb-3">
                <FormGroup label="Data Admissão:* " htmlFor="inputDataAdmissao">
                  <input
                    type="date"
                    id="inputDataAdmissao"
                    className={`form-control ${
                      erros.dataAdmissao ? "is-invalid" : ""
                    }`}
                    value={dataAdmissao}
                    onChange={(e) => setDataAdmissao(e.target.value)}
                    required
                  />
                  {erros.dataAdmissao && (
                    <div className="invalid-feedback">{erros.dataAdmissao}</div>
                  )}
                </FormGroup>
              </div>
            </div>

            <div className="col-md-6 mb-3">
              <FormGroup label="Especialidade: *" htmlFor="inputEspecialidade">
                <input
                  type="string"
                  id="inputEspecialidade"
                  className={`form-control ${
                    erros.especialidade ? "is-invalid" : ""
                  }`}
                  value={especialidade}
                  onChange={(e) => setEspecialidade(e.target.value)}
                  required
                />
                {erros.especialidade && (
                  <div className="invalid-feedback">{erros.especialidade}</div>
                )}
              </FormGroup>
            </div>

            <div>
              <div className="col-md-6 mb-3">
                <FormGroup
                  label="Registro no Conselho: *"
                  htmlFor="inputRegistroConselho"
                >
                  <input
                    type="string"
                    id="inputRegistroConselho"
                    className={`form-control ${
                      erros.registroConselho ? "is-invalid" : ""
                    }`}
                    value={registroConselho}
                    onChange={(e) => setRegistroConselho(e.target.value)}
                    required
                  />
                  {erros.registroConselho && (
                    <div className="invalid-feedback">
                      {erros.registroConselho}
                    </div>
                  )}
                </FormGroup>
              </div>
              <div className="col-md-6 mb-3">
                <FormGroup label="Salario: *" htmlFor="inputSalario">
                  <input
                    type="number"
                    id="inputSalario"
                    className={`form-control ${
                      erros.salario ? "is-invalid" : ""
                    }`}
                    value={salario}
                    onChange={(e) => setSalario(e.target.value)}
                    required
                  />
                  {erros.salario && (
                    <div className="invalid-feedback">{erros.salario}</div>
                  )}
                </FormGroup>
              </div>
            </div>

            <div>
              <div className="col-md-6 mb-3">
                <FormGroup label="Cargo: *" htmlFor="selectCargoId">
                  <select
                    id="selectCargoId"
                    className={`form-control ${
                      erros.cargoId ? "is-invalid" : ""
                    }`}
                    value={cargoId}
                    onChange={(e) => setCargoId(e.target.value)}
                    required
                    size={1}
                  >
                    <option value="">Selecione um cargo</option>
                    {Array.isArray(cargos) && cargos.length > 0 ? (
                      cargos.map((cargo) => (
                        <option key={cargo.id} value={cargo.id}>
                          {cargo.cargo}
                        </option>
                      ))
                    ) : (
                      <option disabled>Carregando cargos...</option>
                    )}
                  </select>
                  {erros.cargoId && (
                    <div className="invalid-feedback">{erros.cargoId}</div>
                  )}
                </FormGroup>
              </div>
            </div>
          </div>

          <Stack spacing={1} padding={1} direction="row">
            <button onClick={salvar} type="button" className="btn btn-success">
              Salvar
            </button>
            <button
              onClick={() => navigate("/ListagemFuncionarios")}
              type="button"
              className="btn btn-danger"
            >
              Cancelar
            </button>
          </Stack>
          <div></div>
        </form>
      </Card>
    </div>
  );
}

export default CadastroFuncionario;
