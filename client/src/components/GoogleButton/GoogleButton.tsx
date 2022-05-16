import { FC, useEffect, useRef } from "react"
import { useGoogle } from "hooks/useGoogle";
import { IGoogleWindow } from "../../interfaces/IGoogleWindow"

const GoogleButton: FC = () => {
  useGoogle()
  const divRef = useRef<HTMLDivElement>(null)
  const googleWindow = window as IGoogleWindow

  useEffect(() => {
    if (!googleWindow.google || !divRef.current) {
      return
    }
    try {
      googleWindow.google.accounts.id.renderButton(divRef.current, {
        type: "standard",
      })
    } catch (err) {
      console.log("err=", err)
    }
  }, [googleWindow.google])

  return (
    <div ref={divRef} />
  )
}

export default GoogleButton
