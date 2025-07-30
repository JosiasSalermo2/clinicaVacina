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



function ListagemEstoques() {
  const navigate = useNavigate();
  const [estoques, setEstoques] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
  try {
    const [resEstoque, resFabricantes] = await Promise.all([
      axios.get(`${BASE_URL}/estoques`),
      axios.get(`${BASE_URL}/fabricantes`),
    ]);

    const mapaFabricantes = resFabricantes.data.reduce((map, fabricante) => {
      map[fabricante.id] = fabricante.nomeFantasia;
      return map;
    }, {});

    const estoquesComNomes = resEstoque.data.map((estoque) => ({
      ...estoque,
      nomeFabricante: estoque.fabricanteId ? mapaFabricantes[estoque.fabricanteId] : "Não encontrado",
    }));

    setEstoques(estoquesComNomes);
  } catch (error) {
    mensagemErro('Erro ao carregar dados dos estoques ou fabricantes.');
  }
};


  const redirecionarCadastro = () => {
    navigate('/CadastroEstoque');
  };

  const redirecionarEdicao = (id) => {
    navigate(`/CadastroEstoque/${id}`);
  };

  const excluirEstoque = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/estoques/${id}`);
      mensagemSucesso('Estoque excluído com sucesso!');
      setEstoques((prev) => prev.filter((estoque) => estoque.id !== id));
    } catch (error) {
      mensagemErro('Erro ao excluir estoque.');
    }
  };

  return (
    <div className="container">
      <Card title="Estoques Cadastrados">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning mb-3"
                onClick={redirecionarCadastro}
              >
                Novo Estoque
              </button>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Estoque</th>
                    <th>Quantidade disponível</th>
                    <th>Quantidade mínima</th>
                    <th>Quantidade máxima</th>
                    <th>Ponto de Ressuprimento</th>
                    <th>Fabricante</th>
                    <th>Ações</th>

                  </tr>
                </thead>
                <tbody>
                  {estoques.map((estoque) => (
                    <tr key={estoque.id}>
                      <td>{estoque.nome}</td>
                      <td>{estoque.quantidadeDisponivel}</td>
                      <td>{estoque.quantidadeMinima}</td>
                      <td>{estoque.quantidadeMaxima}</td>
                      <td>{estoque.pontoRessuprimento}</td>
                      <td>{estoque.nomeFabricante}</td>

                      <td>
                        <Stack spacing={1} padding={0} direction="row">
                          <IconButton
                            onClick={() => redirecionarEdicao(estoque.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => excluirEstoque(estoque.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                  {estoques.length === 0 && (
                    <tr>
                      <td colSpan="7">Nenhum estoque encontrado.</td>
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

export default ListagemEstoques;
