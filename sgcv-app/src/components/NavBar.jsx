import React, { useState } from 'react';
import 'bootswatch/dist/minty/bootstrap.css';
import '../custom.css';

function NavBar(props) {
  const [isDropdownOpen1, setDropdownOpen1] = useState(false);
  const [isDropdownOpen2, setDropdownOpen2] = useState(false);
  const [isDropdownOpen3, setDropdownOpen3] = useState(false);
  const [isDropdownOpen4, setDropdownOpen4] = useState(false);
  const [isDropdownOpen5, setDropdownOpen5] = useState(false);
  const [isDropdownOpen6, setDropdownOpen6] = useState(false);
  const [isDropdownOpen7, setDropdownOpen7] = useState(false);
  const [isDropdownOpen8, setDropdownOpen8] = useState(false);
  const [isDropdownOpen9, setDropdownOpen9] = useState(false);

  const role = localStorage.getItem("role"); // ADMIN ou USER

  const closeAllDropdowns = () => {
    setDropdownOpen1(false);
    setDropdownOpen2(false);
    setDropdownOpen3(false);
    setDropdownOpen4(false);
    setDropdownOpen5(false);
    setDropdownOpen6(false);
    setDropdownOpen7(false);
    setDropdownOpen8(false);
    setDropdownOpen9(false);
  };

  const handleMouseEnter = (index) => {
    closeAllDropdowns();
    switch (index) {
      case 1: setDropdownOpen1(true); break;
      case 2: setDropdownOpen2(true); break;
      case 3: setDropdownOpen3(true); break;
      case 4: setDropdownOpen4(true); break;
      case 5: setDropdownOpen5(true); break;
      case 6: setDropdownOpen6(true); break;
      case 7: setDropdownOpen7(true); break;
      case 8: setDropdownOpen8(true); break;
      case 9: setDropdownOpen9(true); break;
      default: break;
    }
  };

  const handleMouseLeave = () => {
    closeAllDropdowns();
  };

  return (
    <div className="navbar navbar-expand-lg fixed-top bg-primary">
      <div className="container-fluid">
        <a href="/" className="navbar-brand">
          <img src="https://cdn-icons-png.flaticon.com/128/6064/6064458.png" alt="" width={20} />
        </a>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarResponsive"
          aria-controls="navbarResponsive"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarResponsive">
          <ul className="navbar-nav">
            <li className="nav-item dropdown" onMouseEnter={() => handleMouseEnter(1)} onMouseLeave={handleMouseLeave}>
              <span className={`nav-link ${isDropdownOpen1 ? "active" : ""}`} id="navbarDropdown1" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded={isDropdownOpen1}>
                Agendamento
              </span>
              <div className={`dropdown-menu ${isDropdownOpen1 ? "show" : ""}`} aria-labelledby="navbarDropdown1">
                <a className="dropdown-item" href="CadastroAgendamento">Cadastrar Agendamento</a>
                <a className="dropdown-item" href="ListagemAgendamento">Listagem dos Agendamentos</a>
              </div>
            </li>

            {role === "ADMIN" && (
              <li className="nav-item dropdown" onMouseEnter={() => handleMouseEnter(2)} onMouseLeave={handleMouseLeave}>
                <span className={`nav-link ${isDropdownOpen2 ? "active" : ""}`} id="navbarDropdown2" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded={isDropdownOpen2}>
                  Usuários
                </span>
                <div className={`dropdown-menu ${isDropdownOpen2 ? "show" : ""}`} aria-labelledby="navbarDropdown2">
                  {role === "ADMIN" && <a className="dropdown-item" href="CadastroUsuario">Cadastrar Usuário</a>}
                  {role === "ADMIN" && <a className="dropdown-item" href="ListagemUsuarios">Listagem de Usuários</a>}
                </div>
              </li>)}

            <li className="nav-item dropdown" onMouseEnter={() => handleMouseEnter(3)} onMouseLeave={handleMouseLeave}>
              <span className={`nav-link ${isDropdownOpen3 ? "active" : ""}`} id="navbarDropdown3" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded={isDropdownOpen3}>
                Vacinações
              </span>
              <div className={`dropdown-menu ${isDropdownOpen3 ? "show" : ""}`} aria-labelledby="navbarDropdown3">
                <a className="dropdown-item" href="CadastroVacinacao">Cadastrar Vacinação</a>
                <a className="dropdown-item" href="ListagemVacinacao">Vacinação do dia</a>
              </div>
            </li>
            <li className="nav-item dropdown" onMouseEnter={() => handleMouseEnter(4)} onMouseLeave={handleMouseLeave}>
              <span className={`nav-link ${isDropdownOpen4 ? "active" : ""}`} id="navbarDropdown4" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded={isDropdownOpen4}>
                Vacinas
              </span>
              <div className={`dropdown-menu ${isDropdownOpen4 ? "show" : ""}`} aria-labelledby="navbarDropdown4">
                {role === "ADMIN" && <a className="dropdown-item" href="CadastroVacina">Cadastrar Vacina</a>}
                {role === "ADMIN" && <a className="dropdown-item" href="ListagemVacinas">Listagem de Vacinas</a>}
                <a className="dropdown-item" href="CadastroTipoVacina">Cadastrar Tipo de vacina</a>
                <a className="dropdown-item" href="ListagemTipoVacinas">Listagem de Tipo de vacina</a>
              </div>
            </li>

            {role === "ADMIN" && (
              <li className="nav-item dropdown" onMouseEnter={() => handleMouseEnter(5)} onMouseLeave={handleMouseLeave}>
                <span className={`nav-link ${isDropdownOpen5 ? "active" : ""}`} id="navbarDropdown5" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded={isDropdownOpen5}>
                  Funcionários
                </span>
                <div className={`dropdown-menu ${isDropdownOpen5 ? "show" : ""}`} aria-labelledby="navbarDropdown5">
                  <a className="dropdown-item" href="CadastroFuncionario">Cadastrar Funcionário</a>
                  <a className="dropdown-item" href="ListagemFuncionarios">Listagem de Funcionários</a>
                  <a className="dropdown-item" href="CadastroCargo">Cadastrar Cargo</a>
                  <a className="dropdown-item" href="ListagemCargos">Listagem de Cargos</a>
                </div>
              </li>)}

            <li className="nav-item dropdown" onMouseEnter={() => handleMouseEnter(7)} onMouseLeave={handleMouseLeave}>
              <span className={`nav-link ${isDropdownOpen7 ? "active" : ""}`} id="navbarDropdown7" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded={isDropdownOpen7}>
                Pacientes
              </span>
              <div className={`dropdown-menu ${isDropdownOpen7 ? "show" : ""}`} aria-labelledby="navbarDropdown7">
                <a className="dropdown-item" href="CadastroPaciente">Cadastrar Paciente</a>
                <a className="dropdown-item" href="ListagemPacientes">Listagem de Pacientes</a>
                <a className="dropdown-item" href="CadastroComorbidade">Cadastrar Comorbidade</a>
                <a className="dropdown-item" href="ListagemComorbidades">Listagem de Comorbidades</a>
              </div>
            </li>

            <li className="nav-item dropdown" onMouseEnter={() => handleMouseEnter(8)} onMouseLeave={handleMouseLeave}>
              <span className={`nav-link ${isDropdownOpen8 ? "active" : ""}`} id="navbarDropdown8" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded={isDropdownOpen8}>
                Compras
              </span>
              <div className={`dropdown-menu ${isDropdownOpen8 ? "show" : ""}`} aria-labelledby="navbarDropdown8">
                {role === "ADMIN" && <a className="dropdown-item" href="CadastroCompra">Cadastrar Compra</a>}
                {role === "ADMIN" && <a className="dropdown-item" href="ListagemCompra">Listagem de Compras</a>}
                <a className="dropdown-item" href="CadastroFornecedor">Cadastrar Fornecedor</a>
                <a className="dropdown-item" href="ListagemFornecedores">Listagem de Fornecedores</a>
                <a className="dropdown-item" href="CadastroFabricante">Cadastrar Fabricante</a>
                <a className="dropdown-item" href="ListagemFabricantes">Listagem de Fabricantes</a>
              </div>
            </li>

            <li className="nav-item dropdown" onMouseEnter={() => handleMouseEnter(9)} onMouseLeave={handleMouseLeave}>
              <span className={`nav-link ${isDropdownOpen9 ? "active" : ""}`} id="navbarDropdown9" role="button" data-bs-toggle="dropdown" aria-haspopup="true" aria-expanded={isDropdownOpen9}>
                Estoques
              </span>
              <div className={`dropdown-menu ${isDropdownOpen9 ? "show" : ""}`} aria-labelledby="navbarDropdown9">
                <a className="dropdown-item" href="CadastroEstoque">Cadastrar Estoque</a>
                <a className="dropdown-item" href="ListagemEstoques">Listagem de Estoques</a>
                <a className="dropdown-item" href="CadastroLote">Cadastrar Lote</a>
                <a className="dropdown-item" href="ListagemLotes">Listagem de Lotes</a>
                <a className="dropdown-item" href="CadastroDescarte">Cadastrar Descarte</a>
                <a className="dropdown-item" href="ListagemDescarte">Listagem de Descartes</a>
              </div>
            </li>

            <li className="nav-item">
              <span
                className="nav-link"
                role="button"
                onClick={() => {
                  localStorage.clear(); 
                  window.location.href = "/Login"; 
                }}
              >
                Sair
              </span>
            </li>


          </ul>
        </div>
      </div>
    </div>
  );
}

export default NavBar;
