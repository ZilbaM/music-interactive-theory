import styled from 'styled-components';

const Button = styled.button`
  background-color: ${({ bg }) => bg || '#6200ee'};
  color: ${({ color }) => color || '#fff'};
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: ${({ size }) => size || '16px'};
  cursor: pointer;
  margin: ${({ margin }) => margin || '0'};

  &:hover {
    background-color: ${({ hoverBg }) => hoverBg || '#3700b3'};
  }
`;

export default Button;
