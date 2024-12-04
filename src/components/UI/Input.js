// src/Components/UI/Input.js
import styled from 'styled-components';

const Input = styled.input`
  padding: 10px;
  font-size: ${({ size }) => size || '16px'};
  margin: ${({ margin }) => margin || '0'};
  border: 1px solid #ccc;
  border-radius: 4px;
`;

export default Input;
