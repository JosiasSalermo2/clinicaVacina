import React from 'react';
import 'bootswatch/dist/flatly/bootstrap.css';
import 'toastr/build/toastr.min';
import 'toastr/build/toastr.css';

import { useLocation } from 'react-router-dom';

import NavBar from './components/NavBar.jsx';
import Rotas from './rotas.jsx';

function App() {
  const location = useLocation();
  const esconderNavBar = location.pathname === '/Login';

  return (
    <div className='container'>
      {!esconderNavBar && <NavBar />}
      <Rotas />
    </div>
  );
}

export default App;
