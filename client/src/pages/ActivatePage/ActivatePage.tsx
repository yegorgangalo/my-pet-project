import { useContext, FC } from "react"
import { observer } from "mobx-react-lite";
import { Typography, Button, Box } from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { Context } from '../../store/Context'
import Spinner from "components/Spinner";

const MainPage: FC = () => {
  const { store } = useContext(Context)
  const { email, _id, isActivated } = store.user
  const sendActivationMail = () => store.sendActivationMail(_id)

  const activatedNotification = 'Your account is already activated'
  const nonActivatedNotification = `Your account is not activated.
    If you didn't receive activation link on your ${email},
    you can resend it:`

  return (
    <Box p={2}>
      <Typography mb={2}>{isActivated ? activatedNotification : nonActivatedNotification}</Typography>
      <Button
        onClick={sendActivationMail}
        variant="contained"
        endIcon={store.isLoading ? <Spinner/> : <SendIcon />}
        disabled={store.isLoading}
      >Resend activation link</Button>
    </Box>
  )
}

export default observer(MainPage)
