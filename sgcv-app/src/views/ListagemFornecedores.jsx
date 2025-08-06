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



function ListagemFornecedores() {
  const navigate = useNavigate();
  const [fornecedores, setFornecedores] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
  try {
    const [resFornecedores, resTelefones] = await Promise.all([
      axios.get(`${BASE_URL}/fornecedores`),
      axios.get(`${BASE_URL}/telefones`),
    ]);

    const mapaTelefones = resTelefones.data.reduce((map, telefone) => {
      map[telefone.id] = {
        ddd: telefone.ddd,
        numero: telefone.numero,
      };
      return map;
    }, {});

    const fornecedoresComTelefones = resFornecedores.data.map((fornecedor) => ({
      ...fornecedor,
      telefoneDdd: mapaTelefones[fornecedor.telefoneId]?.ddd || "N/A",
      telefoneNumero: mapaTelefones[fornecedor.telefoneId]?.numero || "N/A",
    }));

    setFornecedores(fornecedoresComTelefones);
  } catch (error) {
    mensagemErro('Erro ao carregar dados dos fornecedores.');
  }
};


  const redirecionarCadastro = () => {
    navigate('/CadastroFornecedor');
  };

  const redirecionarEdicao = (id) => {
    navigate(`/CadastroFornecedor/${id}`);
  };

  const excluirFornecedor = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/fornecedores/${id}`);
      mensagemSucesso('Fornecedor excluído com sucesso!');
      setFornecedores((prev) => prev.filter((fornecedor) => fornecedor.id !== id));
    } catch (error) {
      mensagemErro('Erro ao excluir fornecedor.');
    }
  };

  return (
    <div className="container">
      <Card title="Fornecedores Cadastrados">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning mb-3"
                onClick={redirecionarCadastro}
              >
                Novo Fornecedor
              </button>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Fornecedor</th>
                    <th>E-mail</th>
                    <th>CNPJ</th>
                    <th>Razão Social</th>
                    <th>Telefone</th>
                  </tr>
                </thead>
                <tbody>
                  {fornecedores.map((fornecedor) => (
                    <tr key={fornecedor.id}>
                      <td>{fornecedor.nomeFantasia}</td>
                      <td>{fornecedor.email}</td>
                      <td>{fornecedor.cnpj}</td>
                      <td>{fornecedor.razaoSocial}</td>
                      <td className="no-break">
                        ({fornecedor.telefoneDdd}) {fornecedor.telefoneNumero}
                      </td>
                      <td>
                        <Stack spacing={1} padding={0} direction="row">
                          <IconButton
                            onClick={() => redirecionarEdicao(fornecedor.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton
                            onClick={() => excluirFornecedor(fornecedor.id)}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                  {fornecedores.length === 0 && (
                    <tr>
                      <td colSpan="4">Nenhum fornecedor encontrado.</td>
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

export default ListagemFornecedores;
