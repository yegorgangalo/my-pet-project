import { ROLES } from "@mandruy/common/const"
import { IRole } from "interfaces/IRole";
import { useContext, FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { observer } from "mobx-react-lite";
import { Context } from '../../store/Context'

interface PrivateRouteProps {
  component: ReactNode,
  redirectTo?: string,
  noActivation?: boolean,
  allowedRoles?: Array<keyof typeof ROLES>,
  userRoles?: IRole[],
}

const PublicRoute: FC<PrivateRouteProps> = ({ component, redirectTo = '/', noActivation = false, allowedRoles = [ROLES.GUEST], userRoles = [{ value: ROLES.GUEST }] }) => {
  const { store } = useContext(Context)

  if (!store.isLoadedBE) {
    return <></>
  }

  const normalizedUserRoles = userRoles.map(role => role.value)

  const hasUserAccessByRole = allowedRoles.some(role => normalizedUserRoles.includes(role))

  const isLoggedIn = noActivation ? store.isAuth : (store.isAuth && store.user.isActivated)
  const hasAccess = hasUserAccessByRole && isLoggedIn

  return (<>
    {hasAccess ? component : <Navigate to={redirectTo} replace />}
  </>
  );
}

export default observer(PublicRoute)
