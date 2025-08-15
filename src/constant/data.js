export const SuperAdminMenu = [
	{
        isHeadr: true,
        title: "Paparan Utama",
    },
    {
        title: "Paparan Utama",
        icon: "heroicons-outline:home",
        link: "dashboard",
    },
	{
        isHeadr: true,
        title: "Pengurusan Maklumat",
    },
	{
        title: "Pengurusan Pengguna",
        icon: "heroicons-outline:users",
        link: "pengurusan/pengurusan-pengguna",
    },
	{
        title: "Pengurusan Institusi",
        icon: "heroicons-outline:building-library",
        link: "pengurusan/pengurusan-institusi",
    },
	{
        title: "Pengurusan Transaksi",
        icon: "heroicons-outline:document-text",
        link: "pengurusan/pengurusan-transaksi",
    },
	{
        title: "Pengurusan Akaun Kredit",
        icon: "heroicons:wallet",
        child: [
			{
				childtitle: 'Pengguna',
				childlink: 'pengurusan/akaun-kredit/pengguna'
			},
			{
				childtitle: 'Institusi',
				childlink: 'pengurusan/akaun-kredit/institusi'
			}
		]
    },
	{
        title: "Pengurusan Tabung",
        icon: "heroicons-outline:archive-box",
        link: "pengurusan/pengurusan-tabung",
    },
	{
        isHeadr: true,
        title: "Kempen",
    },
	{
        title: "Senarai Kempen",
        icon: "heroicons-outline:clipboard-document-list",
        link: "pengurusan/pengurusan-kempen",
    },
	{
        isHeadr: true,
        title: "Pengeluaran",
    },
	{
        title: "Senarai Pengeluaran",
        icon: "heroicons-outline:clipboard-document-list",
        link: "pengurusan/pengurusan-pengeluaran",
    },
]

