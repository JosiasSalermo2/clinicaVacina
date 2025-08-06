import React, { useEffect, useState } from 'react';
import Card from '../components/Card';
import { mensagemSucesso, mensagemErro } from '../components/toastr';

import '../custom.css'

import { useNavigate } from 'react-router-dom';

import Stack from '@mui/material/Stack';
import { IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';

import axios from 'axios';
import { BASE_URL } from '../config/axios';


function ListagemFabricantes() {
  const navigate = useNavigate();
  const [fabricantes, setFabricantes] = useState([]);

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [resFabricantes, resTelefones, resEnderecos] = await Promise.all([
        axios.get(`${BASE_URL}/fabricantes`),
        axios.get(`${BASE_URL}/telefones`),
        axios.get(`${BASE_URL}/enderecos`),
      ]);

      const mapaTelefones = resTelefones.data.reduce((map, telefone) => {
        map[telefone.id] = {
          ddd: telefone.ddd,
          numero: telefone.numero,
        };
        return map;
      }, {});

      const mapaEnderecos = resEnderecos.data.reduce((map, endereco) => {
        map[endereco.id] = {
          logradouro: endereco.logradouro,
          numero: endereco.numero,
          complemento: endereco.complemento,
          bairro: endereco.bairro,
          cidade: endereco.cidade,
          uf: endereco.uf,
          cep: endereco.cep
        };
        return map;
      }, {});

      const fabricantesComDados = resFabricantes.data.map((fabricante) => ({
        ...fabricante,
        telefoneDdd: mapaTelefones[fabricante.telefoneId]?.ddd || "N/A",
        telefoneNumero: mapaTelefones[fabricante.telefoneId]?.numero || "N/A",
        enderecoLogradouro: mapaEnderecos[fabricante.enderecoId]?.logradouro || "N/A",
        enderecoNumero: mapaEnderecos[fabricante.enderecoId]?.numero || "N/A",
        enderecoComplemento: mapaEnderecos[fabricante.enderecoId]?.complemento || "",
        enderecoBairro: mapaEnderecos[fabricante.enderecoId]?.bairro || "N/A",
        enderecoCidade: mapaEnderecos[fabricante.enderecoId]?.cidade || "N/A",
        enderecoUf: mapaEnderecos[fabricante.enderecoId]?.uf || "N/A",
        enderecoCep: mapaEnderecos[fabricante.enderecoId]?.cep || "N/A",
      }));

      setFabricantes(fabricantesComDados);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
      mensagemErro('Erro ao carregar dados dos fabricantes.');
    }
  };

  const redirecionarCadastro = () => {
    navigate('/CadastroFabricante');
  };

  const redirecionarEdicao = (id) => {
    navigate(`/CadastroFabricante/${id}`);
  };

  const excluirFabricante = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/fabricantes/${id}`);
      mensagemSucesso('Fabricante excluído com sucesso!');
      setFabricantes((prev) => prev.filter((fabricante) => fabricante.id !== id));
    } catch (error) {
      mensagemErro('Erro ao excluir fabricante.');
    }
  };

  return (
    <div className="container">
      <Card title="Fabricantes Cadastrados">
        <div className="row">
          <div className="col-lg-12">
            <div className="bs-component">
              <button
                type="button"
                className="btn btn-warning mb-3"
                onClick={redirecionarCadastro}
              >
                Novo Fabricante
              </button>
              <table className="table table-hover">
                <thead>
                  <tr>
                    <th>Fabricante</th>
                    <th>E-mail</th>
                    <th>CNPJ</th>
                    <th>Razão Social</th>
                    <th>Telefone</th>
                    <th>Endereço</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {fabricantes.map((fabricante) => (
                    <tr key={fabricante.id}>
                      <td>{fabricante.nomeFantasia}</td>
                      <td>{fabricante.email}</td>
                      <td>{fabricante.cnpj}</td>
                      <td>{fabricante.razaoSocial}</td>
                      <td className="no-break">
                        ({fabricante.telefoneDdd}) {fabricante.telefoneNumero}
                      </td>
                      <td>
                        {fabricante.enderecoLogradouro}, {fabricante.enderecoNumero}
                        {fabricante.enderecoComplemento && `, ${fabricante.enderecoComplemento}`}<br />
                        {fabricante.enderecoBairro} - {fabricante.enderecoCidade}/{fabricante.enderecoUf}<br />
                        CEP: {fabricante.enderecoCep}
                      </td>

                      <td>
                        <Stack spacing={1} padding={0} direction="row">
                          <IconButton
                            onClick={() => redirecionarEdicao(fabricante.id)}
                          >
                            <EditIcon />
                          </IconButton>
                          <IconButton onClick={() => excluirFabricante(fabricante.id)}>
                            <DeleteIcon />
                          </IconButton>
                        </Stack>
                      </td>
                    </tr>
                  ))}
                  {fabricantes.length === 0 && (
                    <tr>
                      <td colSpan="4">Nenhum fabricante encontrado.</td>
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

export default ListagemFabricantes;