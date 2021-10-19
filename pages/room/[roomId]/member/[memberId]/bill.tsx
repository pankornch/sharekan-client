import Copy from "@/src/components/Copy"
import DashboardNavbar from "@/src/components/DashboardNavbar"
import auth from "@/src/middlewares/auth"
import { IItem } from "@/src/types"
import { gql, useQuery } from "@apollo/client"
import React, { FC } from "react"
import { QRCode } from "react-qr-svg"
import generatePayload from "promptpay-qr"
import Section from "@/src/components/Section"
import { GET_MEMBER_BILL } from "@/src/gql"
import client from "@/src/configs/apollo-client"
import Loading from "@/src/components/Loading"
import { useRouter } from "next/dist/client/router"
import CloseSVG from "@/public/close.svg"
import avatar from "@/src/utils/avatar"

interface Props {
	query: {
		roomId: string
		memberId: string
	}
}

const BillMember: FC<Props> = (props) => {
	const router = useRouter()
	const { data, loading } = useQuery(GET_MEMBER_BILL, {
		variables: {
			roomId: props.query.roomId,
			order: "DESC",
		},
	})

	const getPromptpayText = () => {
		if (loading) return
		return generatePayload(data.room.owner.promptpayNumber, {
			amount: data.room.me.cart.total,
		})
	}

	const goToItem = (item: IItem) => {
		router.push(`/room/${data.room.id}/item/${item.id}`)
	}

	if (loading) return <Loading />

	return (
		<div>
			<DashboardNavbar backButton />

			<div className="container pt-24 pb-9 space-y-5">
				<div>
					<h3 className="text-2xl text-center text-bold">เจ้าของห้อง</h3>
					<div className="flex space-x-3 justify-center">
						<img src={avatar(data!.room!.owner!.email!)} className="w-8" />
						<h3 className="text-xl text-center">{data.room.owner.name}</h3>
					</div>
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

				<div className="space-y-3">
					<Section title="สินค้า" className="space-y-3">
						{(data.room.me.items as IItem[]).map((e) => (
							<div key={e.id} className="item-card" onClick={() => goToItem(e)}>
								<div className="flex justify-between">
									<span>{e.name}</span>
									<div className="flex items-center space-x-1">
										<span>{e.price}</span>
										<CloseSVG className="w-3" />
										<span>{e.quantity}</span>
									</div>
								</div>
								<div className="flex justify-between">
									<span>ราคารวม</span>
									<span>{e.price! * e.quantity!}</span>
								</div>
							</div>
						))}
					</Section>
				</div>

				<div className="flex justify-between">
					<span>สินค้าในตะกร้าทั้งหมด</span>
					<span>{data.room.me.cart.itemCounts} ชิ้น</span>
				</div>

				<div className="flex justify-between">
					<span>ราคารวมทั้งหมด</span>
					<span className="text-2xl font-bold text-main-orange">
						{data.room.me.cart.total}
					</span>
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps = auth(async ({ req, query, res }: any) => {
	const { roomId, memberId } = query
	try {
		const { data } = await client.query({
			query: gql`
				query ($roomId: ID!, $memberId: ID!) {
					room(id: $roomId) {
						id
						member(id: $memberId) {
							id
						}
						me {
							id
						}
					}
				}
			`,
			variables: { roomId, memberId },
			context: { req },
		})

		if (memberId !== data.room.me.id) {
			res.writeHead(302, {
				Location: `/room/${roomId}/member/${data.room.me.id}/bill`,
			})
			res.end()
		}
		return {
			props: {
				query,
			},
		}
	} catch (error) {
		return {
			notFound: true,
		}
	}
})

export default BillMember
