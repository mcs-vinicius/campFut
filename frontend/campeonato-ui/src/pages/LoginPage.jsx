// /campeonato-ui/src/pages/LoginPage.jsx

import React, { useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { toast } from 'react-toastify';

const LoginContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  padding: 2rem;
`;

const LoginForm = styled.form`
  width: 100%;
  max-width: 400px;
  padding: 2.5rem;
  background-color: #1D193BCC;
  border: 1px solid #D42F8A;
  border-radius: 8px;
  box-shadow: 0 0 20px rgba(212, 47, 138, 0.4);
  backdrop-filter: blur(5px);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;

  h1 {
    text-align: center;
    font-size: 2rem;
    margin-bottom: 1rem;
  }
`;

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
  width: 100%;
  padding: 12px 15px;
  background-color: #00F2EA;
  border: none;
  border-radius: 4px;
  color: #0B071B;
  font-size: 1.1rem;
  font-weight: bold;
  font-family: 'Orbitron', sans-serif;
  cursor: pointer;
  transition: background-color 0.3s, box-shadow 0.3s;

  &:hover {
    background-color: #8afff7;
    box-shadow: 0 0 15px rgba(0, 242, 234, 0.7);
  }
`;

const LoginPage = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.post('http://127.0.0.1:5000/auth/login', {
        username,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem('accessToken', access_token);
      toast.success("Login realizado com sucesso!");
      navigate('/admin/dashboard');
    } catch (err) {
      toast.error('Usuário ou senha inválidos.');
      console.error("Erro no login:", err);
    }
  };

  return (
    <LoginContainer>
      <LoginForm onSubmit={handleLogin}>
        <h1>Admin Login</h1>
        <Input
          type="text"
          placeholder="Usuário"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
        />
        <Input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <Button type="submit">Entrar</Button>
      </LoginForm>
    </LoginContainer>
  );
};

export default LoginPage;