// /campeonato-ui/src/components/PublicMatchCard.jsx

import React from 'react';
import styled from 'styled-components';

const Card = styled.div`
  background-color: #1D193BCC;
  backdrop-filter: blur(5px);
  padding: 1.25rem;
  border-radius: 6px;
  border-left: 4px solid ${props => props.isFinished ? '#5a6268' : '#00F2EA'};
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
`;

const Score = styled.span`
  font-family: 'Orbitron', sans-serif;
  font-size: 1.8rem;
  color: #EAEAF2;
  margin: 0 1.5rem;
`;

const PlayerName = styled.span`
  font-size: 1.1rem;
  font-weight: bold;
  flex: 1;
`;

const VersusText = styled(Score)`
  font-size: 1.2rem;
  color: #D42F8A;
`;

const PublicMatchCard = ({ match }) => {
  const isFinished = match.status === 'FINISHED';

  return (
    <Card isFinished={isFinished}>
      <PlayerName style={{ textAlign: 'right' }}>{match.participant1?.name || 'BYE'}</PlayerName>
      {isFinished ? (
        <Score>{match.score1} x {match.score2}</Score>
      ) : (
        <VersusText>VS</VersusText>
      )}
      <PlayerName style={{ textAlign: 'left' }}>{match.participant2?.name || 'BYE'}</PlayerName>
    </Card>
  );
};

export default PublicMatchCard;