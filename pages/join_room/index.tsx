import client from "@/src/configs/apollo-client"
import auth from "@/src/middlewares/auth"
import gql from "graphql-tag"
import React, { FC } from "react"

const JoinRoom: FC = () => {
	return <></>
}

export default JoinRoom

export const getServerSideProps = auth(async ({ query, req, res }: any) => {
	const { id, memberId } = query

	if (!id) {
		return {
			notFound: true,
		}
	}

	try {
		await client.mutate({
			mutation: gql`
				mutation ($joinRoomInput: JoinRoomInput!) {
					joinRoom(input: $joinRoomInput) {
						id
					}
				}
			`,
			variables: {
				joinRoomInput: {
					id,
					memberId,
				},
			},
			context: { req },
		})
		res.writeHead(302, { location: `/room/${id}` })
		res.end()

		return {
			props: {},
		}
	} catch (error) {
		return {
			notFound: true,
		}
	}
})
