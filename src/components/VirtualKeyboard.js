// src/Components/VirtualKeyboard.js
import React from 'react';
import styled from 'styled-components';

const KeyboardContainer = styled.div`
  display: flex;
  height: 100px;
  justify-content: center;
  align-items: flex-end;
  margin-top: 20px;
`;

const Key = styled.div`
  width: 20px;
  height: ${({ isBlack }) => (isBlack ? '60px' : '100px')};
  background-color: ${({ isActive, isBlack }) =>
    isActive ? 'orange' : isBlack ? 'black' : 'white'};
  border: 1px solid grey;
  margin: ${({ isBlack }) => (isBlack ? '40px -10px' : '0')};
  z-index: ${({ isBlack }) => (isBlack ? '1' : '0')};
  position: ${({ isBlack }) => (isBlack ? 'relative' : 'static')};
`;

function VirtualKeyboard({ firstNote, lastNote, activeNotes }) {
  const keys = [];

  for (let note = firstNote; note <= lastNote; note += 1) {
    const isActive = activeNotes.includes(note);
    const isBlack = [1, 3, 6, 8, 10].includes(note % 12);
    keys.push(<Key key={note} isActive={isActive} isBlack={isBlack} />);
  }

  return <KeyboardContainer>{keys}</KeyboardContainer>;
}

export default VirtualKeyboard;
