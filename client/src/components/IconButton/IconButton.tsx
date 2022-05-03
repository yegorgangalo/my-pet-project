import { FC, ReactNode } from 'react'
import s from './IconButton.module.css';

export enum buttonType {
  BUTTON = 'button',
  SUBMIT = 'submit',
  RESET = 'reset',
}

interface IconButtonProps {
  children: ReactNode,
  onClick?: () => void,
  classNames: string,
  type?: buttonType,
}

const IconButton: FC<IconButtonProps> = ({ children, onClick, classNames="", type=buttonType.BUTTON, ...allyProps }) => (
  <button
    type={type}
    className={`${s.IconButton} ${classNames}`}
    onClick={onClick}
    {...allyProps}
  >
    {children}
  </button>
);

export default IconButton;