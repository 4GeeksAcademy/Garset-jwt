import React from "react";
import { Link } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export const Navbar = () => {
	const { store, dispatch } = useGlobalReducer();

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("user");
		dispatch({ type: "logout" });
	};

	return (
		<nav className="navbar navbar-expand-lg navbar-dark bg-dark">
			<div className="container">
				<Link className="navbar-brand" to="/">My App</Link>
				{store.auth.isAuthenticated && (
					<button className="btn btn-outline-light" onClick={handleLogout}>
						Logout
					</button>
				)}
			</div>
		</nav>
	);
};