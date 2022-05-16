import { useContext, FC } from "react"
import { Typography, Button, TextField, Box } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import PasswordTextField from 'components/PasswordTextField'
import GoogleButton from "components/GoogleButton/GoogleButton";
import { Context } from '../../store/Context'

interface ILoginData {
  password: string;
  email: string
}

const LoginPage: FC = () => {
  const { store } = useContext(Context)
  const { control, handleSubmit } = useFormContext<ILoginData>()

  const onSubmit = (data: ILoginData) => {
    store.login(data.email, data.password)
  }

  return (
    <Box p={2}>
      <Typography>Log In</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Controller
          name="email"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              onChange={onChange}
              value={value || ''}
              label="Email"
              type="email"
              margin="normal"
              fullWidth
            />
          )}
        />
        <Controller
          name="password"
          control={control}
          render={({ field: { onChange, value } }) => (
            <PasswordTextField
              onChange={onChange}
              value={value}
              margin="normal"
              fullWidth
            />
          )}
        />
        <Button type="submit" variant="contained">Log In</Button>
        <GoogleButton/>
      </Box>
    </Box>
  )
}

export default LoginPage
