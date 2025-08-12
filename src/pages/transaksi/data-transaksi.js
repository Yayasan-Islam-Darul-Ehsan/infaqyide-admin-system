import moment from "moment";

export const data_transaksi = [
    {
        "id": 1,
        "transaction_order_number": "BYR0000001",
        "transaction_reference_number": "202405100912737465",
        "transaction_bill_name": "Bayaran RM10.00 Untuk Keahlian Kariah",
        "transaction_bill_description": "Bayaran RM10.00 kepada institusi Surau Taman Dato' Wan untuk bayaran keahlian kariah tahun 2024",
        "transaction_amount": 10.00,
        "transaction_date": "2024-06-06 15:30:00",
        "transaction_payment_method": "Online Banking",
        "transaction_fpx_id": "2024102301928328322",
        "transaction_status": "Success"
    },
    {
        "id": 2,
        "transaction_order_number": "BYR0000002",
        "transaction_reference_number": "202405100912737466",
        "transaction_bill_name": "Bayaran RM15.00 Untuk Derma Masjid",
        "transaction_bill_description": "Bayaran RM15.00 kepada Masjid Al-Hidayah untuk derma",
        "transaction_amount": 15.00,
        "transaction_date": "2024-06-06 15:31:00",
        "transaction_payment_method": "Credit Card",
        "transaction_fpx_id": "2024102301928328323",
        "transaction_status": "Failed"
    },
    {
        "id": 3,
        "transaction_order_number": "BYR0000003",
        "transaction_reference_number": "202405100912737467",
        "transaction_bill_name": "Bayaran RM20.00 Untuk Yuran Sekolah",
        "transaction_bill_description": "Bayaran RM20.00 kepada Sekolah Menengah Kebangsaan untuk yuran tahunan",
        "transaction_amount": 20.00,
        "transaction_date": "2024-06-06 15:32:00",
        "transaction_payment_method": "Debit Card",
        "transaction_fpx_id": "2024102301928328324",
        "transaction_status": "Success"
    },
    {
        "id": 4,
        "transaction_order_number": "BYR0000004",
        "transaction_reference_number": "202405100912737468",
        "transaction_bill_name": "Bayaran RM5.00 Untuk Buku",
        "transaction_bill_description": "Bayaran RM5.00 kepada Kedai Buku Bestari untuk buku latihan",
        "transaction_amount": 5.00,
        "transaction_date": "2024-06-06 15:33:00",
        "transaction_payment_method": "Online Banking",
        "transaction_fpx_id": "2024102301928328325",
        "transaction_status": "Success"
    },
    {
        "id": 5,
        "transaction_order_number": "BYR0000005",
        "transaction_reference_number": "202405100912737469",
        "transaction_bill_name": "Bayaran RM50.00 Untuk Kursus",
        "transaction_bill_description": "Bayaran RM50.00 kepada Akademi Latihan untuk kursus kepimpinan",
        "transaction_amount": 50.00,
        "transaction_date": "2024-06-06 15:34:00",
        "transaction_payment_method": "Credit Card",
        "transaction_fpx_id": "2024102301928328326",
        "transaction_status": "Success"
    },
    {
        "id": 6,
        "transaction_order_number": "BYR0000006",
        "transaction_reference_number": "202405100912737470",
        "transaction_bill_name": "Bayaran RM25.00 Untuk Derma Anak Yatim",
        "transaction_bill_description": "Bayaran RM25.00 kepada Rumah Anak Yatim Darul Iman untuk derma",
        "transaction_amount": 25.00,
        "transaction_date": "2024-06-06 15:35:00",
        "transaction_payment_method": "Debit Card",
        "transaction_fpx_id": "2024102301928328327",
        "transaction_status": "Success"
    },
    {
        "id": 7,
        "transaction_order_number": "BYR0000007",
        "transaction_reference_number": "202405100912737471",
        "transaction_bill_name": "Bayaran RM30.00 Untuk Keahlian Kelab",
        "transaction_bill_description": "Bayaran RM30.00 kepada Kelab Rekreasi untuk keahlian tahunan",
        "transaction_amount": 30.00,
        "transaction_date": "2024-06-06 15:36:00",
        "transaction_payment_method": "Online Banking",
        "transaction_fpx_id": "2024102301928328328",
        "transaction_status": "Failed"
    },
    {
        "id": 8,
        "transaction_order_number": "BYR0000008",
        "transaction_reference_number": "202405100912737472",
        "transaction_bill_name": "Bayaran RM40.00 Untuk Sumbangan Hospital",
        "transaction_bill_description": "Bayaran RM40.00 kepada Hospital Sultanah untuk sumbangan",
        "transaction_amount": 40.00,
        "transaction_date": "2024-06-06 15:37:00",
        "transaction_payment_method": "Credit Card",
        "transaction_fpx_id": "2024102301928328329",
        "transaction_status": "Failed"
    },
    {
        "id": 9,
        "transaction_order_number": "BYR0000009",
        "transaction_reference_number": "202405100912737473",
        "transaction_bill_name": "Bayaran RM35.00 Untuk Yuran Gym",
        "transaction_bill_description": "Bayaran RM35.00 kepada GymFit untuk yuran bulanan",
        "transaction_amount": 35.00,
        "transaction_date": "2024-06-06 15:38:00",
        "transaction_payment_method": "Debit Card",
        "transaction_fpx_id": "2024102301928328330",
        "transaction_status": "Success"
    },
    {
        "id": 10,
        "transaction_order_number": "BYR0000010",
        "transaction_reference_number": "202405100912737474",
        "transaction_bill_name": "Bayaran RM45.00 Untuk Yuran Persatuan",
        "transaction_bill_description": "Bayaran RM45.00 kepada Persatuan Penduduk untuk yuran tahunan",
        "transaction_amount": 45.00,
        "transaction_date": "2024-06-06 15:39:00",
        "transaction_payment_method": "Online Banking",
        "transaction_fpx_id": "2024102301928328331",
        "transaction_status": "Success"
    }
]