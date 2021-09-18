import React, { FC } from "react"
import CopySVG from "@/public/copy.svg"

interface Props {
	content: string
}

const Copy: FC<Props> = (props) => {
	const onCopy = () => {
		navigator.clipboard.writeText(props.content)
	}
	return (
		<div
			onClick={onCopy}
			className="flex items-center justify-center bg-main-orange bg-opacity-25 rounded-full h-10 w-10 p-1 cursor-pointer"
		>
			<CopySVG className="fill-current text-main-orange" />
		</div>
	)
}

export default Copy
