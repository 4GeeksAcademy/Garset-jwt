import { Navigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const PrivateRoute = ({ children }) => {
    const { store } = useGlobalReducer();
    return store.auth.isAuthenticated ? children : <Navigate to="/" replace />;
};