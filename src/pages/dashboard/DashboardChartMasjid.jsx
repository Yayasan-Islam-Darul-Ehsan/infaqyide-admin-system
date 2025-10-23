import React, { useEffect, useState } from "react";
import Chart from "react-apexcharts";
import useDarkMode from "@/hooks/useDarkMode";
import useRtl from "@/hooks/useRtl";
import { API, SYSADMIN_API } from "@/utils/api";
import SkeletionTable from "@/components/skeleton/Table";

function toMYR(amount = 0) {
    return Intl.NumberFormat('ms-MY', { style: 'currency', currency: 'MYR' }).format(amount)
}

const DashboardChartMasjid = ({ height = 400 }) => {


	const [isDark]  = useDarkMode();
	const [isRtl]   = useRtl();

    const [loading, set_loading]        = useState(true)
    const [series, set_series]          = useState([])
    const [categories, set_categories]  = useState([])

    const GetReport = async () => {
        set_loading(true)
        try {
            let api = await API("v2/dashboard", {}, "GET", true)
            if(api.status_code === 200) {
                set_series(api.data.series)
                set_categories(api.data.categories)
            }
        } catch (e) {
            console.log("Syntax error at fetching yearly infaq report : ", e)
        } finally {
            set_loading(false)
        }
    }
	// const series    = [
	// 	{
	// 		name: "Infaq Am",
	// 		data: [44, 55, 57, 56, 61, 58, 63, 60, 66],
	// 	},
	// 	{
	// 		name: "Auto Infaq",
	// 		data: [76, 85, 101, 98, 87, 105, 91, 114, 94],
	// 	},
	// 	{
	// 		name: "Sumbangan Kempen",
	// 		data: [35, 41, 36, 26, 45, 48, 52, 53, 41],
	// 	},
	// ];
	const options = {
		chart: {
			toolbar: {
				show: false,
			},
		},
		plotOptions: {
			bar: {
				horizontal: false,
				endingShape: "rounded",
				columnWidth: "45%",
			},
		},
		legend: {
			show: true,
			position: "top",
			horizontalAlign: "right",
			fontSize: "12px",
			fontFamily: "Inter",
			offsetY: -30,
			markers: {
				width: 8,
				height: 8,
				offsetY: -1,
				offsetX: -5,
				radius: 12,
			},
			labels: {
				colors: isDark ? "#CBD5E1" : "#475569",
			},
			itemMargin: {
				horizontal: 18,
				vertical: 0,
			},
		},
		title: {
			text: `Laporan Kutipan Sumbangan Infaq & Kempen Tahun ${new Date().getFullYear()}`,
			align: "left",

			offsetX: isRtl ? "0%" : 0,
			offsetY: 13,
			floating: false,
			style: {
				fontSize: "18px",
				fontWeight: "500",
				fontFamily: "Inter",
				color: isDark ? "#fff" : "#0f172a",
			},
		},
		dataLabels: {
			enabled: false,
		},
		stroke: {
			show: true,
			width: 2,
			colors: ["transparent"],
		},
		yaxis: {
			opposite: isRtl ? true : false,
			labels: {
				style: {
					colors: isDark ? "#CBD5E1" : "#475569",
					fontFamily: "Inter",
				},
			},
		},
		xaxis: {
			categories: categories,
			labels: {
				style: {
					colors: isDark ? "#CBD5E1" : "#475569",
					fontFamily: "Inter",
				},
			},
			axisBorder: {
				show: false,
			},
			axisTicks: {
				show: false,
			},
		},

		fill: {
			opacity: 1,
		},
		tooltip: {
			y: {
				formatter: function (val) {
					return toMYR(val)
				},
			},
		},
		colors: ["#4669FA", "#0CE7FA", "#FA916B"],
		grid: {
			show: true,
			borderColor: isDark ? "#334155" : "#E2E8F0",
			strokeDashArray: 10,
			position: "back",
		},
		responsive: [
			{
				breakpoint: 600,
				options: {
					legend: {
						position: "bottom",
						offsetY: 8,
						horizontalAlign: "center",
					},
					plotOptions: {
						bar: {
							columnWidth: "80%",
						},
					},
				},
			},
		],
	};

    useEffect(() => {
        GetReport()
    }, [])

    if(loading) return <SkeletionTable count={10} />

	return (
		<div>
			<Chart
				options={options}
				series={series}
				type="bar"
				height={height}
			/>
		</div>
	);
};

export default DashboardChartMasjid;
