// src/components/RankingTable.jsx
import React from 'react';
import styled from 'styled-components';
import { FaTrophy } from 'react-icons/fa'; // Ícone de troféu

// --- Estilização do componente ---
const TableWrapper = styled.div`
  background-color: #1D193BCC; /* Fundo do card com transparência */
  border: 1px solid #D42F8A;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(212, 47, 138, 0.4);
  backdrop-filter: blur(5px);
  overflow-x: auto; /* Para rolagem em telas pequenas */
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  color: #EAEAF2;
  font-family: 'Exo 2', sans-serif;

  th, td {
    padding: 14px 18px;
    text-align: center;
    white-space: nowrap;
  }

  thead {
    background-color: #0B071B99;
    color: #00F2EA;
    font-family: 'Orbitron', sans-serif;
    text-transform: uppercase;
    font-size: 0.9em;
    letter-spacing: 1px;
  }

  tbody tr {
    border-bottom: 1px solid #3c3866;
    transition: background-color 0.2s ease-in-out;
    &:last-child {
      border-bottom: none;
    }
    &:hover {
      background-color: #2a2650;
    }
  }

  .pos {
    font-weight: bold;
    font-size: 1.1em;
    color: #00F2EA;
  }
  
  .player-name {
    text-align: left;
    font-weight: bold;
  }

  .first-place {
    color: #FFD700; /* Cor de ouro para o primeiro lugar */
  }
`;

// --- Componente React ---
const RankingTable = ({ participants }) => {
  if (!participants || participants.length === 0) {
    return <p>Nenhum participante no ranking ainda.</p>;
  }

  return (
    <TableWrapper>
      <Table>
        <thead>
          <tr>
            <th>Pos</th>
            <th style={{ textAlign: 'left' }}>Nome</th>
            <th>PTs</th>
            <th>J</th>
            <th>V</th>
            <th>E</th>
            <th>D</th>
            <th>SG</th>
            <th>PTC</th>
          </tr>
        </thead>
        <tbody>
          {participants.map((p) => (
            <tr key={p.id}>
              <td className="pos">
                {p.position === 1 ? <FaTrophy className="first-place" /> : p.position}
              </td>
              <td className="player-name">{p.name}</td>
              <td>{p.total_points}</td>
              <td>{p.games_played}</td>
              <td>{p.wins}</td>
              <td>{p.draws}</td>
              <td>{p.losses}</td>
              <td>{p.goal_difference}</td>
              <td>{p.ptc_bonus_count}</td>
            </tr>
          ))}
        </tbody>
      </Table>
    </TableWrapper>
  );
};

export default RankingTable;