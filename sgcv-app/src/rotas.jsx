import React from "react";
import Login from "./views/Login";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LoadingOverlay from "./LoadingOverlay";
import RotaPrivada from "./views/RotaPrivada";

// CADASTRO
import CadastroPaciente from "./views/CadastroPaciente";
import CadastroFabricante from "./views/CadastroFabricante";
import CadastroEspecialidade from "./views/CadastroEspecialidade";
import CadastroPerfilAcesso from "./views/CadastroPerfilAcesso";
import CadastroFuncionario from "./views/CadastroFuncionario";
import CadastroTipoVacina from "./views/CadastroTipoVacina";
import CadastroVacina from "./views/CadastroVacina";
import CadastroVacinacao from "./views/CadastroVacinacao";
import CadastroCompra from "./views/CadastroCompra";
import CadastroDescarte from "./views/CadastroDescarte";
import CadastroUsuario from "./views/CadastroUsuario";
import CadastroCargo from "./views/CadastroCargo";
import CadastroAgendamento from "./views/CadastroAgendamento";
import CadastroEstoque from "./views/CadastroEstoque";
import CadastroLote from "./views/CadastroLote";
import CadastroFornecedor from "./views/CadastroFornecedor";
import CadastroComorbidade from "./views/CadastroComorbidade";

// LISTAGEM
import ListagemPacientes from "./views/ListagemPacientes";
import ListagemFabricantes from "./views/ListagemFabricantes";
import ListagemFuncionarios from "./views/ListagemFuncionarios";
import ListagemVacinas from "./views/ListagemVacinas";
import ListagemVacinacao from "./views/ListagemVacinacao";
import ListagemCompra from "./views/ListagemCompra";
import ListagemDescarte from "./views/ListagemDescarte";
import ListagemUsuarios from "./views/ListagemUsuario";
import ListagemCargos from "./views/ListagemCargos";
import ListagemAgendamento from "./views/ListagemAgendamento";
import ListagemEstoques from "./views/ListagemEstoques";
import ListagemLotes from "./views/ListagemLotes";
import ListagemFornecedores from "./views/ListagemFornecedores";
import ListagemTiposVacinas from "./views/ListagemTiposVacinas";
import ListagemComorbidades from "./views/ListagemComorbidades";

function Rotas() {
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <LoadingOverlay loading={loading} />}

      <Routes>
        <Route path="/" element={<Navigate to="/Login" />} />
        <Route path="/Login" element={<Login />} />

        {/* ROTAS DE CADASTRO */}
        <Route path="/CadastroPaciente" element={<CadastroPaciente />} />
        <Route
          path="/CadastroPaciente/:idParam"
          element={<CadastroPaciente />}
        />

        <Route path="/CadastroFabricante" element={<CadastroFabricante />} />
        <Route
          path="/CadastroFabricante/:idParam"
          element={<CadastroFabricante />}
        />

        <Route
          path="/CadastroEspecialidade"
          element={<CadastroEspecialidade />}
        />
        <Route
          path="/CadastroEspecialidade/:idParam"
          element={<CadastroEspecialidade />}
        />

        <Route path="/CadastroCargo" element={<CadastroCargo />} />
        <Route path="/CadastroCargo/:idParam" element={<CadastroCargo />} />

        <Route
          path="/CadastroPerfilAcesso"
          element={<CadastroPerfilAcesso />}
        />
        <Route
          path="/CadastroPerfilAcesso/:idParam"
          element={<CadastroPerfilAcesso />}
        />

        <Route path="/CadastroFuncionario" element={<CadastroFuncionario />} />
        <Route
          path="/CadastroFuncionario/:idParam"
          element={<CadastroFuncionario />}
        />

        <Route path="/CadastroTipoVacina" element={<CadastroTipoVacina />} />
        <Route
          path="/CadastroTipoVacina/:idParam"
          element={<CadastroTipoVacina />}
        />

        <Route path="/CadastroVacina" element={<CadastroVacina />} />
        <Route path="/CadastroVacina/:idParam" element={<CadastroVacina />} />

        <Route path="/CadastroVacinacao" element={<CadastroVacinacao />} />
        <Route
          path="/CadastroVacinacao/:idParam"
          element={<CadastroVacinacao />}
        />

        <Route path="/CadastroCompra" element={<CadastroCompra />} />
        <Route path="/CadastroCompra/:idParam" element={<CadastroCompra />} />

        <Route path="/CadastroDescarte" element={<CadastroDescarte />} />
        <Route
          path="/CadastroDescarte/:idParam"
          element={<CadastroDescarte />}
        />

        <Route path="/CadastroUsuario" element={<CadastroUsuario />} />
        <Route path="/CadastroUsuario/:idParam" element={<CadastroUsuario />} />

        <Route path="/CadastroAgendamento" element={<CadastroAgendamento />} />
        <Route
          path="/CadastroAgendamento/:idParam"
          element={<CadastroAgendamento />}
        />

        <Route path="/CadastroEstoque" element={<CadastroEstoque />} />
        <Route path="/CadastroEstoque/:idParam" element={<CadastroEstoque />} />

        <Route path="/CadastroLote" element={<CadastroLote />} />
        <Route path="/CadastroLote/:idParam" element={<CadastroLote />} />

        <Route path="/CadastroFornecedor" element={<CadastroFornecedor />} />
        <Route
          path="/CadastroFornecedor/:idParam"
          element={<CadastroFornecedor />}
        />

        <Route path="/CadastroComorbidade" element={<CadastroComorbidade />} />
        <Route
          path="/CadastroComorbidade/:idParam"
          element={<CadastroComorbidade />}
        />

        {/* ROTAS DE LISTAGEM */}
        <Route path="/ListagemPacientes" element={<ListagemPacientes />} />
        <Route path="/ListagemFabricantes" element={<ListagemFabricantes />} />
        <Route
          path="/ListagemFuncionarios"
          element={<ListagemFuncionarios />}
        />
        <Route path="/ListagemVacinas" element={<ListagemVacinas />} />
        <Route path="/ListagemVacinacao" element={<ListagemVacinacao />} />
        <Route path="/ListagemCompra" element={<ListagemCompra />} />
        <Route path="/ListagemDescarte" element={<ListagemDescarte />} />
        <Route path="/ListagemUsuarios" element={<ListagemUsuarios />} />
        <Route path="/ListagemCargos" element={<ListagemCargos />} />
        <Route path="/ListagemAgendamento" element={<ListagemAgendamento />} />
        <Route path="/ListagemEstoques" element={<ListagemEstoques />} />
        <Route path="/ListagemLotes" element={<ListagemLotes />} />
        <Route
          path="/ListagemFornecedores"
          element={<ListagemFornecedores />}
        />
        <Route
          path="/ListagemTiposVacinas"
          element={<ListagemTiposVacinas />}
        />
        <Route
          path="/ListagemComorbidades"
          element={<ListagemComorbidades />}
        />
        {/* REDIRECIONAMENTO */}
      </Routes>
    </>
  );
}

export default Rotas;
