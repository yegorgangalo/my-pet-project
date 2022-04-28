import { LS } from "@mandruy/common/const"
import { observer } from "mobx-react-lite";
import { useEffect, useContext, useState } from 'react'
import LoginForm from "./components/LoginForm";
import { Context } from "./index"
import { IUser } from "./interfaces/IUser";
import UserService from "./services/UserService";

function App() {
  const { store } = useContext(Context)
  useEffect(() => {
    if (localStorage.getItem(LS.ACCESS_TOKEN)) {
      store.checkAuth()
    }
  }, [store])

  const [users, setUsers] = useState<IUser[]>([])

  const fetchUsers = async () => {
    try {
      const { data } = await UserService.fetchUsers()
      console.log(data)
      setUsers(data)
    } catch (err) {}
  }

  if (store.isLoading) {
    return <div className="App">
      <h1>Loading...</h1>
    </div>
  }

  if (!store.isAuth) {
    return <div className="App">
      <LoginForm />
    </div>
  }

  if (!store.user.isActivated) {
    return <div className="App">
      <h1>Activate your account from email: {store.user.email}</h1>
      <button onClick={() => store.logout()}>logout</button>
    </div>
  }

  return (
    <div className="App">
      <h1>User {store.user?.name} is {store.isAuth ? 'authorized' : 'unauthorized'}</h1>
      <button onClick={() => fetchUsers()}>get users list</button>
      <button onClick={() => store.logout()}>logout</button>
      {!users.length ? null : (
        <ul>
          {users.map(user => (<li>
            <p>Name: {user.name}</p>
            <p>Email: {user.email}</p>
            <p>Is active: {user.isActivated.toString()}</p>
            <p>Roles: {user.roles.reduce((acc, role) => {
              return acc + `${role.value} (${role.description})`
            }, '')}</p>
          </li>))}
        </ul>
      )}
    </div>
  );
}

export default observer(App);
