import React from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import useDarkMode from "@/hooks/useDarkMode";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";
import { useSelector } from "react-redux";

const SidebarLogo = ({ menuHover }) => {
  
	const [isDark] 						= useDarkMode();
  	const [collapsed, setMenuCollapsed] = useSidebar();
  	const [isSemiDark] 					= useSemiDark();
  	const [skin] 						= useSkin();

	const { user } = useSelector((user) => user.auth)
	
	return (
		<div className={` logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] py-6 px-4${menuHover ? "" : ""}
		${skin === "bordered" ? " border-b border-r-0 border-slate-200 dark:border-slate-700" : " border-none"}`}
		>
		<Link to="/dashboard">
			<div className="flex items-center">
			<div className="logo-icon">
				{!isDark && !isSemiDark ? (
				<img src={"https://is1-ssl.mzstatic.com/image/thumb/Purple112/v4/89/80/fe/8980fe8a-9e65-d611-b7b9-9be5d186d4b3/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp"} 	alt="" className="w-[70px] h-[70px]"/> ) : 
				(<img src={"https://is1-ssl.mzstatic.com/image/thumb/Purple112/v4/89/80/fe/8980fe8a-9e65-d611-b7b9-9be5d186d4b3/AppIcon-0-0-1x_U007emarketing-0-0-0-7-0-0-sRGB-0-0-0-GLES2_U002c0-512MB-85-220-0-0.png/230x0w.webp"}	alt="" className="w-[70px] h-[70px]"/>)}
			</div>

			{(!collapsed || menuHover) && (
				<div>
					<h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user.role}</h1>
				</div>
			)}
			</div>
		</Link>
		</div>
	);
};

export default SidebarLogo;
