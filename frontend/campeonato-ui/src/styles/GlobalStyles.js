import { createGlobalStyle } from 'styled-components';

export const GlobalStyles = createGlobalStyle`
  /* A linha @import foi REMOVIDA daqui */

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
  }

  body {
    background-color: #0B071B;
    color: #EAEAF2;
    font-family: 'Exo 2', sans-serif;
    -webkit-font-smoothing: antialiased;
  }

  h1, h2, h3, h4, h5, h6 {
    font-family: 'Orbitron', sans-serif;
    color: #00F2EA;
  }

  body::before {
    content: '';
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-image: 
      linear-gradient(rgba(11, 7, 27, 0.95), rgba(11, 7, 27, 0.95)),
      linear-gradient(to right, rgba(0, 242, 234, 0.1) 1px, transparent 1px),
      linear-gradient(to bottom, rgba(0, 242, 234, 0.1) 1px, transparent 1px);
    background-size: 100%, 50px 50px, 50px 50px;
    z-index: -1;
    animation: pan-background 60s linear infinite;
  }

  @keyframes pan-background {
    from {
      background-position: 0 0;
    }
    to {
      background-position: -500px -500px;
    }
  }
`;