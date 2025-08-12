import React from "react";
import { Link } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import useDarkMode from "@/hooks/useDarkMode";
import useSidebar from "@/hooks/useSidebar";
import useSemiDark from "@/hooks/useSemiDark";
import useSkin from "@/hooks/useSkin";

const SidebarLogo = ({ menuHover }) => {
  
	const [isDark] 						= useDarkMode();
  	const [collapsed, setMenuCollapsed] = useSidebar();
  	const [isSemiDark] 					= useSemiDark();
  	const [skin] 						= useSkin();
	
	return (
		<div className={` logo-segment flex justify-between items-center bg-white dark:bg-slate-800 z-[9] py-6 px-4${menuHover ? "" : ""}
		${skin === "bordered" ? " border-b border-r-0 border-slate-200 dark:border-slate-700" : " border-none"}`}
		>
		<Link to="/dashboard">
			<div className="flex items-center">
			<div className="logo-icon">
				{!isDark && !isSemiDark ? (
				<img src={"https://play-lh.googleusercontent.com/Eg3F9LWGFQPK2EQAyVzbpunhM24FXLGpFgzlqkA-SnwD65l4pX5MKrqDAFwuFsTXdws"} 	alt="" className="w-[70px] h-[70px]"/> ) : 
				(<img src={"https://play-lh.googleusercontent.com/Eg3F9LWGFQPK2EQAyVzbpunhM24FXLGpFgzlqkA-SnwD65l4pX5MKrqDAFwuFsTXdws"}	alt="" className="w-[70px] h-[70px]"/>)}
			</div>

			{(!collapsed || menuHover) && (
				<div>
					<h1 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Pengurusan Institusi</h1>
				</div>
			)}
			</div>
		</Link>
		</div>
	);
};

export default SidebarLogo;
