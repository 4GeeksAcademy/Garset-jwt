import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";

export let Home = () => {
	let { store, dispatch } = useGlobalReducer();
	let [email, setEmail] = useState("");
	let [password, setPassword] = useState("");
	let [error, setError] = useState("");
	let [isRegistering, setIsRegistering] = useState(false);
	let navigate = useNavigate();

	let loadMessage = async () => {
		try {
			let backendUrl = import.meta.env.VITE_BACKEND_URL;
			if (!backendUrl) throw new Error("VITE_BACKEND_URL is not defined in .env file");

			let response = await fetch(backendUrl + "/api/hello");
			let data = await response.json();

			if (response.ok) dispatch({ type: "set_hello", payload: data.message });
			return data;
		} catch (error) {
			console.error("Error loading message:", error);
		}
	};

	let login = async () => {
		try {
			setError("");
			let backendUrl = import.meta.env.VITE_BACKEND_URL;
			let response = await fetch(`${backendUrl}/login`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			let data = await response.json();

			if (response.ok) {

				localStorage.setItem("token", data.token);
				localStorage.setItem("user", JSON.stringify(data.user));

				dispatch({
					type: "login_success",
					payload: {
						token: data.token,
						user: data.user
					}
				});

				navigate("/dashboard");
			} else {
				throw new Error(data.message || "Login failed");
			}
		} catch (err) {
			setError(err.message);
			console.error("Login error:", err);
		}
	};

	let register = async () => {
		try {
			setError("");
			let backendUrl = import.meta.env.VITE_BACKEND_URL;

			if (!backendUrl) {
				throw new Error("Backend URL is not configured");
			}

			// Elimina cualquier barra adicional al final de la URL
			backendUrl = backendUrl.trim().replace(/\/+$/, '');

			let response = await fetch(`${backendUrl}/register`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ email, password }),
			});

			let data = await response.json();

			if (!response.ok) {
				throw new Error(data.msg || data.message || "Registration failed");
			}

			alert("Registration successful! Please login.");
			setEmail("");
			setPassword("");
			setIsRegistering(false);

		} catch (err) {
			setError(err.message);
			console.error("Registration error:", err);
		}
	};

	let logout = () => {

		localStorage.removeItem("token");
		localStorage.removeItem("user");

		dispatch({ type: "logout" });

		navigate("/");
	};

	let accessProtected = async () => {
		try {
			if (!store.auth.token) throw new Error("No authentication token found");

			let backendUrl = import.meta.env.VITE_BACKEND_URL;
			let response = await fetch(`${backendUrl}/protected`, {
				method: "GET",
				headers: {
					"Content-Type": "application/json",
					"Authorization": `Bearer ${store.auth.token}`,
				},
			});

			let data = await response.json();

			if (response.ok) {
				alert(`Protected data: ${JSON.stringify(data)}`);
			} else {
				throw new Error(data.message || "Access to protected route failed");
			}
		} catch (err) {
			console.error("Protected route error:", err);
			alert(err.message);
		}
	};

	useEffect(() => {

		if (store.auth.isAuthenticated) {
			navigate("/dashboard");
		} else {
			loadMessage();
		}
	}, [store.auth.isAuthenticated]);

	return (
		<div className="text-center mt-5">
			<h1 className="display-4">Hello Rigo!!</h1>
			<p className="lead">
				<img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
			</p>

			{!store.auth.isAuthenticated ? (
				<div className="mb-4">
					<h2>{isRegistering ? "Register" : "Login"}</h2>

					{error && <div className="alert alert-danger">{error}</div>}

					<div className="mb-3">
						<input
							type="email"
							className="form-control"
							placeholder="Email"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
						/>
					</div>
					<div className="mb-3">
						<input
							type="password"
							className="form-control"
							placeholder="Password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
						/>
					</div>

					{isRegistering ? (
						<>
							<button className="btn btn-primary me-2" onClick={register}>
								Register
							</button>
							<button
								className="btn btn-link"
								onClick={() => setIsRegistering(false)}
							>
								Already have an account? Login
							</button>
						</>
					) : (
						<>
							<button className="btn btn-primary me-2" onClick={login}>
								Login
							</button>
							<button
								className="btn btn-link"
								onClick={() => setIsRegistering(true)}
							>
								Don't have an account? Register
							</button>
						</>
					)}
				</div>
			) : (
				<div className="mb-4">
					<h2>Welcome!</h2>
					<p>You are logged in as: {store.auth.user?.email}</p>
					<button className="btn btn-success me-2" onClick={accessProtected}>
						Access Protected Route
					</button>
					<button className="btn btn-danger" onClick={logout}>
						Logout
					</button>
				</div>
			)}

			<div className="alert alert-info">
				{store.message ? (
					<span>{store.message}</span>
				) : (
					<span className="text-danger">
						Loading message from the backend (make sure your python 🐍 backend is running)...
					</span>
				)}
			</div>
		</div>
	);
};