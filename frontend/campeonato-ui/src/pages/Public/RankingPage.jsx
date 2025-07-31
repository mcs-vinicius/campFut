// src/pages/RankingPage.jsx
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api'; // Nosso conector da API
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
  color: #D42F8A; /* Cor neon de erro/alerta */
`;


const RankingPage = () => {
  // Estados do componente
  const [ranking, setRanking] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect para buscar os dados da API quando o componente for montado
  useEffect(() => {
    const fetchRanking = async () => {
      try {
        // Faz a chamada GET para o endpoint /ranking do nosso backend
        const response = await api.get('/ranking');
        setRanking(response.data); // Armazena os dados no estado
      } catch (err) {
        console.error("Erro ao buscar ranking:", err);
        setError('Não foi possível carregar o ranking. Verifique se a API (backend) está rodando.');
      } finally {
        // Independentemente de sucesso ou falha, para de carregar
        setIsLoading(false);
      }
    };

    fetchRanking();
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // Renderização condicional
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
      </Header>
      <main>
        {renderContent()}
      </main>
    </PageContainer>
  );
};

export default RankingPage;