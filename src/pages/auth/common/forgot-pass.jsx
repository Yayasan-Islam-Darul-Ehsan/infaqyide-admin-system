import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { Alert, Spinner } from "evergreen-ui";
import { toast } from "react-toastify";
import { API } from "@/utils/api";
import Button from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";

const ForgotPass = () => {

	const navigate = useNavigate()
	const [username, set_username] 		= useState("")
	const [useremail, set_useremail]	= useState("")  
	const [loading, set_loading] 		= useState(false)

	const [status, set_status] 			= useState(null)

	const onSubmit = async (e) => {
		e.preventDefault()
		set_loading(true)

		if(!username) {
			set_loading(false)
			toast.error("Sila lengkapkan ruangan nama pengguna anda.")
		}
		else if(!useremail) {
			set_loading(false)
			toast.error("Sila lengkapkan ruangan E-mel anda.")
		}
		else {

			let json = {
				USERNAME: username.trim(),
				USEREMAIL: useremail.trim()
			}

			let api = await API("request-forgot-password", json)

			if(api.status_code === 200) {
				toast.success(api.message)
				set_status(api)
			} else {
				toast.error(api.message)
				set_status(api)
			}
		}

		set_loading(false)
	};

	return (
		<form onSubmit={onSubmit} className="space-y-4 ">
		
		{
			status === null && (
				<>
				<Textinput
					name="Username"
					label="Nama Pengguna"
					placeholder="Nama Pengguna"
					className="h-[48px]"
					onChange={e => set_username(e.target.value)}
					defaultValue={username}
					register={() => {}}
				/>

				<Textinput
					name="E-mel"
					label="E-mel"
					placeholder="nama_pengguna@email.com"
					className="h-[48px]"
					onChange={e => set_useremail(e.target.value)}
					defaultValue={useremail}
					register={() => {}}
				/>

				{
					loading ? 
					<button disabled className="btn bg-gray-300 text-white w-full text-center flex justify-center items-center">
						<Spinner width={20} />
					</button> :
					<button className="btn bg-teal-600 text-white block w-full text-center">Tukar Kata Laluan</button>
				}
				</>
			)
		}

		{
			status !== null && (
				<>
				<div className="w-full flex flex-col justify-center items-center">

					<div>
						<Alert 
						intent={status.status_code === 200 ? "success" : "danger"} 
						title={status.status_code === 200 ? "Permohonan Berjaya" : "Sistem Ralat"}
						>
							{status.message}
						</Alert>
					</div>

					<div className="mt-6 flex justify-center items-center">
						<Button className="bg-teal-600 text-white" onClick={() => set_status(null)}>Reset Semula</Button>
					</div>
					<div className="mt-6 flex justify-center items-center">
						<Button className="" onClick={() => navigate("/")}>Kembali</Button>
					</div>
				</div>
				</>
			)
		}
		
		</form>
	);
};

export default ForgotPass;
