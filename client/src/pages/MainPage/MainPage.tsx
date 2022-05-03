import { FC } from "react"
import { observer } from "mobx-react-lite";
import { Typography, Box } from "@mui/material";

const MainPage: FC = () => {
  return (
    <Box p={2}>
      <Typography>Main Page</Typography>
    </Box>
  )
}

export default observer(MainPage)
