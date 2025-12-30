import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './features/layout/Layout';
import AdminDashboard from './features/adminDashboard/pages/AdminDashboard';
import People from './features/people/pages/People';
import PersonDetail from './features/people/pages/PersonDetail';

function App() {
  return (
    <BrowserRouter>
      <Layout>
        <Routes>
          <Route path="/" element={<AdminDashboard />} />
          <Route path="/personas" element={<People />} />
          <Route path="/personas/:id" element={<PersonDetail />} />
          <Route path="/prestamos" element={<div><h1>💰 Préstamos</h1><p>Lista de préstamos próximamente.</p></div>} />
          <Route path="/reportes" element={<div><h1>📊 Reportes</h1><p>Reportes próximamente.</p></div>} />
          <Route path="/configuracion" element={<div><h1>⚙️ Configuración</h1><p>Configuración próximamente.</p></div>} />
        </Routes>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
