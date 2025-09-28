import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = ({ requiredRole }) => {

  const user = JSON.parse(localStorage.getItem("user")); 
  

  if (!user) {
   
    return <Navigate to="/" />;
  }

  if (requiredRole && user.role !== requiredRole) {
   
    return <Navigate to="/unauthorized" />;
  }

  
  return <Outlet />;
};

export default PrivateRoute;