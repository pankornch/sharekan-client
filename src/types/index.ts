export interface IUser {
	id?: string
	email?: string
	name?: string
	promptpayName?: string
	promptpayNumber?: string
	createdAt?: Date
	updatedAt?: Date
}

export interface IRoom {
	id?: string
	title?: string
	owner?: IUser
	members?: IMember[]
	total?: number
	items?: IItem[]
	itemCounts?: number
	itemTypeCount?: number
	createdAt?: Date
	updatedAt?: Date
}

export interface IMember {
	id?: string
	user?: IUser
	nickname?: string
	room?: IRoom
	role?: string
	isAnonymous?: boolean
	cart?: ICart
	createdAt?: Date
	updatedAt?: Date
}

export interface ICart {
	member?: IMember
	total?: number
	items?: IItem[]
	itemCounts?: number
}

export interface IItem {
	id?: string
	member?: IMember
	room?: IRoom
	name?: string
	price?: number
	quantity?: number
	createdAt?: Date
	updatedAt?: Date
}
