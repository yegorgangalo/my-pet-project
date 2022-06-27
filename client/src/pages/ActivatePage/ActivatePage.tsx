import { FC, useState } from "react"
import { Typography, Button, Box } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import Spinner from "components/Spinner";
import AuthService from 'services/AuthService'
import { useTypedSelector } from 'hooks/useTypedRedux'

const ActivatePage: FC = () => {
  const { user } = useTypedSelector(state => state.user)
  const { email, _id, isActivated } = user

  const [loading, setLoading] = useState(false)

  const sendActivationMail = (userId: string) => async () => {
    setLoading(true)
    try {
      await AuthService.sendActivationMail(userId)
    } catch (err) {
      console.log("error", (err as Error).message)
      console.log(err)
    } finally {
      setLoading(false)
    }
  }

  const activatedNotification = 'Your account is already activated'
  const nonActivatedNotification = `Your account is not activated.
    If you didn't receive activation link on your ${email},
    you can resend it:`

  return (
    <Box p={2}>
      <Typography mb={2}>{isActivated ? activatedNotification : nonActivatedNotification}</Typography>
      <Button
        onClick={sendActivationMail(_id)}
        variant="contained"
        endIcon={loading ? <Spinner/> : <SendIcon />}
        disabled={loading}
      >Resend activation link</Button>
    </Box>
  )
}

export default ActivatePage
