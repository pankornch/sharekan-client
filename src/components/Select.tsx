import React, { FC, useEffect, useState } from "react"
import LoadingSVG from "@/public/loading.svg"
import ArrowDownSVG from "@/public/arrow-down.svg"
import CloseSVG from "@/public/close.svg"
import Swal from "sweetalert2"
interface IOption {
	value: string
	label: string
}

interface Props {
	options: IOption[]
	onSelect?: (e: IOption) => any
	defaultValue?: string
	label?: string
	className?: string
	loading?: boolean
	showRemove?: boolean
	onRemove?: (e: IOption) => any
	renderOption?: (e: IOption) => JSX.Element
}

const Select: FC<Props> = (props) => {
	const [options, setOptions] = useState<IOption[]>([])
	const [select, setSelect] = useState<IOption | null>(null)
	const [selectedIndex, setSelectedIndex] = useState<number>(0)
	const [open, setOpen] = useState<boolean>(false)

	const onSelect = (option: IOption, i: number) => {
		setSelect(option!)
		setSelectedIndex(i)

		if (typeof props.onSelect === "function") {
			props.onSelect(option!)
		}
	}

	const onClickSelect = (e: any) => {
		if (open) {
			setOpen(false)
			return
		}

		setOpen(true)
		e.stopPropagation()

		document.addEventListener("click", close)
	}

	const close = () => {
		setOpen(false)
		document.removeEventListener("click", close)
	}

	useEffect(() => {
		setOptions(props.options)

		if (props.defaultValue) {
			const opt = props.options.find((e) => e.value === props.defaultValue)
			setSelect(opt || props.options[0])
		} else {
			setSelect(props.options[0])
		}
	}, [props.loading, props.options, props.defaultValue])

	const onRemove = (e: IOption) => {
		Swal.fire({
			title: "ต้องการจะลบหรือไม่?",
			confirmButtonText: "ตกลง",
			showCancelButton: true,
			cancelButtonText: "ยกเลิก",
			confirmButtonColor: "#123AAF",
			icon: "warning",
		}).then((result) => {
			if (result.isConfirmed && typeof props.onRemove === "function") {
				props.onRemove(e)
			}
		})
	}

	const renderOptions = () => {
		return options.map((e, i) => (
			<div
				key={i}
				onClick={() => onSelect(e, i)}
				className={`cursor-default  py-2 px-3 ${
					i === selectedIndex ? "bg-blue-300" : "hover:bg-blue-200"
				}`}
			>
				<div className="flex justify-between items-center space-x-3">
					<div className="flex-grow truncate">
						{typeof props.renderOption === "function" ? (
							props.renderOption(e)
						) : (
							<span className="">{e.label}</span>
						)}
					</div>

					{props.showRemove && (
						<div
							className="cursor-pointer"
							onClick={(evt) => {
								evt.stopPropagation()
								onRemove(e)
							}}
						>
							<CloseSVG className="text-red-500 w-4 h-4" />
						</div>
					)}
				</div>
			</div>
		))
	}

	return (
		<>
			{props.label && <div className="mb-2 text-lg">{props.label}</div>}
			<div onClick={onClickSelect} className="relative">
				<div className="select flex justify-between items-center">
					{props.loading ? (
						<div className="flex space-x-3">
							<LoadingSVG className="fill-current text-main-orange animate-spin w-5" />
							<span>กำลังโหลด ...</span>
						</div>
					) : (
						<div>
							<span>{select ? select?.label : "เลือก"}</span>
						</div>
					)}

					<ArrowDownSVG />
				</div>
				{open && (
					<div className="absolute top-10 left-0 w-full shadow-md bg-white rounded-md my-2 md:max-h-64 max-h-96 overflow-y-scroll">
						{renderOptions()}
					</div>
				)}
			</div>
		</>
	)
}
export default Select
