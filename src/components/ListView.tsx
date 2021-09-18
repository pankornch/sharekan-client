import React, { FC, useEffect } from "react"

interface Props {
	data: { [key: string]: any }[]
	render: (item: any) => JSX.Element
}
const ListView: FC<Props> = (props) => {
	useEffect(() => {}, [props.data])

	if (!props.data.length)
		return (
			<div className="flex items-center flex-col w-full space-y-5 pt-5">
				<img src="/no-data.svg" className="lg:w-1/5 lg:h-1/5 h-2/3 w-2/3" />
                <span className="text-main-grey">ไม่มีข้อมูล</span>
			</div>
		)

	return (
		<>
			{props.data.map((e, i) => (
				<div key={i}>{props.render(e)}</div>
			))}
		</>
	)
}

export default ListView
