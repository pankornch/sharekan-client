import {
	GetServerSideProps,
	GetServerSidePropsContext,
	GetServerSidePropsResult,
} from "next"
import { getSession } from "next-auth/client"

const auth = (
	handler: (context: GetServerSidePropsContext) => Promise<GetServerSidePropsResult<any>>
): GetServerSideProps => {
	return async (context) => {
		const session = await getSession({ req: context.req })
		if (!session?.token) {
			return {
				redirect: {
					destination: "/sign_in",
					permanent: true,
				},
				props: {}
			}
		}

		context.locale = JSON.stringify(session)

		return handler(context)
	}
}

export default auth