export const menuItems = [
    {
        isHeadr: true,
        title: "Paparan Utama",
    },
    {
        title: "Paparan Utama",
        icon: "heroicons-outline:home",
        link: "dashboard",
    },
	{
        title: "Pengurusan Pengguna",
        icon: "heroicons-outline:users",
        link: "pengurusan/pengurusan-pengguna",
    },
    {
        isHeadr: true,
        title: "Pengurusan Institusi",
    },
	{
        title: "Maklumat Institusi",
        icon: "heroicons-outline:identification",
        link: "institusi/maklumat",
    },
	{
        title: "Gambar / Logo Institusi",
        icon: "heroicons-outline:identification",
        link: "institusi/logo",
    },
	{
        title: "Tukar Kata Laluan",
        icon: "heroicons-outline:lock-closed",
        link: "institusi/tukar-kata-laluan",
    },
	{
        title: "Maklumat Perbankan",
        icon: "heroicons-outline:building-library",
        link: "perbankan/maklumat",
    },
	{
        title: "Maklumat Tabung",
        icon: "heroicons:wallet",
        link: "tabung/senarai-tabung",
    },
	{
		title: "Maklumat AJK",
        icon: "heroicons-outline:user-group",
        link: "ajk/senarai-ajk",
	},
	{
        title: "Maklumat Kempen",
        icon: "heroicons-outline:megaphone",
        link: "kempen/senarai-kempen",

    },
	{

        title: "Hebahan",
        icon: "heroicons-outline:newspaper",
        link: "hebahan/senarai-hebahan",
    },
	{
        title: "Kredit",
        icon: "heroicons-outline:credit-card",
        link: "institusi/kredit",
    },
	{
        title: "Pengeluaran",
        icon: "heroicons-outline:banknotes",
        link: "institusi/pengeluaran",
    },
	{
        title: "Transaksi",
        icon: "heroicons-outline:list-bullet",
        link: "institusi/transaksi-institusi",
        
    },
    {
        isHeadr: true,
        title: "Kariah & Khairat Kematian",
    },
    {
        title: "Pengesahan Kariah",
        icon: "heroicons-outline:clipboard-document-check",
        link: "pengesahan/senarai-kariah",
    },
    {
        title: "Senarai Ahli Kariah",
        icon: "heroicons-outline:users",
        link: "kariah/senarai-kariah",
    },
	{
        title: "Senarai Asnaf",
        icon: "heroicons-outline:users",
        link: "asnaf/list",
    },
	{
        title: "Senarai Anak Yatim",
        icon: "heroicons-outline:users",
        link: "anak-yatim/list",
    },
	{
        title: "Senarai Ahli Khairat",
        icon: "heroicons-outline:users",
        link: "ahli-khairat/list",
    },
    {
        title: "Khairat Kematian",
        icon: "heroicons-outline:credit-card",
        child: [
            {
                childtitle: "Bayar",
                childlink: "khairat-kematian/pay"
            },
            {
                childtitle: "Rekod Bayaran",
                childlink: "khairat-kematian/senarai-khairat-kematian"
            }
        ]
    },
	{
        title: "Permohonan Bantuan Khairat Kematian",
        icon: "heroicons-outline:credit-card",
        child: [
            {
                childtitle: "Senarai Permohonan",
                childlink: "permohonan-bantuan-khairat/senarai-permohonan"
            }
        ]
    },
	{
        title: "Yuran Khairat Kematian",
        icon: "heroicons-outline:newspaper",
		    child: [
            {
                childtitle: "Senarai Yuran",
                childlink: "yuran/list"
            },
            {
                childtitle: "Tambah Yuran",
                childlink: "yuran/create"
            }
        ]
    },
	{
        title: "Transaksi Bayaran Yuran Khairat Kematian",
        icon: "heroicons-outline:credit-card",
        link: "transaksi/senarai-bayaran",
    },
    {
      isHeadr: true,
      title: "Aset dan Inventori",
    },
	{
		title: "Senarai Inventori Aset",
		icon: "heroicons-outline:archive-box",
		link: "aset/inventori-aset"
	},
	{
		title: "Pendaftaran Aset",
		icon: "heroicons-solid:archive-box-arrow-down",
		link: "aset/pendaftaran-aset"
	},
	{
		title: "Senarai Lokasi",
		icon: "heroicons-outline:map-pin",
		link: "aset/senarai-lokasi"
	},
	{
		title: "Pemerolehan Aset",
		icon: "heroicons-outline:squares-2x2",
		//link: "aset/permohonan-pemerolehan-aset"
		child: [
			{
                childtitle: "Senarai Pemerolehan",
                childlink: "aset/senarai-pemerolehan-aset"
            },
            {
                childtitle: "Permohonan Pemerolehan",
                childlink: "aset/permohonan-pemerolehan-aset"
            }
		]
	},
    {
 
      

		title: "Pelupusan Aset",
		icon: "heroicons-outline:archive-box-x-mark",
		//link: "aset/permohonan-pelupusan-aset",
		child: [
			{
				childtitle: "Senarai Pelupusan",
				childlink: "aset/senarai-pelupusan-aset"
			},
			{
				childtitle: "Permohonan Pelupusan",
				childlink: "aset/permohonan-pelupusan-aset"
			}
		]

    },
  //         {
  //             childtitle: "Pendaftaran Aset",
  //             childlink: "aset/pendaftaran-aset"
  //         },
  //         // {
  //         //     childtitle: "Senarai Aset",
  //         //     childlink: "aset/senarai-aset"
  //         // },
  //         {
  //             childtitle: "Permohonan Pelupusan Aset",
  //             childlink: "aset/permohonan-pelupusan-aset"
  //         },
  //         {
  //             childtitle: "Permohonan Pemerolehan Aset",
  //             childlink: "aset/permohonan-pemerolehan-aset"
  //         },
  //         {
  //             childtitle: "Inventori Aset",
  //             childlink: "aset/inventori-aset"
  //         },
  //         // {
  //         //   childtitle: "Borang Penyelenggaraan Aset",
  //         //   childlink: "aset/borang-penyelenggaraan-aset"
  //         // },
  //         {
  //             childtitle: "Senarai Lokasi",
  //             childlink: "aset/senarai-lokasi"
  //         }
  //     ]
  // },
	{
        isHeadr: true,
        title: "Kewangan Masjid",
    },
	{
        title: "Panjar Wang Runcit",
        icon: "heroicons-outline:calculator",
		link: "panjar-wang-runcit/info"
	},
	{
        title: "Baki Bank Terkini",
        icon: "heroicons-outline:calculator",
		    child: [
			{
            	childtitle: "Baki Terkini Bank Semasa",
            	childlink: 'kewangan/baki-bank-semasa'
          	},
			{
            	childtitle: "Baki Terkini Simpanan Tetap",
            	childlink: 'kewangan/baki-simpanan-tetap'
          	},
      	]
    },
	{
        title: "Rekod Perolehan",
        icon: "heroicons-outline:calculator",
		link: "perolehan/senarai-transaksi"
    },
	{
        title: "Rekod Perbelanjaan",
        icon: "heroicons-outline:calculator",
		link: "perbelanjaan/senarai-transaksi"
    },
];

