import { SYSADMIN_API } from "@/utils/api";
import React, { useState, useEffect } from "react";

// Mock data for demonstration
const mockData = {
	success: true,
	data: [
		{
			autoInfaqId: 74,
			autoInfaqName: "Infaq RM5 Anak Yatim Setiap Subuh",
			autoInfaqCode: "55b01207-de7e-11f0-bd37-da275a942d34",
			autoInfaqAccountId: 1633,
			autoInfaqAmount: 5,
			autoInfaqPaymentType: "Kredit",
			autoInfaqScheduleDay: "Isnin,Selasa,Rabu,Khamis,Jumaat,Sabtu,Ahad",
			autoInfaqScheduleTime: "04:00:00",
			autoInfaqStartDate: "2025-12-21T16:00:00.000Z",
			autoInfaqExpiredDate: "2025-12-30T16:00:00.000Z",
			autoInfaqStatus: 1,
			autoInfaqCreatedDate: "2025-12-21T23:04:23.000Z",
		},
		{
			autoInfaqId: 73,
			autoInfaqName: "Subuh",
			autoInfaqCode: "063145dd-de12-11f0-bd37-da275a942d34",
			autoInfaqAccountId: 284,
			autoInfaqAmount: 1,
			autoInfaqPaymentType: "Kredit",
			autoInfaqScheduleDay: "Isnin,Selasa,Rabu,Khamis,Jumaat,Sabtu,Ahad",
			autoInfaqScheduleTime: "06:30:00",
			autoInfaqStartDate: "2025-12-20T16:00:00.000Z",
			autoInfaqExpiredDate: "2026-12-20T16:00:00.000Z",
			autoInfaqStatus: 1,
			autoInfaqCreatedDate: "2025-12-21T10:09:04.000Z",
		},
		{
			autoInfaqId: 72,
			autoInfaqName: "Infaq Subuh",
			autoInfaqCode: "8d14b8de-dbb4-11f0-b587-da275a942d34",
			autoInfaqAccountId: 424,
			autoInfaqAmount: 2,
			autoInfaqPaymentType: "Kredit",
			autoInfaqScheduleDay: "Isnin,Selasa,Rabu,Khamis,Jumaat,Sabtu,Ahad",
			autoInfaqScheduleTime: "06:00:00",
			autoInfaqStartDate: "2025-12-17T16:00:00.000Z",
			autoInfaqExpiredDate: "2026-02-18T16:00:00.000Z",
			autoInfaqStatus: 1,
			autoInfaqCreatedDate: "2025-12-18T09:54:55.000Z",
		},
		{
			autoInfaqId: 71,
			autoInfaqName: "Rm2 setiap subuh",
			autoInfaqCode: "76840677-db3f-11f0-b587-da275a942d34",
			autoInfaqAccountId: 1935,
			autoInfaqAmount: 2,
			autoInfaqPaymentType: "Kredit",
			autoInfaqScheduleDay: "Isnin,Selasa,Rabu,Khamis,Jumaat,Sabtu,Ahad",
			autoInfaqScheduleTime: "06:00:00",
			autoInfaqStartDate: "2025-12-16T16:00:00.000Z",
			autoInfaqExpiredDate: "2026-02-04T16:00:00.000Z",
			autoInfaqStatus: 1,
			autoInfaqCreatedDate: "2025-12-17T19:56:46.000Z",
		},
		{
			autoInfaqId: 70,
			autoInfaqName: "Infaq RM1 setiap isya",
			autoInfaqCode: "86c2c027-d87d-11f0-b587-da275a942d34",
			autoInfaqAccountId: 2180,
			autoInfaqAmount: 1,
			autoInfaqPaymentType: "Kredit",
			autoInfaqScheduleDay: "Isnin,Selasa,Rabu,Khamis,Jumaat,Sabtu,Ahad",
			autoInfaqScheduleTime: "21:00:00",
			autoInfaqStartDate: "2025-12-12T16:00:00.000Z",
			autoInfaqExpiredDate: "2026-12-12T16:00:00.000Z",
			autoInfaqStatus: 1,
			autoInfaqCreatedDate: "2025-12-14T07:43:29.000Z",
		},
		{
			autoInfaqId: 69,
			autoInfaqName: "Infaq RM1 setiap maghrib",
			autoInfaqCode: "50681282-d87d-11f0-b587-da275a942d34",
			autoInfaqAccountId: 2180,
			autoInfaqAmount: 1,
			autoInfaqPaymentType: "Kredit",
			autoInfaqScheduleDay: "Isnin,Selasa,Rabu,Khamis,Jumaat,Sabtu,Ahad",
			autoInfaqScheduleTime: "20:00:00",
			autoInfaqStartDate: "2025-12-12T16:00:00.000Z",
			autoInfaqExpiredDate: "2026-12-12T16:00:00.000Z",
			autoInfaqStatus: 1,
			autoInfaqCreatedDate: "2025-12-14T07:41:57.000Z",
		},
		{
			autoInfaqId: 68,
			autoInfaqName: "Infaq RM1 setiap asar",
			autoInfaqCode: "0f40cd01-d87d-11f0-b587-da275a942d34",
			autoInfaqAccountId: 2180,
			autoInfaqAmount: 1,
			autoInfaqPaymentType: "Kredit",
			autoInfaqScheduleDay: "Isnin,Selasa,Rabu,Khamis,Jumaat,Sabtu,Ahad",
			autoInfaqScheduleTime: "17:00:00",
			autoInfaqStartDate: "2025-12-12T16:00:00.000Z",
			autoInfaqExpiredDate: "2026-12-12T16:00:00.000Z",
			autoInfaqStatus: 0,
			autoInfaqCreatedDate: "2025-12-14T07:40:08.000Z",
		},
		{
			autoInfaqId: 67,
			autoInfaqName: "Infaq Jumaat",
			autoInfaqCode: "f8082b67-d7e6-11f0-b587-da275a942d34",
			autoInfaqAccountId: 1359,
			autoInfaqAmount: 5,
			autoInfaqPaymentType: "Kredit",
			autoInfaqScheduleDay: "Jumaat",
			autoInfaqScheduleTime: "06:30:00",
			autoInfaqStartDate: "2025-12-12T16:00:00.000Z",
			autoInfaqExpiredDate: "2026-12-30T16:00:00.000Z",
			autoInfaqStatus: 1,
			autoInfaqCreatedDate: "2025-12-13T13:45:45.000Z",
		},
	],
	pagination: {
		page: 1,
		limit: 10,
		total: 74,
		totalPages: 8,
	},
};

