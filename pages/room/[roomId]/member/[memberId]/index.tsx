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

	if (loading) return <Loading />

	const getInviteUri = () => {
		return `${process.env.NEXT_PUBLIC_HOST}/join_room?id=${props.query.roomId}&memberId=${data.room.member.id}`
	}

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
						<span className="text-2xl font-bold">
							{data.room.member.nickname}
						</span>
					</div>

					<Copy content={getInviteUri()} />
				</div>

				<div className="flex flex-col">
					<Section title="สินค้า" className="space-y-3">
						{(data.room.member.cart.items as IItem[]).map((e) => (
							<div key={e.id} className="item-card">
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
					<span className="text-lg font-bold">
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
