import { gql } from "@apollo/client"

export const SIGN_IN = gql`
	mutation ($signInInput: SignInInput!) {
		signIn(input: $signInInput) {
			token
			user {
				id
				email
				name
				promptpayName
				promptpayNumber
			}
		}
	}
`

export const CREATE_ROOM = gql`
	mutation ($createRoomInput: CreateRoomInput!) {
		createRoom(input: $createRoomInput) {
			id
			title
		}
	}
`

export const ADD_ITEM = gql`
	mutation ($input: AddItemInput!) {
		addItem(input: $input) {
			id
		}
	}
`

export const UPDATE_ITEM = gql`
	mutation ($updateItemInput: UpdateItemInput!) {
		updateItem(input: $updateItemInput) {
			id
		}
	}
`

export const REMOVE_ITEM = gql`
	mutation ($removeItemInput: RemoveItemInput!) {
		removeItem(input: $removeItemInput)
	}
`

export const CHANGE_PASSWORD = gql`
	mutation ($changePasswordInput: ChangePasswordInput!) {
		changePassword(input: $changePasswordInput) {
			id
		}
	}
`

export const CREATE_ANONYMOUS_MEMBER = gql`
	mutation ($createAnonymousUserInput: CreateAnonymousUserInput!) {
		createAnonymousUser(input: $createAnonymousUserInput) {
			id
		}
	}
`

export const REMOVE_ROOM = gql`
	mutation ($input: RemoveRoomInput!) {
		removeRoom(input: $input)
	}
`

export const REMOVE_MEMBER = gql`
	mutation ($input: RemoveMemberInput!) {
		removeMember(input: $input)
	}
`

export const UPDATE_ROOM_TITLE = gql`
	mutation ($input: UpdateRoomInput!) {
		updateRoom(input: $input) {
			id
		}
	}
`