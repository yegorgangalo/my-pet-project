import { useContext, FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { Context } from '../../store/Context'

interface PrivateRouteProps {
  component?: ReactNode,
  redirectTo?: string,
  noActivation?: boolean,
}

const PublicRoute: FC<PrivateRouteProps> = ({ component, redirectTo = '/', noActivation = false }) => {
  const { store } = useContext(Context)

  if (!store.isLoadedBE) {
    return <></>
  }

  const isLoggedIn = noActivation ? store.isAuth : (store.isAuth && store.user.isActivated)

  return (<>
    {isLoggedIn ? component : <Navigate to={redirectTo} replace />}
  </>
  );
}

export default observer(PublicRoute)