export const topMenu = 
[
	{
		isHeadr: true,
		title: "Utama",
	},
	{
		title: "Paparan Utama",
		icon: "heroicons-outline:home",
		link: "dashboard",
	},
	{
		isHeadr: true,
		title: "Aplikasi",
	},
	{
		isHeadr: true,
		title: "Pages",
	},
	{
		title: "Authentication",
		icon: "heroicons-outline:lock-closed",
		link: "#",
		child: [
			{
				childtitle: "Signin One",
				childlink: "/",
			},
			{
				childtitle: "Signin Two",
				childlink: "/login2",
			},
			{
				childtitle: "Signin Three",
				childlink: "/login3",
			},
			{
				childtitle: "Signup One",
				childlink: "/reg",
			},
			{
				childtitle: "Signup Two",
				childlink: "/reg2",
			},
			{
				childtitle: "Signup Three",
				childlink: "/reg3",
			},
			{
				childtitle: "Forget Password One",
				childlink: "/forgot-password",
			},
			{
				childtitle: "Forget Password Two",
				childlink: "/forgot-password2",
			},
			{
				childtitle: "Forget Password Three",
				childlink: "/forgot-password3",
			},
			{
				childtitle: "Lock Screen One",
				childlink: "/lock-screen",
			},
			{
				childtitle: "Lock Screen Two",
				childlink: "/lock-screen2",
			},
			{
				childtitle: "Lock Screen Three",
				childlink: "/lock-screen3",
			},
		],
	},
	{
		title: "Utility",
		icon: "heroicons-outline:view-boards",
		link: "#",
		isHide: false,
		child: [
			{
				childtitle: "Invoice",
				childlink: "invoice",
			},
			{
				childtitle: "Pricing",
				childlink: "pricing",
			},
			{
				childtitle: "FAQ",
				childlink: "faq",
			},
			{
				childtitle: "Blog",
				childlink: "blog",
			},
			{
				childtitle: "Blank page",
				childlink: "blank-page",
			},
			{
				childtitle: "Prfoile",
				childlink: "profile",
			},
			{
				childtitle: "Settings",
				childlink: "settings",
			},
			{
				childtitle: "404 page",
				childlink: "/404",
			},
		
			{
				childtitle: "Coming Soon",
				childlink: "/coming-soon",
			},
			{
				childtitle: "Under Maintanance page",
				childlink: "/under-construction",
			},
		],
	}
];

import User1 from "@/assets/images/all-img/user.png";
import User2 from "@/assets/images/all-img/user2.png";
import User3 from "@/assets/images/all-img/user3.png";
import User4 from "@/assets/images/all-img/user4.png";

export const notifications = [
	{
		title: "Your order is placed",
		desc: "Amet minim mollit non deser unt ullamco est sit aliqua.",

		image: User1,
		link: "#",
	},
	{
		title: "Congratulations Darlene  🎉",
		desc: "Won the monthly best seller badge",
		unread: true,
		image: User2,
		link: "#",
	},
	{
		title: "Revised Order 👋",
		desc: "Won the monthly best seller badge",

		image: User3,
		link: "#",
	},
	{
		title: "Brooklyn Simmons",
		desc: "Added you to Top Secret Project group...",

		image: User4,
		link: "#",
	},
];

