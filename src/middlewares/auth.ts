import { GetServerSideProps, GetServerSidePropsContext } from "next"
import { getSession } from "next-auth/client"

const auth = (
	handler: (context: GetServerSidePropsContext) => any
): GetServerSideProps => {
	return async (context: GetServerSidePropsContext) => {
		const session = await getSession({ req: context.req })
		if (!session?.token) {
			context.res.writeHead(302, {
				Location: "/sign_in",
			})
			context.res.end()
		}

		context.locale = JSON.stringify(session)

		return handler(context)
	}
}

export default auth
