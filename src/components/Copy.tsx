import React, { FC } from "react"
import CopySVG from "@/public/copy.svg"
import Swal from "sweetalert2"

interface Props {
	content: string
}

const Copy: FC<Props> = (props) => {
	const onCopy = () => {
		navigator.clipboard.writeText(props.content)
		Swal.fire({
			icon: "success",
			title: "Copeid",
			showConfirmButton: false,
			timer: 1000,
		})
	}
	return (
		<div
			onClick={onCopy}
			className="flex items-center justify-center bg-main-orange bg-opacity-25 rounded-full h-10 w-10 p-1 cursor-pointer"
		>
			<CopySVG className="text-main-orange w-full" />
		</div>
	)
}

export default Copy
