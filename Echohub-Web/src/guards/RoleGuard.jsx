import { useSelector } from 'react-redux'; 
import { Navigate } from 'react-router-dom';
import PropTypes from 'prop-types';

const RoleGuard = ({ requiredRoles, children }) => {
  
  const user  = useSelector((state) => state.auth.user);

  console.log("user roles:"+JSON.stringify(user.roles))
  console.log("required roles:"+JSON.stringify(requiredRoles))

  const hasRequiredRole = user?.roles.some(role => requiredRoles.includes(role));

  console.log("required roles"+hasRequiredRole)
  if (!hasRequiredRole) {
    return <Navigate to="/404" />; 
  }

  return children;
};

RoleGuard.propTypes = {
  requiredRoles: PropTypes.arrayOf(PropTypes.string).isRequired,
  children: PropTypes.node.isRequired,
};

export default RoleGuard;
