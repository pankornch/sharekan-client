import client from "@/src/configs/apollo-client"
import { JOIN_ROOM } from "@/src/gql"
import gql from "graphql-tag"
import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"
import React, { FC } from "react"

const JoinRoom: FC = () => {
	return <></>
}

export default JoinRoom

export const getServerSideProps: GetServerSideProps = async ({
	req,
	query,
	res,
}) => {
	const { id, memberId } = query
	
	const session = await getSession({ req })

	if (!session) {
		res.setHeader("set-cookie", [`join_room_id=${id}`, `member_id=${memberId}`])
		return {
			redirect: {
				destination: "/sign_in",
				permanent: true,
			},
		}
	}

	if (!id) {
		return {
			notFound: true,
		}
	}

	try {
		await client.mutate({
			mutation: JOIN_ROOM,
			variables: {
				input: {
					id,
					memberId,
				},
			},
			context: { req },
		})

		return {
			redirect: {
				destination: `/room/${id}`,
			},
			props: {},
		}
	} catch (error: any) {
		if (error.graphQLErrors[0].message === "You are in this room") {
			return {
				redirect: {
					destination: `/room/${id}`,
				},
				props: {},
			}
		}
		return {
			notFound: true,
		}
	}
}
