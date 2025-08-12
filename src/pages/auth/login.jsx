import React from "react";
import { Link } from "react-router-dom";
import LoginForm from "./common/login-form";
import Social from "./common/social";
import useDarkMode from "@/hooks/useDarkMode";

// image import
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import Illustration from "@/assets/images/auth/ils1.svg";

const Login = () => {

	const [isDark] = useDarkMode();
	return (
		<div className="loginwrapper">
		<div className="lg-inner-column">
			<div className="left-column w-full h-full flex justify-center items-center">
				<div className="w-full h-full flex flex-col justify-center items-center">
					<img src={"https://al-jariyah.com/static/media/logo_dark.c4a29d4218fc5c3e72e0.png"} alt="" className="max-w-[250px] object-contain"/>
					<div className="mt-6">
						<p className="font-semibold text-2xl text-gray-900">Sistem Pengurusan Institusi</p>
					</div>
				</div>
			</div>
			<div className="right-column relative">
			<div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
				<div className="auth-box h-full flex flex-col justify-center">

				<div className="mobile-logo text-center mb-6 lg:hidden block justify-center items-center mx-auto">
					<Link to="/">
					<img src={"https://al-jariyah.com/static/media/logo_dark.c4a29d4218fc5c3e72e0.png"} alt="" className="max-w-[120px] object-contain"/>
					</Link>
				</div>

				<div className="text-center 2xl:mb-10 mb-4">
					<h4 className="font-semibold">Log Masuk</h4>
					<div className="text-slate-500 text-sm">
						Log masuk akaun anda untuk mula menggunakan sistem pengurusan institusi Al-Jariyah
					</div>
				</div>

				<LoginForm />

				</div>
				<div className="auth-footer text-center">Copyright {new Date().getFullYear()}, Hak Cipta Terpelihara Al-Jariyah.</div>
			</div>
			</div>
		</div>
		</div>
	);
};

export default Login;
