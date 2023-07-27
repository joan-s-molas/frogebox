import React, { useEffect, useState } from 'react';
import { v4 as uuidv4 } from 'uuid';
import styled, { createGlobalStyle } from 'styled-components';
import { keyframes } from 'styled-components';

type Glyph = {
  id: string;
  char: string;
  top: number;
  size: number;
  speed: number;
  left: number;
};

const moveRight = keyframes`
  from { transform: translateX(-100%); }
  to { transform: translateX(calc(100vw + 100%)); }
`;

//const moveRight = keyframes`
//  from { transform: translateX(0); }
//  to { transform: translateX(calc(100vw + 100%)); }
//`;

const GlobalStyle = createGlobalStyle`
  body {
    background: linear-gradient(#020024, #74007c);
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

const glyphs = ["𓆈","𓆉","𓆊","𓆋","𓆌","𓆍","𓆎","𓆏","𓆐","𓆑","𓆒","𓆘","𓆙","𓆚"];

const GlyphContainer = styled.div<{size: number, speed: number}>`
  position: absolute;
  font-size: ${({size}) => `${size}em`};
  animation: ${moveRight} linear ${({speed}) => `${speed}s`} infinite;
`;

const App: React.FC = () => {
  const [glyphsState, setGlyphs] = useState<Glyph[]>([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const bias = Math.pow(Math.random(), 3); // Bias towards smaller sizes
      const size = 2 + bias * (20 - 2); // Random size from 2em to 20em

      const newGlyph: Glyph = {
        id: uuidv4(),
        char: glyphs[Math.floor(Math.random() * glyphs.length)],
        top: Math.random() * 100,
        size,
        speed: Math.random() * 10 + size / 4, // Smaller glyphs are slower
        left: 0,
      };

      setGlyphs((glyphs) => [...glyphs, newGlyph]);
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <>
      <GlobalStyle />
      {glyphsState.map((glyph: Glyph) => (
        <GlyphContainer
          key={glyph.id}
          style={{ top: `${glyph.top}%` }}
          size={glyph.size}
          speed={glyph.speed}
        >
          {glyph.char}
        </GlyphContainer>
      ))}
    </>
  );
};

export default App;

