import Link from "next/link"
import React, { FC } from "react"

const PageNotFound: FC = () => {
	return (
		<div className="flex flex-col items-center h-screen justify-center">
			<img src="/not-found.svg" alt="" />
			<Link href="/">
				<a className="button bg-main-orange mt-12 text-white">กลับสู่หน้าหลัก</a>
			</Link>
		</div>
	)
}

export default PageNotFound
