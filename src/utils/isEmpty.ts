export default function isEmpty(arg: Object | Array<any>): boolean {
	if (Array.isArray(arg) && !arg.length) return true

	if (typeof arg === "object" && !Object.keys(arg).length) return true

	return false
}
