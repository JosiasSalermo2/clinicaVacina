import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";

import Stack from "@mui/material/Stack";

import Card from "../components/Card";
import { mensagemSucesso, mensagemErro } from "../components/toastr";
import FormGroup from "../components/FormGroup";



import "../custom.css";
import LoadingOverlay from '../LoadingOverlay';

import axios from "axios";
import { BASE_URL } from "../config/axios";


function CadastroCompra() {
  const { idParam } = useParams();
  const navigate = useNavigate();
  const baseURL = `${BASE_URL}/compras`;


  // Estado para lista de compras (TODAS)
  const [compras, setCompras] = useState([]);

  // — Dados da Compra
  const [id, setId] = useState('');
  const [valor, setValor] = useState('');
  const [dataCompra, setDataCompra] = useState('');
  const [quantidadeVacina, setQuantidadeVacina] = useState('');

  // — IDs de relacionamento
  const [fornecedorId, setFornecedorId] = useState('');
  const [fabricanteId, setFabricanteId] = useState('');
  const [vacinaId, setVacinaId] = useState('');


  // — Listas para selects (sempre arrays)
  const [fornecedores, setFornecedores] = useState([]);
  const [fabricantes, setFabricantes] = useState([]);
  const [vacinas, setVacinas] = useState([]);

  //--- Controle de loading e edição --
  const [loading, setLoading] = useState(true);

  const [erros, setErros] = useState({});

  async function buscarCompraPorId() {
    try {
      const response = await axios.get(`${baseURL}/${idParam}`);
      const compra = response.data;
      setId(compra.id);
      setValor(compra.valor);
      setDataCompra(compra.dataCompra);
      setFornecedorId(compra.fornecedorId);
      setFabricanteId(compra.fabricanteId);
      setVacinaId(compra.vacinaId);
    } catch (error) {
      console.error("Erro ao buscar compra:", error);
      mensagemErro("Compra não encontrada");
    } finally {
      setLoading(false);
    }

  }


  async function salvar() {
    const novosErros = {};

    if (!valor || isNaN(parseFloat(valor))) {
      novosErros.valor = "Informe um valor válido.";
    }

    if (!dataCompra) {
      novosErros.dataCompra = "Informe a data da compra.";
    }

    if (!fabricanteId) {
      novosErros.fabricanteId = "Selecione o fabricante.";
    }

    if (!fornecedorId) {
      novosErros.fornecedorId = "Selecione o fornecedor.";
    }

    if (!vacinaId) {
      novosErros.vacinaId = "Selecione a vacina.";
    }

    setErros(novosErros);

    if (Object.keys(novosErros).length > 0) {
      mensagemErro("Preencha todos os campos obrigatórios corretamente.");
      return;
    }

    const data = {
      valor: parseFloat(valor),
      dataCompra,
      fornecedorId: parseInt(fornecedorId),
      fabricanteId: parseInt(fabricanteId),
      vacinaId: parseInt(vacinaId),
    };

    try {
      if (!idParam) {
        await axios.post(baseURL, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        mensagemSucesso(`Compra cadastrada com sucesso!`);
      } else {
        await axios.put(`${baseURL}/${idParam}`, data, {
          headers: { 'Content-Type': 'application/json' },
        });
        mensagemSucesso(`Compra ${id} alterada com sucesso!`);
      }

      navigate('/ListagemCompra');
    } catch (error) {
      console.error("Erro ao salvar compra:", error);
      mensagemErro("Erro ao salvar os dados");
    }
  }


  function inicializar() {
    if (idParam == null) {
      setId('');
      setValor('');
      setDataCompra('');
      setFornecedorId('');
      setFabricanteId('');
      setVacinaId('');
    } else {
      buscarCompraPorId();
    }
  }


  // - UseEffect para buscar compras ao carregar o componente

  // - Compras
  useEffect(() => {
    async function carregarCompras() {
      try {
        const response = await axios.get(baseURL);
        setCompras(response.data);
      } catch (error) {
        mensagemErro("Erro ao carregar lista de compras.");
      }
    }
    carregarCompras();
  }, []);

  // - Fabricantes 
  useEffect(() => {
    async function carregarFabricantes() {
      try {
        const response = await axios.get(`${BASE_URL}/fabricantes`);
        setFabricantes(response.data);
      } catch (error) {
        mensagemErro("Erro ao carregar fabricantes.");
      }
    }
    carregarFabricantes();
  }, []);

  // - Fornecedores 
  useEffect(() => {
    async function carregarFornecedores() {
      try {
        const response = await axios.get(`${BASE_URL}/fornecedores`);
        setFornecedores(response.data);
      } catch (error) {
        mensagemErro("Erro ao carregar fornecedores.");
      }
    }
    carregarFornecedores();
  }, []);

  // - Vacinas 
  useEffect(() => {
    async function carregarVacinas() {
      try {
        const response = await axios.get(`${BASE_URL}/vacinas`);
        setVacinas(response.data);
      } catch (error) {
        mensagemErro("Erro ao carregar vacinas.");
      }
    }
    carregarVacinas();
  }, []);


  useEffect(() => {
    if (idParam) {
      buscarCompraPorId();
    } else {
      setLoading(false);
    }
  }, [idParam]);


  if (loading) return <LoadingOverlay loading={true} />;


  return (
    <div className="container">
      <LoadingOverlay loading={loading} />
      <Card title={idParam ? "Editar Compra" : "Cadastrar Compra"}>
        <form>
          <div className="row">
            <div className="col-md-6 mb-3">
              <FormGroup label="Valor da Compra: *" htmlFor="inputValor">
                <input
                  type="number"
                  step="0.01"
                  id="inputValor"
                  value={valor}
                  className={`form-control ${erros.valor ? 'is-invalid' : ''}`}
                  name="valor"
                  onChange={e => setValor(e.target.value)}
                />
                {erros.valor && <div className="invalid-feedback">{erros.valor}</div>}
              </FormGroup>
            </div>
            <div className="col-md-6 mb-3">
              <FormGroup label="Data da Compra: *" htmlFor="inputDataCompra">
                <input
                  type="date"
                  id="inputDataCompra"
                  value={dataCompra}
                  className={`form-control ${erros.dataCompra ? 'is-invalid' : ''}`}
                  name="dataCompra"
                  onChange={e => setDataCompra(e.target.value)}
                />
                {erros.dataCompra && (
                  <div className="invalid-feedback">{erros.dataCompra}</div>
                )}
              </FormGroup>
            </div>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <FormGroup label="Vacina: *" htmlFor="selectVacina">
                <select
                  className={`form-select ${erros.vacinaId ? 'is-invalid' : ''}`}
                  id="selectVacina"
                  value={vacinaId}
                  onChange={e => setVacinaId(e.target.value)}
                >
                  <option value="">Selecione a Vacina</option>
                  {vacinas.map(vacina => (
                    <option key={vacina.id} value={vacina.id}>
                      {vacina.vacina}
                    </option>
                  ))}
                </select>
                {erros.vacinaId && <div className="invalid-feedback">{erros.vacinaId}</div>}

              </FormGroup>
            </div>
            <div className="col-md-6 mb-3">
              <FormGroup label="Quantidade de vacina: *" htmlFor="inputQuantidadeVacina">
                <input
                  type="number"
                  id="inputQuantidadeVacina"
                  value={quantidadeVacina}
                  className={`form-control ${erros.quantidadeVacina ? 'is-invalid' : ''}`}
                  name="quantidadeVacina"
                  onChange={e => setQuantidadeVacina(e.target.value)}
                />
                {erros.quantidadeVacinaa && (
                  <div className="invalid-feedback">{erros.quantidadeVacina}</div>
                )}
              </FormGroup>
            </div>
          </div>


          <div className="row">
            <div className="col-md-6 mb-3">
              <FormGroup label="Fabricante: *" htmlFor="selectFabricante">
                <select
                  className={`form-select ${erros.fabricanteId ? 'is-invalid' : ''}`}
                  id="selectFabricante"
                  value={fabricanteId}
                  onChange={e => setFabricanteId(e.target.value)}
                >
                  <option value="">Selecione o Fabricante</option>
                  {fabricantes.map(fab => (
                    <option key={fab.id} value={fab.id}>
                      {fab.nomeFantasia}
                    </option>
                  ))}
                </select>
                {erros.fabricanteId && <div className="invalid-feedback">{erros.fabricanteId}</div>}

              </FormGroup>
            </div>
            <div className="col-md-6 mb-3">
              <FormGroup label="Fornecedor: *" htmlFor="selectFornecedor">
                <select
                  className={`form-select ${erros.fornecedorId ? 'is-invalid' : ''}`}
                  id="selectFornecedor"
                  value={fornecedorId}
                  onChange={e => setFornecedorId(e.target.value)}
                >
                  <option value="">Selecione o Fornecedor</option>
                  {fornecedores.map(forn => (
                    <option key={forn.id} value={forn.id}>
                      {forn.nomeFantasia || forn.razaoSocial}
                    </option>
                  ))}
                </select>
                {erros.fornecedorId && (
                  <div className="invalid-feedback">{erros.fornecedorId}</div>
                )}
              </FormGroup>
            </div>
          </div>
          <Stack spacing={1} padding={1} direction="row">
            <button
              onClick={salvar}
              type="button"
              className="btn btn-success" >
              Salvar
            </button>
            <button
              onClick={() => navigate('/ListagemCompra')}
              type="button"
              className="btn btn-danger"
            >
              Cancelar
            </button>
          </Stack>
        </form>
      </Card>
    </div>
  );

}

export default CadastroCompra;
