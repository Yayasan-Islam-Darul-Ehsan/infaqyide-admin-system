import React from 'react'

import bg from '@/assets/yidebg2.jpg'
import logo from '@/assets/logo1.png'

export default function LeftColumn() {
	return (
		<div 
			className="left-column w-full h-full flex justify-center items-center" 
			style={{ 
				//background: `url(${bg}) no-repeat center center`,
				background: `url(${bg}) no-repeat center center`,
				backgroundSize: 'cover' 
			}}>
		<div className="w-full h-full flex flex-col justify-center items-center">
			<img src={logo} alt="" className="max-w-[300px]"/>
			<div className="mt-6">
				<p className="font-semibold text-2xl text-white">Sistem Pengurusan Aplikasi InfaqYIDE</p>
			</div>
		</div>
		</div>
	)
}
