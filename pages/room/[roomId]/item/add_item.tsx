import DashboardNavbar from "@/src/components/DashboardNavbar"
import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import Add from "@/public/add.svg"
import Remove from "@/public/remove.svg"
import Dropdown from "@/src/components/Dropdown"
import { useRouter } from "next/dist/client/router"
import { IItem, IMember } from "@/src/types"
import { gql, useMutation, useQuery } from "@apollo/client"
import auth from "@/src/middlewares/auth"
import client from "@/src/configs/apollo-client"
import { getSession } from "next-auth/client"
import {
	ADD_ITEM,
	CREATE_ANONYMOUS_MEMBER,
	GET_ITEM_BY_MEMBER,
} from "@/src/gql"
import Alert from "@/src/components/Alert"
import Loading from "@/src/components/Loading"

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
	const { data: room, refetch } = useQuery(GET_ITEM_BY_MEMBER, {
		variables: { roomId: props.query.roomId },
	})
	const [addItem] = useMutation(ADD_ITEM)

	const alertRef = useRef<any>()

	const getTotal = () => {
		const total = (item.price || 0) * item.quantity!
		return total + (currentMember.cart?.total || 0)
	}

	const onSelectMember = async (option: { name: string; value: string }) => {
		const member = members.find((e) => e.id === option.value)
		setCurrentMember(member!)
	}

	const increment = () => {
		setItem((prev) => ({ ...prev, quantity: prev.quantity! + 1 }))
	}

	const decrement = () => {
		if (item.quantity! <= 1) return

		setItem((prev) => ({ ...prev, quantity: prev.quantity! - 1 }))
	}

	useEffect(() => {
		if (!room) return
		setMembers(room.room.members)
		setLoading(false)
		setCurrentMember(room.room.me)
	}, [room])

	const onSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault()

		await addItem({
			variables: {
				addItemInput: {
					name: item.name,
					price: item.price,
					quantity: item.quantity,
					roomId: props.query.roomId,
					memberId: currentMember.id,
				},
			},
		})

		alertRef.current.open({
			title: "เพิ่มรายการสำเร็จ",
			type: "SUCCESS",
		})

		router.back()
	}

	const onCreateAnonymous = async () => {
		await createAnonymousUser({
			variables: {
				createAnonymousUserInput: {
					roomId: props.query.roomId,
				},
			},
		})

		alertRef.current.open({
			title: "เพิ่มสมาชิกไม่ระบุตัวตนสำเร็จ",
			type: "SUCCESS",
		})

		refetch()
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
								<Dropdown
									label="สมาชิก"
									options={members.map((e) => ({
										value: e.id!,
										name: `${e.nickname} (${e.user?.email || "anonymous"})`,
									}))}
									defaultValue={currentMember.id}
									onSelect={onSelectMember}
								/>

								<div
									onClick={onCreateAnonymous}
									className="flex justify-end cursor-pointer"
								>
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
			<Alert ref={alertRef} />
		</div>
	)
}

export const getServerSideProps = auth(async ({ req, res, query }: any) => {
	const { roomId } = query

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
