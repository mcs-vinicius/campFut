// /campeonato-ui/src/pages/Public/RankingPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import api from '../../services/api';
import RankingTable from '../../components/RankingTable';

const PageContainer = styled.div`
  max-width: 1200px;
  margin: 0 auto;
  padding: 2rem;
`;

const Header = styled.header`
  text-align: center;
  margin-bottom: 2.5rem;
  
  h1 {
    font-size: 3rem;
    text-shadow: 0 0 10px #00F2EA;
    margin-bottom: 1rem;
  }
`;

const NavLink = styled(Link)`
  display: inline-block;
  padding: 10px 20px;
  background-color: #1D193B;
  border: 1px solid #00F2EA;
  border-radius: 4px;
  color: #00F2EA;
  text-decoration: none;
  font-family: 'Orbitron', sans-serif;
  font-weight: bold;
  transition: all 0.3s ease;

  &:hover {
    background-color: #00F2EA;
    color: #0B071B;
    box-shadow: 0 0 15px #00F2EA;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #00F2EA;
`;

const ErrorMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #D42F8A;
`;

const RankingPage = () => {
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchRanking = async () => {
      try {
        const response = await api.get('/ranking');
        setRanking(response.data);
      } catch (err) {
        console.error("Erro ao buscar ranking:", err);
        setError('Não foi possível carregar o ranking. Verifique se a API (backend) está rodando.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingMessage>Carregando ranking...</LoadingMessage>;
    }
    if (error) {
      return <ErrorMessage>{error}</ErrorMessage>;
    }
    return <RankingTable participants={ranking} />;
  };

  return (
    <PageContainer>
      <Header>
        <h1>Tabela de Classificação</h1>
        <NavLink to="/rodadas">Ver Rodadas do Campeonato</NavLink>
      </Header>
      <main>
        {renderContent()}
      </main>
    </PageContainer>
  );
};

export default RankingPage;