export const message = [
	{
		title: "Wade Warren",
		desc: "Hi! How are you doing?.....",
		active: true,
		hasnotifaction: true,
		notification_count: 1,
		image: User1,
		link: "#",
	},
	{
		title: "Savannah Nguyen",
		desc: "Hi! How are you doing?.....",
		active: false,
		hasnotifaction: false,
		image: User2,
		link: "#",
	},
	{
		title: "Ralph Edwards",
		desc: "Hi! How are you doing?.....",
		active: false,
		hasnotifaction: true,
		notification_count: 8,
		image: User3,
		link: "#",
	},
	{
		title: "Cody Fisher",
		desc: "Hi! How are you doing?.....",
		active: true,
		hasnotifaction: false,
		image: User4,
		link: "#",
	},
	{
		title: "Savannah Nguyen",
		desc: "Hi! How are you doing?.....",
		active: false,
		hasnotifaction: false,
		image: User2,
		link: "#",
	},
	{
		title: "Ralph Edwards",
		desc: "Hi! How are you doing?.....",
		active: false,
		hasnotifaction: true,
		notification_count: 8,
		image: User3,
		link: "#",
	},
	{
		title: "Cody Fisher",
		desc: "Hi! How are you doing?.....",
		active: true,
		hasnotifaction: false,
		image: User4,
		link: "#",
	},
];

export const colors = {
	primary: "#4669FA",
	secondary: "#A0AEC0",
	danger: "#F1595C",
	black: "#111112",
	warning: "#FA916B",
	info: "#0CE7FA",
	light: "#425466",
	success: "#50C793",
	"gray-f7": "#F7F8FC",
	dark: "#1E293B",
	"dark-gray": "#0F172A",
	gray: "#68768A",
	gray2: "#EEF1F9",
	"dark-light": "#CBD5E1",
};

export const hexToRGB = (hex, alpha) => {
	var r = parseInt(hex.slice(1, 3), 16),
		g = parseInt(hex.slice(3, 5), 16),
		b = parseInt(hex.slice(5, 7), 16);

	if (alpha) {
		return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
	} else {
		return "rgb(" + r + ", " + g + ", " + b + ")";
	}
};

export const topFilterLists = [
	{
		name: "Inbox",
		value: "all",
		icon: "uil:image-v",
	},
	{
		name: "Starred",
		value: "fav",
		icon: "heroicons:star",
	},
	{
		name: "Sent",
		value: "sent",
		icon: "heroicons-outline:paper-airplane",
	},
	{
		name: "Drafts",
		value: "drafts",
		icon: "heroicons-outline:pencil-alt",
	},
	{
		name: "Spam",
		value: "spam",
		icon: "heroicons:information-circle",
	},
	{
		name: "Trash",
		value: "trash",
		icon: "heroicons:trash",
	},
];

export const bottomFilterLists = [
	{
		name: "personal",
		value: "personal",
		icon: "heroicons:chevron-double-right",
	},
	{
		name: "Social",
		value: "social",
		icon: "heroicons:chevron-double-right",
	},
	{
		name: "Promotions",
		value: "promotions",
		icon: "heroicons:chevron-double-right",
	},
	{
		name: "Business",
		value: "business",
		icon: "heroicons:chevron-double-right",
	},
];

import meetsImage1 from "@/assets/images/svg/sk.svg";
import meetsImage2 from "@/assets/images/svg/path.svg";
import meetsImage3 from "@/assets/images/svg/dc.svg";
import meetsImage4 from "@/assets/images/svg/sk.svg";

export const meets = [
	{
		img: meetsImage1,
		title: "Meeting with client",
		date: "01 Nov 2021",
		meet: "Zoom meeting",
	},
	{
		img: meetsImage2,
		title: "Design meeting (team)",
		date: "01 Nov 2021",
		meet: "Skyp meeting",
	},
	{
		img: meetsImage3,
		title: "Background research",
		date: "01 Nov 2021",
		meet: "Google meeting",
	},
	{
		img: meetsImage4,
		title: "Meeting with client",
		date: "01 Nov 2021",
		meet: "Zoom meeting",
	},
];

import file1Img from "@/assets/images/icon/file-1.svg";
import file2Img from "@/assets/images/icon/pdf-1.svg";
import file3Img from "@/assets/images/icon/zip-1.svg";
import file4Img from "@/assets/images/icon/pdf-2.svg";
import file5Img from "@/assets/images/icon/scr-1.svg";

