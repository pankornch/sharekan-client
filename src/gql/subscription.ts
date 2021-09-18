import { gql } from "@apollo/client"

export const SUBSCRIBE_ON_ITEM_CHNAGE = gql`
	subscription ($onSubscribeItemInput: OnSubscribeItemInput!) {
		onItemChange(input: $onSubscribeItemInput) {
			state
			item {
				id
				name
				member {
					nickname
				}
			}
		}
	}
`
