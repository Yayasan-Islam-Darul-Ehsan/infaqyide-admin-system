import React, { useState } from "react";
import { Collapse } from "react-collapse";
import { NavLink } from "react-router-dom";
import Icon from "@/components/ui/Icon";
import Multilevel from "./Multi";

const Submenu = ({ activeSubmenu, item, i, toggleMultiMenu, activeMultiMenu }) => {
	return (
		<Collapse isOpened={activeSubmenu === i}>
		<ul className="sub-menu  space-y-4  ">
			{item.child?.map((subItem, j) => (
			<li key={j} className="block pl-4 pr-1 first:pt-4  last:pb-4">
				{subItem?.multi_menu ? (
				<div>
					<div onClick={() => toggleMultiMenu(j)} className={`${
						activeMultiMenu
						? " text-[#2f7d5b] dark:text-[#7fd1a8] font-semibold"
						: "text-slate-600 dark:text-slate-300"
					} text-sm flex space-x-3 items-center transition-all duration-150 cursor-pointer rtl:space-x-reverse`}>
					<span
						className={`${ activeMultiMenu === j
							? " bg-[#3a9366] border-[#3a9366] dark:bg-[#7fd1a8] dark:border-[#7fd1a8] ring-4 ring-[#3a9366]/20 dark:ring-[#7fd1a8]/20"
							: ""
						} h-2 w-2 rounded-full border border-slate-600 dark:border-white inline-block flex-none `}
					></span>
					<span className="flex-1">{subItem.childtitle}</span>
					<span className="flex-none">
						<span
						className={`menu-arrow transform transition-all duration-300 ${
							activeMultiMenu === j ? " rotate-90" : ""
						}`}
						>
						<Icon icon="ph:caret-right" />
						</span>
					</span>
					</div>
					<Multilevel
					activeMultiMenu={activeMultiMenu}
					j={j}
					subItem={subItem}
					/>
				</div>
				) : (
				<NavLink to={subItem.childlink}>
					{({ isActive }) => (
					<span
						className={`${
						isActive
							? " text-[#2f7d5b] dark:text-[#7fd1a8] font-semibold"
							: "text-slate-600 dark:text-slate-300"
						} text-sm flex space-x-3 items-center transition-all duration-150 rtl:space-x-reverse`}
					>
						<span
						className={`${
							isActive
							? " bg-[#3a9366] border-[#3a9366] dark:bg-[#7fd1a8] dark:border-[#7fd1a8] ring-4 ring-[#3a9366]/20 dark:ring-[#7fd1a8]/20"
							: ""
						} h-2 w-2 rounded-full border border-slate-600 dark:border-white inline-block flex-none`}
						></span>
						<span className="flex-1">{subItem.childtitle}</span>
					</span>
					)}
				</NavLink>
				)}
			</li>
			))}
		</ul>
		</Collapse>
	);
};

export default Submenu;
