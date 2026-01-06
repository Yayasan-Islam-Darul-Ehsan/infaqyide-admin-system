import React, { useState } from "react";
import Icon from "@/components/ui/Icon";

const Alert = ({
	children,
	className = "alert-dark",
	icon,
	toggle,
	dismissible,
	label,
}) => {
	const [isShow, setIsShow] = useState(true);
	const [isClosing, setIsClosing] = useState(false);

	const handleDestroy = () => {
		setIsClosing(true);
		setTimeout(() => {
			setIsShow(false);
		}, 300); // Match animation duration
	};

	return (
		<>
			{isShow ? (
				<div className={`alert ${className} ${isClosing ? "alert-closing" : "alert-entering"}`}>
					<div className="flex items-start space-x-4 rtl:space-x-reverse">
						{icon && (
							<div className="flex-shrink-0 mt-0.5">
								<div className="alert-icon-wrapper"><Icon icon={icon} className="alert-icon" /></div>
							</div>
						)}
						<div className="flex-1 min-w-0">
							{children ? children : label}
						</div>
						{(dismissible || toggle) && (
							<div
								className="flex-shrink-0 ml-auto cursor-pointer transition-all duration-200 hover:scale-110 active:scale-95 opacity-70 hover:opacity-100"
								onClick={dismissible ? handleDestroy : toggle}
							>
								<Icon icon="heroicons-outline:x" className="w-5 h-5"/>
							</div>
						)}
					</div>
				</div>
			) : null}
		</>
	);
};

export default Alert;
