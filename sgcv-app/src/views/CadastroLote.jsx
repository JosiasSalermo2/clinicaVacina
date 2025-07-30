import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";

import Card from "../components/Card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import FormGroup from "../components/FormGroup";

import "../custom.css";
import LoadingOverlay from "../LoadingOverlay";

import axios from "axios";

import { BASE_URL } from '../config/axios';

function CadastroLote() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/lotes`;

  const [id, setId] = useState('');
  const [dataValidade, setDataValidade] = useState('');
  const [numeroLote, setNumeroLote] = useState('');
  const [numeroAmpola, setNumeroAmpola] = useState('');
  const [dosesAmpola, setDosesAmpola] = useState('');
  const [nomeVacina, setNomeVacina] = useState('');
  const [nomeEstoque, setNomeEstoque] = useState('');
  const [loading, setLoading] = useState(true);
  const [erros, setErros] = useState({});

  const [compras, setCompras] = useState([]);
  const [compraId, setCompraId] = useState("");

  const [vacinas, setVacinas] = useState([]);
  const [vacinaId, setVacinaId] = useState("");

  const [estoques, setEstoques] = useState([]);
  const [estoqueId, setEstoqueId] = useState("");



async function salvar() {
  const novosErros = {};

  if (!dataValidade || !dataValidade.trim()) {
    novosErros.dataValidade = "A validade é obrigatória.";
  }

 if (!numeroLote || !numeroLote.trim()) {
   novosErros.numeroLote = "O número do lote é obrigatório.";
 }

 if (!numeroAmpola && numeroAmpola !== 0) {
   novosErros.numeroAmpola = "O número da ampola é obrigatório.";
 }

 if (!dosesAmpola && dosesAmpola !== 0) {
   novosErros.dosesAmpola = "A dose da ampola é obrigatória.";
 }

  if (!compraId) {
    novosErros.compraId = "O número da compra é obrigatório.";
  }

  if (!vacinaId) {
    novosErros.vacinaId = "A vacina é obrigatória.";
  }

  if (!estoqueId) {
    novosErros.estoqueId = "O estoque é obrigatório.";
  }

  setErros(novosErros);
  if (Object.keys(novosErros).length > 0) {
    mensagemErro("Preencha todos os campos obrigatórios corretamente.");
    return;
  }

  const data = {
    numeroLote,
    dataValidade,
    numeroAmpola,
    dosesAmpola,
    compraId: parseInt(compraId, 10),
    vacinaId: parseInt(vacinaId, 10),
    estoqueId: parseInt(estoqueId, 10),
  };
  if (idParam) data.id = id;

  try {
    if (!idParam) {
      await axios.post(baseURL, data);
      mensagemSucesso(`Lote ${numeroLote} cadastrado com sucesso!`);
      setNumeroLote("");
      setDataValidade("");
      setNumeroAmpola("");
      setDosesAmpola("");
      setCompraId("");
      setVacinaId("");
      setEstoqueId("");
      setErros({});
    } else {
      await axios.put(`${baseURL}/${idParam}`, data);
      mensagemSucesso(`Lote ${numeroLote} alterado com sucesso!`);
      navigate(`/ListagemLotes`);
    }
  } catch (error) {
    mensagemErro(error?.response?.data?.message || "Erro ao salvar o lote.");
  }
}


  async function buscar() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      setId(response.data.id);
      setNumeroLote(response.data.numeroLote);
      setDataValidade(response.data.dataValidade);
      setNumeroAmpola(response.data.numeroAmpola);
      setDosesAmpola(response.data.dosesAmpola);
      setCompraId(response.data.compraId);
      setVacinaId(response.data.vacinaId);
      setEstoqueId(response.data.estoqueId);
    } catch (error) {
      console.error("Erro ao buscar os dados:", error);
      mensagemErro("Erro ao buscar os dados");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
  const carregarListas = async () => {
    try {
      const [resCompras, resVacinas, resEstoques] = await Promise.all([
        axios.get(`${BASE_URL}/compras`),
        axios.get(`${BASE_URL}/vacinas`),
        axios.get(`${BASE_URL}/estoques`)
      ]);
      setCompras(resCompras.data);
      console.log("COMPRAS:", resCompras.data);
      setVacinas(resVacinas.data);
      setEstoques(resEstoques.data);
    } catch (error) {
      console.error("Erro ao carregar compras, vacinas ou estoques", error);
    }
  };

  if (idParam) {
    buscar();
  } else {
    setLoading(false);
  }

  carregarListas();
}, [idParam]);


  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title="Cadastro de Lote">
        <div className="row">
          <div className="col-lg-12">
            <div className="form-row">
              <div className="mesmaLinha">
                <div className="col-md-12 mb-3">
                  <FormGroup
                    label="Número do Lote: *"
                    htmlFor="inputNumeroLote"
                  >
                    <input
                      type="text"
                      id="inputNumeroLote"
                      value={numeroLote}
                      className={`form-control ${
                        erros.numeroLote ? "is-invalid" : ""
                      }`}
                      onChange={(e) => setNumeroLote(e.target.value)}
                    />
                    {erros.numeroLote && (
                      <div className="invalid-feedback">{erros.numeroLote}</div>
                    )}
                  </FormGroup>
                </div>
              </div>

              <div className="col-md-12 mb-3">
                <FormGroup label="Data validade: *" htmlFor="inputDataValidade">
                  <input
                    type="date"
                    id="dataValidade"
                    value={dataValidade}
                    className={`form-control ${
                      erros.dataValidade ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setDataValidade(e.target.value)}
                  />
                  {erros.dataValidade && (
                    <div className="invalid-feedback">{erros.dataValidade}</div>
                  )}
                </FormGroup>

                <FormGroup label="Número ampola: " htmlFor="inputNumeroAmpola">
                  <input
                    type="number"
                    id="inputNumeroAmpola"
                    value={numeroAmpola}
                    className={`form-control ${
                      erros.numeroAmpola ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setNumeroAmpola(e.target.value)}
                    min="0"
                  />
                  {erros.numeroAmpola && (
                    <div className="invalid-feedback">{erros.numeroAmpola}</div>
                  )}
                </FormGroup>

                <FormGroup label="Doses ampola: " htmlFor="inputDosesAmpola">
                  <input
                    type="number"
                    id="inputDosesAmpola"
                    value={dosesAmpola}
                    className={`form-control ${
                      erros.dosesAmpola ? "is-invalid" : ""
                    }`}
                    onChange={(e) => setDosesAmpola(e.target.value)}
                    min="0"
                  />
                  {erros.dosesAmpola && (
                    <div className="invalid-feedback">{erros.dosesAmpola}</div>
                  )}
                </FormGroup>

                <FormGroup label="Compra: *" htmlFor="compraId">
                  <select
                    id="compraId"
                    value={compraId}
                    onChange={(e) => setCompraId(e.target.value)}
                    className={`form-control ${
                      erros.compraId ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Selecione</option>
                    {compras.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.id}
                      </option>
                    ))}
                  </select>
                  {erros.numeroCompra && (
                    <div className="invalid-feedback">{erros.numeroCompra}</div>
                  )}
                </FormGroup>

                <FormGroup label="Vacina: *" htmlFor="vacinaId">
                  <select
                    id="vacinaId"
                    value={vacinaId}
                    onChange={(e) => setVacinaId(e.target.value)}
                    className={`form-control ${
                      erros.vacinaId ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Selecione</option>
                    {vacinas.map((v) => (
                      <option key={v.id} value={v.id}>
                        {v.vacina}
                      </option>
                    ))}
                  </select>
                  {erros.vacinaId && (
                    <div className="invalid-feedback">{erros.vacinaId}</div>
                  )}
                </FormGroup>

                <FormGroup label="Estoque: *" htmlFor="estoqueId">
                  <select
                    id="estoqueId"
                    value={estoqueId}
                    onChange={(e) => setEstoqueId(e.target.value)}
                    className={`form-control ${
                      erros.estoqueId ? "is-invalid" : ""
                    }`}
                  >
                    <option value="">Selecione</option>
                    {estoques.map((e) => (
                      <option key={e.id} value={e.id}>
                        {e.nome}
                      </option>
                    ))}
                  </select>
                  {erros.estoqueId && (
                    <div className="invalid-feedback">{erros.estoqueId}</div>
                  )}
                </FormGroup>
              </div>

              <Stack spacing={1} padding={1} direction="row">
                <button
                  onClick={salvar}
                  type="button"
                  className="btn btn-success"
                >
                  Salvar
                </button>
                <button
                  onClick={() => navigate("/ListagemLotes")}
                  type="button"
                  className="btn btn-danger"
                >
                  Cancelar
                </button>
              </Stack>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}

export default CadastroLote;
