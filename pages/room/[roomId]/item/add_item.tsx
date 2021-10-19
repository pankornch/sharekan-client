import DashboardNavbar from "@/src/components/DashboardNavbar"
import React, { FC, useCallback, useEffect, useState } from "react"
import Add from "@/public/add.svg"
import Remove from "@/public/remove.svg"
import { useRouter } from "next/dist/client/router"
import { IItem, IMember } from "@/src/types"
import { gql, useMutation, useQuery } from "@apollo/client"
import auth from "@/src/middlewares/auth"
import client from "@/src/configs/apollo-client"
import Swal from "sweetalert2"
import {
	ADD_ITEM,
	CREATE_ANONYMOUS_MEMBER,
	GET_ITEMS_BY_MEMBER,
	GET_MEMBER_ITEMS_BY_OWNER,
	REMOVE_MEMBER,
} from "@/src/gql"
import Loading from "@/src/components/Loading"
import Toast from "@/src/components/Toast"
import Select from "@/src/components/Select"
import avatar from "@/src/utils/avatar"

interface Props {
	query: {
		roomId: string
	}
	isOwner: boolean
}

const AddItem: FC<Props> = (props) => {
	const router = useRouter()
	const [item, setItem] = useState<IItem>({
		name: "",
		quantity: 1,
	})

	const [currentMember, setCurrentMember] = useState<IMember>({})
	const [members, setMembers] = useState<IMember[]>([])
	const [loading, setLoading] = useState<boolean>(true)
	const [createAnonymousUser] = useMutation(CREATE_ANONYMOUS_MEMBER)
	const { data: room, refetch } = useQuery(
		props.isOwner ? GET_MEMBER_ITEMS_BY_OWNER : GET_ITEMS_BY_MEMBER,
		{
			variables: { roomId: props.query.roomId },
		}
	)
	const [addItem] = useMutation(ADD_ITEM)
	const [removeMember] = useMutation(REMOVE_MEMBER)

	useEffect(() => {
		if (!room) return
		if (props.isOwner) setMembers(room.room.members)
		setCurrentMember(room.room.me)
		setLoading(false)
	}, [props.isOwner, room])

	const getTotal = () => {
		const total = (item.price || 0) * item.quantity!
		return total + (currentMember.cart?.total || 0)
	}

	const onSelectMember = useCallback(
		async (option) => {
			const member = members.find((e) => e.id === option.value)
			setCurrentMember(member!)
		},
		[members]
	)

	const increment = () => {
		setItem((prev) => ({ ...prev, quantity: prev.quantity! + 1 }))
	}

	const decrement = () => {
		if (item.quantity! <= 1) return

		setItem((prev) => ({ ...prev, quantity: prev.quantity! - 1 }))
	}

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		await addItem({
			variables: {
				input: {
					name: item.name,
					price: item.price,
					quantity: item.quantity,
					roomId: props.query.roomId,
					memberId: currentMember.id,
				},
			},
		})

		await Toast.open({
			title: "เพิ่มรายการสำเร็จ",
			type: "SUCCESS",
		})
		router.back()
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

	const onRemoveMember = useCallback(
		async (option) => {
			await removeMember({
				variables: {
					input: {
						roomId: props.query.roomId,
						memberId: option.value,
					},
				},
			})

			refetch()
		},
		[props.query.roomId, refetch, removeMember]
	)

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
							required
							onChange={(e) =>
								setItem((prev) => ({ ...prev, name: e.target.value }))
							}
							value={item.name!}
						/>

						<div className="flex justify-between">
							<input
								type="number"
								className="input w-32"
								placeholder="ราคา"
								required
								onChange={(e) =>
									setItem((prev) => ({
										...prev,
										price: Number(e.target.value),
									}))
								}
								value={item.price || ""}
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
									showRemove
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
									onRemove={(option) => onRemoveMember(option)}
								/>

								<div className="flex justify-end">
									<div
										onClick={onCreateAnonymous}
										className="button bg-main-orange text-white w-auto cursor-pointer"
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
									<span className="text-main-orange text-bold">
										(+{item.quantity})
									</span>
									<span>ชิ้น</span>
								</span>
							</div>

							<div className="flex justify-between">
								<span>ราคารวมทั้งหมด</span>
								<span>{getTotal()}</span>
							</div>
						</div>

						<div className="space-y-3">
							<button
								type="submit"
								className="button text-white bg-main-blue w-full"
							>
								เพิ่มสินค้าในตระกร้า
							</button>

							<div
								onClick={() => router.replace(`/room/${props.query.roomId}`)}
								className="button text-white bg-main-red w-full cursor-pointer"
							>
								ยกเลิก
							</div>
						</div>
					</div>
				</form>
			</div>
		</div>
	)
}

export const getServerSideProps = auth(async ({ req, query }) => {
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
