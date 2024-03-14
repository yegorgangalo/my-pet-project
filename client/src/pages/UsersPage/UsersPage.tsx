import { useState, FC } from "react"
import { IUser } from "interfaces/IUser";
import UserService from 'services/UserService';
import { useTypedSelector } from 'hooks/useTypedRedux'

const UsersPage: FC = () => {
  const { isAuth, user } = useTypedSelector(state => state.user)

  const [users, setUsers] = useState<IUser[]>([])

  const fetchUsers = async () => {
    try {
      const { data } = await UserService.fetchUsers()
      setUsers(data)
    } catch (err) {
      console.log((err as Error).message)
    }
  }

  return (
    <div>
      <h1>User {user?.name} is {isAuth ? 'authorized' : 'unauthorized'}</h1>
      <button onClick={() => fetchUsers()}>get users list</button>
      {!users.length ? null : (
        <ul>
          {users.map(user => (<li key={user?._id}>
            <p>Name: {user?.name}</p>
            <p>Email: {user?.email}</p>
            <p>Is active: {user?.isActivated.toString()}</p>
            <p>Roles: {user?.roles.reduce((acc, role) => {
              return acc + `${role.value} (${role.description})`
            }, '')}</p>
          </li>))}
        </ul>
      )}
    </div>
  )
}

export default UsersPage
