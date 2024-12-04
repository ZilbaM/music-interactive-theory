import styled from 'styled-components';

const Text = styled.p`
  font-size: ${({ size }) => size || '18px'};
  color: ${({ color }) => color || '#000'};
  margin: ${({ margin }) => margin || '0'};
`;

export default Text;
