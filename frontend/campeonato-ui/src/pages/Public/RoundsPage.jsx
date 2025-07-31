// /campeonato-ui/src/pages/Public/RoundsPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import api from '../../services/api'; // Usamos a API pública
import PublicMatchCard from '../../components/PublicMatchCard';

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

const RoundsContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
`;

const RoundSection = styled.section`
  background-color: #1D193B55;
  padding: 1.5rem;
  border-radius: 8px;
`;

const RoundTitle = styled.h2`
  font-size: 1.8rem;
  color: #D42F8A;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3c3866;
`;

const MatchesContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #00F2EA;
`;

const RoundsPage = () => {
  const [roundsData, setRoundsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const response = await api.get('/rounds');
        setRoundsData(response.data);
      } catch (error) {
        console.error("Erro ao buscar as rodadas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRounds();
  }, []);

  if (isLoading) {
    return <LoadingMessage>Carregando rodadas...</LoadingMessage>;
  }

  const roundKeys = Object.keys(roundsData);

  if (roundKeys.length === 0) {
    return <p>Nenhuma partida encontrada. O campeonato ainda não foi iniciado.</p>;
  }

  return (
    <PageContainer>
      <Header>
        <h1>Rodadas do Campeonato</h1>
      </Header>
      <RoundsContainer>
        {roundKeys.map(roundNumber => (
          <RoundSection key={roundNumber}>
            <RoundTitle>Rodada {roundNumber}</RoundTitle>
            <MatchesContainer>
              {roundsData[roundNumber].map(match => (
                <PublicMatchCard key={match.id} match={match} />
              ))}
            </MatchesContainer>
          </RoundSection>
        ))}
      </RoundsContainer>
    </PageContainer>
  );
};

export default RoundsPage;