// Icons as components
const Icons = {
	Calendar: () => (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
			<line x1="16" y1="2" x2="16" y2="6" />
			<line x1="8" y1="2" x2="8" y2="6" />
			<line x1="3" y1="10" x2="21" y2="10" />
		</svg>
	),
	Users: () => (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
			<circle cx="9" cy="7" r="4" />
			<path d="M23 21v-2a4 4 0 0 0-3-3.87" />
			<path d="M16 3.13a4 4 0 0 1 0 7.75" />
		</svg>
	),
	DollarSign: () => (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<line x1="12" y1="1" x2="12" y2="23" />
			<path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
		</svg>
	),
    RM: () => (
        <svg
            width="20"
            height="20"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            <text x="3" y="17" fontSize="14" fontWeight="bold" fill="currentColor" stroke="none">RM</text>
        </svg>
    ),
	TrendingUp: () => (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
			<polyline points="17 6 23 6 23 12" />
		</svg>
	),
	CheckCircle: () => (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
			<polyline points="22 4 12 14.01 9 11.01" />
		</svg>
	),
	XCircle: () => (
		<svg
			width="20"
			height="20"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<line x1="15" y1="9" x2="9" y2="15" />
			<line x1="9" y1="9" x2="15" y2="15" />
		</svg>
	),
	Search: () => (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="11" cy="11" r="8" />
			<line x1="21" y1="21" x2="16.65" y2="16.65" />
		</svg>
	),
	Plus: () => (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<line x1="12" y1="5" x2="12" y2="19" />
			<line x1="5" y1="12" x2="19" y2="12" />
		</svg>
	),
	Filter: () => (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
		</svg>
	),
	Download: () => (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
			<polyline points="7 10 12 15 17 10" />
			<line x1="12" y1="15" x2="12" y2="3" />
		</svg>
	),
	Eye: () => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
			<circle cx="12" cy="12" r="3" />
		</svg>
	),
	Edit: () => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
			<path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
		</svg>
	),
	Trash: () => (
		<svg
			width="16"
			height="16"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="3 6 5 6 21 6" />
			<path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
		</svg>
	),
	ChevronLeft: () => (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="15 18 9 12 15 6" />
		</svg>
	),
	ChevronRight: () => (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="9 18 15 12 9 6" />
		</svg>
	),
	Clock: () => (
		<svg
			width="14"
			height="14"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<circle cx="12" cy="12" r="10" />
			<polyline points="12 6 12 12 16 14" />
		</svg>
	),
	Refresh: () => (
		<svg
			width="18"
			height="18"
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth="2"
			strokeLinecap="round"
			strokeLinejoin="round"
		>
			<polyline points="23 4 23 10 17 10" />
			<polyline points="1 20 1 14 7 14" />
			<path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15" />
		</svg>
	),
};

