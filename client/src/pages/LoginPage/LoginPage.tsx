import { FC } from "react"
import { Typography, Button, TextField, Box } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import PasswordTextField from 'components/PasswordTextField'
import GoogleButton from "components/GoogleButton/GoogleButton";
import { useDispatchActions } from 'hooks/useTypedRedux'
import { ILoginData } from 'interfaces/ILoginData'

const LoginPage: FC = () => {
  const { login } = useDispatchActions()
  const { control, handleSubmit } = useFormContext<ILoginData>()

  const onSubmit = (data: ILoginData) => {
    login(data)
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
