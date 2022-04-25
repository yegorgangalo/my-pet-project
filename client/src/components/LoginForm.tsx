import { FC, useState, ChangeEvent, useContext } from "react"
import { observer } from "mobx-react-lite";
import { Context } from "../index"

const LoginForm: FC = () => {
  const { store } = useContext(Context)

  const [name, setName] = useState<string>('')
  const [email, setEmail] = useState<string>('')
  const [password, setPassword] = useState<string>('')

  const handleInput = (setter: Function) => (e: ChangeEvent<HTMLInputElement>) => {
    setter(e.target.value)
  }

  const handleNameInput = handleInput(setName)
  const handleEmailInput = handleInput(setEmail)
  const handlePasswordInput = handleInput(setPassword)

  return <div>
    <input type="text" placeholder="name" value={name} onChange={handleNameInput}/>
    <input type="text" placeholder="email" value={email} onChange={handleEmailInput}/>
    <input type="text" placeholder="password" value={password} onChange={handlePasswordInput} />
    <button onClick={() => store.login(email, password)}>login</button>
    <button onClick={() => store.registration(name, email, password)}>registration</button>
  </div>
}

export default observer(LoginForm)
