import React, { FC, useCallback, useEffect, useState } from "react"
import CloseSVG from "@/public/close.svg"
import AddSVG from "@/public/add.svg"
import TrashSVG from "@/public/trash.svg"

interface Props {
	isOpen: boolean
	onClose: () => any
}
interface IItem {
	id: number
	size: number | null
	cost: number | null
	total: number | null
	perUnit: number | null
}

const Cheaper: FC<Props> = (props) => {
	const [isOpen, setIsOpen] = useState<boolean>(true)
	const [items, setItems] = useState<IItem[]>([
		{ id: 1, size: null, cost: null, total: null, perUnit: null },
		{ id: 2, size: null, cost: null, total: null, perUnit: null },
	])

	const [isSave, setIsSave] = useState<boolean>(false)

	useEffect(() => {
		if (props.isOpen === isOpen) return
		setIsOpen(props.isOpen)
	}, [props.isOpen, isOpen])

	const updateItem = useCallback(
		(index: number, value: string, type: string) => {
			setItems((prev) => {
				const current = prev[index]
				// @ts-ignore
				current[type] = parseFloat(value)
				if (current.cost && current.size) {
					current.total = current.cost * current.size
					current.perUnit = parseFloat((current.cost / current.size).toFixed(9))
				}
				return [...prev]
			})
		},
		[setItems]
	)

	const addItem = () => {
		setItems((prev) => [
			...prev,
			{
				id: items[items.length - 1].id + 1,
				size: null,
				cost: null,
				total: null,
				perUnit: null,
			},
		])
	}

	const removeItem = (index: number) => {
		setItems((prev) => {
			delete prev[index]

			return [...prev.filter((e) => e)]
		})
	}

	const result = useCallback(() => {
		if (!items.every((e) => e.size && e.cost)) return
		const clone: IItem[] = JSON.parse(JSON.stringify(items))
		const sort = clone.sort((a, b) => (a.perUnit! < b.perUnit! ? -1 : 1))

		if (sort[0].perUnit == sort[1].perUnit) {
			return {
				text: "Same",
				item: null,
			}
		}
		return {
			text: `Item ${sort[0].id} is Cheaper`,
			item: sort[0],
		}
	}, [items])

	const handleClose = () => {
		setIsOpen(false)
		props.onClose()
		if (!isSave) return handleClear()
	}

	const handleClear = () => {
		setItems([
			{ id: 1, size: null, cost: null, total: null, perUnit: null },
			{ id: 2, size: null, cost: null, total: null, perUnit: null },
		])
	}

	if (!isOpen) return <></>
	return (
		<div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-screen sm:w-1/2 sm:max-h-96 h-4/5 overflow-y-scroll p-6 bg-white shadow">
			<div className="text-center font-bold text-xl mb-5">Cheaper</div>
			<div
				className="absolute top-6 right-6 cursor-pointer"
				onClick={handleClose}
			>
				<CloseSVG className="text-main-red w-5" />
			</div>
			<div className="grid grid-cols-6 gap-5 items-center">
				<div></div>
				<div className="col-span-2">Size</div>
				<div className="col-span-2">Cost</div>
				<div className="col-span-1">Per unit</div>
			</div>
			<div className="flex flex-col">
				{items.map((e, i) => (
					<div
						key={i}
						className={`grid grid-cols-6 gap-5 my-3 items-center ${
							result()?.item?.id === e.id ? "bg-blue-200 py-3" : ""
						}`}
					>
						<div className="flex sm:flex-row flex-col sm:items-center items-start space-x-3 ">
							<span>Item {e.id}</span>
							{items.length > 2 && (
								<div onClick={() => removeItem(i)}>
									<CloseSVG className="text-main-red w-3 cursor-pointer" />
								</div>
							)}
						</div>

						<input
							type="number"
							className="input w-full col-span-2"
							onChange={(e) => updateItem(i, e.target.value, "size")}
							value={e?.size || ""}
						/>
						<input
							type="number"
							className="input w-full col-span-2"
							onChange={(e) => updateItem(i, e.target.value, "cost")}
							value={e?.cost || ""}
						/>
						<span className="max-w-xs overflow-scroll">{e.perUnit}</span>
					</div>
				))}
			</div>
			<div className="grid grid-cols-6 gap-5 mt-6">
				<div className="space-y-3 col-span-2 sm:col-span-1">
					<div
						onClick={addItem}
						className="flex items-center space-x-1 cursor-pointer hover:bg-blue-200 rounded-md"
					>
						<AddSVG className="text-main-blue w-7" />
						<span>Add</span>
					</div>
					<div
						onClick={handleClear}
						className="flex items-center space-x-1 cursor-pointer hover:bg-red-200 rounded-md"
					>
						<TrashSVG className="text-main-red w-5 mx-1" />
						<span>Clear</span>
					</div>
					<div className="mx-2 space-x-3">
						<input
							type="checkbox"
							checked={isSave}
							onChange={(e) => setIsSave(e.target.checked)}
						/>
						<span>Save</span>
					</div>
				</div>
				<div className="col-span-4 justify-self-center font-bold text-xl">
					{result()?.text}
				</div>
			</div>
		</div>
	)
}

export default Cheaper
