import { FC, MouseEvent, /* ChangeEvent, */ useState } from 'react';
import { FormControlProps } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import FormHelperText from '@mui/material/FormHelperText';

interface PasswordTextFieldProps extends FormControlProps {
  value: string;
  // setPassword?: (password: string ) => void;
  helperText?: string;

}

const PasswordTextField: FC<PasswordTextFieldProps> = ({ value="", /* setPassword, */ helperText, ...restProps }) => {
    const [showPassword, setShowPassword] = useState(false)

  // const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
  //     setPassword(event.target.value);
  //   };

  const handleClickShowPassword = () => {
    setShowPassword(state => !state)
  };

  const handleMouseDownPassword = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const showErrorText = helperText && restProps.error

  return (<FormControl variant="outlined" {...restProps}>
    <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel>
    <OutlinedInput
      id="outlined-adornment-password"
      type={showPassword ? 'text' : 'password'}
      value={value}
      // onChange={handleChange}
      endAdornment={
        <InputAdornment position="end">
          <IconButton
            aria-label="toggle password visibility"
            onClick={handleClickShowPassword}
            onMouseDown={handleMouseDownPassword}
            edge="end"
          >
            {showPassword ? <VisibilityOff /> : <Visibility />}
          </IconButton>
        </InputAdornment>
      }
      label="Password"
    />
    {showErrorText && <FormHelperText id="outlined-error-helper-text">{helperText}</FormHelperText>}
  </FormControl>)
}

export default PasswordTextField
