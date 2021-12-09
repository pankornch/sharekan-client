import Copy from "@/src/components/Copy"
import DashboardNavbar from "@/src/components/DashboardNavbar"
import Loading from "@/src/components/Loading"
import Section from "@/src/components/Section"
import client from "@/src/configs/apollo-client"
import { GET_MEMBER_BY_ID } from "@/src/gql"
import auth from "@/src/middlewares/auth"
import { IItem } from "@/src/types"
import avatar from "@/src/utils/avatar"
import { gql, useQuery } from "@apollo/client"
import { useRouter } from "next/dist/client/router"
import { QRCode } from "react-qr-svg"
import generatePayload from "promptpay-qr"
import React, { FC } from "react"

interface Props {
	query: {
		roomId: string
		memberId: string
	}
}

const ViewMember: FC<Props> = (props) => {
	const { data, loading } = useQuery(GET_MEMBER_BY_ID, {
		variables: {
			roomId: props.query.roomId,
			memberId: props.query.memberId,
		},
	})

	const router = useRouter()

	const getInviteUri = () => {
		const { protocol, host } = location
		const url = `${protocol}//${host}`

		return `${url}/join_room?id=${props.query.roomId}&memberId=${data.room.member.id}`
	}

	const goToItem = (item: IItem) => {
		router.push(`/room/${data.room.id}/item/${item.id}`)
	}

	const getPromptpayText = () => {
		if (loading) return
		return generatePayload(data.room.owner.promptpayNumber, {
			amount: data.room.member.cart.total,
		})
	}

	if (loading) return <Loading />

	return (
		<div>
			<DashboardNavbar
				backButton
				backTo={`/room/${props.query.roomId}`}
				title={data.room.title}
			/>

			<div className="container pt-24 pb-9 flex flex-col space-y-5">
				<div className="flex items-center justify-between">
					<div className="flex items-center space-x-3">
						<img
							src={avatar(data.room.member?.user?.email || data.room.member.id)}
							className="w-14 h-14"
							alt=""
						/>
						<div className="flex flex-col">
							<span className="text-2xl font-bold">
								{data.room.member.nickname}
							</span>
							<span className="text-sm text-main-grey">
								{data.room.member.user.email}
							</span>
						</div>
					</div>
					{data.room.member.isAnonymous && <Copy content={getInviteUri()} />}
				</div>

				{data.room.owner.promptpayNumber && data.room.owner.promptpayName ? (
					<>
						<div className="flex justify-center">
							<QRCode value={getPromptpayText()} className="w-56" />
						</div>

						<div className="space-y-3">
							<Section title="พร้อมเพย์">
								<div className="flex justify-between items-center">
									<div className="flex flex-col space-y-1 text-main-grey">
										<span>{data.room.owner.promptpayName}</span>
										<span>{data.room.owner.promptpayNumber}</span>
									</div>
									<Copy content={data.room.owner.promptpayNumber} />
								</div>
							</Section>
						</div>
					</>
				) : (
					<div className="text-xl text-main-grey">ไม่พบข้อมูลพร้อมเพย์</div>
				)}

				<div className="flex flex-col">
					<Section title="สินค้า" className="space-y-3">
						{(data.room.member.cart.items as IItem[]).map((e) => (
							<div onClick={() => goToItem(e)} key={e.id} className="item-card">
								<div className="flex items-center justify-between">
									<span>{e.name}</span>
									<div className="flex items-center space-x-1">
										<span>{e.price}</span>
										<img src="/close.svg" alt="" className="w-3" />
										<span>{e.quantity}</span>
									</div>
								</div>
								<div className="flex items-center justify-between">
									<span>ราคารวม</span>
									<span>{e.price! * e.quantity!}</span>
								</div>
							</div>
						))}
					</Section>
				</div>

				<hr />
				<div className="flex justify-between">
					<span>สินค้าในตระกร้าทั้งหมด</span>
					<span>{data.room.member.cart.itemCounts} ชิ้น</span>
				</div>

				<div className="flex justify-between">
					<span>ราคารวมทั้งหมด</span>
					<span className="text-lg font-bold text-main-orange">
						{data.room.member.cart.total}
					</span>
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps = auth(async ({ req, query }: any) => {
	const { roomId, memberId } = query
	try {
		await client.query({
			query: gql`
				query ($roomId: ID!, $memberId: ID!) {
					room(id: $roomId) {
						id
						member(id: $memberId) {
							id
						}
					}
				}
			`,
			variables: { roomId, memberId },
			context: { req },
		})
	} catch (error) {
		return {
			notFound: true,
		}
	}
	return {
		props: {
			query,
		},
	}
})

export default ViewMember
