import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useTypedSelector } from 'hooks/useTypedRedux'

interface PublicRouteProps {
  component: ReactNode,
  restricted?: boolean,
  redirectTo?: string,
}

const PublicRoute: FC<PublicRouteProps> = (props) => {
  const { component, restricted = false, redirectTo = '/' } = props

  const { isAuth } = useTypedSelector(state => state.user)
  const isLoggedIn = isAuth
  const shouldRedirect = isLoggedIn && restricted;

  return (<>
    {shouldRedirect ? <Navigate to={redirectTo} replace /> : component}
  </>
  );
}

export default PublicRoute
