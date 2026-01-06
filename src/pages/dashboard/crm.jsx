import React, { useMemo, useState } from "react";
import { useSelector } from 'react-redux';
import Card from "@/components/ui/Card";
import HomeBredCurbs from "./HomeBredCurbs";
import { API } from "@/utils/api";
import ListLoading from "@/components/skeleton/ListLoading";
import Grid from "@/components/skeleton/Grid";
import Badge from "@/components/ui/Badge";
import moment from "moment";
import DashboardChartMasjid from "./DashboardChartMasjid";
import Alert from "@/components/ui/Alert";

const CrmPage = () => {

	const { user }                                      		= useSelector(user => user.auth)

	const [loading, set_loading] 								= useState(true)
	const [loading_1, set_loading_1] 							= useState(true)
	const [loading_2, set_loading_2] 							= useState(true)

	const [total_sumbangan, set_total_sumbagan] 				= useState(0)
	const [total_infaq, set_total_infaq] 						= useState(0)
	const [total_waqaf, set_total_waqaf] 						= useState(0)
	const [total_bulan_ini, set_total_bulan_ini] 				= useState(0)

	const [ahli_kariah, set_ahli_kariah] 						= useState([])
	const [bayaran_yuran, set_bayaran_yuran] 					= useState([])

	const [loading2, set_loading2] 								= useState(true)
	const [transaksi, set_transaksi] 							= useState({row: [], total: 0, totalPages: 0})
	
	// Registration status state
	const [registrationStatus, setRegistrationStatus] 			= useState(null)
	const [showStatusAlert, setShowStatusAlert] 				= useState(false)
	
	// Profile completion state
	const [profileData, setProfileData] 						= useState(null)
	const [isProfileIncomplete, setIsProfileIncomplete] 		= useState(false)
	const [missingFields, setMissingFields] 					= useState([])

	const GET_DASHBOARD_INFAQ = async () => {
        set_loading(true)
        let api = await API("getRingkasanData", { orgID: user.id }, "POST", true)
		console.log("Log Get Dashboard Infaq : ", api)
        if(api.status === 200) {
            let data = api.data
			set_total_sumbagan(data.TOTAL_OVERALL?.TOTAL_AMOUNT)
			set_total_infaq(data.TOTAL_INFAQ?.TOTAL_AMOUNT)
			set_total_waqaf(data.TOTAL_WAKAF?.TOTAL_AMOUNT)
			set_total_bulan_ini(data.TOTAL_TODAY?.TOTAL_AMOUNT)

        }

        setTimeout(() => {
            set_loading(false)
        }, 500);
    }

	const GET_SENARAI_KUTIPAN = async () => {
		try {
			set_loading2(true)
			let api = await API(`v2/transaksi?page=1&limit=10`, {}, "GET", true)
			if(api.status_code === 200) {
				set_transaksi(api.data)
				setTimeout(() => {
					set_loading2(false)
				}, 500);
			}
		} catch (error) {
			set_loading2(false)
		}
	}

	const GetStatusPendaftaran = async () => {
		try {
			let api = await API("getStatusPendaftaran", {}, "GET", true)
			console.log("Log Api Get Status Pendaftaran : ", api)
			
			if(api.status_code === 200 && api.data?.organizationRegistrationStatus) {
				const status = api.data.organizationRegistrationStatus
				setRegistrationStatus(status)
				setShowStatusAlert(true)
			}
		} catch (error) {
			console.error("Error fetching registration status:", error)
		}
	}

	const GetStatusPendingData = async () => {
		try {
			let api = await API("getStatusPendingData", {}, "GET", true)
			console.log("Log Api Get Status Pending Data : ", api)
			
			if(api.status_code === 200 && api.data) {
				const data = api.data
				setProfileData(data)
				
				// Fields to check for completion
				const fieldsToCheck = {
					organizationName: 'Nama Institusi',
					organizationType: 'Jenis Institusi',
					organizationRegistrationNo: 'No. Pendaftaran',
					organizationPhone: 'No. Telefon',
					organizationAddress: 'Alamat',
					organizationCity: 'Bandar',
					organizationState: 'Negeri',
					organizationPostcode: 'Poskod',
					organizationPICName: 'Nama PIC',
					organizationPICPhone: 'No. Telefon PIC',
					organizationPICEmail: 'E-mel PIC',
					organizationBankName: 'Nama Bank',
					organizationBankNumber: 'No. Akaun Bank',
					organizationBankAccName: 'Nama Pemegang Akaun'
				}
				
				// Check for null or empty values
				const missing = []
				Object.keys(fieldsToCheck).forEach(key => {
					if (!data[key] || data[key] === null || data[key] === '') {
						missing.push(fieldsToCheck[key])
					}
				})
				
				if(missing.length > 0) {
					setIsProfileIncomplete(true)
					setMissingFields(missing)
				} else {
					setIsProfileIncomplete(false)
					setMissingFields([])
				}
			}
		} catch (error) {
			console.error("Error fetching pending data:", error)
		}
	}


	useMemo(() => {
		GET_DASHBOARD_INFAQ()
		GET_SENARAI_KUTIPAN()
		GetStatusPendaftaran()
		GetStatusPendingData()
	}, [])

	const get_badge = (status) => {
        if(status === 'Approve') {
            return <Badge className='bg-emerald-600 text-white'>Berjaya</Badge>
        } 
        else if(status === 'Pending') {
            return <Badge className='bg-yellow-600 text-white'>Dalam Proses</Badge>
        } 
        else {
            return <Badge className='bg-gray-600 text-white'>Lain-lain</Badge>
        }
    }

	// Function to render incomplete profile alert
	const renderIncompleteProfileAlert = () => {
		if (!isProfileIncomplete || missingFields.length === 0) return null;

		return (
			<Alert 
				className="alert-warning bg-amber-50 border border-amber-600"
				icon="heroicons:exclamation-triangle"
				dismissible={true}
				label={
					<div>
						<h4 className="text-base font-semibold mb-2 text-amber-800">Profil Institusi Tidak Lengkap</h4>
						<p className="text-sm text-amber-900 mb-3">
							Profil institusi anda masih belum lengkap. Sila lengkapkan maklumat berikut untuk memastikan institusi anda dapat dipaparkan dengan sempurna di aplikasi mudah alih InfaqYIDE.
						</p>
						<div className="mb-3">
							<p className="text-sm font-semibold text-amber-800 mb-2">Maklumat yang perlu dilengkapkan ({missingFields.length}):</p>
							<ul className="list-disc list-inside text-sm text-amber-900 space-y-1">
								{missingFields.slice(0, 5).map((field, index) => (
									<li key={index}>{field}</li>
								))}
								{missingFields.length > 5 && (
									<li className="font-medium">...dan {missingFields.length - 5} lagi</li>
								)}
							</ul>
						</div>
						<a 
							href="/institusi/maklumat" 
							className="inline-flex items-center px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white text-sm font-medium rounded-md transition-colors duration-200"
						>
							<span>Lengkapkan Profil</span>
							<svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
							</svg>
						</a>
					</div>
				}
			/>
		);
	}

	// Function to render registration status alert
	const renderRegistrationAlert = () => {
		if (!showStatusAlert || !registrationStatus) return null;

		const statusConfig = {
			'Waiting': {
				className: 'alert-warning bg-blue-50 border border-blue-700',
				icon: 'heroicons-outline:clock',
				title: 'Menunggu Pengesahan',
				titleClass: 'text-blue-700',
				message: 'Pendaftaran institusi anda sedang dalam proses menunggu pengesahan. Kami akan memaklumkan kepada anda sebaik sahaja pendaftaran diproses.'
			},
			'Pending Approval': {
				className: 'alert-info bg-blue-50 border border-blue-700',
				icon: 'heroicons-outline:information-circle',
				title: 'Menunggu Kelulusan',
				titleClass: 'text-blue-700',
				message: 'Pendaftaran institusi anda sedang menunggu kelulusan daripada pentadbir sistem. Sila tunggu untuk maklum balas selanjutnya.'
			},
			'In-Review': {
				className: 'alert-info bg-blue-50 border border-blue-700',
				icon: 'heroicons-outline:document-search',
				title: 'Dalam Semakan',
				titleClass: 'text-blue-700',
				message: 'Pendaftaran institusi anda sedang dalam proses semakan oleh pasukan kami. Kami akan menghubungi anda sekiranya memerlukan maklumat tambahan.'
			},
			'Approved': {
				className: 'alert-success bg-emerald-50 border border-emerald-700',
				icon: 'heroicons-outline:check-circle',
				title: 'Pendaftaran Berjaya',
				titleClass: 'text-emerald-700',
				message: 'Tahniah! Pendaftaran institusi anda telah berjaya diluluskan. Profil anda kini akan dipaparkan di aplikasi mudah alih InfaqYIDE.'
			},
			'Rejected': {
				className: 'alert-danger bg-red-50 border border-red-700',
				icon: 'heroicons-outline:x-circle',
				title: 'Pendaftaran Ditolak',
				titleClass: 'text-red-700',
				message: 'Maaf, pendaftaran institusi anda telah ditolak. Sila hubungi pentadbir sistem untuk maklumat lanjut atau cuba daftar semula dengan maklumat yang tepat.'
			}
		};

		const config = statusConfig[registrationStatus] || {
			className: 'alert-dark',
			icon: 'heroicons-outline:information-circle',
			title: 'Status Pendaftaran',
			titleClass: statusConfig[registrationStatus].titleClass,
			message: `Status semasa: ${registrationStatus}`
		};

		return (
			<Alert 
				className={config.className}
				icon={config.icon}
				dismissible={true}
				label={
					<div>
						<h4 className={`text-base font-semibold mb-1 ${config.titleClass}`}>{config.title}</h4>
						<p className="text-sm">{config.message}</p>
					</div>
				}
			/>
		);
	}

	return (
		<div>
			<HomeBredCurbs title="Halaman Utama" />
			<div>
				{
					loading && (
						<>
							<Grid count={3} />
						</>
					)
				}

				{/* Alerts Section */}
				{!loading && (
					<div className="space-y-4 my-6">
						{/* Incomplete Profile Alert */}
						{isProfileIncomplete && renderIncompleteProfileAlert()}
						
						{/* Registration Status Alert */}
						{showStatusAlert && registrationStatus && renderRegistrationAlert()}
					</div>
				)}

				{
					!loading && (
						<>
						<section>
							<div className="grid grid-cols-1 md:grid-cols-4 gap-3 mb-3">
								<Card>
									<div><p className="font-medium text-sm text-gray-600">Jumlah Sumbangan</p></div>
									<div className="mt-3"><p className="font-semibold text-blue-600 text-2xl">RM {parseFloat(total_sumbangan).toFixed(2)}</p></div>
								</Card>
								<Card>
									<div><p className="font-medium text-sm text-gray-600">Jumlah Kutipan Infaq</p></div>
									<div className="mt-3"><p className="font-semibold text-teal-600 text-2xl">RM {parseFloat(total_infaq).toFixed(2)}</p></div>
								</Card>
								<Card>
									<div><p className="font-medium text-sm text-gray-600">Jumlah Kutipan Kempen</p></div>
									<div className="mt-3"><p className="font-semibold text-red-600 text-2xl">RM {parseFloat(total_waqaf).toFixed(2)}</p></div>
								</Card>
								<Card>
									<div><p className="font-medium text-sm text-gray-600">Sumbangan Bulan Ini</p></div>
									<div className="mt-3"><p className="font-semibold text-yellow-600 text-2xl">RM {parseFloat(total_bulan_ini).toFixed(2)}</p></div>
								</Card>
							</div>
						</section>

						<section className="mt-6">
							<Card>
								<DashboardChartMasjid />
							</Card>
						</section>

						{/* <section>
							<div className="grid grid-cols-1 md:grid-cols-4 gap-3 mt-6">
								<Card>
									<div><p className="font-medium text-sm text-gray-600">Jumlah Ahli Kariah</p></div>
									<div className="mt-3"><p className="font-semibold text-gray-900 text-2xl">{Number(total_verified)}</p></div>
								</Card>
								<Card>
									<div><p className="font-medium text-sm text-gray-600">Jumlah Ahli Khairat Kematian</p></div>
									<div className="mt-3"><p className="font-semibold text-gray-900 text-2xl">{Number(total_active_khairat)}</p></div>
								</Card>
								<Card>
									<div><p className="font-medium text-sm text-gray-600">Jumlah Pengesahan Ahli Kariah</p></div>
									<div className="mt-3"><p className="font-semibold text-gray-900 text-2xl">{Number(total_pending)}</p></div>
								</Card>
								<Card>
									<div><p className="font-medium text-sm text-gray-600">Jumlah Kutipan Khairat Kematian</p></div>
									<div className="mt-3"><p className="font-semibold text-gray-900 text-2xl">RM {parseFloat(total_yuran_collected).toFixed(2)}</p></div>
								</Card>
							</div>
						</section> */}
						</>
					)
				}

				{/* <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
				<Card className="mt-6">
				{
					loading_1 && <ListLoading count={5} />
				}
				{
					loading_1 === false && (
						<>
						<div className="mb-6">
							<p className="font-semibold text-xl text-gray-900">Senarai 5 Ahli Kariah Terkini</p>
						</div>
						<table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
                            <thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
                                <td width={'5%'} className='p-3 font-semibold text-xs'>Bil.</td>
                                <td width={'20%'} className='p-3 font-semibold text-xs'>Nama Kariah</td>
                                <td width={'10%'} className='p-3 font-semibold text-xs'>E-mel</td>
                                <td width={'10%'} className='p-3 font-semibold text-xs'>No. Telefon</td>
                                <td width={'10%'} className='p-3 font-semibold text-xs text-center'>Jantina</td>
                                <td width={'20%'} className='p-3 font-semibold text-xs text-center'>Tarikh Daftar</td>
                                <td width={'5%'} className='p-3 font-semibold text-xs text-center'>Status Kariah</td>
                            </thead>
                            <tbody className='text-xs p-3'>
                                {
                                    ahli_kariah.length < 1 && (
                                        <tr className='border border-gray-100 p-3'>
                                            <td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai sebarang transaksi buat masa sementara waktu.</td>
                                        </tr>
                                    )
                                }
                                {
                                    ahli_kariah.length > 0 && ahli_kariah.map((data, index) => (
                                        <tr key={index} className='border border-gray-100 p-3'>
                                            <td width={'5%'} className='p-3 font-normal text-xs'>{index + 1}.</td>
                                            <td width={'20%'} className='p-3 font-semibold text-xs text-clip'>
                                                <p className='font-semibold text-gray-900'>{data.full_name}</p>
                                            </td>
                                            <td width={'10%'} className='p-3 font-normal text-xs text-clip'>
                                                <p className='font-semibold text-gray-900'>{data.email_address}</p>
                                            </td>
                                            <td width={'10%'} className='p-3 font-normal text-xs text-center'>
                                            <p className='font-normal text-gray-900'>{data.phone_number}</p>
                                            </td>
                                            <td width={'10%'} className='p-3 font-semibold text-xs text-center'>
                                                {
                                                    data.gender === "Lelaki" ?
                                                    <Badge className='bg-blue-400 text-white w-[80px] justify-center'>{data.gender}</Badge> :
                                                    <Badge className='bg-pink-400 text-white w-[80px] justify-center'>{data.gender}</Badge>
                                                }
                                            </td>
                                            <td width={'20%'} className='p-3 font-normal text-xs text-center'>
                                                <p className='font-normal text-gray-900'>{moment(data.register_date).format("DD MMMM YYYY")}</p>
                                            </td>
                                            <td width={'5%'} className='p-3 font-normal text-xs text-center'>
                                                <Badge className='bg-teal-600 text-white w-[80px] justify-center'>{data.marital_status}</Badge>
                                            </td>
                                        </tr>
                                    ))
                                }
                            </tbody>
                        </table>
						</>
					)
				}
				</Card>

				<Card className="mt-6">
					{
						loading_2 && <ListLoading />
					}
					{
						loading_2 === false && (
							<>
								<div className="mb-6">
									<p className="font-semibold text-xl text-gray-900">Senarai 5 Bayaran Yuran Khairat Kematian Terkini</p>
								</div>
								<table className='min-w-full divide-y divide-slate-100 table-fixed dark:divide-slate-700'>
									<thead className="bg-slate-200 dark:bg-slate-700 p-3 rounded-md">
										<td width={'5%'} className='p-3 font-semibold text-xs'>Bil.</td>
										<td width={'10%'} className='p-3 font-semibold text-xs'>Jumlah(RM)</td>
										<td width={'10%'} className='p-3 font-semibold text-xs'>Nama</td>
										<td width={'10%'} className='p-3 font-semibold text-xs'>E-mel</td>
										<td width={'10%'} className='p-3 font-semibold text-xs'>No. Telefon</td>
										<td width={'10%'} className='p-3 font-semibold text-xs'>Status</td>
									</thead>
									<tbody className='text-xs p-3'>
										{
											bayaran_yuran.length < 1 && (
												<tr className='border border-gray-100 p-3'>
													<td colSpan={7} className='p-3 text-center'>Anda tidak mempunyai sebarang transaksi buat masa sementara waktu.</td>
												</tr>
											)
										}
										{
											bayaran_yuran.length > 0 && bayaran_yuran.map((data, index) => (
												<tr key={index} className='border border-gray-100 p-3'>
													<td width={'5%'} className='p-3 font-normal text-xs'>{index + 1}.</td>
													<td width={'10%'} className='p-3 font-normal text-xs text-clip'>
														<p className='font-normal text-gray-900'>{data.payment_amount}</p>
													</td>
													<td width={'10%'} className='p-3 font-normal text-xs text-clip'>
														<p className='font-normal text-gray-900'>{data.payor_name}</p>
													</td>
													<td width={'10%'} className='p-3 font-normal text-xs text-clip'>
														<p className='font-normal text-gray-900'>{data.payor_email}</p>
													</td>
													<td width={'10%'} className='p-3 font-normal text-xs text-clip'>
														<p className='font-normal text-gray-900'>{data.payor_phone}</p>
													</td>
													<td width={'10%'} className='p-3 font-normal text-xs text-clip'>
														<p className='font-normal text-gray-900'>{get_badge(data.payment_status)}</p>
													</td>
												</tr>
											))
										}
									</tbody>
								</table>
							</>
						)
					}
				</Card>
				</div> */}

				<section className="mt-6">
					<Card
					title={"Senarai 5 Transaksi Terkini"}
					subtitle={"Berikut adalah senarai 5 transaksi terkini untuk institusi anda."}
					>
					{
						loading2 ? 
						<ListLoading count={10} /> : (
							// <pre>
							// 	<code>
							// 		{JSON.stringify(transaksi, undefined, 4)}
							// 	</code>
							// </pre>
							<div class="relative overflow-x-auto shadow-md sm:rounded-lg">
							<table class="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
								<thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
									<tr>
										<th scope="col" class="px-6 py-3">
											Bil.
										</th>
										<th scope="col" class="px-6 py-3">
											Maklumat Penyumbang
										</th>
										<th scope="col" class="px-6 py-3">
											Jenis Sumbangan
										</th>
										<th scope="col" class="px-6 py-3">
											Jumlah Sumbangan (RM)
										</th>
										<th scope="col" class="px-6 py-3">
											Tarikh Sumbangan
										</th>
										<th scope="col" class="px-6 py-3">
											Status
										</th>
									</tr>
								</thead>
								<tbody>
									{ transaksi.row.length == 0 && (
										<>
										<tr className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
											<td scope="col" class="px-6 py-3 text-center" colSpan={6}>Anda tidak mempunyai senarai kutipan sumbangan.</td>
										</tr>
										</>
									)}

									{ transaksi.row.length > 0 && transaksi.row.map((item, index) => (
										<>
										<tr key={index} className="odd:bg-white odd:dark:bg-gray-900 even:bg-gray-50 even:dark:bg-gray-800 border-b dark:border-gray-700 border-gray-200">
											<td scope="col" class="px-6 py-3">
												{index + 1}
											</td>
											<td scope="col" class="px-6 py-3">
												<span>{item.billpayment_payorName}</span><br />
												<span>{item.billpayment_payorEmail}</span>
											</td>
											<td scope="col" class="px-6 py-3">
												<span>{item.billpayment_type}</span>
											</td>
											<td scope="col" class="px-6 py-3">
												<span>{Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR'}).format(item.billpayment_amountNett)}</span>
											</td>
											<td scope="col" class="px-6 py-3">
												<span>{item.billpayment_status == 1 ? 'Transaksi Berjaya' : 'Transaksi Gagal'}</span>
											</td>
											<td scope="col" class="px-6 py-3">
												<span>{moment(item.billpayment_createdDate).format('DD MMM YYYY, hh:mm A')}</span>
											</td>
										</tr>
										</>
									)
									)}
								</tbody>
							</table>
							</div>
						)
					}
					</Card>
				</section>
			</div>
		</div>
	);
};

export default CrmPage;
