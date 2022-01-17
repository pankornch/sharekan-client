import React, { FC } from "react"
import auth from "../../src/middlewares/auth"

const Room: FC = () => {
	return <></>
}

export default Room

export const getServerSideProps = auth(async ({ res }: any) => {
	return {
		notFound: true,
	}
})
