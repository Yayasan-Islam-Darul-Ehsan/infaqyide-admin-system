import React, { useState } from "react";
import Textinput from "@/components/ui/Textinput";
import { useNavigate } from "react-router-dom";
import Checkbox from "@/components/ui/Checkbox";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";

import { toast } from "react-toastify";

import { Spinner } from "evergreen-ui";
import { AUTH__LOGIN } from "@/utils/global__function";
import { setUser } from "@/store/api/auth/authSlice";
import Button from "@/components/ui/Button";


const LoginForm = () => {

	const dispatch 					= useDispatch();
  	const navigate 					= useNavigate();

	const [username, set_username] 	= useState("")
	const [password, set_password] 	= useState("")  
	const [loading, set_loading] 	= useState(false)
	const [checked, setChecked] 	= useState(false);

  	const onSubmit = async (e) => {
		e.preventDefault()
		set_loading(true)
		if(!username) {
			toast.error("Nama penggunga atau e-mel tidak boleh kosong. Sila lengkapkan maklumat anda.", {
				position: "top-right",
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
		} 
		else if(!password) {
			toast.error("Kata laluan tidak boleh kosong. Sila lengkapkan maklumat.", {
				position: "top-right",
				autoClose: 1500,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
		} 
		else 
		{
			let json = { 
				username: username.trim(), 
				password: password.trim(),
				ACCOUNT_USERNAME: username.trim(),
				ACCOUNT_PASSWORD: password.trim()
			}
			
			//let api = await SSO("auth/login", json, "POST", false)
			let api = await AUTH__LOGIN(username.trim(), password.trim())

			if(api.status_code === 200 || api.status === 200) {

				sessionStorage.clear()

				window.sessionStorage.setItem("_aT", api.data.token)
				window.sessionStorage.setItem("token", api.data.token)
				window.sessionStorage.setItem("user", JSON.stringify(api.data.user))
				dispatch(setUser(api.data.user))

				toast.success(api.message)
				//navigate("/dashboard");

				let currentUrl = window.location.href; // Example: "https://example.com/login/a=kjaksdu712nsd7fnas"
				let encryptedPath = currentUrl.split('/a=')[1];

				// 2. Check if the encrypted data exists
				if (encryptedPath) {
					try {
					// 3. Decode the base64-encoded path using atob()
					const decodedPath = atob(encryptedPath); // Example: "/dashboard"
				
					setTimeout(() => {
						window.location.href = decodedPath;
					}, 1000);
					// 4. Redirect to the decoded path
					
					} catch (error) {
					console.error('Failed to decode the path:', error);
					// Optionally handle the error (e.g., show an error message or redirect to a fallback page)
					setTimeout(() => {
						window.location.href = "/dashboard";
					}, 1000);
					}
				} else {
					console.error('No encrypted path found.');
					// Redirect to login or fallback page if no encrypted data is present
					setTimeout(() => {
						window.location.href = "/dashboard";
					}, 1000);
				}
				
			} else {
				toast.error(api.message, {
					position: "top-right",
					autoClose: 1500,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
					theme: "light",
				});
			}
		}
		set_loading(false)
  	};

  	return (
    	<form onSubmit={onSubmit} className="space-y-4">
		<Textinput
			name="Username"
			label="Nama pengguna atau e-mel"
			placeholder="pengguna / pengguna@email.com"
			className="h-[48px]"
			onChange={e => set_username(e.target.value)}
			defaultValue={username}
			register={() => {}}
		/>
		<Textinput
			name="Password"
			label="Kata laluan"
			placeholder="••••••••"
			type="password"
			className="h-[48px]"
			onChange={e => set_password(e.target.value)}
			defaultValue={password}
			register={() => {}}
			hasicon={true}
		/>
		<div className="flex justify-between">
			{/* <Checkbox value={checked} onChange={() => setChecked(!checked)} label="Keep me signed in"/> */}
			<Checkbox value={checked} onChange={() => setChecked(!checked)} label="Ingat saya"/>
			<Link to="/forgot-password" className="text-sm text-slate-800 dark:text-slate-400 leading-6 font-medium">
				Lupa Kata Laluan?{" "}
			</Link>
		</div>
		
		{
			loading ? 
			<button disabled className="btn bg-gray-300 text-white w-full text-center flex justify-center items-center">
				<Spinner width={20} />
			</button> :
			<button className="btn bg-teal-600 text-white block w-full text-center">Log Masuk</button>
		}

		

		<div className="mt-6 w-full">
			<Button className="w-full bg-gray-900 text-white" onClick={() => navigate("/register")}>Pendaftaran Institusi</Button>
		</div>
    	</form>
  	);
};

export default LoginForm;
