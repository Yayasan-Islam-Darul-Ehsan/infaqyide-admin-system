import React from "react";
import useDarkMode from "@/hooks/useDarkMode";
import { Link } from "react-router-dom";
import useWidth from "@/hooks/useWidth";

const Logo = () => {
	const [isDark] = useDarkMode();
	const { width, breakpoints } = useWidth();

	return (
		<div>
			<Link to="/dashboard">
				{width >= breakpoints.xl ? (
				<img src={"https://al-jariyah.com/static/media/logo_dark.c4a29d4218fc5c3e72e0.png"} alt="" className="max-w-[30px] object-contain"/>
				) : (
				<img src={"https://al-jariyah.com/static/media/logo_dark.c4a29d4218fc5c3e72e0.png"} alt="" className="max-w-[30px] object-contain"/>
				)}
			</Link>
		</div>
	);
};

export default Logo;
