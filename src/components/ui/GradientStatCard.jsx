import React from "react";
import Icon from "@/components/ui/Icon";

const THEMES = {
	orange: "from-amber-400 via-orange-500 to-rose-500 shadow-orange-500/30",
	blue: "from-sky-400 via-blue-500 to-indigo-600 shadow-blue-500/30",
	green: "from-emerald-400 via-teal-500 to-cyan-600 shadow-teal-500/30",
	purple: "from-violet-500 via-purple-600 to-fuchsia-600 shadow-purple-500/30",
	rose: "from-pink-500 via-rose-500 to-red-500 shadow-rose-500/30",
	slate: "from-slate-500 via-slate-600 to-slate-800 shadow-slate-500/30",
};

// Kad statistik bergradient dengan bulatan hiasan
const GradientStatCard = ({ label, value, caption, badge, icon, theme = "blue", loading = false }) => {
	return (
		<div className={`relative overflow-hidden rounded-2xl bg-gradient-to-br p-6 text-white shadow-lg ${THEMES[theme] || THEMES.blue}`}>
			<div className="pointer-events-none absolute -right-10 -top-16 h-44 w-44 rounded-full bg-white/10" />
			<div className="pointer-events-none absolute -bottom-20 -right-4 h-44 w-44 rounded-full bg-white/10" />

			<div className="relative">
				<div className="flex items-start justify-between gap-3">
					<p className="text-xs font-semibold uppercase tracking-[0.15em] text-white">{label}</p>
					{badge ? (
						<span className="whitespace-nowrap rounded-lg bg-white/20 px-2 py-0.5 text-xs font-semibold backdrop-blur-sm">{badge}</span>
					) : icon ? (
						<Icon icon={icon} className="text-2xl text-white" />
					) : null}
				</div>
				{loading ? (
					<div className="mt-4 h-9 w-2/3 animate-pulse rounded-lg bg-white/25" />
				) : (
					<p className="mt-3 text-xl font-bold">{value}</p>
				)}
				{caption && <p className="mt-2 text-sm font-medium text-white">{caption}</p>}
			</div>
		</div>
	);
};

export default GradientStatCard;
