import React from "react";
import { Link } from "react-router-dom";
import useDarkMode from "@/hooks/useDarkMode";
import RegForm from "./common/reg-from";
import Social from "./common/social";
import { ToastContainer } from "react-toastify";
// image import
import LogoWhite from "@/assets/images/logo/logo-white.svg";
import Logo from "@/assets/images/logo/logo.svg";
import Illustration from "@/assets/images/auth/ils1.svg";
import LeftColumn from "./common/left-column";
import FormWizard from "../forms/form-wizard/HorizentalWizard";

const Register = () => {

	const [isDark] = useDarkMode();
	return (
		<div className="loginwrapper">
		<div className="lg-inner-column">
			<LeftColumn />
			<div className="right-column relative bg-white dark:bg-slate-800">
			<div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
				<div className="auth-box h-full flex flex-col justify-center">
				
				<div className="mobile-logo text-center mb-6 lg:hidden block justify-center items-center mx-auto">
					<Link to="/">
					<img src={"https://al-jariyah.com/static/media/logo_dark.c4a29d4218fc5c3e72e0.png"} alt="" className="max-w-[120px] object-contain"/>
					</Link>
				</div>

				<div className="text-center 2xl:mb-10 mb-4">
					<h4 className="font-semibold">Pendaftaran Institusi</h4>
					<div className="text-slate-500 text-sm">
						Lengkapkan maklumat anda di bawah untuk mendaftar sebagai institusi InfaqYIDE.
					</div>
				</div>

				<RegForm />
				
				<div className="max-w-[300px] mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-6 text-sm">
					Sudah berdaftar? Sila klik <Link to="/" className="text-slate-900 dark:text-white font-medium hover:underline">log masuk</Link>
				</div>
				</div>
				<div className="auth-footer text-center">
					Copyright {new Date().getFullYear()}, Hak Cipta Terpelihara InfaqYIDE.
				</div>
			</div>
			</div>
		</div>
		</div>
	);
};

export default Register;
