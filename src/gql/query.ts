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
	query ($roomsType: GetRoomTypes!, $order: String) {
		me {
			id
			rooms(type: $roomsType, order: $order) {
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
				isOwner
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
	query ($roomId: ID!, $order: String) {
		room(id: $roomId) {
			id
			items(order: $order) {
				id
				name
				price
				quantity
				member {
					id
					nickname
					user {
						id
						name
						email
					}
				}
			}
		}
	}
`

export const GET_ITEMS_BY_OWNER = gql`
	query ($roomId: ID!, $order: String) {
		room(id: $roomId) {
			id
			me {
				user {
					id
					email
				}
				nickname
				items(order: $order) {
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
	query ($roomId: ID!, $order: String) {
		room(id: $roomId) {
			id
			members(order: $order) {
				id
				nickname
				user {
					id
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
			id
			title
			owner {
				email
				name
				promptpayNumber
				promptpayName
			}
			member(id: $memberId) {
				id
				isAnonymous
				nickname
				user {
					id
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
	query ($roomId: ID!, $order: String) {
		room(id: $roomId) {
			id
			owner {
				email
				name
				promptpayName
				promptpayNumber
			}

			me {
				id
				items(order: $order) {
					id
					name
					price
					quantity
				}
				cart {
					total
					itemCounts
				}
			}
		}
	}
`

export const GET_MEMBER_ITEMS_BY_OWNER = gql`
	query ($roomId: ID!) {
		room(id: $roomId) {
			id
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
				isAnonymous
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

export const GET_ITEMS_BY_MEMBER = gql`
	query ($roomId: ID!) {
		room(id: $roomId) {
			id
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
		}
	}
`

export const GET_ITEM_BY_ID_BY_OWNER = gql`
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

export const GET_ITEM_BY_ID = gql`
	query ($roomId: ID!, $itemId: ID!) {
		room(id: $roomId) {
			me {
				id
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
				cart {
					total
				}
			}
			createdAt
		}
	}
`

export const GET_ME_IN_ROOM = gql`
	query ($roomId: ID!) {
		room(id: $roomId) {
			id
			me {
				id
			}
		}
	}
`
