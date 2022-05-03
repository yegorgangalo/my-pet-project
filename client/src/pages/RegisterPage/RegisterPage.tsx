import { useContext, FC } from "react"
import { Typography, Button, TextField, Box } from "@mui/material";
import { useFormContext, Controller } from "react-hook-form";
import PasswordTextField from '../../components/PasswordTextField'
import { Context } from '../../store/Context'

interface IRegisterData {
  name: string;
  email: string
  password: string;
}

const RegistrationPage: FC = () => {
  const { store } = useContext(Context)
  const { control, handleSubmit } = useFormContext<IRegisterData>()

  const onSubmit = (data: IRegisterData) => {
    store.registration(data.name, data.email, data.password)
  }

  console.log('store=', {...store});


  return (
    <Box p={2}>
      <Typography>Registration</Typography>
      <Box component="form" onSubmit={handleSubmit(onSubmit)} autoComplete="off">
        <Controller
          name="name"
          control={control}
          render={({ field: { onChange, value } }) => (
            <TextField
              onChange={onChange}
              value={value || ''}
              label="Name"
              margin="normal"
              fullWidth
            />
          )}
        />
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
        <Button type="submit" variant="contained">Register</Button>
      </Box>
    </Box>
  )
}

export default RegistrationPage
