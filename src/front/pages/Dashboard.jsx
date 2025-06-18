import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import useGlobalReducer from "../hooks/useGlobalReducer.jsx";
import rigoImageUrl from "../assets/img/rigo-baby.jpg";

export const Dashboard = () => {
    const { store, dispatch } = useGlobalReducer();
    const navigate = useNavigate();


    useEffect(() => {
        if (!store.auth.isAuthenticated || !store.auth.token) {
            navigate("/");
        }
    }, [store.auth.isAuthenticated, navigate]);

    const loadProtectedData = async () => {
        try {
            const backendUrl = import.meta.env.VITE_BACKEND_URL;
            const response = await fetch(`${backendUrl}/protected`, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${store.auth.token}`
                }
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.message || "Failed to fetch protected data");
            }


            console.log("Protected data:", data);
            return data;
        } catch (error) {
            console.error("Error loading protected data:", error);

            if (error.message.includes("token") || error.message.includes("authentication")) {
                dispatch({ type: "logout" });
                localStorage.removeItem("token");
                localStorage.removeItem("user");
                navigate("/");
            }
        }
    };


    useEffect(() => {
        if (store.auth.isAuthenticated) {
            loadProtectedData();
        }
    }, [store.auth.isAuthenticated]);

    if (!store.auth.isAuthenticated) {
        return null;
    }

    return (
        <div className="text-center mt-5">
            <h1 className="display-4">Welcome to your Dashboard!</h1>
            <p className="lead">
                <img src={rigoImageUrl} className="img-fluid rounded-circle mb-3" alt="Rigo Baby" />
            </p>

            <div className="card mx-auto" style={{ maxWidth: '500px' }}>
                <div className="card-body">
                    <h3 className="card-title">Private Content</h3>
                    <p className="card-text">
                        Hello, <strong>{store.auth.user?.email}</strong>!
                    </p>
                    <p className="card-text">
                        This content is protected and only visible to authenticated users.
                    </p>

                    <div className="mt-4">
                        <button
                            className="btn btn-primary me-2"
                            onClick={loadProtectedData}
                        >
                            Refresh Protected Data
                        </button>
                        <button
                            className="btn btn-danger"
                            onClick={() => {
                                dispatch({ type: "logout" });
                                localStorage.removeItem("token");
                                localStorage.removeItem("user");
                                navigate("/");
                            }}
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="alert alert-info mt-4 mx-auto" style={{ maxWidth: '600px' }}>
                {store.message && (
                    <span>Backend message: {store.message}</span>
                )}
            </div>
        </div>
    );
};