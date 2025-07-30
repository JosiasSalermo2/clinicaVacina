import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

import { useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL } from '../config/axios';



function ListagemLotes() {
  const navigate = useNavigate();
  const [lotes, setLotes] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
  try {
    const [resLote, resCompras, resVacinas, resEstoques] = await Promise.all([
      axios.get(`${BASE_URL}/lotes`),
      axios.get(`${BASE_URL}/compras`),
      axios.get(`${BASE_URL}/vacinas`),
      axios.get(`${BASE_URL}/estoques`),
    ]);

    const mapaCompras = resCompras.data.reduce((map, compra) => {
      map[compra.id] = compra.id;
      return map;
    }, {});

    const mapaVacinas = resVacinas.data.reduce((map, vacina) => {
      map[vacina.id] = vacina.vacina;
      return map;
    }, {});

    const mapaEstoques = resEstoques.data.reduce((map, estoque) => {
      map[estoque.id] = estoque.nome;
      return map;
    }, {});

    const lotesComNomes = resLote.data.map((lote) => ({
      ...lote,
      nomeVacina: lote.vacinaId ? mapaVacinas[lote.vacinaId] : "Não encontrado",
      nomeEstoque: lote.estoqueId ? mapaEstoques[lote.estoqueId] : "Não encontrado",


    }));

    setLotes(lotesComNomes);
  } catch (error) {
    mensagemErro('Erro ao carregar dados dos lotes, vacinas ou estoques.');
  }
};


  const redirecionarCadastro = () => {
    navigate('/CadastroLote');
  };

  const redirecionarEdicao = (id) => {
    navigate(`/CadastroLote/${id}`);
  };

  const excluirLote = async (id) => {
  try {
    await axios.delete(`${BASE_URL}/lotes/${id}`);
    mensagemSucesso('Lote excluído com sucesso!');
    setLotes((prev) => prev.filter((lote) => lote.id !== id));
  } catch (error) {
    console.error("Erro ao excluir lote:", error);
    mensagemErro(error?.response?.data?.message || 'Erro ao excluir lote.');
  }
};


  return (
    <div className="container">
      <Card title="Lotes Cadastrados">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning mb-3"
                onClick={redirecionarCadastro}
              >
                Novo Lote
              </button>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Lote</th>
                    <th>Data Validade</th>
                    <th>Ampolas</th>
                    <th>Doses de Ampolas</th>
                    <th>Compra</th>
                    <th>Vacina</th>
                    <th>Estoque</th>
                    <th>Ações</th>

                  </tr>
                </thead>
                <tbody>
                  {lotes.map((lote) => (
                    <tr key={lote.id}>
                      <td>{lote.numeroLote}</td>
                      <td>{lote.dataValidade}</td>
                      <td>{lote.numeroAmpola}</td>
                      <td>{lote.dosesAmpola}</td>
                      <td>{lote.compraId}</td>
                      <td>{lote.nomeVacina}</td>
                      <td>{lote.nomeEstoque}</td>

                      <td>
                        <Stack spacing={1} padding={0} direction="row">
                          <IconButton
                            onClick={() => redirecionarEdicao(lote.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => excluirLote(lote.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                  {lotes.length === 0 && (
                    <tr>
                      <td colSpan="4">Nenhum lote encontrado.</td>
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

export default ListagemLotes;
