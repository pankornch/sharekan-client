import DashboardNavbar from "@/src/components/DashboardNavbar"
import React, { FC, useEffect, useState } from "react"
import Add from "@/public/add.svg"
import Remove from "@/public/remove.svg"
import Dropdown from "@/src/components/Dropdown"
import client from "@/src/configs/apollo-client"
import auth from "@/src/middlewares/auth"
import { IItem, IMember } from "@/src/types"
import { useRouter } from "next/dist/client/router"
import { useQuery, gql } from "@apollo/client"
import { getSession } from "next-auth/client"
import { GET_ITEM_BY_ID, REMOVE_ITEM, UPDATE_ITEM } from "@/src/gql"
import Loading from "@/src/components/Loading"

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
	const { data: queryRoom } = useQuery(GET_ITEM_BY_ID, {
		variables: { roomId: props.query.roomId, itemId: props.query.itemId },
	})

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
		if (!confirm(`ต้องการลบสินค้า ${item.name} หรือไม่?`)) return

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

		if (!confirm("ต้องการแก้ไขรายการ หรือไม่?")) return

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
		} catch (error: any) {}
	}

	const onSelectMember = async (option: { name: string; value: string }) => {
		const member = members.find((e) => e.id === option.value)
		setCurrentMember(member!)
	}

	const getTotal = () => {
		const $total = (item: IItem) => (item.price || 0) * (item.quantity || 0)

		const currentItem = queryRoom.room.item
		const diffPrice = $total(item) - $total(currentItem)

		return (currentMember.cart?.total || 0) + diffPrice
	}

	const canEdit = () => {
		console.log(props.isOwner, queryRoom.room.me.id, item.member?.id)
		if (props.isOwner || queryRoom.room.me.id === item.member?.id) return true
		return false
	}

	if (loading) return <Loading />

	return (
		<div className="relative">
			<DashboardNavbar backButton backTo={`/room/${props.query.roomId}`} />

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
								<Dropdown
									label="สมาชิก"
									options={members.map((e) => ({
										value: e.id!,
										name: `${e.nickname} (${e.user?.email})`,
									}))}
									defaultValue={currentMember.id}
									onSelect={onSelectMember}
								/>

								<div className="flex justify-end">
									<div className="button bg-main-orange text-white w-auto">
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
	const { roomId, itemId } = query

	const session = await getSession({ req })

	try {
		const { data } = await client.query({
			query: gql`
				query ($roomId: ID!) {
					room(id: $roomId) {
						owner {
							id
						}
					}
				}
			`,
			variables: { roomId },
			context: { req },
		})

		const isOwner = data.room.owner.id === session?.user.id
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
