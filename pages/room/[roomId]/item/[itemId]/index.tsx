import DashboardNavbar from "@/src/components/DashboardNavbar"
import React, { FC, useCallback, useContext, useEffect, useState } from "react"
import Add from "@/public/add.svg"
import Remove from "@/public/remove.svg"
import client from "@/src/configs/apollo-client"
import auth from "@/src/middlewares/auth"
import { IItem, IMember } from "@/src/types"
import { useRouter } from "next/dist/client/router"
import { useQuery, gql, useMutation } from "@apollo/client"
import {
	CREATE_ANONYMOUS_MEMBER,
	GET_ITEM_BY_ID,
	GET_ITEM_BY_ID_BY_OWNER,
	REMOVE_ITEM,
	UPDATE_ITEM,
} from "@/src/gql"
import Loading from "@/src/components/Loading"
import Select from "@/src/components/Select"
import avatar from "@/src/utils/avatar"
import Swal from "sweetalert2"
import Toast from "@/src/components/Toast"

interface Props {
	query: {
		roomId: string
		itemId: string
	}
	isOwner: boolean
}

const AddItem: FC<Props> = (props) => {
	const [item, setItem] = useState<IItem>({})
	const [members, setMembers] = useState<IMember[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [currentMember, setCurrentMember] = useState<IMember>({})
	const [submitLoading, setSubmitLoading] = useState<boolean>(false)

	const { data: queryRoom, refetch } = useQuery(
		props.isOwner ? GET_ITEM_BY_ID_BY_OWNER : GET_ITEM_BY_ID,
		{
			variables: { roomId: props.query.roomId, itemId: props.query.itemId },
		}
	)
	const [createAnonymousUser] = useMutation(CREATE_ANONYMOUS_MEMBER)

	const router = useRouter()

	useEffect(() => {
		if (!queryRoom) return

		setItem(queryRoom.room.item)
		setMembers(queryRoom.room.members)
		setCurrentMember(queryRoom.room.item.member)
		setLoading(false)
	}, [queryRoom])

	const increment = () => {
		if (!canEdit()) return
		setItem((prev) => ({ ...prev, quantity: prev.quantity! + 1 }))
	}

	const decrement = () => {
		if (!canEdit()) return
		if (item.quantity! <= 1) return

		setItem((prev) => ({ ...prev, quantity: prev.quantity! - 1 }))
	}

	const onRemoveItem = async () => {
		const result = await Swal.fire({
			icon: "warning",
			title: `ต้องการลบสินค้า ${item.name} หรือไม่?`,
			showDenyButton: true,
			confirmButtonText: "ตกลง",
			denyButtonText: "ยกเลิก",
			confirmButtonColor: "#123AAF",
		})

		if (!result.isConfirmed) return

		await client.mutate({
			mutation: REMOVE_ITEM,
			variables: {
				removeItemInput: {
					roomId: props.query.roomId,
					id: props.query.itemId,
				},
			},
		})

		router.back()
	}

	const onSubmit = async (e: React.FocusEvent<HTMLFormElement>) => {
		e.preventDefault()
		setSubmitLoading(true)

		const result = await Swal.fire({
			title: "ต้องการแก้ไขรายการหรือไม่ ?",
			showDenyButton: true,
			confirmButtonText: "ตกลง",
			denyButtonText: "ยกเลิก",
			confirmButtonColor: "#123AAF",
		})

		if (!result.isConfirmed) return

		try {
			await client.mutate({
				mutation: UPDATE_ITEM,
				variables: {
					updateItemInput: {
						id: props.query.itemId,
						roomId: props.query.roomId,
						name: item.name,
						price: item.price,
						quantity: item.quantity,
						memberId: currentMember.id,
					},
				},
			})
			router.back()
		} catch (error: any) {
			setSubmitLoading(false)
		}
	}

	const onSelectMember = useCallback(
		async (option: any) => {
			const member = members.find((e) => e.id === option.value)
			setCurrentMember(member!)
		},
		[members]
	)

	const getTotal = () => {
		const $total = (item: IItem) => (item.price || 0) * (item.quantity || 0)

		const currentItem = queryRoom.room.item
		const diffPrice = $total(item) - $total(currentItem)

		return (currentMember.cart?.total || 0) + diffPrice
	}

	const canEdit = () => {
		if (props.isOwner || queryRoom.room.me.id === item.member!.id) return true
		return false
	}

	const onCreateAnonymous = async () => {
		const { value: nickname } = await Swal.fire({
			title: "เพิ่มสมาชิกไม่ระบุตัวตน",
			input: "text",
			inputPlaceholder: "ชื่อ",
			showCancelButton: true,
			confirmButtonColor: "#123AAF",
		})

		if (nickname === undefined) return

		await createAnonymousUser({
			variables: {
				createAnonymousUserInput: {
					roomId: props.query.roomId,
					nickname: nickname || null,
				},
			},
		})

		Toast.open({ title: "เพิ่มสมาชิกไม่ระบุตัวตนสำเร็จ", type: "SUCCESS" })

		refetch()
	}

	if (loading) return <Loading />

	return (
		<div className="relative">
			<DashboardNavbar backButton />

			<div className="container pt-24 pb-12 h-screen">
				<form
					onSubmit={onSubmit}
					className="flex flex-col justify-between h-full"
				>
					<div className="space-y-5">
						<input
							type="text"
							className="input w-full h-10"
							placeholder="ชื่อรายการ"
							onChange={(e) =>
								setItem((prev) => ({ ...prev, name: e.target.value }))
							}
							disabled={!canEdit()}
							value={item.name}
						/>

						<div className="flex justify-between">
							<input
								type="number"
								className="input w-32"
								placeholder="ราคา"
								onChange={(e) =>
									setItem((prev) => ({
										...prev,
										price: Number(e.target.value),
									}))
								}
								disabled={!canEdit()}
								value={item.price}
							/>

							<div className="flex space-x-3 items-center">
								<div
									onClick={increment}
									className="shadow flex items-center justify-center bg-white rounded-full w-10 h-10 cursor-pointer"
								>
									<Add />
								</div>
								<span>{item.quantity}</span>
								<div
									onClick={decrement}
									className="shadow flex items-center justify-center bg-white rounded-full w-10 h-10 cursor-pointer"
								>
									<Remove />
								</div>
							</div>
						</div>

						{props.isOwner && (
							<>
								<Select
									label="สมาชิก"
									options={members.map((e) => ({
										value: e.id!,
										label: `${e.nickname} ${
											e.isAnonymous ? "(anonymous)" : ""
										}`,
									}))}
									defaultValue={currentMember.id}
									onSelect={onSelectMember}
									renderOption={(option) => (
										<div className="flex space-x-3 items-center">
											<img
												src={avatar(
													members.find((e) => e.id === option.value)?.user
														?.email
												)}
												className="w-8 h-8"
											/>
											<span>{option.label}</span>
										</div>
									)}
								/>

								<div className="flex justify-end">
									<div
										onClick={onCreateAnonymous}
										className="button bg-main-orange text-white w-auto"
									>
										เพิ่มสมาชิกไม่ระบุชื่อ
									</div>
								</div>
							</>
						)}
					</div>

					<div className="space-y-5">
						<div className="text-main-grey space-y-2">
							<div className="flex justify-between">
								<span>ราคารวม</span>
								<span>{(item.price || 0) * item.quantity!}</span>
							</div>

							<div className="flex justify-between">
								<span>สินค้าในตระกร้า</span>
								<span className="space-x-1">
									<span>{currentMember.cart?.itemCounts}</span>
									<span>ชิ้น</span>
								</span>
							</div>

							<div className="flex justify-between">
								<span>ราคารวมทั้งหมด</span>
								<span>{getTotal()}</span>
							</div>
						</div>

						{canEdit() && (
							<div className="space-y-3">
								<button
									disabled={submitLoading}
									type="submit"
									className="button text-white bg-main-blue w-full"
								>
									แก้ไขรายการ
								</button>

								<div
									onClick={onRemoveItem}
									className="button text-white bg-main-red w-full"
								>
									ลบ
								</div>
							</div>
						)}
					</div>
				</form>
			</div>
		</div>
	)
}

export const getServerSideProps = auth(async ({ req, query }: any) => {
	const { roomId } = query

	try {
		const { data } = await client.query({
			query: gql`
				query ($roomId: ID!) {
					room(id: $roomId) {
						isOwner
					}
				}
			`,
			variables: { roomId },
			context: { req },
		})

		const { isOwner } = data.room
		return {
			props: { query, isOwner },
		}
	} catch (error) {
		return {
			notFound: true,
		}
	}
})

export default AddItem
