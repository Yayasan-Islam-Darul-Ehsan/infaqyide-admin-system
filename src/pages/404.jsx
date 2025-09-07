import React from "react";
import { Link } from "react-router-dom";

import ErrorImage from "@/assets/images/all-img/404-2.svg";
function Error() {
	return (
		<div className="min-h-screen flex flex-col justify-center items-center text-center py-20 dark:bg-slate-900">
			<img src={ErrorImage} alt="" />
			<div className="max-w-[546px] mx-auto w-full mt-12">
				<h4 className="text-slate-900 mb-4">Laman Belum Tersedia</h4>
				<div className="dark:text-white text-base font-normal mb-10">
					Halaman yang anda cari mungkin telah dipadamkan, ditukar namanya, atau sedang tidak tersedia buat sementara waktu.
				</div>
			</div>
			<div className="max-w-[300px] mx-auto w-full">
				<Link to="/dashboard" className="btn btn-primary bg-teal-600 text-white ring-teal-700 dark:bg-teal-800 block text-center">
					Halaman Utama
				</Link>
			</div>
		</div>
	);
}

export default Error;
