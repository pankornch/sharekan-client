import Loading from "@/src/components/Loading"
import React, { useEffect, useState } from "react"
import Toast from "@/src/components/Toast"
import Select from "@/src/components/Select"
import Image from "next/image"
export default function Test() {
	return (
		<div id="app">
			<Image
				unoptimized
				src="https://avatars.dicebear.com/api/adventurer/your-custom-seed.svg"
				// layout="fill"
				alt="logo"
				height="320px"
				width="320px"
			/>
		</div>
	)
}
