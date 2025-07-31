// /campeonato-ui/src/components/MatchCard.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { authApi } from '../services/api';
import { toast } from 'react-toastify';
import { showConfirmation } from '../utils/toastUtils.jsx';

const Card = styled.div`
  background-color: #1D193B;
  border-radius: 6px;
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-left: 4px solid ${props => props.isFinished ? '#5a6268' : '#00F2EA'};
  transition: border-left 0.3s ease-in-out;
`;

const VersusContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-weight: bold;
  font-size: 1.1rem;
`;

const PlayerContainer = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  
  &:first-child { justify-content: flex-end; }
  &:last-child { justify-content: flex-start; }
`;

const PlayerName = styled.span`
  text-align: center;
`;

const VersusText = styled.span`
  color: #D42F8A;
  font-family: 'Orbitron', sans-serif;
  font-size: 0.9em;
  margin: 0 0.5rem;
`;

const WoButton = styled.button`
  background-color: #7a3a00;
  color: #fff;
  border: none;
  border-radius: 3px;
  padding: 2px 6px;
  font-size: 0.7rem;
  font-weight: bold;
  cursor: pointer;
  
  &:hover:not(:disabled) { background-color: #ad5200; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;

const ScoreInputContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
`;

const ScoreInput = styled.input`
  width: 60px;
  padding: 8px;
  background-color: #0B071B;
  border: 1px solid #3c3866;
  border-radius: 4px;
  color: #EAEAF2;
  text-align: center;
  font-size: 1.2rem;
  font-weight: bold;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  -moz-appearance: textfield;
  &:disabled {
    opacity: 0.6;
    cursor: not-allowed;
    background-color: #2a2650;
  }
`;

const SaveButton = styled.button`
  padding: 8px 12px;
  margin-left: 0.5rem;
  background-color: #00F2EA;
  border: none;
  border-radius: 4px;
  color: #0B071B;
  font-weight: bold;
  cursor: pointer;
  transition: background-color 0.2s;
  &:hover:not(:disabled) { background-color: #8afff7; }
  &:disabled { background-color: #5a6268; cursor: not-allowed; }
`;

const DoubleWoButton = styled.button`
  width: 100%;
  padding: 8px;
  margin-top: 8px;
  background-color: #c82333;
  color: white;
  border: none;
  border-radius: 4px;
  font-weight: bold;
  cursor: pointer;
  &:hover:not(:disabled) { background-color: #a71d2a; }
  &:disabled { opacity: 0.5; cursor: not-allowed; }
`;


const MatchCard = ({ match, onMatchUpdate }) => {
  const isFinished = match.status === 'FINISHED';
  const [score1, setScore1] = useState(match.score1 ?? '');
  const [score2, setScore2] = useState(match.score2 ?? '');
  
  const handleSaveScore = async () => {
    if (score1 === '' || score2 === '') {
      toast.warn('Por favor, preencha ambos os placares.');
      return;
    }
    try {
      const response = await authApi.put(`/matches/${match.id}`, {
        score1: Number(score1),
        score2: Number(score2)
      });
      onMatchUpdate(response.data);
      toast.success("Placar salvo com sucesso!");
    } catch (error) {
      toast.error(error.response?.data?.msg || 'Não foi possível salvar o resultado.');
    }
  };

  const handleWalkover = (absentParticipantId) => {
    const confirmAction = async () => {
      try {
        const response = await authApi.post(`/matches/${match.id}/wo`, { absent_participant_id: absentParticipantId });
        onMatchUpdate(response.data);
        toast.success("W.O. aplicado com sucesso!");
      } catch (error) {
        toast.error(error.response?.data?.msg || 'Não foi possível marcar o W.O.');
      }
    };
    showConfirmation("Confirmar W.O.? O resultado será 3x0 e a partida será finalizada.", confirmAction);
  };

  const handleDoubleWalkover = () => {
    const confirmAction = async () => {
      try {
        const response = await authApi.post(`/matches/${match.id}/wo`, { absent_participant_id: 'double' });
        onMatchUpdate(response.data);
        toast.success("W.O. Duplo aplicado com sucesso!");
      } catch (error) {
        toast.error(error.response?.data?.msg || 'Não foi possível marcar o W.O. Duplo.');
      }
    };
    showConfirmation("Confirmar W.O. Duplo? Nenhum jogador pontuará.", confirmAction);
  };

  return (
    <Card isFinished={isFinished}>
      <VersusContainer>
        <PlayerContainer>
          {!isFinished && <WoButton onClick={() => handleWalkover(match.participant1.id)} disabled={isFinished}>W.O.</WoButton>}
          <PlayerName>{match.participant1?.name || 'BYE'}</PlayerName>
        </PlayerContainer>
        <VersusText>VS</VersusText>
        <PlayerContainer>
          <PlayerName>{match.participant2?.name || 'BYE'}</PlayerName>
          {!isFinished && <WoButton onClick={() => handleWalkover(match.participant2.id)} disabled={isFinished}>W.O.</WoButton>}
        </PlayerContainer>
      </VersusContainer>
      
      <ScoreInputContainer>
        <ScoreInput 
          type="number" 
          value={score1}
          onChange={(e) => setScore1(e.target.value)}
          disabled={isFinished}
        />
        <ScoreInput 
          type="number" 
          value={score2}
          onChange={(e) => setScore2(e.target.value)}
          disabled={isFinished}
        />
        <SaveButton onClick={handleSaveScore} disabled={isFinished}>
          Salvar
        </SaveButton>
      </ScoreInputContainer>

      {!isFinished && (
        <DoubleWoButton onClick={handleDoubleWalkover} disabled={isFinished}>
          W.O. Duplo
        </DoubleWoButton>
      )}
    </Card>
  );
};

export default MatchCard;