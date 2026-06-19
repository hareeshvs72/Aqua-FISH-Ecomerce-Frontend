import React from "react";
import { Navigate } from "react-router-dom";
import { useRole } from "../../context/RoleContext";
import Preloader from "../../components/Preloader";

const UserRoute = ({ children }) => {
  const { role, loading } = useRole();

  if (loading) {
    return <Preloader />;
  }

  // Admins are now permitted to browse user-facing pages (Fish, Accessories, etc.)
  // We only block completely unauthenticated users if the page is private
  // In this project, many pages wrapped in UserRoute are public but we want to know the role.
  
  return children;
};

export default UserRoute;
