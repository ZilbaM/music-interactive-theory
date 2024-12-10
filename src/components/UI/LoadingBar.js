// src/Components/UI/LoadingBar.js
import React from 'react';
import styled from 'styled-components';

const BarContainer = styled.div`
  width: 100%;
  height: 10px;
  background-color: #e0e0e0;
  border-radius: 5px;
  overflow: hidden;
`;

const BarProgress = styled.div`
  height: 100%;
  width: ${({ progress }) => progress}%;
  background-color: ${({ color }) => color || '#4caf50'};
  transition: width 0.1s ease-in-out;
`;

function LoadingBar({ progress, color }) {
  return (
    <BarContainer>
      <BarProgress progress={progress} color={color} />
    </BarContainer>
  );
}

export default LoadingBar;
