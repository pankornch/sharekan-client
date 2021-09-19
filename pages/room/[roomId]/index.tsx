import DashboardNavbar from "@/src/components/DashboardNavbar"
import Dropdown from "@/src/components/Dropdown"
import avatar from "@/src/utils/avatar"
import { useRouter } from "next/dist/client/router"
import Link from "next/link"
import React, { FC, useCallback, useEffect, useRef, useState } from "react"
import Info from "@/public/info.svg"
import Bill from "@/public/bill.svg"
import { gql, useQuery, useSubscription } from "@apollo/client"
import auth from "@/src/middlewares/auth"
import client from "@/src/configs/apollo-client"
import { IMember, IRoom } from "@/src/types"
import Loading from "@/src/components/Loading"
import ListView from "@/src/components/ListView"
import {
	GET_ITEMS_BY_OWNER,
	GET_ME_IN_ROOM,
	GET_ROOM_ITEMS,
	GET_ROOM_MEMBERS,
	SUBSCRIBE_ON_ITEM_CHNAGE,
} from "@/src/gql"
import Alert from "@/src/components/Alert"

interface Props {
	room: IRoom
	query: {
		roomId: string
	}
}

const RoomById: FC<Props> = (props) => {
	const router = useRouter()

	const [selectType, setSelectType] = useState<string>("")

	const [options, setOptions] = useState<{ name: string; value: string }[]>([
		{ name: "ของตนเอง", value: "own" },
		{ name: "สินค้า", value: "item" },
		{ name: "สมาชิก", value: "member" },
	])

	const [refresh, setRefresh] = useState<number>(0)

	const { data } = useQuery(GET_ME_IN_ROOM, {
		variables: {
			roomId: props.query.roomId,
		},
	})

	const alertRef = useRef<any>()

	const { data: sub } = useSubscription(SUBSCRIBE_ON_ITEM_CHNAGE, {
		variables: {
			onSubscribeItemInput: {
				roomId: props.query.roomId,
			},
		},
	})

	useEffect(() => {
		if (!sub) return

		const { state, item } = sub.onItemChange
		setRefresh((prev) => prev + 1)
		alertRef.current.open({
			title: state,
			body: `${item.member.nickname} / ${item.name}`,
			type: "SUCCESS",
		})
	}, [sub])

	const RenderCart = () => {
		switch (selectType) {
			case "item":
				return <Items roomId={props.query.roomId} refresh={refresh} />
			case "member":
				return <Member roomId={props.query.roomId} />
			default:
				return <ItemsOwner roomId={props.query.roomId} />
		}
	}

	const onChangeType = useCallback(
		(option: { name: string; value: string }) => {
			setSelectType(option.value)
		},
		[setSelectType]
	)

	return (
		<div className="relative">
			<DashboardNavbar
				backButton
				title={props.room.title!}
				backTo="/dashboard"
			/>

			<div className="py-24 container space-y-5">
				<Dropdown
					className="w-full"
					label="แยกประเภท"
					options={options}
					onSelect={onChangeType}
					defaultIndex={0}
				/>

				<RenderCart />
			</div>

			<div className="fixed bottom-28 right-3 space-y-5">
				<div
					className="bg-blue-200 rounded-full p-3 cursor-pointer"
					onClick={() => router.push(`/room/${router.query.roomId}/overview`)}
				>
					<Info className="w-9 fill-color text-main-blue" />
				</div>

				<div
					className="bg-yellow-300 rounded-full p-3 cursor-pointer"
					onClick={() =>
						router.push(
							`/room/${router.query.roomId}/member/${data.room.me.id}/bill`
						)
					}
				>
					<Bill className="h-9 fill-color text-main-orange" />
				</div>
			</div>

			<div className="fixed bottom-7 right-0 w-full px-7 lg:px-56">
				<Link href={`/room/${router.query.roomId}/item/add_item`}>
					<a className="button w-full bg-main-blue text-white">เพิ่มสินค้า</a>
				</Link>
			</div>

			<Alert ref={alertRef} />
		</div>
	)
}

