// src/components/layout/AdminLayout.jsx
import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import styled from 'styled-components';

const AdminContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const AdminHeader = styled.header`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid #3c3866;
`;

const Tabs = styled.nav`
  display: flex;
  gap: 1.5rem;
`;

const TabLink = styled(NavLink)`
  font-family: 'Orbitron', sans-serif;
  color: #6A6A8B;
  text-decoration: none;
  font-size: 1.2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid transparent;
  transition: color 0.3s, border-color 0.3s;

  &.active, &:hover {
    color: #00F2EA;
    border-bottom-color: #00F2EA;
  }
`;

const LogoutButton = styled.button`
  /* Reutilize o estilo do botão de login se desejar, ou crie um novo */
  padding: 8px 16px;
  background-color: #D42F8A;
  border: none;
  border-radius: 4px;
  color: #fff;
  cursor: pointer;
  font-weight: bold;
`;

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('accessToken');
    navigate('/login');
  };

  return (
    <AdminContainer>
      <AdminHeader>
        <Tabs>
          <TabLink to="/admin/dashboard">Participantes</TabLink>
          <TabLink to="/admin/rodadas">Rodadas</TabLink>
          <TabLink to="/admin/settings">Configurações</TabLink> 
        </Tabs>
        <LogoutButton onClick={handleLogout}>Sair</LogoutButton>
      </AdminHeader>
      <main>
        {/* O conteúdo da aba ativa será renderizado aqui */}
        <Outlet />
      </main>
    </AdminContainer>
  );
};

export default AdminLayout;