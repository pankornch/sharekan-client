import "../styles/globals.scss"
import type { AppProps } from "next/app"
import { ApolloProvider } from "@apollo/client"
import client from "../src/configs/apollo-client"
import React from "react"
import { RecoilRoot } from "recoil"
import Head from "next/head"

function MyApp({ Component, pageProps }: AppProps) {
	return (
		<ApolloProvider client={client}>
			<RecoilRoot>
				<Head>
					<title>Sharekan</title>
					<link rel="manifest" href="/manifest.json"></link>
					<link rel="apple-touch-icon" sizes="180x180" href="icon-192x192.png"></link>
					<meta
						name="viewport"
						content="initial-scale=1.0, width=device-width"
					/>
					<link rel="icon" href="/logo.svg" type="image/x-icon"></link>
				</Head>
				<Component {...pageProps} />
			</RecoilRoot>
		</ApolloProvider>
	)
}
export default MyApp
