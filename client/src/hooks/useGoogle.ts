import { ENV } from "@mandruy/common/const"
import { useCallback, useEffect, useState, useContext } from "react"
import { IGoogleWindow } from "interfaces/IGoogleWindow"
import { Context } from "store/Context"

export const useGoogle = () => {
  const googleWindow = window as IGoogleWindow
  const [scriptLoaded, setScriptLoaded] = useState(false)
  const { store } = useContext(Context)

  const initializeGoogle = useCallback(() => {
    if (!googleWindow.google || scriptLoaded) {
      return
    }
    setScriptLoaded(true)
    try {
      googleWindow.google.accounts.id.initialize({
        client_id: process.env[
          `REACT_APP_${ENV.GOOGLE_AUTH_CLIENT_ID}`
        ] as string,
        callback: (res: any) => {
          store.googleLogin(res.credential)
        },
      })
    } catch (err) {
      console.log(err)
    }
  }, [googleWindow, scriptLoaded, store])

  const addGoogleScript = useCallback(() => {
    const script = document.createElement("script")
    script.src = "https://accounts.google.com/gsi/client"
    script.onload = initializeGoogle
    script.async = true
    script.id = "google-client-script"
    document.querySelector("body")?.appendChild(script)

    const removeGoogleScript = () => {
      googleWindow.google?.accounts.id.cancel()
      document.getElementById("google-client-script")?.remove()
    }
    return removeGoogleScript
  }, [initializeGoogle, googleWindow.google])

  useEffect(() => {
    if (scriptLoaded) {
      return
    }
    const removeGoogleScript = addGoogleScript()
    return removeGoogleScript
  }, [scriptLoaded, addGoogleScript])
}
