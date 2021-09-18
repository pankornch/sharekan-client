import React, { FC } from "react"
import Lottie from "lottie-react"
import LoadingJSON from "@/public/loading-lottie.json"
const Loading: FC = () => {
	return (
		<div className="h-screen w-screen fixed top-0 right-0 flex items-center justify-center">
			<Lottie animationData={LoadingJSON} className="w-full lg:w-1/3 lg:h-1/3" />
		</div>
	)
}

export default Loading
