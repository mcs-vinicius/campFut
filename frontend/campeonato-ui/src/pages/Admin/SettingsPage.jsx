// /campeonato-ui/src/pages/Admin/SettingsPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import { toast } from 'react-toastify';
import { showConfirmation } from '../../utils/toastUtils.jsx';

const SettingsContainer = styled.div`
  max-width: 600px;
`;

const SettingRow = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem;
  background-color: #1D193B;
  border-radius: 6px;
  margin-bottom: 1rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const Label = styled.label`
  font-size: 1.1rem;
  font-weight: bold;
`;

const Input = styled.input`
  width: 80px;
  padding: 8px;
  background-color: #0B071B;
  border: 1px solid #3c3866;
  border-radius: 4px;
  color: #EAEAF2;
  text-align: center;
  font-size: 1.2rem;
  &::-webkit-outer-spin-button,
  &::-webkit-inner-spin-button { -webkit-appearance: none; margin: 0; }
  -moz-appearance: textfield;
`;

const SaveButton = styled.button`
  padding: 12px 20px;
  background-color: #00F2EA;
  border: none;
  border-radius: 4px;
  color: #0B071B;
  font-size: 1rem;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  cursor: pointer;
  display: block;
  margin-top: 1.5rem;
  margin-left: auto;
  transition: background-color 0.3s;
  &:hover {
    background-color: #8afff7;
  }
`;

const DangerButton = styled(SaveButton)`
  background-color: #c82333;
  color: white;
  margin-top: 1rem;
  margin-left: 0;
  &:hover {
    background-color: #a71d2a;
  }
`;

const ResetButton = styled(DangerButton)`
  background-color: #ffc107;
  color: #1D193B;
  &:hover {
    background-color: #e0a800;
  }
`;

const LoadingMessage = styled.p`
  text-align: center;
  font-size: 1.5rem;
  color: #00F2EA;
`;

const HelperText = styled.p`
  color: #aaa;
  margin-top: 0.5rem;
  font-size: 0.9rem;
`;

const SettingsPage = () => {
  const [settings, setSettings] = useState({
    num_turns: '1',
    wo_score_winner: '3',
    wo_score_loser: '0',
    championship_status: 'SETUP',
    num_rounds: '0'
  });
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isChampionshipFinished = settings.championship_status === 'FINISHED';

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await authApi.get('/settings');
        setSettings(prev => ({ ...prev, ...response.data }));
      } catch (_error) {
        console.error("Erro ao buscar configurações:", _error);
        toast.error("Erro ao buscar configurações.");
      } finally {
        setIsLoading(false);
      }
    };
    fetchSettings();
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSettings(prev => ({ ...prev, [name]: value }));
  };

  const handleSaveSettings = async () => {
    try {
      const response = await authApi.put('/settings', settings);
      toast.success(response.data.msg);
    } catch (_error) {
      console.error("Erro ao salvar configurações:", _error);
      toast.error("Falha ao salvar configurações.");
    }
  };

  const handleEndChampionship = () => {
    const confirmAction = async () => {
      try {
        const response = await authApi.post('/championship/end');
        toast.success(response.data.msg);
        setSettings(prev => ({ ...prev, championship_status: 'FINISHED' }));
      } catch (_error) {
        console.error("Erro ao encerrar o campeonato:", _error);
        toast.error("Não foi possível encerrar o campeonato.");
      }
    };
    showConfirmation("Tem certeza? Encerrar o campeonato é uma ação permanente.", confirmAction);
  };

  const handleResetChampionship = () => {
    const confirmAction = async () => {
      try {
        const response = await authApi.post('/championship/reset');
        toast.success(response.data.msg);
        navigate('/admin/dashboard');
      } catch (_error) {
        console.error("Erro ao reiniciar o campeonato:", _error);
        toast.error("Não foi possível reiniciar o campeonato.");
      }
    };
    showConfirmation("REINICIAR? Esta ação apagará TODAS as partidas e resultados. Os participantes serão mantidos.", confirmAction);
  };

  if (isLoading) {
    return <LoadingMessage>Carregando configurações...</LoadingMessage>;
  }

  return (
    <SettingsContainer>
      <div>
        <h2>Configurações do Campeonato</h2>
        <HelperText>
          Defina aqui as regras principais do torneio. Deixe 'Rodadas' como 0 para usar o cálculo automático.
        </HelperText>
        <br />
        <SettingRow>
          <Label htmlFor="num_turns">Quantidade de Turnos (1 = turno único; 2 = ida e volta)</Label>
          <Input 
            type="number" id="num_turns" name="num_turns"
            min="1" max="4" value={settings.num_turns}
            onChange={handleInputChange} disabled={isChampionshipFinished}
          />
        </SettingRow>

        <SettingRow>
          <Label htmlFor="num_rounds">Número Máximo de Rodadas (0 = automático)</Label>
          <Input 
            type="number" id="num_rounds" name="num_rounds"
            min="0" value={settings.num_rounds}
            onChange={handleInputChange} disabled={isChampionshipFinished}
          />
        </SettingRow>

        <SettingRow>
          <Label htmlFor="wo_score_winner">Placar do Vencedor (W.O.)</Label>
          <Input 
            type="number" id="wo_score_winner" name="wo_score_winner"
            min="0" value={settings.wo_score_winner}
            onChange={handleInputChange} disabled={isChampionshipFinished}
          />
        </SettingRow>
        <SettingRow>
          <Label htmlFor="wo_score_loser">Placar do Perdedor (W.O.)</Label>
          <Input 
            type="number" id="wo_score_loser" name="wo_score_loser"
            min="0" value={settings.wo_score_loser}
            onChange={handleInputChange} disabled={isChampionshipFinished}
          />
        </SettingRow>
        <SaveButton onClick={handleSaveSettings} disabled={isChampionshipFinished}>
          Salvar Configurações
        </SaveButton>
      </div>

      <div style={{ marginTop: '2.5rem', paddingTop: '2rem', borderTop: '1px solid #3c3866' }}>
        <h3>Gerenciamento do Campeonato</h3>
        {isChampionshipFinished ? (
          <div>
            <p style={{ color: '#28a745', fontSize: '1.2rem' }}>Este campeonato foi encerrado.</p>
            <p>Você pode reiniciar o campeonato para começar um novo com os mesmos participantes.</p>
            <ResetButton onClick={handleResetChampionship}>
              Reiniciar Novo Campeonato
            </ResetButton>
          </div>
        ) : (
          <>
            <p>Esta ação marcará o campeonato como finalizado e impedirá futuras edições.</p>
            <DangerButton onClick={handleEndChampionship}>
              Encerrar Campeonato
            </DangerButton>
          </>
        )}
      </div>
    </SettingsContainer>
  );
};

export default SettingsPage;