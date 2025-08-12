import React from "react";
import { Link } from "react-router-dom";
import ForgotPass from "./common/forgot-pass";
import useDarkMode from "@/hooks/useDarkMode";
import LeftColumn from "./common/left-column";

const LupaKataLaluan = () => {

  	const [isDark] = useDarkMode();
	return (
		<div className="loginwrapper">
		<div className="lg-inner-column">
			<LeftColumn />
			<div className="right-column relative">
			<div className="inner-content h-full flex flex-col bg-white dark:bg-slate-800">
				<div className="auth-box2 flex flex-col justify-center h-full">
				
				<div className="mobile-logo text-center mb-6 lg:hidden block justify-center items-center mx-auto">
					<Link to="/">
					<img src={"https://al-jariyah.com/static/media/logo_dark.c4a29d4218fc5c3e72e0.png"} alt="" className="max-w-[120px] object-contain"/>
					</Link>
				</div>

				<div className="text-center 2xl:mb-10 mb-4">
					<h4 className="font-semibold">Lupa Kata Laluan</h4>
					<div className="text-slate-500 text-sm">
						Lengkapkan maklumat anda di bawah untuk memohon tukar kata laluan.
					</div>
				</div>

				<ForgotPass />
				
				</div>
				<div className="auth-footer text-center">Copyright {new Date().getFullYear()}, Hak Cipta Terpelihara InfaqYIDE.</div>
			</div>
			</div>
		</div>
		</div>
	);
};

export default LupaKataLaluan;