export const files = [
	{
		img: file1Img,
		title: "Dashboard.fig",
		date: "06 June 2021 / 155MB",
	},
	{
		img: file2Img,
		title: "Ecommerce.pdf",
		date: "06 June 2021 / 155MB",
	},
	{
		img: file3Img,
		title: "Job portal_app.zip",
		date: "06 June 2021 / 155MB",
	},
	{
		img: file4Img,
		title: "Ecommerce.pdf",
		date: "06 June 2021 / 155MB",
	},
	{
		img: file5Img,
		title: "Screenshot.jpg",
		date: "06 June 2021 / 155MB",
	},
];

import blackJumper from "@/assets/images/e-commerce/product-card/classical-black-tshirt.png";
import blackTshirt from "@/assets/images/e-commerce/product-card/black-t-shirt.png";
import checkShirt from "@/assets/images/e-commerce/product-card/check-shirt.png";
import grayJumper from "@/assets/images/e-commerce/product-card/gray-jumper.png";
import grayTshirt from "@/assets/images/e-commerce/product-card/gray-t-shirt.png";
import pinkBlazer from "@/assets/images/e-commerce/product-card/pink-blazer.png";
import redTshirt from "@/assets/images/e-commerce/product-card/red-t-shirt.png";
import yellowFrok from "@/assets/images/e-commerce/product-card/yellow-frok.png";
import yellowJumper from "@/assets/images/e-commerce/product-card/yellow-jumper.png";

export const products = [
	{
		img: blackJumper,
		category: "men",
		name: "Classical Black T-Shirt Classical Black T-Shirt",
		subtitle: "The best cotton black branded shirt.",
		desc: "The best cotton black branded shirt. The best cotton black branded shirt. The best cotton black branded shirt. The best cotton black branded shirt. The best cotton black branded shirt.",
		rating: "4.8",
		price: 489,
		oldPrice: "$700",
		percent: "40%",
		brand: "apple",
	},
	{
		img: blackTshirt,
		category: "men",
		name: "Classical Black T-Shirt",
		subtitle: "The best cotton black branded shirt.",
		desc: "The best cotton black branded shirt",
		rating: "4.8",
		price: 20,
		oldPrice: "$700",
		percent: "40%",
		brand: "apex",
	},
	{
		img: checkShirt,
		category: "women",
		name: "Classical Black T-Shirt",
		subtitle: "The best cotton black branded shirt.",
		desc: "The best cotton black branded shirt",
		rating: "4.8",
		price: 120,
		oldPrice: "$700",
		percent: "40%",
		brand: "easy",
	},
	{
		img: grayJumper,
		category: "women",
		name: "Classical Black T-Shirt",
		subtitle: "The best cotton black branded shirt.",
		desc: "The best cotton black branded shirt",
		rating: "4.8",
		price: 70,
		oldPrice: "$700",
		percent: "40%",
		brand: "pixel",
	},
	{
		img: grayTshirt,
		category: "baby",
		name: "Classical Black T-Shirt",
		subtitle: "The best cotton black branded shirt.",
		desc: "The best cotton black branded shirt",
		rating: "4.8",
		price: 30,
		oldPrice: "$700",
		percent: "40%",
		brand: "apex",
	},
	{
		img: pinkBlazer,
		category: "women",
		name: "Classical Black T-Shirt",
		subtitle: "The best cotton black branded shirt.",
		desc: "The best cotton black branded shirt",
		rating: "4.8",
		price: 40,
		oldPrice: "$700",
		percent: "40%",
		brand: "apple",
	},
	{
		img: redTshirt,
		category: "women",
		name: "Classical Black T-Shirt",
		subtitle: "The best cotton black branded shirt.",
		desc: "The best cotton black branded shirt",
		rating: "4.8",
		price: 90,
		oldPrice: "$700",
		percent: "40%",
		brand: "easy",
	},
	{
		img: yellowFrok,
		category: "women",
		name: "Classical Black T-Shirt",
		subtitle: "The best cotton black branded shirt.",
		desc: "The best cotton black branded shirt",
		rating: "4.8",
		price: 80,
		oldPrice: "$700",
		percent: "40%",
		brand: "pixel",
	},
	{
		img: yellowJumper,
		category: "furniture",
		name: "Classical Black T-Shirt",
		subtitle: "The best cotton black branded shirt.",
		desc: "The best cotton black branded shirt",
		rating: "4.8",
		price: 20,
		oldPrice: "$700",
		percent: "40%",
		brand: "samsung",
	},
];

