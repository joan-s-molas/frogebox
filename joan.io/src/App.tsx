import React, { useState, useEffect } from 'react';
import './App.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';


const App: React.FC = () => {
  const [fontSize, setFontSize] = useState<number>(Math.min(window.innerHeight, window.innerWidth) / 4);

  const adjustFontSize = () => {
    setFontSize(Math.min(window.innerHeight, window.innerWidth) / 2);
  };

  useEffect(() => {
    adjustFontSize();  // Adjust font size after the component is mounted

    window.addEventListener('resize', adjustFontSize);

    return () => {
      window.removeEventListener('resize', adjustFontSize);
    };
  }, []);

  return (
    <div className="App">
      <div className="full-screen-joan" style={{ fontSize: `${fontSize}px` }}>JOAN</div>
      <div className="underneath">
        <a href="https://github.com/joan-s-molas" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faGithub} style={{ color: '#CFD186', marginRight: "10px"}} size="xl" />
        </a>
        <a href="https://www.linkedin.com/in/joan-serra-85b1bb41/" target="_blank" rel="noopener noreferrer">
        <FontAwesomeIcon icon={faLinkedin} style={{ color: '#CFD186' }} size="xl" />
        </a>
      </div>
    </div>
  );
}

export default App;

