import React, { useEffect, Suspense } from "react";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import Loading from "@/components/Loading";

const AuthLayout = () => {

  	const navigate 		= useNavigate();
	const token 		= window.sessionStorage.getItem("_aT")

	useEffect(() => {
    	if (token) {
      		navigate("/dashboard");
    	}
  	}, [token]);

	return (
		<>
		<Suspense fallback={<Loading />}>
			<ToastContainer />
			{<Outlet />}
		</Suspense>
		</>
	);
};

export default AuthLayout;
