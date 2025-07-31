// /campeonato-ui/src/pages/Public/RoundsPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { Link } from 'react-router-dom';
import api from '../../services/api';
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

const PaginationContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;
`;

const PageButton = styled.button`
  padding: 8px 14px;
  border: 1px solid #3c3866;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  
  /* Estilo para rodada finalizada */
  background-color: ${props => props.$isFinished ? '#343a40' : (props.active ? '#00F2EA' : 'transparent')};
  color: ${props => props.$isFinished ? '#aaa' : (props.active ? '#0B071B' : '#EAEAF2')};
  border-color: ${props => props.$isFinished ? '#555' : '#3c3866'};

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const RoundsPage = () => {
  const [roundsData, setRoundsData] = useState({});
  const [activeRound, setActiveRound] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const response = await api.get('/rounds');
        setRoundsData(response.data.rounds);
        setActiveRound(response.data.currentRound);
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
  const currentRoundMatches = activeRound ? roundsData[activeRound] : [];

  if (roundKeys.length === 0) {
    return (
      <PageContainer>
        <Header><h1>Rodadas do Campeonato</h1><NavLink to="/">Ver Tabela de Classificação</NavLink></Header>
        <p style={{textAlign: 'center'}}>Nenhuma partida encontrada. O campeonato ainda não foi iniciado.</p>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <Header>
        <h1>Rodadas do Campeonato</h1>
        <NavLink to="/">Ver Tabela de Classificação</NavLink>
      </Header>

      <PaginationContainer>
        {roundKeys.map(roundNumber => {
          const isFinished = roundsData[roundNumber].every(match => match.status === 'FINISHED');
          return (
            <PageButton 
              key={roundNumber}
              active={parseInt(roundNumber) === activeRound}
              $isFinished={isFinished}
              onClick={() => setActiveRound(parseInt(roundNumber))}
            >
              {roundNumber}
            </PageButton>
          )
        })}
      </PaginationContainer>

      {activeRound && (
        <RoundSection>
          <RoundTitle>Rodada {activeRound}</RoundTitle>
          <MatchesContainer>
            {currentRoundMatches.map(match => (
              <PublicMatchCard key={match.id} match={match} />
            ))}
          </MatchesContainer>
        </RoundSection>
      )}
    </PageContainer>
  );
};

export default RoundsPage;