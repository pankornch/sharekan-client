import React, { FC, memo, useEffect, useState } from "react"
import LoadingSVG from "@/public/loading.svg"

interface IOption {
	value: string
	name: string
}

interface Props {
	options: IOption[]
	onSelect?: (e: IOption) => any
	defaultIndex?: number
	defaultValue?: string
	label?: string
	className?: string
	loading?: boolean
}

const Dropdown: FC<Props> = (props) => {
	const [select, setSelect] = useState<IOption | null>(null)

	useEffect(() => {
		const { options, defaultIndex, defaultValue } = props

		if (defaultValue) {
			const idx = options.findIndex((e) => e.value === defaultValue)
			setSelect(options[idx === -1 ? 0 : idx])
		} else {
			setSelect(options[defaultIndex || 0])
		}
	}, [props.loading, props.options])

	const onSelect = (value: string) => {
		const option = props.options.find((e) => e.value === value)

		setSelect(option!)

		if (typeof props.onSelect === "function") {
			props.onSelect(option!)
		}
	}

	return (
		<div className={props.className || ""}>
			{props.label && <div className="mb-2 text-lg">{props.label}</div>}

			<div className="relative">
				<div className="select flex justify-between items-center">
					{props.loading ? (
						<div className="flex space-x-3">
							<LoadingSVG className="fill-current text-main-orange animate-spin w-5" />
							<span>กำลังโหลด ...</span>
						</div>
					) : (
						<div >
							<span>{select ? select?.name : "เลือก"}</span>
							<select
								onChange={(e) => onSelect(e.target.value)}
								className="absolute top-0 right-0 w-full h-full focus:outline-none opacity-0 cursor-pointer"
								value={select?.value}
							>
								{props.options.map((e, i) => (
									<option value={e.value} key={i}>
										{e.name}
									</option>
								))}
							</select>
						</div>
					)}

					<img src="/arrow-down.svg" alt="" />
				</div>
			</div>
		</div>
	)
}

export default memo(Dropdown)
