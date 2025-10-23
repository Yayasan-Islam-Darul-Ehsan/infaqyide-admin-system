import React, { useMemo, useState } from "react";
import { useSelector } from 'react-redux';
import Card from "@/components/ui/Card";
import HomeBredCurbs from "./HomeBredCurbs";
import { API } from "@/utils/api";
import ListLoading from "@/components/skeleton/ListLoading";
import Grid from "@/components/skeleton/Grid";
import Badge from "@/components/ui/Badge";
import moment from "moment";

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

	useMemo(() => {
		GET_DASHBOARD_INFAQ()
		GET_SENARAI_KUTIPAN()
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
