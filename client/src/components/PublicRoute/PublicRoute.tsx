import { useContext, FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { Context } from '../../store/Context'

interface PublicRouteProps {
  component: ReactNode,
  restricted?: boolean,
  redirectTo?: string,
}

const PublicRoute: FC<PublicRouteProps> = ({ component, restricted = false, redirectTo = '/' }) => {
  const { store } = useContext(Context)
  const isLoggedIn = store.isAuth
  const shouldRedirect = isLoggedIn && restricted;

  return (<>
    {shouldRedirect ? <Navigate to={redirectTo} replace /> : component}
  </>
  );
}

export default observer(PublicRoute)
