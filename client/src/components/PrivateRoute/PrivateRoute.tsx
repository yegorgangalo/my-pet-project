import { ROLES } from "@mandruy/common/const"
import { IRole } from "interfaces/IRole";
import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useTypedSelector } from 'hooks/useTypedRedux'

interface PrivateRouteProps {
  component: ReactNode,
  redirectTo?: string,
  noActivation?: boolean,
  allowedRoles?: Array<keyof typeof ROLES>,
  userRoles?: IRole[],
}

const PublicRoute: FC<PrivateRouteProps> = (props) => {
  const {
    component,
    redirectTo = '/',
    noActivation = false,
    allowedRoles = [ROLES.GUEST],
    userRoles = [{ value: ROLES.GUEST }]
  } = props

  const { isAuth, isLoadedBE, user } = useTypedSelector(state => state.user)

  if (!isLoadedBE) {
    return <></>
  }

  const normalizedUserRoles = userRoles.map(role => role.value)

  const hasUserAccessByRole = allowedRoles.some(role => normalizedUserRoles.includes(role))

  // const isLoggedIn = noActivation ? isAuth : (isAuth && user.isActivated)
  const isLoggedIn = (noActivation && isAuth) ? !user.isActivated : user.isActivated
  const hasAccess = hasUserAccessByRole && isLoggedIn

  return (<>
    {hasAccess ? component : <Navigate to={redirectTo} replace />}
  </>
  );
}

export default PublicRoute
