import React, { useState, useEffect } from 'react';
import './App.css';

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
    </div>
  );
}

export default App;

