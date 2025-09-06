import React, { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// home pages  & dashboard
//import Dashboard from "./pages/dashboard";
const CrmPage 				= lazy(() => import("./pages/dashboard/crm"));

//const Login 				= lazy(() => import("./pages/auth/login"));
//const Register 				= lazy(() => import("./pages/auth/register"));
//const ForgotPass 			= lazy(() => import("./pages/auth/forgot-password"));
const LockScreen 			= lazy(() => import("./pages/auth/lock-screen"));
const Error 				= lazy(() => import("./pages/404"));

// utility pages
const ComingSoonPage 		= lazy(() => import("./pages/utility/coming-soon"));
const UnderConstructionPage = lazy(() => import("./pages/utility/under-construction"));

// app page
const TodoPage 				= lazy(() => import("./pages/app/todo"));
const EmailPage 			= lazy(() => import("./pages/app/email"));
const ChatPage 				= lazy(() => import("./pages/app/chat"));
const ProjectPostPage 		= lazy(() => import("./pages/app/projects"));
const ProjectDetailsPage 	= lazy(() => import("./pages/app/projects/project-details"));

const KanbanPage 			= lazy(() => import("./pages/app/kanban"));
const CalenderPage 			= lazy(() => import("./pages/app/calendar"));

import Layout from "./layout/Layout";
import AuthLayout from "./layout/AuthLayout";
import Loading from "@/components/Loading";

import Login from "./pages/auth/login";
import Register from "./pages/auth/register";
import SenaraiKariah from "./pages/Pengurusan/Kariah/SenaraiKariah";
import MaklumatKariah from "./pages/Pengurusan/Kariah/MaklumatKariah";
import SenaraiPengesahanKariah from "./pages/Pengurusan/PengesahanKariah/SenaraiPengesahanKariah";
import { ModalProvider } from "./components/ui/SuperModal";
import SenaraiBayaranKhairatKematian from "./pages/Pengurusan/BayaranKhairatKematian/SenaraiBayaranKhairatKematian";

import SenaraiTransaksi from "./pages/Pengurusan/TransaksiBayaranKeahlian/SenaraiTransaksi";

import MaklumatTransaksi from "./pages/Pengurusan/TransaksiBayaranKeahlian/MaklumatTransaksi";
import MaklumatBayaranKhairatKematian from "./pages/Pengurusan/BayaranKhairatKematian/MaklumatBayaranKhairatKematian";
import BayarKhairatKematian from "./pages/Pengurusan/BayaranKhairatKematian/BayarKhairatKematian";
import PendaftaranAsset from "./pages/asset/PendaftaranAsset";
import PermohonanPelupusanAsset from "./pages/asset/PermintaanPelupusanAsset";
import PermohonanPemerolehanAsset from "./pages/asset/PermohonanPemerolehanAsset";
import InventoriAsset from "./pages/asset/InventoriAsset";
import SenaraiYuran from "./pages/Pengurusan/Yuran/SenaraiYuran";
import MaklumatYuran from "./pages/Pengurusan/Yuran/MaklumatYuran";
import CreateYuran from "./pages/Pengurusan/Yuran/CreateYuran";

import KemaskiniBakiBank from "./pages/Pengurusan/Kewangan/BakiBankTerkini/KemaskiniBakiBank/KemaskiniBakiBank";
import KemaskiniBakiTetap from "./pages/Pengurusan/Kewangan/BakiBankTerkini/KemaskiniBakiTetap/KemaskiniBakiTetap";
import SettingBank from "./pages/Pengurusan/Kewangan/BakiBankTerkini/SettingBank/SettingBank";
import SenaraiAsnaf from "./pages/Pengurusan/Asnaf/senarai-asnaf";
import TambahAsnaf from "./pages/Pengurusan/Asnaf/tambah-asnaf";
import MaklumatAsnaf from "./pages/Pengurusan/Asnaf/maklumat-asnaf";
import SenaraiAnakYatim from "./pages/Pengurusan/AnakYatim/SenaraiAnakYatim";
import CreateAnakYatim from "./pages/Pengurusan/AnakYatim/CreateAnakYatim";
import MaklumatAnakYatim from "./pages/Pengurusan/AnakYatim/MaklumatAnakYatim";
import SenaraiAhliKhairatKematian from "./pages/Pengurusan/SenaraiAhliKhairatKematian/senarai-ahli";
import MaklumatAhliKhairat from "./pages/Pengurusan/SenaraiAhliKhairatKematian/maklumat-ahli-khairat";
import KutipanJumaat from "./pages/Pengurusan/Kewangan/Penerimaan/KutipanJumaat/KutipanJumaat";
import KutipanTetap from "./pages/Pengurusan/Kewangan/Penerimaan/KutipanTetap/KutipanTetap";
import PenerimaanBaru from "./pages/Pengurusan/Kewangan/Penerimaan/Penerimaan/PenerimaanBaru";
import PerbelanjaanBank from "./pages/Pengurusan/Kewangan/Perbelanjaan/PerbelanjaanBank/PerbelanjaanBank";
import PerbelanjaanBaru from "./pages/Pengurusan/Kewangan/Perbelanjaan/PerbelanjaanBaru/PerbelanjaanBaru";

import InformasiAsset from "./pages/asset/InformasiAsset";
import BorangPenyelenggaraanAsset from "./pages/asset/BorangPenyelenggaraanAsset";
import SenaraiLokasi from "./pages/asset/SenaraiLokasi";
import PermintaanPelupusanAsset from "./pages/asset/PermintaanPelupusanAsset";
import MaklumatInstitusi from "./pages/maklumat-institusi/MaklumatInstitusi";
import MaklumatBankInstitusi from "./pages/maklumat-bank-institusi/MaklumatBankInstitusi";
import MaklumatPanjarWangRuncit from "./pages/panjar-wang-runcit/MaklumatPanjarWangRuncit";
import TambahTransaksiPanjarWangRuncit from "./pages/panjar-wang-runcit/TambahTransaksiPanjarWangRuncit";
import SenaraiBankSimpananTetap from "./pages/Pengurusan/Kewangan/BakiBankTerkini/BakiSimpananTetap/SenaraiBankSimpananTetap";
import TambahBankSimpananTetap from "./pages/Pengurusan/Kewangan/BakiBankTerkini/BakiSimpananTetap/TambahBankSimpananTetap";
import MaklumatBankSimpananTetap from "./pages/Pengurusan/Kewangan/BakiBankTerkini/BakiSimpananTetap/MaklumatBankSimpananTetap";
import TambahTransaksi from "./pages/Pengurusan/Kewangan/BakiBankTerkini/BakiSimpananTetap/TambahTransaksi";
import SenaraiBankSemasa from "./pages/Pengurusan/Kewangan/BakiBankTerkini/BakiBank/SenaraiBankSemasa";
import TambahBankSemasa from "./pages/Pengurusan/Kewangan/BakiBankTerkini/BakiBank/TambahBankSemasa";
import MaklumatBankSemasa from "./pages/Pengurusan/Kewangan/BakiBankTerkini/BakiBank/MaklumatBankSemasa";
import TambahTransaksiBankSemasa from "./pages/Pengurusan/Kewangan/BakiBankTerkini/BakiBank/TambahTransaksiBankSemasa";
import SenaraiTransaksiPenerimaan from "./pages/Pengurusan/Kewangan/Penerimaan/SenaraiTransaksiPenerimaan";
import SenaraiTransaksiPerbelanjaan from "./pages/Pengurusan/Kewangan/Perbelanjaan/SenaraiTransaksiPerbelanjaan";
import TambahMaklumatPerbankan from "./pages/maklumat-bank-institusi/TambahMaklumatPerbankan";
import SenaraiTabung from "./pages/maklumat-tabung/SenaraiTabung";
import SenaraiHebahan from "./pages/Hebahan/senarai-hebahan";
import TambahHebahan from "./pages/Hebahan/TambahHebahan";
import MaklumatHebahan from "./pages/Hebahan/MaklumatHebahan";

import PengeluaranKredit from "./pages/pengeluaran/index";
import TransaksiInstitusi from "./pages/TransaksiInstitusi/senarai-transaksi";
import TransaksiDetailsInstitusi from "./pages/TransaksiInstitusi/DetailsTransaksi";

import TambahTabung from "./pages/maklumat-tabung/TambahTabung";
import MaklumatTabung from "./pages/maklumat-tabung/MaklumatTabung";
import SenaraiAJK from "./pages/maklumat-ajk/SenaraiAJK";
import TambahAJK from "./pages/maklumat-ajk/TambahAJK";
import MaklumatAJK from "./pages/maklumat-ajk/MaklumatAJK";
import SenaraiKempen from "./pages/maklumat-kempen/SenaraiKempen";
import TambahKempen from "./pages/maklumat-kempen/TambahKempen";
import Maklumatkempen from "./pages/maklumat-kempen/Maklumatkempen";

import MaklumatAset from "./pages/asset/MaklumatAset";
import RekodPemerolehanAset from "./pages/asset/RekodPemerolehanAset";
import MaklumatPemerolehanAset from "./pages/asset/MaklumatPemerolehanAset";
import RekodPelupusanAset from "./pages/asset/RekodPelupusanAset";
import BorangPelupusanAset from "./pages/asset/BorangPelupusanAset";
import MaklumatPelupusanAset from "./pages/asset/MaklumatPelupusanAset";
import MaklumatLogo from "./pages/maklumat-logo/MaklumatLogo";
import KemaskiniBankInstitusi from "./pages/maklumat-bank-institusi/KemaskiniBankInstitusi";
import MaklumatTransaksiPWR from "./pages/panjar-wang-runcit/MaklumatTransaksiPWR";
import TambahNilai from "./pages/maklumat-tabung/TambahNilai";
import SenaraiPermohonan from "./pages/permohonan-bantuan-khairat-kematian/SenaraiPermohonan";
import MaklumatPermohonan from "./pages/permohonan-bantuan-khairat-kematian/MaklumatPermohonan";
import TopupResit from "./pages/resit/TopupResit";
import LupaKataLaluan from "./pages/auth/forgot-password";
import TukarKataLaluan from "./pages/KataLaluan/TukarKataLaluan";
import Expired from "./pages/Expired";
import TambahRekodPenerimaan from "./pages/Pengurusan/Kewangan/Penerimaan/TambahRekodPenerimaan";
import TambahRekodPerbelanjaan from "./pages/Pengurusan/Kewangan/Perbelanjaan/TambahRekodPerbelanjaan";
import MaklumatTransaksiPenerimaan from "./pages/Pengurusan/Kewangan/Penerimaan/MaklumatTransaksiPenerimaan";
import MaklumatTransaksiPerbelanjaan from "./pages/Pengurusan/Kewangan/Perbelanjaan/MaklumatTransaksiPerbelanjaan";

import SenaraiPengguna from "./pages/superadmin/pengurusan-pengguna/SenaraiPengguna";
import { useAuth } from "./context/AuthContext";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import MaklumatPengguna from "./pages/superadmin/pengurusan-pengguna/MaklumatPengguna";
import SenaraiTransaksiKeseluruhan from "./pages/superadmin/pengurusan-transaksi/SenaraiTransaksi";
import MaklumatTransaksiSumbangan from "./pages/superadmin/pengurusan-transaksi/MaklumatTransaksi";
import SenaraiMasjid from "./pages/superadmin/pengurusan-masjid/SenaraiMasjid";
import MaklumatMasjid from "./pages/superadmin/pengurusan-masjid/MaklumatMasjid";
import KreditPengguna from "./pages/superadmin/pengurusan-kredit/KreditPengguna";
import MaklumatKreditPengguna from "./pages/superadmin/pengurusan-kredit/MaklumatKreditPengguna";
import Kredit from "./pages/KreditInstitusi/kredit";
import KreditInstitusi from "./pages/superadmin/pengurusan-kredit/KreditInstitusi";
import MaklumatKreditInstitusi from "./pages/superadmin/pengurusan-kredit/MaklumatKreditInstitusi";
import SenaraiTabungMasjid from "./pages/superadmin/pengurusan-tabung/SenaraiTabungMasjid";
import MaklumatTabungMasjid from "./pages/superadmin/pengurusan-tabung/MaklumatTabungMasjid";
import SenaraiKempenMasjid from "./pages/superadmin/pengurusan-kempen/SenaraiKempenMasjid";
import MaklumatKempen from "./pages/superadmin/pengurusan-kempen/MaklumatKempen";
import DashboardSuperAdmin from "./pages/superadmin/DashboardSuperAdmin";
import DaftarMasjid from "./pages/superadmin/pengurusan-masjid/DaftarMasjid";
import DaftarKempen from "./pages/superadmin/pengurusan-kempen/DaftarKempen";
import SenaraiPengesahanKempen from "./pages/superadmin/pengurusan-pengesahan/Kempen/SenaraiPengesahanKempen";
import SenaraiPengesahanInstitusi from "./pages/superadmin/pengurusan-pengesahan/Institusi/SenaraiPengesahanInstitusi";


function App() {

	let { user } = useSelector((user) => user.auth)

	return (
		<main className="App relative">
		<ModalProvider>
		<Routes>

			<Route path="/" element={<AuthLayout />}>
				<Route path="/" element={<Login />} />
				<Route path="/login" element={<Login />} />
				<Route path="/register" element={<Register />} />
				<Route path="/forgot-password" element={<LupaKataLaluan />} />
				<Route path="/lock-screen" element={<LockScreen />} />
				<Route path="/session-expired" element={<Expired />} />
			</Route>

			<Route path="/resit" element={<TopupResit />} />

			<Route path="/*" element={<Layout />}>

				{
					user && user.role === "Super Admin" && (
						<>
							<Route path="dashboard" element={<DashboardSuperAdmin />} />
							<Route path="pengurusan">
								<Route path="pengurusan-pengguna" element={<SenaraiPengguna />} />
								<Route path="maklumat-pengguna" element={<MaklumatPengguna />} />

								<Route path="pengurusan-institusi" element={<SenaraiMasjid />} />
								<Route path="maklumat-institusi" element={<MaklumatMasjid />} />
								<Route path="daftar-institusi" element={<DaftarMasjid />} />

								<Route path="pengurusan-transaksi" element={<SenaraiTransaksiKeseluruhan />} />
								<Route path="maklumat-transaksi" element={<MaklumatTransaksiSumbangan />} />

								<Route path="akaun-kredit">
									<Route path="pengguna" element={<KreditPengguna />} />
									<Route path="maklumat-kredit-pengguna" element={<MaklumatKreditPengguna />} />

									<Route path="institusi" element={<KreditInstitusi />} />
									<Route path="maklumat-kredit-institusi" element={<MaklumatKreditInstitusi />} />
								</Route>

								<Route path="pengurusan-tabung" element={<SenaraiTabungMasjid />} />
								<Route path="maklumat-tabung" element={<MaklumatTabungMasjid />} />

								<Route path="pengurusan-kempen" element={<SenaraiKempenMasjid />} />
								<Route path="maklumat-kempen" element={<MaklumatKempen />} />
								<Route path="daftar-kempen" element={<DaftarKempen />} />
							</Route>
							<Route path="pengesahan">
								<Route path="institusi" element={<SenaraiPengesahanInstitusi />} />
								<Route path="kempen" element={<SenaraiPengesahanKempen />} />
							</Route>
						</>
					)
				}

				<Route path="dashboard" element={<CrmPage />} />

				{/* * * * * * * * * * * Maklumat Institusi * * * * * * * * * * */}
				<Route path="institusi/maklumat" element={<MaklumatInstitusi />} />
				<Route path="institusi/logo" element={<MaklumatLogo />} />
				<Route path="institusi/tukar-kata-laluan" element={<TukarKataLaluan />} />


				{/* * * * * * * * * * * Maklumat Perbankan Institusi * * * * * * * * * * */}
				<Route path="perbankan/maklumat" element={<MaklumatBankInstitusi />} />
				<Route path="perbankan/tambah-maklumat" element={<TambahMaklumatPerbankan />} />
				<Route path="perbankan/kemaskini-maklumat" element={<KemaskiniBankInstitusi />} />


				{/* * * * * * * * * * * Maklumat Tabung Institusi * * * * * * * * * * */}
				<Route path="tabung/senarai-tabung" element={<SenaraiTabung />} />
				<Route path="tabung/tambah-tabung" element={<TambahTabung />} />
				<Route path="tabung/maklumat-tabung" element={<MaklumatTabung />} />
				<Route path="tabung/tambah-nilai" element={<TambahNilai />} />


				{/* * * * * * * * * * * Maklumat AJK * * * * * * * * * * */}
				<Route path="ajk/senarai-ajk" element={<SenaraiAJK />} />
				<Route path="ajk/tambah-ajk" element={<TambahAJK />} />
				<Route path="ajk/maklumat-ajk" element={<MaklumatAJK />} />

				<Route path=":nama_institusi/kempen/:nama_kempen" element={<SenaraiAJK />} />

				{/* * * * * * * * * * * Maklumat Kempen * * * * * * * * * * */}
				<Route path="kempen/senarai-kempen" element={<SenaraiKempen />} />
				<Route path="kempen/tambah-kempen" element={<TambahKempen />} />
				<Route path="kempen/maklumat-kempen" element={<Maklumatkempen />} />

				{/* * * * * * * * * * * Maklumat Hebahan Institusi * * * * * * * * * * */}
				<Route path="hebahan/senarai-hebahan" element={<SenaraiHebahan />} />
				<Route path="hebahan/tambah-hebahan" element={<TambahHebahan />} />
				<Route path="hebahan/maklumat-hebahan" element={<MaklumatHebahan />} />

				{/* * * * * * * * * * * Maklumat Kredit Institusi * * * * * * * * * * */}
				<Route path="institusi/kredit" element={<Kredit />} />

				{/* * * * * * * * * * * Maklumat Pengeluaran Kredit Institusi * * * * * * * * * * */}
				<Route path="institusi/pengeluaran" element={<PengeluaranKredit />} />

				{/* * * * * * * * * * * Maklumat Transaksi Institusi * * * * * * * * * * */}
				<Route path="institusi/transaksi-institusi" element={<TransaksiInstitusi />} />
				<Route path="institusi/transaksi-institusi/maklumat-transaksi/:id" element={<TransaksiDetailsInstitusi />} />


				{/* * * * * * * * * * * Senarai Pengesahan Ahli Kariah * * * * * * * * * * */}
				<Route path="pengesahan/senarai-kariah" element={<SenaraiPengesahanKariah />} />
				<Route path="pengesahan/maklumat-kariah" element={<MaklumatKariah />} />


				{/* * * * * * * * * * * Senarai Ahli Kariah * * * * * * * * * * */}
				<Route path="kariah/senarai-kariah" element={<SenaraiKariah />} />
				<Route path="kariah/maklumat-kariah" element={<MaklumatKariah />} />


				{/* * * * * * * * * * * Senarai Transaksi Bayaran Ahli Kariah * * * * * * * * * * */}
				<Route path="transaksi/senarai-bayaran" element={<SenaraiTransaksi />} />
				<Route path="transaksi/maklumat-bayaran/:id" element={<MaklumatTransaksi />} />


				{/* * * * * * * * * * * Senarai Transaksi Khairat Kematian * * * * * * * * * * */}
				<Route path="khairat-kematian/pay" element={<BayarKhairatKematian />} />
				<Route path="khairat-kematian/senarai-khairat-kematian" element={<SenaraiBayaranKhairatKematian />} />
				<Route path="khairat-kematian/maklumat-khairat-kematian" element={<MaklumatBayaranKhairatKematian />} />


				{/* * * * * * * * * * * Senarai Permohonan Bantuan Khairat Kematian * * * * * * * * * * */}
				<Route path="permohonan-bantuan-khairat/senarai-permohonan" element={<SenaraiPermohonan />} />
				<Route path="permohonan-bantuan-khairat/maklumat-permohonan" element={<MaklumatPermohonan />} />


				{/* * * * * * * * * * * Senarai Yuran * * * * * * * * * * */}
				<Route path="yuran/list" element={<SenaraiYuran />} />
				<Route path="yuran/detail" element={<MaklumatYuran />} />
				<Route path="yuran/create" element={<CreateYuran />} />


				{/* * * * * * * * * * * Senarai Asnaf * * * * * * * * * * */}
				<Route path="asnaf/list" element={<SenaraiAsnaf />} />
				<Route path="asnaf/create" element={<TambahAsnaf />} />
				<Route path="asnaf/detail" element={<MaklumatAsnaf />} />


				{/* * * * * * * * * * * Senarai Anak Yatim * * * * * * * * * * */}
				<Route path="anak-yatim/list" element={<SenaraiAnakYatim />} />
				<Route path="anak-yatim/create" element={<CreateAnakYatim />} />
				<Route path="anak-yatim/detail" element={<MaklumatAnakYatim />} />


				{/* * * * * * * * * * * Senarai Anak Yatim * * * * * * * * * * */}
				<Route path="ahli-khairat/list" element={<SenaraiAhliKhairatKematian />} />
				<Route path="ahli-khairat/detail" element={<MaklumatAhliKhairat />} />


				{/* * * * * * * * * * * Kewangan - Baki Bank Terkini * * * * * * * * * * */}

				<Route path="kewangan/daftar-bank-simpanan-tetap" element={<TambahBankSimpananTetap />} />
				<Route path="kewangan/maklumat-bank-simpanan-tetap" element={<MaklumatBankSimpananTetap />} />
				<Route path="kewangan/tambah-transaksi-simpanan-tetap" element={<TambahTransaksi />} />

				<Route path="kewangan/daftar-bank-semasa" element={<TambahBankSemasa />} />
				<Route path="kewangan/maklumat-bank-semasa" element={<MaklumatBankSemasa />} />
				<Route path="kewangan/tambah-transaksi-bank-semasa" element={<TambahTransaksiBankSemasa />} />

				<Route path="kewangan/baki-bank-semasa" element={<SenaraiBankSemasa />} />
				<Route path="kewangan/baki-simpanan-tetap" element={<SenaraiBankSimpananTetap />} />

				<Route path="kewangan/kemaskini-baki-bank" element={<KemaskiniBakiBank />} />
				<Route path="kewangan/kemaskini-baki-tetap" element={<KemaskiniBakiTetap />} />

				<Route path="kewangan/setting-bank" element={<SettingBank />} />


				{/* * * * * * * * * * * Kewangan - Perolehan * * * * * * * * * * */}
				<Route path="perolehan/kutipan-jumaat" element={<KutipanJumaat />} />
				<Route path="perolehan/kutipan-tetap" element={<KutipanTetap />} />
				<Route path="perolehan/penerimaan-baru" element={<PenerimaanBaru />} />
				<Route path="perolehan/senarai-transaksi" element={<SenaraiTransaksiPenerimaan />} />
				<Route path="perolehan/tambah-rekod-transaksi" element={<TambahRekodPenerimaan />} />
				<Route path="perolehan/maklumat-transaksi" element={<MaklumatTransaksiPenerimaan />} />


				{/* * * * * * * * * * * Kewangan - Perbelanjaan * * * * * * * * * * */}
				<Route path="perbelanjaan/perbelanjaan-bank" element={<PerbelanjaanBank />} />
				<Route path="perbelanjaan/perbelanjaan-baru" element={<PerbelanjaanBaru />} />
				<Route path="perbelanjaan/senarai-transaksi" element={<SenaraiTransaksiPerbelanjaan />} />
				<Route path="perbelanjaan/tambah-rekod-transaksi" element={<TambahRekodPerbelanjaan />} />
				<Route path="perbelanjaan/maklumat-transaksi" element={<MaklumatTransaksiPerbelanjaan />} />

				{/* * * * * * * * * * * Kewangan - Panjar Wang Runcit * * * * * * * * * * */}
				<Route path="panjar-wang-runcit/info" element={<MaklumatPanjarWangRuncit />} />
				<Route path="panjar-wang-runcit/tambah-transaksi" element={<TambahTransaksiPanjarWangRuncit />} />
				<Route path="panjar-wang-runcit/maklumat-transaksi" element={<MaklumatTransaksiPWR />} />

				{/* * * * * * * * * * * Pengurusan - Aset * * * * * * * * * * */}
				<Route path="aset/pendaftaran-aset" element={<PendaftaranAsset />} />
				<Route path="aset/maklumat-aset" element={<MaklumatAset />} />

				<Route path="aset/senarai-pemerolehan-aset" element={<RekodPemerolehanAset />} />
				<Route path="aset/permohonan-pemerolehan-aset" element={<PermohonanPemerolehanAsset />} />
				<Route path="aset/maklumat-pemerolehan-aset" element={<MaklumatPemerolehanAset />} />

				<Route path="aset/senarai-pelupusan-aset" element={<RekodPelupusanAset />} />
				<Route path="aset/permohonan-pelupusan-aset" element={<PermohonanPelupusanAsset />} />
				<Route path="aset/borang-pelupusan-aset" element={<BorangPelupusanAset />} />
				<Route path="aset/maklumat-pelupusan-aset" element={<MaklumatPelupusanAset />} />

				<Route path="aset/inventori-aset" element={<InventoriAsset />} />
				<Route path="aset/maklumat-aset" element={<InformasiAsset />} />
				<Route path="aset/borang-penyelenggaraan-aset" element={<BorangPenyelenggaraanAsset />} />
				<Route path="aset/senarai-lokasi" element={<SenaraiLokasi />} />

				{/* * * * * * * * * * * Pengurusan - Aset * * * * * * * * * * */}
				<Route path="aset/pendaftaran-aset" element={<PendaftaranAsset />} />
				<Route path="aset/permohonan-pelupusan-aset" element={<PermohonanPelupusanAsset/>} />
				<Route path="aset/permohonan-pemerolehan-aset" element={<PermohonanPemerolehanAsset />} />
				<Route path="aset/inventori-aset" element={<InventoriAsset />} />
				<Route path="aset/maklumat-aset" element={<InformasiAsset />} />
				<Route path="aset/borang-penyelenggaraan-aset" element={<BorangPenyelenggaraanAsset />} />
				<Route path="aset/senarai-lokasi" element={<SenaraiLokasi />} />

				<Route path="*" element={<Navigate to="/404" />} />
			</Route>
			
			<Route path="/404" element={<Suspense fallback={<Loading />}><Error /></Suspense> } />
			<Route path="/coming-soon" element={<Suspense fallback={<Loading />}><ComingSoonPage /></Suspense> } />
			<Route path="/under-construction" element={<Suspense fallback={<Loading />}><UnderConstructionPage /></Suspense> } />

		</Routes>
		</ModalProvider>
		</main>
	);
}

export default App;
