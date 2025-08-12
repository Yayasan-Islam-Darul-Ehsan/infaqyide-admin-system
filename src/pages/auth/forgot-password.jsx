import React from "react";
import { Link } from "react-router-dom";
import ForgotPass from "./common/forgot-pass";
import useDarkMode from "@/hooks/useDarkMode";

const LupaKataLaluan = () => {

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
				{/* <div className="md:max-w-[345px] mx-auto font-normal text-slate-500 dark:text-slate-400 2xl:mt-12 mt-8 uppercase text-sm">
					Forget It,
					<Link
					to="/"
					className="text-slate-900 dark:text-white font-medium hover:underline"
					>
					Send me Back
					</Link>
					to The Sign In
				</div> */}
				</div>
				<div className="auth-footer text-center">Copyright {new Date().getFullYear()}, Hak Cipta Terpelihara Al-Jariyah.</div>
			</div>
			</div>
		</div>
		</div>
	);
};

export default LupaKataLaluan;
