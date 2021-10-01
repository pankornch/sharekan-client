import { GetServerSideProps } from "next"
import { getSession } from "next-auth/client"

const auth = (handler: any): GetServerSideProps => {
	return async (context) => {
		const session = await getSession({ req: context.req })
		console.log(session)
		if (!session?.token) {
			context.res.writeHead(302, {
				Location: "/sign_in",
			})
			context.res.end()
		}
		return handler(context)
	}
}

export default auth
