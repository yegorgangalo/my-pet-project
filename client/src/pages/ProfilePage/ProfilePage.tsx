import { useContext, FC, useCallback } from "react"
import { useSnackbar } from 'notistack'
import { observer } from "mobx-react-lite";
import { Typography, Box } from "@mui/material";
import { useDropzone } from 'react-dropzone'
import imageCompression from 'browser-image-compression';
import { Context } from 'store/Context'
import Spinner from "components/Spinner";
import styles from './ProfilePage.module.scss'

const ProfilePage: FC = () => {
  const { enqueueSnackbar } = useSnackbar()
  const { store } = useContext(Context)
  const { name, _id } = store.user

  const onDrop = useCallback(async (files: any) => {
    try {
      if (!files[0].type.includes('image')) {
        enqueueSnackbar('load only images', { variant: 'warning' })
        return
      }
      if (files.length > 1) {
        enqueueSnackbar('load files one by one', { variant: 'info' })
      }

      const options = {
        maxSizeMB: 10,
        maxWidthOrHeight: 600,
        useWebWorker: true
      }

      const compressedFile = await imageCompression(files[0], options);

      const formData = new FormData()
      formData.append('file', compressedFile, compressedFile.name)
      await store.updateUserAvatar(_id, formData)
      enqueueSnackbar('File is uploaded', {variant: 'success'})
    } catch (err) {
      console.log((err as Error).message)
      enqueueSnackbar('File is not uploaded. try again', {variant: 'error'})
    }

  }, [enqueueSnackbar, _id, store])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({ onDrop })

  const dragZoneText = isDragActive ? 'Drop photo to load it' : 'Drag photo or click to select' ;

  return (
    <Box p={2}>
      <Typography variant="h3" mb={2}>{name} Profile</Typography>
      <Typography mb={2}>Update avatar photo:</Typography>
      <Box className={styles.dropZone} {...getRootProps()}>
        <input {...getInputProps()} />
        {store.isLoading ? <Spinner/> : <Typography>{dragZoneText}</Typography>}
      </Box>
    </Box>
  )
}

export default observer(ProfilePage)
