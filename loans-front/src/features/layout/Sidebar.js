import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  const location = useLocation();

  const menuItems = [
    { path: '/', label: '🏠 Dashboard', icon: '🏠' },
    { path: '/personas', label: '👥 Personas', icon: '👥' },
    { path: '/prestamos', label: '💰 Préstamos', icon: '💰' },
    { path: '/reportes', label: '📊 Reportes', icon: '📊' },
    { path: '/configuracion', label: '⚙️ Configuración', icon: '⚙️' },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <h2>Sistema de Préstamos</h2>
      </div>
      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="icon">{item.icon}</span>
            <span className="label">{item.label.split(' ')[1]}</span>
          </Link>
        ))}
      </nav>
    </div>
  );
};

export default Sidebar;