const Items: FC<{ roomId: string; refresh: number }> = ({
	roomId,
	refresh,
}) => {
	const router = useRouter()
	const { data, loading, refetch } = useQuery(GET_ROOM_ITEMS, {
		variables: { roomId },
	})

	useEffect(() => {
		if (!refresh) return
		refetch()
	}, [refresh])

	if (loading) return <Loading />

	return (
		<>
			<ListView
				data={data.room.items}
				render={(e) => (
					<div
						onClick={() => router.push(`/room/${roomId}/item/${e.id}`)}
						className="item-card"
					>
						<div className="flex items-center justify-between">
							<span>{e.name}</span>
							<div className="flex items-center space-x-2">
								<span>{e.price}</span>
								<img src="/close.svg" className="w-3 h-3" alt="" />
								<span>{e.quantity}</span>
								<span>= {(e.price || 0) * (e.quantity || 0)}</span>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<img
								src={avatar(e.member?.user?.email || e.member?.id)}
								className="w-9"
								alt=""
							/>
							<span>{e.member?.nickname}</span>
						</div>
					</div>
				)}
			/>
		</>
	)
}

const ItemsOwner: FC<{ roomId: string }> = ({ roomId }) => {
	const router = useRouter()

	const { data, loading } = useQuery(GET_ITEMS_BY_OWNER, {
		variables: { roomId },
	})

	if (loading) return <Loading />

	return (
		<>
			<ListView
				data={data.room.me.items}
				render={(e) => (
					<div
						onClick={() => router.push(`/room/${roomId}/item/${e.id}`)}
						className="item-card"
					>
						<div className="flex items-center justify-between">
							<span>{e.name}</span>
							<div className="flex items-center space-x-2">
								<span>{e.price}</span>
								<img src="/close.svg" className="w-3 h-3" alt="" />
								<span>{e.quantity}</span>
								<span>= {(e.price || 0) * (e.quantity || 0)}</span>
							</div>
						</div>
						<div className="flex items-center space-x-3">
							<img
								src={avatar(data.room.me.user.email)}
								className="w-9"
								alt=""
							/>
							<span>{data.room.me.nickname}</span>
						</div>
					</div>
				)}
			/>
		</>
	)
}

const Member: FC<{ roomId: string }> = (props) => {
	const router = useRouter()

	const { data, loading } = useQuery(GET_ROOM_MEMBERS, {
		variables: {
			roomId: props.roomId,
		},
	})

	if (loading) return <Loading />
	return (
		<>
			{(data.room.members as IMember[]).map((e) => (
				<div
					key={e.id}
					onClick={() => router.push(`/room/${props.roomId}/member/${e.id}`)}
					className="item-card"
				>
					<div className="flex items-center space-x-3">
						<img src={avatar(e.user?.email || e.id)} className="w-9" alt="" />
						<span>{e.nickname}</span>
					</div>
					<div className="flex items-center justify-between">
						<span>สินค้าทั้งหมด</span>
						<span>{e.cart?.itemCounts} ชิ้น</span>
					</div>
					<div className="flex items-center justify-between">
						<span>ราคารวมทั้งหมด</span>
						<span>{e.cart?.total}</span>
					</div>
				</div>
			))}
		</>
	)
}

export const getServerSideProps = auth(async ({ query, res, req }: any) => {
	const { roomId } = query

	try {
		const res = await client.query({
			query: gql`
				query ($roomId: ID!) {
					room(id: $roomId) {
						id
						title
					}
				}
			`,
			variables: { roomId },
			context: { req },
		})
		return {
			props: {
				room: res.data.room,
				query,
			},
		}
	} catch (error) {
		return {
			notFound: true,
		}
	}
})

export default RoomById
