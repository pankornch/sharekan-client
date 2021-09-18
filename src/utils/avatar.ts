const avatar = (name?: string): string | undefined => {
	const uri = process.env.NEXT_PUBLIC_AVATAR_API

	return `${uri}/gridy/${name ?? ""}.svg`
}

export default avatar
