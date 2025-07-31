// /campeonato-ui/src/pages/Admin/ParticipantPage.jsx

import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import { authApi } from '../../services/api';
import { FaTrash, FaPlusCircle } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { showConfirmation } from '../../utils/toastUtils.jsx';

const Input = styled.input`
  width: 100%;
  padding: 12px 15px;
  background-color: #0B071B;
  border: 1px solid #3c3866;
  border-radius: 4px;
  color: #EAEAF2;
  font-size: 1rem;
  transition: border-color 0.3s, box-shadow 0.3s;
  &:focus {
    outline: none;
    border-color: #00F2EA;
    box-shadow: 0 0 10px rgba(0, 242, 234, 0.5);
  }
`;

const Button = styled.button`
  padding: 12px 20px;
  background-color: #00F2EA;
  border: none;
  border-radius: 4px;
  color: #0B071B;
  font-size: 1rem;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.3s, box-shadow 0.3s;
  &:hover:not(:disabled) {
    background-color: #8afff7;
    box-shadow: 0 0 15px rgba(0, 242, 234, 0.7);
  }
  &:disabled {
    background-color: #5a6268;
    opacity: 0.7;
    cursor: not-allowed;
  }
`;

const ActionButton = styled.button`
  background: transparent;
  border: none;
  cursor: pointer;
  font-size: 1rem;
  transition: color 0.2s;
  display: flex;
  align-items: center;
  &.delete {
    color: #D42F8A;
    &:hover { color: #ff5eaf; }
  }
  &.ptc {
    color: #28a745;
    &:hover { color: #34c759; }
  }
`;

const StartButton = styled(Button)`
  background-color: #28a745;
  color: #fff;
  &:hover:not(:disabled) {
    background-color: #218838;
    box-shadow: 0 0 15px rgba(40, 167, 69, 0.7);
  }
`;

const ParticipantManager = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2rem;
`;

const AddForm = styled.form`
  display: flex;
  gap: 1rem;
  max-width: 500px;
  align-items: center;
`;

const ParticipantList = styled.ul`
  list-style: none;
  padding: 0;
`;

const ParticipantListItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #1D193B;
  padding: 1rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
`;

const ItemActions = styled.div`
  display: flex;
  gap: 1rem;
`;

const PageHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ImportSection = styled.div`
  margin-top: 2rem;
  padding-top: 2rem;
  border-top: 1px solid #3c3866;
`;

const ImportForm = styled.form`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem;
  background-color: #1D193B;
  border-radius: 8px;
  max-width: 600px;
  flex-wrap: wrap;
`;

const FileInput = styled.input`
  color: #EAEAF2;
  font-family: 'Exo 2', sans-serif;
  &::file-selector-button {
    padding: 8px 12px;
    background-color: #D42F8A;
    border: none;
    border-radius: 4px;
    color: #fff;
    font-weight: bold;
    cursor: pointer;
    margin-right: 1rem;
  }
`;