export const categories = [
	{ label: "All", value: "all", count: "9724" },
	{ label: "Men", value: "men", count: "1312" },
	{ label: "Women", value: "women", count: "3752" },
	{ label: "Child", value: "child", count: "985" },
	{ label: "Baby", value: "baby", count: "745" },
	{ label: "Footwear", value: "footwear", count: "1280" },
	{ label: "Furniture", value: "furniture", count: "820" },
	{ label: "Mobile", value: "mobile", count: "2460" },
];

export const brands = [
	{ label: "Apple", value: "apple", count: "9724" },
	{ label: "Apex", value: "apex", count: "1312" },
	{ label: "Easy", value: "easy", count: "3752" },
	{ label: "Pixel", value: "pixel", count: "985" },
	{ label: "Samsung", value: "samsung", count: "2460" },
];

export const price = [
	{
		label: "$0 - $199",
		value: {
		min: 0,
		max: 199,
		},
		count: "9724",
	},
	{
		label: "$200 - $449",
		value: {
		min: 200,
		max: 499,
		},
		count: "1312",
	},
	{
		label: "$450 - $599",
		value: {
		min: 450,
		max: 599,
		},
		count: "3752",
	},
	{
		label: "$600 - $799",
		value: {
		min: 600,
		max: 799,
		},
		count: "985",
	},
	{
		label: "$800 & Above",
		value: {
		min: 800,
		max: 1000,
		},
		count: "745",
	},
];

export const ratings = [
	{ name: 5, value: 5, count: "9724" },
	{ name: 4, value: 4, count: "1312" },
	{ name: 3, value: 3, count: "3752" },
	{ name: 2, value: 2, count: "985" },
	{ name: 1, value: 1, count: "2460" },
];

export const selectOptions = [
	{
		value: "option1",
		label: "Option 1",
	},
	{
		value: "option2",
		label: "Option 2",
	},
	{
		value: "option3",
		label: "Option 3",
	},
];
export const selectCategory = [
	{
		value: "option1",
		label: "Top Rated",
	},
	{
		value: "option2",
		label: "Option 2",
	},
	{
		value: "option3",
		label: "Option 3",
	},
];

import bkash from "@/assets/images/e-commerce/cart-icon/bkash.png";
import fatoorah from "@/assets/images/e-commerce/cart-icon/fatoorah.png";
import instamojo from "@/assets/images/e-commerce/cart-icon/instamojo.png";
import iyzco from "@/assets/images/e-commerce/cart-icon/iyzco.png";
import nagad from "@/assets/images/e-commerce/cart-icon/nagad.png";
import ngenious from "@/assets/images/e-commerce/cart-icon/ngenious.png";
import payfast from "@/assets/images/e-commerce/cart-icon/payfast.png";
import payku from "@/assets/images/e-commerce/cart-icon/payku.png";
import paypal from "@/assets/images/e-commerce/cart-icon/paypal.png";
import paytm from "@/assets/images/e-commerce/cart-icon/paytm.png";
import razorpay from "@/assets/images/e-commerce/cart-icon/razorpay.png";
import ssl from "@/assets/images/e-commerce/cart-icon/ssl.png";
import stripe from "@/assets/images/e-commerce/cart-icon/stripe.png";
import truck from "@/assets/images/e-commerce/cart-icon/truck.png";
import vougepay from "@/assets/images/e-commerce/cart-icon/vougepay.png";

export const payments = [
	{
		img: bkash,
		value: "bkash",
	},
	{
		img: fatoorah,
		value: "fatoorah",
	},
	{
		img: instamojo,
		value: "instamojo",
	},
	{
		img: iyzco,
		value: "iyzco",
	},
	{
		img: nagad,
		value: "nagad",
	},
	{
		img: ngenious,
		value: "ngenious",
	},
	{
		img: payfast,
		value: "payfast",
	},
	{
		img: payku,
		value: "payku",
	},
	{
		img: paypal,
		value: "paypal",
	},
	{
		img: paytm,
		value: "paytm",
	},
	{
		img: razorpay,
		value: "razorpay",
	},
	{
		img: ssl,
		value: "ssl",
	},
	{
		img: stripe,
		value: "stripe",
	},
	{
		img: truck,
		value: "truck",
	},
	{
		img: vougepay,
		value: "vougepay",
	},
];
