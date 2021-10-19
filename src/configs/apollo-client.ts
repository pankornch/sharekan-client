import {
	ApolloClient,
	createHttpLink,
	InMemoryCache,
	split,
} from "@apollo/client"
import { setContext } from "@apollo/client/link/context"
import { getSession } from "next-auth/client"
import { WebSocketLink } from "@apollo/client/link/ws"
import { getMainDefinition } from "@apollo/client/utilities"

const wsLink = process.browser
	? new WebSocketLink({
			uri: process.env.NEXT_PUBLIC_GRAPHQL_WS!,
			options: {
				reconnect: true,
				connectionParams: async () => {
					const session = await getSession()

					return {
						Authorization: session?.token ? `Bearer ${session.token!}` : "",
					}
				},
			},
	  })
	: null

const httpLink = createHttpLink({
	uri: process.env.NEXT_PUBLIC_GRAPHQL_URL!,
})

const authLink = setContext(async (_, ctx) => {
	const session = await getSession({ req: ctx.req })
	let token = ""

	if (session?.token) {
		token = session.token as string
	}

	return {
		headers: {
			...ctx.headers,
			authorization: token ? `Bearer ${token}` : "",
		},
	}
})

const link = process.browser
	? split(
			({ query }) => {
				const definition = getMainDefinition(query)
				return (
					definition.kind === "OperationDefinition" &&
					definition.operation === "subscription"
				)
			},
			wsLink!,
			authLink.concat(httpLink)
	  )
	: authLink.concat(httpLink)

const client = new ApolloClient({
	link: link,
	cache: new InMemoryCache(),
})

export default client
