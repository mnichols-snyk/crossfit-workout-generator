// frontend/src/components/common/Button.tsx
import React from 'react';

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'danger';
}

const Button: React.FC<ButtonProps> = ({ children, variant = 'primary', ...props }) => {
  const baseStyle: React.CSSProperties = {
    padding: '10px 15px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    fontSize: '16px',
  };

  const primaryStyle: React.CSSProperties = {
    backgroundColor: '#007bff',
    color: 'white',
  };

  const secondaryStyle: React.CSSProperties = {
    backgroundColor: '#6c757d',
    color: 'white',
  };

  const dangerStyle: React.CSSProperties = {
    backgroundColor: '#dc3545',
    color: 'white',
  };

  let currentStyle = primaryStyle;
  if (variant === 'secondary') {
    currentStyle = secondaryStyle;
  } else if (variant === 'danger') {
    currentStyle = dangerStyle;
  }

  return (
    <button style={{ ...baseStyle, ...currentStyle }} {...props}>
      {children}
    </button>
  );
};

export default Button;
