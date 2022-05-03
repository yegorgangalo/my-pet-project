import { FC } from 'react'
import { ImSpinner9 } from 'react-icons/im';
import s from './Spinner.module.scss'

interface SpinnerProps {
  classNames?: string,
  centerred?: boolean,
}

const Spinner: FC<SpinnerProps> = ({classNames="", centerred }) => {
    return <ImSpinner9 className={`${centerred ? s.centerred : s.iconSpin} ${classNames}`}/>;
}

export default Spinner
