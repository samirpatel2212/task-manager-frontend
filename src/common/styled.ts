

import styled from 'styled-components';

export const ToastContainer = styled.div<{ type: 'success' | 'failure' }>`
  position: fixed;
  top: 20px;
  left: 50%;
  transform: translateX(-50%);
  background: ${(props) => (props.type === 'success' ? 'green' : 'red')};
  color: white;
  padding: 10px 20px;
  border-radius: 5px;
  z-index: 1000;
`;

export const CloseButton = styled.span`
  cursor: pointer;
  margin-left: 10px;
  font-weight: bold;
`;

export const Button = styled.button`
  margin: 5px;
`;