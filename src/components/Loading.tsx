import React, { FC } from "react"
import LoadingSVG from "@/public/loading.svg"
const Loading: FC = () => {
	return (
		<div className="h-screen w-screen fixed top-0 right-0 flex items-center justify-center">
			<LoadingSVG className="text-main-blue animate-spin w-1/3 lg:w-1/5 lg:h-1/5" />
		</div>
	)
}

export default Loading
