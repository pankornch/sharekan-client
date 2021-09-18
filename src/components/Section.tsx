import React, { FC } from "react"

interface Props {
	title: string
	children?: JSX.Element | JSX.Element[]
	className?: string
}

const Section: FC<Props> = ({ title, children, className }) => {
	return (
		<div className={className}>
			<div className="text-xl mb-2">{title}</div>
			{children}
		</div>
	)
}

export default Section
