// /campeonato-ui/src/pages/Admin/AdminRoundsPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { authApi } from '../../services/api';
import MatchCard from '../../components/MatchCard';
import { toast } from 'react-toastify';

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

const RoundHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid #3c3866;
  flex-wrap: wrap;
  gap: 1rem;
`;

const RoundTitle = styled.h2`
  font-size: 1.8rem;
  color: #D42F8A;
  margin: 0;
`;

const FinalizeButton = styled.button`
  padding: 8px 16px;
  background-color: #28a745;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover:not(:disabled) {
    background-color: #218838;
  }
  
  &:disabled {
    background-color: #5a6268;
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const RoundStatusBadge = styled.span`
  background-color: #00F2EA;
  color: #0B071B;
  padding: 4px 8px;
  border-radius: 4px;
  font-size: 0.9rem;
  font-weight: bold;
`;

const MatchesGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
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
  margin-top: 2.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #3c3866;
`;

const PageButton = styled.button`
  padding: 8px 14px;
  border: 1px solid #3c3866;
  border-radius: 4px;
  background-color: ${props => props.active ? '#00F2EA' : 'transparent'};
  color: ${props => props.active ? '#0B071B' : '#EAEAF2'};
  font-weight: bold;
  cursor: pointer;

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const AdminRoundsPage = () => {
  const [roundsData, setRoundsData] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const ROUNDS_PER_PAGE = 2; // Você pode ajustar este número

  useEffect(() => {
    const fetchRounds = async () => {
      try {
        const response = await authApi.get('/rounds');
        setRoundsData(response.data);
      } catch (error) {
        console.error("Erro ao buscar as rodadas:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchRounds();
  }, []);

  const handleMatchUpdate = (updatedMatch) => {
    const newRoundsData = JSON.parse(JSON.stringify(roundsData));
    const roundKey = String(updatedMatch.round_number);
    const round = newRoundsData[roundKey];

    if (round) {
      const matchIndex = round.findIndex(m => m.id === updatedMatch.id);
      if (matchIndex !== -1) {
        round[matchIndex] = updatedMatch;
        setRoundsData(newRoundsData);
      }
    }
  };

  const handleFinalizeRound = (roundNumber) => {
    toast.success(`Rodada ${roundNumber} marcada como finalizada!`);
  };

  if (isLoading) {
    return <LoadingMessage>Carregando rodadas...</LoadingMessage>;
  }

  const roundKeys = Object.keys(roundsData);

  if (roundKeys.length === 0) {
    return <p>Nenhuma partida gerada. Inicie o campeonato na aba 'Participantes'.</p>;
  }

  // Lógica de paginação
  const totalPages = Math.ceil(roundKeys.length / ROUNDS_PER_PAGE);
  const indexOfLastRound = currentPage * ROUNDS_PER_PAGE;
  const indexOfFirstRound = indexOfLastRound - ROUNDS_PER_PAGE;
  const currentRoundKeys = roundKeys.slice(indexOfFirstRound, indexOfLastRound);

  return (
    <>
      <RoundsContainer>
        {currentRoundKeys.map(roundNumber => {
          const currentRoundMatches = roundsData[roundNumber];
          const isRoundComplete = currentRoundMatches.every(match => match.status === 'FINISHED');

          return (
            <RoundSection key={roundNumber}>
              <RoundHeader>
                <RoundTitle>Rodada {roundNumber}</RoundTitle>
                {isRoundComplete ? (
                  <RoundStatusBadge>Finalizada</RoundStatusBadge>
                ) : (
                  <FinalizeButton 
                    disabled={!isRoundComplete}
                    onClick={() => handleFinalizeRound(roundNumber)}
                  >
                    Finalizar Rodada
                  </FinalizeButton>
                )}
              </RoundHeader>
              <MatchesGrid>
                {currentRoundMatches.map(match => (
                  <MatchCard 
                    key={match.id} 
                    match={match} 
                    onMatchUpdate={handleMatchUpdate} 
                  />
                ))}
              </MatchesGrid>
            </RoundSection>
          );
        })}
      </RoundsContainer>
      
      {totalPages > 1 && (
        <PaginationContainer>
          <PageButton onClick={() => setCurrentPage(c => c - 1)} disabled={currentPage === 1}>
            Anterior
          </PageButton>
          {[...Array(totalPages).keys()].map(num => (
            <PageButton 
              key={num + 1} 
              active={num + 1 === currentPage} 
              onClick={() => setCurrentPage(num + 1)}
            >
              {num + 1}
            </PageButton>
          ))}
          <PageButton onClick={() => setCurrentPage(c => c + 1)} disabled={currentPage === totalPages}>
            Próxima
          </PageButton>
        </PaginationContainer>
      )}
    </>
  );
};

export default AdminRoundsPage;