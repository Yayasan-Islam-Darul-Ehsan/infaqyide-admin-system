import React, { useState } from "react";
import Dropdown from "@/components/ui/Dropdown";
import Icon from "@/components/ui/Icon";
import { Menu, Transition } from "@headlessui/react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logOut } from "@/store/api/auth/authSlice";

import UserAvatar from "@/assets/images/all-img/user.png";

const profileLabel = () => {

	const { user } = useSelector(a => a.auth)

	let [session_user, set_session_user] = useState(JSON.parse(sessionStorage.getItem("user")))
	
	return (
		<div className="flex items-center">
		<div className="flex-1 ltr:mr-[10px] rtl:ml-[10px]">
			<div className="lg:h-8 lg:w-8 h-7 w-7 rounded-full">
			<img
				src={(user && user.image) ? user.image : 'https://cdn-icons-png.flaticon.com/128/1077/1077063.png'} alt="https://cdn-icons-png.flaticon.com/128/1077/1077063.png" className="block w-full h-full object-contain rounded-full bg-gray-100"
				onError={e => {
					e.src = "https://cdn-icons-png.flaticon.com/128/1077/1077063.png"
				}}
			/>
			</div>
		</div>
		
		<div className="flex-none text-slate-600 dark:text-white text-sm font-normal items-center lg:flex hidden overflow-hidden text-ellipsis whitespace-nowrap">
			<span className="overflow-hidden text-ellipsis whitespace-nowrap w-[85px] block">
			{user ? user.username : ""}
			</span>
			<span className="text-base inline-block ltr:ml-[10px] rtl:mr-[10px]">
			<Icon icon="heroicons-outline:chevron-down"></Icon>
			</span>
		</div>
		</div>
	);
};

const Profile = () => {

	const navigate = useNavigate();
	const dispatch = useDispatch();

	const handleLogout = () => {
		sessionStorage.removeItem("_aT");
		sessionStorage.removeItem("user");
		sessionStorage.removeItem("tanggungan")
		sessionStorage.clear()
		dispatch(logOut());
		//navigate("/")
		window.location.href = "/"
	};

	const ProfileMenu = [
		// { 
		// 	label: "Profile",
		// 	icon: "heroicons-outline:user",
		// 	action: () => {
		// 		navigate("/profile");
		// 	},
		// },
		// {
		// 	label: "Settings",
		// 	icon: "heroicons-outline:cog",
		// 	action: () => {
		// 		navigate("/settings");
		// 	},
		// },
		{
			label: "Log Keluar",
			icon: "heroicons-outline:login",
			action: () => {
				dispatch(handleLogout);
			},
		},
	];

	return (
		<Dropdown label={profileLabel()} classMenuItems="w-[180px] top-[58px]">
		{ProfileMenu.map((item, index) => (
			<Menu.Item key={index}>
			{({ active }) => (
				<div
				onClick={() => item.action()}
				className={`${
					active
					? "bg-slate-100 text-slate-900 dark:bg-slate-600 dark:text-slate-300 dark:bg-opacity-50"
					: "text-slate-600 dark:text-slate-300"
				} block     ${
					item.hasDivider
					? "border-t border-slate-100 dark:border-slate-700"
					: ""
				}`}
				>
				<div className={`block cursor-pointer px-4 py-2`}>
					<div className="flex items-center">
					<span className="block text-xl ltr:mr-3 rtl:ml-3">
						<Icon icon={item.icon} />
					</span>
					<span className="block text-sm">{item.label}</span>
					</div>
				</div>
				</div>
			)}
			</Menu.Item>
		))}
		</Dropdown>
	);
};

export default Profile;
