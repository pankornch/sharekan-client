import { gql } from "@apollo/client"

export const GET_ME = gql`
	query {
		me {
			email
			name
			promptpayName
			promptpayNumber
		}
	}
`

export const GET_ROOMS = gql`
	query ($roomsType: GetRoomTypes!) {
		me {
			rooms(type: $roomsType) {
				owner {
					id
					name
				}
				members {
					cart {
						total
						items {
							price
						}
					}
				}
				id
				title
				total
				itemCounts
				createdAt
				updatedAt
			}
		}
	}
`

export const GET_ROOM_BY_ID = gql`
	query ($roomId: ID!) {
		room(id: $roomId) {
			title
			owner {
				id
				name
			}
			members {
				id
				nickname
				cart {
					total
					items {
						name
						price
						quantity
					}
				}
				user {
					name
				}
			}
		}
	}
`


export const GET_ROOM_ITEMS = gql`
	query ($roomId: ID!) {
		room(id: $roomId) {
			items {
				id
				name
				price
				quantity
				member {
					id
					nickname
					user {
						name
						email
					}
				}
			}
		}
	}
`

export const GET_ITEMS_BY_OWNER = gql`
	query ($roomId: ID!) {
		room(id: $roomId) {
			me {
				user {
					email
				}
				nickname
				items {
					id
					name
					price
					quantity
				}
			}
		}
	}
`

export const GET_ROOM_MEMBERS = gql`
	query ($roomId: ID!) {
		room(id: $roomId) {
			members {
				id
				nickname
				user {
					email
				}
				cart {
					total
					itemCounts
				}
			}
		}
	}
`

export const GET_MEMBER_BY_ID = gql`
	query ($roomId: ID!, $memberId: ID!) {
		room(id: $roomId) {
			title
			member(id: $memberId) {
				id
				nickname
				user {
					email
				}
				cart {
					items {
						id
						name
						price
						quantity
					}
					total
					itemCounts
				}
			}
		}
	}
`
export const GET_MEMBER_BILL = gql`
	query ($roomId: ID!) {
		room(id: $roomId) {
			owner {
				email
				name
				promptpayName
				promptpayNumber
			}

			me {
				id
				cart {
					items {
						id
						name
						price
						quantity
					}
					total
					itemCounts
				}
			}
		}
	}
`

export const GET_ITEM_BY_MEMBER = gql`
	query ($roomId: ID!) {
		room(id: $roomId) {
			title
			me {
				id
				nickname
				cart {
					itemCounts
					items {
						quantity
					}
					total
				}
			}
			members {
				id
				nickname
				user {
					email
				}
				cart {
					itemCounts
					total
				}
			}
		}
	}
`

export const GET_ITEM_BY_ID = gql`
	query ($roomId: ID!, $itemId: ID!) {
		room(id: $roomId) {
			me {
				id
			}
			members {
				id
				nickname
				user {
					name
					email
				}
			}
			item(id: $itemId) {
				id
				name
				price
				quantity
				member {
					id
					nickname
					user {
						name
					}
					cart {
						itemCounts
						total
						total
					}
				}
			}
		}
	}
`

export const GET_ROOM_OVERVIEW = gql`
	query ($roomId: ID!) {
		room(id: $roomId) {
			id
			title
			total
			itemCounts
			owner {
				id
			}
			members {
				id
				nickname
				role
				user {
					id
					email
				}
			}
		}
	}
`

export const GET_ME_IN_ROOM = gql`
	query ($roomId: ID!) {
		room(id: $roomId) {
			me {
				id
			}
		}
	}
`