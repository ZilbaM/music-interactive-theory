// src/Components/UI/Container.js
import styled from 'styled-components';

const Container = styled.div`
  max-width: ${({ maxWidth }) => maxWidth || '800px'};
  margin: 0 auto;
  padding: ${({ padding }) => padding || '20px'};
  text-align: ${({ align }) => align || 'center'};
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

export default Container;
