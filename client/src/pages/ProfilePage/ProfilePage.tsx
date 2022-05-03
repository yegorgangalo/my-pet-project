import { useContext, FC } from "react"
import { observer } from "mobx-react-lite";
import { Typography, Box } from "@mui/material";
import { Context } from 'store/Context'
import SendIcon from '@mui/icons-material/Send';
import Spinner from "components/Spinner";

const ProfilePage: FC = () => {
  const { store } = useContext(Context)
  const { email, _id, isActivated } = store.user

  return (
    <Box p={2}>
      <Typography mb={2}>Profile page</Typography>
    </Box>
  )
}

export default observer(ProfilePage)