// Utility functions
const formatDate = (dateString) => {
	if (!dateString) return "-";
	const date = new Date(dateString);
	return date.toLocaleDateString("ms-MY", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

const formatDateTime = (dateString) => {
	if (!dateString) return "-";
	const date = new Date(dateString);
	return date.toLocaleDateString("ms-MY", {
		day: "2-digit",
		month: "short",
		year: "numeric",
		hour: "2-digit",
		minute: "2-digit",
	});
};

const formatTime = (timeString) => {
	if (!timeString) return "-";
	const [hours, minutes] = timeString.split(":");
	const hour = parseInt(hours);
	const ampm = hour >= 12 ? "PM" : "AM";
	const hour12 = hour % 12 || 12;
	return `${hour12}:${minutes} ${ampm}`;
};

const formatCurrency = (amount) => {
	if (amount === null || amount === undefined) return "-";
	return `RM ${parseFloat(amount).toFixed(2)}`;
};

const truncateCode = (code) => {
	if (!code) return "-";
	return code.substring(0, 8) + "...";
};

const getScheduleDays = (days) => {
	if (!days) return "-";
	const dayMap = {
		Isnin: "Isn",
		Selasa: "Sel",
		Rabu: "Rab",
		Khamis: "Kha",
		Jumaat: "Jum",
		Sabtu: "Sab",
		Ahad: "Ahd",
	};

	const dayList = days.split(",");
	if (dayList.length === 7) return "Setiap Hari";
	if (dayList.length === 1) return days;
	return dayList.map((d) => dayMap[d] || d).join(", ");
};

const getScheduleTypeLabel = (type) => {
	const types = {
		1: "Harian",
		2: "Mingguan",
		3: "Bulanan",
	};
	return types[type] || type || "-";
};

// Stat Card Component - Light Mode
const StatCard = ({ icon: Icon, label, value, subValue, trend, color }) => {
	const colorClasses = {
		emerald: "bg-emerald-50 border-emerald-600 shadow-emerald-100",
		blue: "bg-blue-50 border-blue-600 shadow-blue-100",
		amber: "bg-amber-50 border-amber-600 shadow-amber-100",
		rose: "bg-rose-50 border-rose-600 shadow-rose-100",
		violet: "bg-violet-50 border-violet-600 shadow-violet-100",
	};

	const iconBgClasses = {
		emerald: "bg-emerald-100 text-emerald-600",
		blue: "bg-blue-100 text-blue-600",
		amber: "bg-amber-100 text-amber-600",
		rose: "bg-rose-100 text-rose-600",
		violet: "bg-violet-100 text-violet-600",
	};

	const textClasses = {
		emerald: "text-emerald-600",
		blue: "text-blue-600",
		amber: "text-amber-600",
		rose: "text-rose-600",
		violet: "text-violet-600",
	};

	return (
		<div className={`relative overflow-hidden rounded-2xl border ${colorClasses[color]} p-5 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg`}>
			<div className="flex items-start justify-between relative">
				<div>
					<p className="text-gray-500 text-sm font-medium mb-1">
						{label}
					</p>
					<p className="text-3xl font-bold text-gray-800 tracking-tight">
						{value}
					</p>
					{subValue && (
						<p className="text-gray-400 text-sm mt-1">{subValue}</p>
					)}
				</div>
				<div className={`p-3 rounded-xl ${iconBgClasses[color]}`}>
					<Icon />
				</div>
			</div>

			{/* {trend && (
				<div className="mt-3 flex items-center gap-1 text-sm">
					<span className={textClasses[color]}>
						<Icons.TrendingUp />
					</span>
					<span className="text-emerald-600 font-medium">
						{trend}
					</span>
					<span className="text-gray-400">vs bulan lepas</span>
				</div>
			)} */}
		</div>
	);
};

// Status Badge Component - Light Mode
const StatusBadge = ({ status }) => {
	const isActive = status === 1;
	return (
		<span
			className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
				isActive
					? "bg-emerald-100 text-emerald-700 border border-emerald-200"
					: "bg-gray-100 text-gray-600 border border-gray-200"
			}`}
		>
			<span
				className={`w-1.5 h-1.5 rounded-full ${
					isActive ? "bg-emerald-500 animate-pulse" : "bg-gray-400"
				}`}
			></span>
			{isActive ? "Aktif" : "Tidak Aktif"}
		</span>
	);
};

// Action Button Component - Light Mode
const ActionButton = ({
	icon: Icon,
	onClick,
	variant = "default",
	tooltip,
}) => {
	const variants = {
		default:
			"bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-gray-800",
		primary:
			"bg-blue-100 hover:bg-blue-200 text-blue-600 hover:text-blue-700",
		danger: "bg-rose-100 hover:bg-rose-200 text-rose-600 hover:text-rose-700",
	};

	return (
		<button
			onClick={onClick}
			className={`p-2 rounded-lg transition-all duration-200 ${variants[variant]} hover:scale-110`}
			title={tooltip}
		>
			<Icon />
		</button>
	);
};

// Detail Item Component for Modal
const DetailItem = ({ icon: Icon, label, value, fullWidth = false }) => (
	<div className={`${fullWidth ? "col-span-2" : ""}`}>
		<div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
			{Icon && <Icon />}
			<span>{label}</span>
		</div>
		<p className="text-gray-800 font-medium">{value || "-"}</p>
	</div>
);

// Detail Modal Component
const DetailModal = ({ isOpen, onClose, data, isLoading }) => {
	if (!isOpen) return null;

	return (
		<div className="fixed inset-0 z-[1000] overflow-y-auto">
			{/* Backdrop */}
			<div className="fixed inset-0 bg-black-500/50 transition-opacity"
				onClick={onClose}
			></div>

			{/* Modal */}
			<div className="flex min-h-full items-center justify-center p-4">
				<div className="relative bg-white rounded-2xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden transform transition-all">
					{/* Header */}
					<div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-gray-50">
						<div>
							<h2 className="text-xl font-bold text-gray-800">
								Butiran Auto Infaq
							</h2>
							<p className="text-sm text-gray-500 mt-0.5">
								Maklumat lengkap jadual infaq automatik
							</p>
						</div>
						<button
							onClick={onClose}
							className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 text-gray-500 hover:text-gray-700 transition-colors"
						>
							<Icons.XCircle />
						</button>
					</div>

					{/* Content */}
					<div className="px-6 py-5 overflow-y-auto max-h-[calc(90vh-140px)]">
						{isLoading ? (
							<div className="flex items-center justify-center py-12">
								<div className="flex flex-col items-center gap-4">
									<div className="w-10 h-10 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
									<p className="text-gray-500">Memuatkan butiran...</p>
								</div>
							</div>
						) : data ? (
							<div className="space-y-6">
								{/* Basic Info Section */}
								<div>
									<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
										Maklumat Asas
									</h3>
									<div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
										<DetailItem
											icon={Icons.FileText}
											label="Nama Jadual"
											value={data.autoInfaqName}
											fullWidth
										/>
										<DetailItem
											label="Kod Jadual"
											value={data.autoInfaqCode}
											fullWidth
										/>
										<DetailItem
											icon={Icons.RM}
											label="Amaun"
											value={formatCurrency(data.autoInfaqAmount)}
										/>
										<DetailItem
											icon={Icons.CreditCard}
											label="Jenis Pembayaran"
											value={data.autoInfaqPaymentType}
										/>
									</div>
								</div>

								{/* Account Info Section */}
								<div>
									<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
										Maklumat Akaun
									</h3>
									<div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
										<DetailItem
											icon={Icons.User}
											label="ID Akaun"
											value={data.autoInfaqAccountId}
										/>
										<DetailItem
											icon={Icons.Wallet}
											label="ID Wallet"
											value={data.autoInfaqWalletId}
										/>
										<DetailItem
											label="ID Tabung"
											value={data.autoInfaqTabungId}
										/>
									</div>
								</div>

								{/* Schedule Info Section */}
								<div>
									<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
										Jadual
									</h3>
									<div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
										<DetailItem
											icon={Icons.Calendar}
											label="Hari"
											value={getScheduleDays(data.autoInfaqScheduleDay)}
											fullWidth
										/>
										<DetailItem
											icon={Icons.Clock}
											label="Masa"
											value={formatTime(data.autoInfaqScheduleTime)}
										/>
										<DetailItem
											label="Jenis Jadual"
											value={getScheduleTypeLabel(data.autoInfaqScheduleType)}
										/>
										<DetailItem
											icon={Icons.Building}
											label="Organisasi"
											value={data.autoInfaqScheduleOrganization}
											fullWidth
										/>
										<DetailItem
											label="Index Organisasi Terakhir"
											value={data.autoInfaqLastOrganizationIndex}
										/>
									</div>
								</div>

								{/* Period Info Section */}
								<div>
									<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
										Tempoh
									</h3>
									<div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
										<DetailItem
											label="Tarikh Mula"
											value={formatDate(data.autoInfaqStartDate)}
										/>
										<DetailItem
											label="Tarikh Tamat"
											value={formatDate(data.autoInfaqExpiredDate)}
										/>
									</div>
								</div>

								{/* Status & Meta Section */}
								<div>
									<h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-3">
										Status & Rekod
									</h3>
									<div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-xl">
										<div>
											<div className="flex items-center gap-2 text-gray-500 text-sm mb-1">
												<span>Status</span>
											</div>
											<StatusBadge status={data.autoInfaqStatus} />
										</div>
										<DetailItem
											label="Catatan"
											value={data.autoInfaqRemarks}
										/>
										<DetailItem
											label="Tarikh Dicipta"
											value={formatDateTime(data.autoInfaqCreatedDate)}
										/>
										<DetailItem
											label="Tarikh Dikemaskini"
											value={formatDateTime(data.autoInfaqLastModified)}
										/>
									</div>
								</div>
							</div>
						) : (
							<div className="flex items-center justify-center py-12">
								<p className="text-gray-500">Tiada data dijumpai</p>
							</div>
						)}
					</div>

					{/* Footer */}
					<div className="flex items-center justify-end gap-3 px-6 py-2 border-t border-gray-200 bg-gray-50">
						<button
							onClick={onClose}
							className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg transition-colors"
						>
							Tutup
						</button>
						<button
							onClick={() => console.log("Edit", data?.autoInfaqId)}
							className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
						>
							Kemaskini
						</button>
					</div>
				</div>
			</div>
		</div>
	);
};

// Main Component - Light Mode
export default function AutoInfaqAdmin() {
	const [data, setData]               = useState([]);
	const [pagination, setPagination]   = useState({
		page: 1,
		limit: 10,
		total: 0,
		totalPages: 0,
	});
	const [searchQuery, setSearchQuery]     = useState("");
	const [statusFilter, setStatusFilter]   = useState("all");
	const [isLoading, setIsLoading]         = useState(true);

    const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
    const [selectedDetail, setSelectedDetail]       = useState(null);
    const [isDetailLoading, setIsDetailLoading]     = useState(false);

	// Simulate API call
	useEffect(() => {
		const fetchData = async () => {
			setIsLoading(true);
			// await new Promise((resolve) => setTimeout(resolve, 800));
			// setData(mockData.data);
			// setPagination(mockData.pagination);
			// setIsLoading(false);

            let api = await SYSADMIN_API(`auto-infaq?page=${pagination.page}&limit=${pagination.limit}`, {}, "GET")
            if(api.success == true) {
                setData(api.data)
                setPagination(api.pagination)
            }

            setIsLoading(false);
		};

		fetchData();
	}, [pagination.page, searchQuery]);

    const handleViewDetail = async (id) => {
        setIsDetailModalOpen(true);
        setIsDetailLoading(true);
        setSelectedDetail(null);

        try {
            let api = await SYSADMIN_API(`auto-infaq/${id}`, {}, "GET");
            if (api.success === true) {
                setSelectedDetail(api.data);
            }
        } catch (error) {
            console.error("Error fetching detail:", error);
        }

        setIsDetailLoading(false);
    };

    // Close modal
	const handleCloseModal = () => {
		setIsDetailModalOpen(false);
		setSelectedDetail(null);
	};

	// Calculate stats
	const stats = {
		total: pagination.total,
		active: data.filter((item) => item.autoInfaqStatus === 1).length,
		inactive: data.filter((item) => item.autoInfaqStatus === 0).length,
		totalAmount: data.reduce((sum, item) => sum + item.autoInfaqAmount, 0),
		uniqueUsers: new Set(data.map((item) => item.autoInfaqAccountId)).size,
	};

	// Filter data
	const filteredData = data.filter((item) => {
		if (statusFilter === "active") return item.autoInfaqStatus === 1;
		if (statusFilter === "inactive") return item.autoInfaqStatus === 0;
		return true;
	});

	const handlePageChange = (newPage) => {
		if (newPage >= 1 && newPage <= pagination.totalPages) {
			setPagination((prev) => ({ ...prev, page: newPage }));
		}
	};

	return (
		<div className="min-h-screen bg-transparent">
            {/* Detail Modal */}
			<DetailModal
				isOpen={isDetailModalOpen}
				onClose={handleCloseModal}
				data={selectedDetail}
				isLoading={isDetailLoading}
			/>

			<div className="relative max-w-full">
				{/* Header */}
				<div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
					<div>
						<h1 className="text-3xl font-bold text-gray-800">
							Senarai Rekod Jdual Auto Infaq
						</h1>
						<p className="text-gray-500 mt-1">
							Urus dan pantau semua jadual auto infaq automatik.
						</p>
					</div>

					<div className="flex flex-wrap items-center gap-3">
						{/* <button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 shadow-sm">
							<Icons.Download />
							Export
						</button>
						<button className="inline-flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium text-gray-700 transition-all duration-200 hover:border-gray-300 shadow-sm">
							<Icons.Refresh />
							Refresh
						</button> */}
						{/* <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 rounded-xl text-sm font-semibold text-white shadow-lg shadow-emerald-200 transition-all duration-200 hover:shadow-emerald-300 hover:scale-[1.02]">
							<Icons.Plus />
							Tambah Baru
						</button> */}
					</div>
				</div>

				{/* Stats Cards */}
				<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
					<StatCard
						icon={Icons.Calendar}
						label="Jumlah Jadual"
						value={stats.total}
						subValue="Keseluruhan rekod"
						color="blue"
					/>
					<StatCard
						icon={Icons.CheckCircle}
						label="Jadual Aktif"
						value={stats.active}
						subValue={`${
							Math.round(
								(stats.active /
									(stats.active + stats.inactive)) *
									100
							) || 0
						}% daripada jumlah`}
						trend="+12%"
						color="emerald"
					/>
					<StatCard
						icon={Icons.Users}
						label="Pengguna Unik"
						value={stats.uniqueUsers}
						subValue="Pengguna berdaftar"
						color="violet"
					/>
					<StatCard
						icon={Icons.DollarSign}
						label="Jumlah Infaq"
						value={formatCurrency(stats.totalAmount)}
						subValue="Pada halaman ini"
						color="amber"
					/>
				</div>

				{/* Filters & Search */}
				<div className="bg-white border border-gray-200 rounded-2xl p-4 mb-6 shadow-sm">
					<div className="flex flex-col sm:flex-row gap-4">
						{/* Search */}
						<div className="relative flex-1">
							<div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400">
								<Icons.Search />
							</div>
							<input
								type="text"
								placeholder="Cari nama atau kod jadual..."
								value={searchQuery}
								onChange={(e) => setSearchQuery(e.target.value)}
								className="text-sm w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-200"
							/>
						</div>

						{/* Status Filter */}
						<div className="flex items-center gap-2">
							<div className="flex items-center text-gray-400 mr-2">
								<Icons.Filter />
							</div>
							<button
								onClick={() => setStatusFilter("all")}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
									statusFilter === "all"
										? "bg-gray-800 text-white"
										: "bg-gray-100 text-gray-600 hover:text-gray-800 hover:bg-gray-200"
								}`}
							>
								Semua
							</button>
							<button
								onClick={() => setStatusFilter("active")}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
									statusFilter === "active"
										? "bg-emerald-100 text-emerald-700 border border-emerald-200"
										: "bg-gray-100 text-gray-600 hover:text-emerald-700 hover:bg-emerald-50"
								}`}
							>
								Aktif
							</button>
							<button
								onClick={() => setStatusFilter("inactive")}
								className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
									statusFilter === "inactive"
										? "bg-gray-200 text-gray-700 border border-gray-300"
										: "bg-gray-100 text-gray-600 hover:text-gray-700 hover:bg-gray-200"
								}`}
							>
								Tidak Aktif
							</button>
						</div>
					</div>
				</div>

				{/* Table */}
				<div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
					{isLoading ? (
						<div className="flex items-center justify-center py-20">
							<div className="flex flex-col items-center gap-4">
								<div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin"></div>
								<p className="text-gray-500">
									Memuatkan data...
								</p>
							</div>
						</div>
					) : (
						<>
							<div className="overflow-x-auto">
								<table className="w-full">
									<thead>
										<tr className="border-b border-gray-200 bg-gray-50">
											<th className="text-left py-4 px-5 text-sm font-semibold text-gray-600 uppercase tracking-wider">
												Nama Jadual
											</th>
											<th className="text-left py-4 px-5 text-sm font-semibold text-gray-600 uppercase tracking-wider">
												Amaun
											</th>
											<th className="text-left py-4 px-5 text-sm font-semibold text-gray-600 uppercase tracking-wider">
												Jadual
											</th>
											<th className="text-left py-4 px-5 text-sm font-semibold text-gray-600 uppercase tracking-wider">
												Tempoh
											</th>
											<th className="text-left py-4 px-5 text-sm font-semibold text-gray-600 uppercase tracking-wider">
												Status
											</th>
											<th className="text-right py-4 px-5 text-sm font-semibold text-gray-600 uppercase tracking-wider">
												Tindakan
											</th>
										</tr>
									</thead>
									<tbody className="divide-y divide-gray-100">
										{filteredData.map((item, index) => (
											<tr
												key={item.autoInfaqId}
												className="group hover:bg-gray-50 transition-colors duration-200"
												style={{ animationDelay: `${index * 50}ms` }}
											>
												<td className="py-4 px-5">
													<div className="flex flex-col">
														<span className="text-sm font-semibold text-gray-800 group-hover:text-emerald-600 transition-colors duration-200">
															{item.autoInfaqName}
														</span>
														{/* <span className="text-xs text-gray-400 font-mono mt-0.5">
															{truncateCode(
																item.autoInfaqCode
															)}
														</span> */}
													</div>
												</td>
												<td className="py-4 px-5">
													<span className="inline-flex items-center px-3 py-1.5 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 font-semibold">
														{formatCurrency(item.autoInfaqAmount)}
													</span>
												</td>
												<td className="py-4 px-5">
													<div className="flex flex-col gap-1">
														<span className="text-sm text-gray-700">
															{getScheduleDays(
																item.autoInfaqScheduleDay
															)}
														</span>
														<span className="inline-flex items-center gap-1 text-xs text-gray-400">
															<Icons.Clock />
															{formatTime(
																item.autoInfaqScheduleTime
															)}
														</span>
													</div>
												</td>
												<td className="py-4 px-5">
													<div className="flex gap-0.5 text-sm">
														<span className="text-gray-700">
															{formatDate(
																item.autoInfaqStartDate
															)}
														</span>
														<span className="text-gray-400">
															-
														</span>
														<span className="text-gray-500">
															{formatDate(
																item.autoInfaqExpiredDate
															)}
														</span>
													</div>
												</td>
												<td className="py-4 px-5">
													<StatusBadge
														status={
															item.autoInfaqStatus
														}
													/>
												</td>
												<td className="py-4 px-5">
													<div className="flex items-center justify-end gap-2">
														<ActionButton
															icon={Icons.Eye}
															variant="primary"
															tooltip="Lihat"
															onClick={() => handleViewDetail(item.autoInfaqId)}
														/>
														<ActionButton
															icon={Icons.Edit}
															tooltip="Edit"
															onClick={() =>
																console.log(
																	"Edit",
																	item.autoInfaqId
																)
															}
														/>
														<ActionButton
															icon={Icons.Trash}
															variant="danger"
															tooltip="Padam"
															onClick={() =>
																console.log(
																	"Delete",
																	item.autoInfaqId
																)
															}
														/>
													</div>
												</td>
											</tr>
										))}
									</tbody>
								</table>
							</div>

							{/* Pagination */}
							<div className="flex flex-col sm:flex-row items-center justify-between gap-4 px-5 py-4 border-t border-gray-200 bg-gray-50">
								<p className="text-sm text-gray-500">
									Menunjukkan{" "}
									<span className="font-medium text-gray-700">
										{(pagination.page - 1) *
											pagination.limit +
											1}
									</span>{" "}
									hingga{" "}
									<span className="font-medium text-gray-700">
										{Math.min(
											pagination.page * pagination.limit,
											pagination.total
										)}
									</span>{" "}
									daripada{" "}
									<span className="font-medium text-gray-700">
										{pagination.total}
									</span>{" "}
									rekod
								</p>

								<div className="flex items-center gap-2">
									<button
										onClick={() =>
											handlePageChange(
												pagination.page - 1
											)
										}
										disabled={pagination.page === 1}
										className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
									>
										<Icons.ChevronLeft />
									</button>

									{Array.from(
										{
											length: Math.min(
												5,
												pagination.totalPages
											),
										},
										(_, i) => {
											let pageNum;
											if (pagination.totalPages <= 5) {
												pageNum = i + 1;
											} else if (pagination.page <= 3) {
												pageNum = i + 1;
											} else if (
												pagination.page >=
												pagination.totalPages - 2
											) {
												pageNum =
													pagination.totalPages -
													4 +
													i;
											} else {
												pageNum =
													pagination.page - 2 + i;
											}

											return (
												<button
													key={pageNum}
													onClick={() => {
                                                        console.log("Log Page Num : ", pageNum)
														handlePageChange(pageNum)
													}}
													className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200 ${
														pagination.page ===
														pageNum
															? "bg-emerald-600 text-white shadow-lg shadow-emerald-200"
															: "bg-white border border-gray-200 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
													}`}
												>
													{pageNum}
												</button>
											);
										}
									)}

									<button
										onClick={() =>
											handlePageChange(
												pagination.page + 1
											)
										}
										disabled={
											pagination.page ===
											pagination.totalPages
										}
										className="p-2 rounded-lg bg-white border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
									>
										<Icons.ChevronRight />
									</button>
								</div>
							</div>
						</>
					)}
				</div>

				{/* Footer */}
				{/* <div className="mt-8 text-center text-sm text-gray-400">
					<p>Auto Infaq Management System © 2025 • INFAQYIDE</p>
				</div> */}
			</div>
		</div>
	);
}
