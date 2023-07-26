import React, { useEffect, useState } from 'react';
import styled, { keyframes, createGlobalStyle } from 'styled-components';

// Global styles to set the gradient background
const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(to bottom, #020024, #74007c);
    margin: 0;
    height: 100vh;
    width: 100vw;
    display: flex;
    align-items: center;
    justify-content: center;
    color: #33ff33; // Neon green color
    overflow: hidden;
  }
`;

// Define our moving div
const MovingDiv = styled.div<{ speed: number; zIndex: number; size: number }>`
  position: absolute;
  left: 0;
  color: #33ff33; // Neon green color
  z-index: ${props => props.zIndex};
  font-size: ${props => props.size}em;
  animation: ${(props) => keyframes`
    0% {
      transform: translateX(0%);
      opacity: 0;
    }
    10% {
      opacity: 1;
    }
    90% {
      opacity: 1;
    }
    100% {
      transform: translateX(100vw);
      opacity: 0;
    }
  `} ${props => props.speed}s linear infinite;
`;

const glyphs = ["𓆈","𓆉","𓆊","𓆋","𓆌","𓆍","𓆎","𓆏","𓆐","𓆑","𓆒","𓆓","𓆔","𓆕","𓆖","𓆗","𓆘","𓆙","𓆚"];

interface Glyph {
  glyph: string;
  size: number;
  speed: number;
  position: number;
  zIndex: number;
}

const App: React.FC = () => {
  const [randomGlyphs, setRandomGlyphs] = useState<Glyph[]>([]);
  
  const generateRandomGlyph = (): Glyph => {
    const glyph = glyphs[Math.floor(Math.random() * glyphs.length)];
    const size = Number((Math.random() * 6 + 2).toFixed(2)); // Random size between 2 and 8
    const speed = (8 - size) + 5; // Bigger glyphs move faster
    const position = Math.random() * (window.innerHeight - 50); // Random vertical position
    const zIndex = Math.round(size * 10); // Bigger glyphs appear on top
    return { glyph, size, speed, position, zIndex };
  };

  // Recalculate the glyph positions whenever the window is resized
  useEffect(() => {
    const handleResize = () => {
      setRandomGlyphs((glyphs) => glyphs.map(glyph => ({ ...glyph, position: Math.random() * (window.innerHeight - 50) })));
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setRandomGlyphs((glyphs) => [...glyphs, generateRandomGlyph()]);
    }, 1000);

    return () => clearInterval(intervalId); // Clean up on unmount
  }, []);

  return (
    <div className="App">
      <GlobalStyle />
      {randomGlyphs.map(({ glyph, size, speed, position, zIndex }, index) => (
        <MovingDiv key={index} style={{ top: `${position}px` }} speed={speed} zIndex={zIndex} size={size}>
          {glyph}
        </MovingDiv>
      ))}
    </div>
  );
};

export default App;

