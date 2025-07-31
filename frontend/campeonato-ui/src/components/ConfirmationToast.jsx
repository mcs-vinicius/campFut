// /campeonato-ui/src/components/ConfirmationToast.jsx

import React from 'react';
import styled from 'styled-components';

const ConfirmationContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  color: #EAEAF2;
`;

const ConfirmationButton = styled.button`
  padding: 8px 12px;
  border: none;
  border-radius: 4px;
  color: #fff;
  font-weight: bold;
  cursor: pointer;
  /* MUDANÇA AQUI: de props.confirm para props.$confirm */
  background-color: ${props => props.$confirm ? '#28a745' : '#6c757d'};
  
  &:hover {
    opacity: 0.9;
  }
`;

const ConfirmationToast = ({ closeToast, onConfirm, message }) => (
  <ConfirmationContainer>
    <p>{message}</p>
    <div>
      {/* MUDANÇA AQUI: de confirm para $confirm */}
      <ConfirmationButton $confirm onClick={() => { onConfirm(); closeToast(); }}>
        Confirmar
      </ConfirmationButton>
      <ConfirmationButton onClick={closeToast} style={{ marginLeft: '10px' }}>
        Cancelar
      </ConfirmationButton>
    </div>
  </ConfirmationContainer>
);

export default ConfirmationToast;