const ParticipantPage = () => {
  const [participants, setParticipants] = useState([]);
  const [newName, setNewName] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const navigate = useNavigate();

  const fetchParticipants = async () => {
    try {
      const response = await authApi.get('/participants');
      setParticipants(response.data);
    } catch (_error) {
      console.error("Erro ao buscar participantes:", _error);
      toast.error("Não foi possível carregar a lista de participantes.");
    }
  };

  useEffect(() => {
    fetchParticipants();
  }, []);

  const handleAddParticipant = async (e) => {
    e.preventDefault();
    if (!newName.trim()) return;
    try {
      const response = await authApi.post('/participants', { name: newName });
      setParticipants(prev => [...prev, response.data]);
      setNewName('');
      toast.success(`'${response.data.name}' adicionado com sucesso!`);
    } catch (_error) {
      console.error("Erro ao adicionar participante:", _error);
      toast.error(_error.response?.data?.msg || "Erro ao adicionar participante.");
    }
  };

  const handleDeleteParticipant = (participantId, participantName) => {
    const confirmAction = async () => {
      try {
        await authApi.delete(`/participants/${participantId}`);
        setParticipants(prev => prev.filter(p => p.id !== participantId));
        toast.success(`'${participantName}' foi excluído.`);
      } catch (_error) {
        console.error("Erro ao deletar participante:", _error);
        toast.error("Não foi possível excluir o participante.");
      }
    };
    showConfirmation(`Tem certeza que deseja excluir '${participantName}'?`, confirmAction);
  };
  
  const handleStartChampionship = () => {
    const confirmAction = async () => {
      try {
        const response = await authApi.post('/championship/start');
        toast.success(response.data.msg);
        navigate('/admin/rodadas');
      } catch (_error) {
        console.error("Erro ao iniciar campeonato:", _error);
        toast.error(_error.response?.data?.msg || "Não foi possível iniciar o campeonato.");
      }
    };
    showConfirmation("Iniciar campeonato? Esta ação não pode ser desfeita.", confirmAction);
  };

  const handleAddPtc = (participantId, participantName) => {
    const confirmAction = async () => {
      try {
        const response = await authApi.post(`/participants/${participantId}/ptc`);
        toast.success(response.data.msg);
      } catch (_error) {
        console.error("Erro ao adicionar ponto PTC:", _error);
        toast.error(_error.response?.data?.msg || "Não foi possível adicionar o ponto bônus.");
      }
    };
    showConfirmation(`Adicionar +2 pontos bônus para '${participantName}'?`, confirmAction);
  };

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleImport = async (event) => {
    event.preventDefault();
    if (!selectedFile) {
      toast.warn("Por favor, selecione um arquivo .csv para importar.");
      return;
    }

    const formData = new FormData();
    formData.append('file', selectedFile);

    try {
      const response = await authApi.post('/participants/import', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      toast.success(response.data.msg);
      fetchParticipants();
      setSelectedFile(null);
      event.target.reset();
    } catch (_error) {
      console.error("Erro ao importar participantes:", _error);
      toast.error(_error.response?.data?.msg || "Não foi possível importar o arquivo.");
    }
  };

  return (
    <ParticipantManager>
      <PageHeader>
        <h2>Gerenciar Participantes</h2>
        <StartButton onClick={handleStartChampionship}>
          Iniciar Campeonato
        </StartButton>
      </PageHeader>
      
      <AddForm onSubmit={handleAddParticipant}>
        <Input
          type="text"
          placeholder="Nome do participante"
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
        />
        <Button type="submit">Adicionar</Button>
      </AddForm>

      <ImportSection>
        <h3>Importar em Massa (.csv)</h3>
        <ImportForm onSubmit={handleImport}>
          <FileInput type="file" accept=".csv" onChange={handleFileChange} />
          <Button type="submit" disabled={!selectedFile}>Importar</Button>
        </ImportForm>
      </ImportSection>

      <h2>Lista de Participantes</h2>
      <ParticipantList>
        {participants.length > 0 ? (
          participants.map(p => (
            <ParticipantListItem key={p.id}>
              <span>{p.name}</span>
              <ItemActions>
                <ActionButton 
                  className="ptc" 
                  title="Adicionar Ponto Bônus PTC"
                  onClick={() => handleAddPtc(p.id, p.name)}
                >
                  <FaPlusCircle />
                </ActionButton>
                <ActionButton 
                  className="delete" 
                  title="Excluir Participante"
                  onClick={() => handleDeleteParticipant(p.id, p.name)}
                >
                  <FaTrash />
                </ActionButton>
              </ItemActions>
            </ParticipantListItem>
          ))
        ) : (
          <p>Nenhum participante adicionado ainda.</p>
        )}
      </ParticipantList>
    </ParticipantManager>
  );
};

export default ParticipantPage;