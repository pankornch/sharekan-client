import DashboardNavbar from "@/src/components/DashboardNavbar"
import Dropdown from "@/src/components/Dropdown"
import Link from "next/link"
import React, { FC, useCallback, useState } from "react"
import auth from "@/src/middlewares/auth"
import dateFormatter from "@/src/utils/dateFormatter"
import { useRouter } from "next/dist/client/router"
import Loading from "@/src/components/Loading"
import ListView from "@/src/components/ListView"
import { useQuery } from "@apollo/client"
import { GET_ROOMS } from "@/src/gql"

const Dashobard: FC = () => {
	const [select, setSelect] = useState<string>("ALL")
	const { data, refetch, loading } = useQuery(GET_ROOMS, {
		variables: { roomsType: select },
	})

	const router = useRouter()

	const onSelect = useCallback((option: { name: string; value: string }) => {
		refetch()
		setSelect(option.value)
	}, [])

	return (
		<div className="ralative">
			<DashboardNavbar />

			<div className="container pt-12 pb-24">
				<Dropdown
					className="mt-10"
					label="ประเภทห้อง"
					options={[
						{ name: "ทั้งหมด", value: "ALL" },
						{ name: "เจ้าของ", value: "OWNER" },
						{ name: "สมาชิก", value: "MEMBER" },
					]}
					onSelect={onSelect}
					defaultValue={select}
				/>
				{loading ? (
					<Loading />
				) : (
					<div className="mt-12 space-y-5 w-full h-full">
						<ListView
							data={data.me.rooms}
							render={(e) => (
								<div
									onClick={() => router.push(`/room/${e.id}`)}
									className="item-card text-main-grey"
								>
									<div className="text-main-dark font-bold">{e.title}</div>

									<div className="flex justify-between">
										<span>สินค้าทั้งหมด</span>
										<span>{e.itemCounts} ชิ้น</span>
									</div>
									<div className="flex justify-between">
										<span>ราคารวมทั้งหมด</span>
										<span>{e.total}</span>
									</div>
									<div className="flex justify-between">
										<span>เจ้าของห้อง</span>
										<span>{e.owner?.name}</span>
									</div>
									<div className="flex justify-between">
										<span>สร้างเมื่อ</span>
										<span>{dateFormatter(e.createdAt!).dateTime}</span>
									</div>
								</div>
							)}
						/>
					</div>
				)}

				<div className="bottom-7 right-0 w-full fixed px-7 lg:px-56">
					<Link href="/room/create">
						<a className="button bg-main-blue text-white">สร้างห้อง</a>
					</Link>
				</div>
			</div>
		</div>
	)
}

export const getServerSideProps = auth(async ({ req }: any) => {
	return {
		props: {},
	}
})

export default Dashobard
