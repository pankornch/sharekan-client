import NextAuth from "next-auth"
import Providers from "next-auth/providers"
import { SIGN_IN } from "@/src/gql"
import client from "@/src/configs/apollo-client"

const providers = [
	Providers.Credentials({
		name: "Credentials",
		// The credentials is used to generate a suitable form on the sign in page.
		// You can specify whatever fields you are expecting to be submitted.
		// e.g. domain, username, password, 2FA token, etc.
		credentials: {
			email: { label: "Email", type: "text", placeholder: "jsmith" },
			password: { label: "Password", type: "password" },
		},
		async authorize({ email, password }) {
			try {
				const res = await client.mutate({
					mutation: SIGN_IN,
					variables: {
						signInInput: {
							email,
							password,
						},
					},
				})

				return res.data?.signIn
			} catch (error) {
				return null
			}
		},
	}),
]

export default NextAuth({
	providers,
	callbacks: {
		jwt: (token, user: any) => {
			if (user) {
				token.accessToken = user.token
				token.name = user.user.name
				token.email = user.user.email
				token.user = user.user
			}
			return token
		},

		session: (session, token) => {
			session.token = token.accessToken as string
			session.user = token.user as any
			return session
		},
	},
})
