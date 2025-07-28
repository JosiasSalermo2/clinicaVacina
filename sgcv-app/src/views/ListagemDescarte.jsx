import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../components/Card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';
import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import axios from 'axios';
import { BASE_URL } from '../config/axios';


function ListagemDescarte() {
  const navigate = useNavigate();
  const [descartes, setDescartes] = useState([]);

  useEffect(() => {
      carregarDescartes();
    }, []);

  const carregarDescartes = async () => {
    try {
      const [resDescartes, resEstoques] = await Promise.all([
        axios.get(`${BASE_URL}/descartes`),
        axios.get(`${BASE_URL}/estoques`),
      ]);
    
    const mapaDescartes = resDescartes.data.reduce((map, descarte) => {
      map[descarte.id] = descarte.id;
      return map;
    }, {});

    const mapaEstoques = resEstoques.data.reduce((map, estoque) => {
      map[estoque.id] = estoque.nome;
      return map;
    }, {});

    const descartesComNomes = resDescartes.data.map((descarte) => ({
          ...descarte,
          nomeEstoque: descarte.estoqueId ? mapaEstoques[descarte.estoqueId] : "Não encontrado",
        }));
    
        setDescartes(descartesComNomes);
      } catch (error) {
        mensagemErro('Erro ao carregar dados dos descartes ou estoques.');
      }
  };

  const redirecionarCadastro = () => {
    navigate('/CadastroDescarte');
  };

  const redirecionarEdicao = (id) => {
    navigate(`/CadastroDescarte/${id}`);
  };

  const excluirDescarte = async (id) => {
  if (!window.confirm("Tem certeza que deseja excluir este descarte?")) return;

  try {
    await axios.delete(`${BASE_URL}/descartes/${id}`);
    mensagemSucesso('Descarte excluído com sucesso!');
    setDescartes((prev) => prev.filter((descarte) => descarte.id !== id));
  } catch (error) {
    console.error("Erro ao excluir descarte:", error);
    mensagemErro(error?.response?.data?.message || 'Erro ao excluir descarte.');
  }
};

  return (
    <div className="container">
      <Card title="Descartes Cadastrados">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning"
                onClick={redirecionarCadastro}
              >
                Novo Descarte
              </button>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Para descarte:</th>
                    <th>Quantidade disponível</th>
                    <th>Quantidade a ser descartada</th>                   
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {descartes.map((descarte) => (
                    <tr key={descarte.id}> 
                    <td>{descarte.nome}</td>
                    <td>{descarte.quantidadeDisponivel}</td>                       
                      <td>{descarte.quantidadeDescartes}</td>                                        
                      <td>
                        <Stack spacing={1} padding={0} direction="row">
                          <IconButton onClick={() => redirecionarEdicao(descarte.id)}>
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => excluirDescarte(descarte.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                  {descartes.length === 0 && (
                    <tr>
                      <td colSpan="5">Nenhum descarte cadastrado.</td>
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

export default ListagemDescarte;
