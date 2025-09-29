import React from 'react'
import bg from '@/assets/yidebg1.jpg'

export default function LeftColumn() {
	return (
		<div 
			className="left-column w-full h-full flex justify-center items-center" 
			style={{ 
				//background: `url(${bg}) no-repeat center center`,
				background: `url('https://infaqyide.xyz/assets/bg/bg2.jpg') no-repeat center center`,
				backgroundSize: 'cover' 
			}}>
		<div className="w-full h-full flex flex-col justify-center items-center">
			<img src={"https://cp.infaqyide.com.my/logo/main-transparent.webp"} alt="" className="max-w-[500px]"/>
			<div className="mt-6">
				<p className="font-semibold text-2xl text-white">Sistem Pengurusan Aplikasi InfaqYIDE</p>
			</div>
		</div>
		</div>
	)
}
