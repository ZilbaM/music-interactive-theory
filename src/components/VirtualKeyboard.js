// src/Components/VirtualKeyboard.js
import React from 'react';
import styled from 'styled-components';

const KeyboardOuter = styled.div`
  position: relative;
`;

const WhiteRow = styled.div`
  display: flex;
  flex-wrap: no-wrap;
`;

const BlackRow = styled.div`
  display: flex;
  flex-wrap: no-wrap;
  position: absolute;
  left: 10px;
`;

const KeyContainer = styled.div`
  height: 100px;
  width: 20px;
  display: flex;
  justify-content: center;
`;

const WhiteKey = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid black;
  background-color: ${({ isActive, isHighlighted }) => {
    if (isHighlighted) return 'lightblue';
    if (isActive) return 'orange';
    return 'white';
  }};
`;

const BlackKey = styled.div`
  width: 70%;
  height: 65%;
  border: 1px solid black;
  background-color: ${({ isActive, isHighlighted }) => {
    if (isHighlighted) return 'lightblue';
    if (isActive) return 'orange';
    return 'black';
  }};
`;

function VirtualKeyboard({
  firstNote,
  lastNote,
  activeNotes = [],
  highlightedNotes = [],
}) {
  const isBlackKey = (note) => [1, 3, 6, 8, 10].includes(note % 12);
  const isActive = (note) => activeNotes.includes(note);
  const isHighlighted = (note) => highlightedNotes.includes(note);

  const blackNotes = [];
  const whiteNotes = [];

  for (let n = firstNote; n <= lastNote; n += 1) {
    if (isBlackKey(n)) {
      blackNotes.push(n);
    } else {
      whiteNotes.push(n);
      // insert placeholders for black keys if needed
      if (!isBlackKey(n + 1)) {
        blackNotes.push(-2 * n);
      }
    }
  }

  return (
    <KeyboardOuter>
      <BlackRow>
        {blackNotes.map((note) => (
          <KeyContainer key={note}>
            {note >= 0 && (
              <BlackKey
                isActive={isActive(note)}
                isHighlighted={isHighlighted(note)}
              />
            )}
          </KeyContainer>
        ))}
      </BlackRow>
      <WhiteRow>
        {whiteNotes.map((note) => (
          <KeyContainer key={note}>
            <WhiteKey
              note={note}
              isActive={isActive(note)}
              isHighlighted={isHighlighted(note)}
            />
          </KeyContainer>
        ))}
      </WhiteRow>
    </KeyboardOuter>
  );
}

export default VirtualKeyboard;
