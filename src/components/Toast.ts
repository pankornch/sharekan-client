interface Props {
	title: string
	content?: string
	type: Type
	timer?: number
}

type Type = "SUCCESS" | "ERROR"

class Toast {
	constructor() {
		if (!process.browser) return
	}
	open(props: Props): Promise<void> {
		const root = document.getElementById("__next")!

		const container = document.createElement("div")
		container.className = "fixed top-3 right-0 w-screen px-3 z-50"

		const toast = document.createElement("div")
		toast!.className = `border-l-4 p-4 z-50 shadow-md rounded-md
            ${getColor(props.type)}`

		const title = document.createElement("div")
		title.className = "font-bold"
		title.innerText = props.title

		if (props.content) {
			const content = document.createElement("div")
			content.className = "text-sm"
			content.innerText = props.content || ""

			toast.appendChild(title).appendChild(content)
		} else {
			toast.appendChild(title)
		}
		container.appendChild(toast)

		root.appendChild(container)
		return new Promise((resolve) => {
			setTimeout(() => {
				root.removeChild(container)
				resolve()
			}, props?.timer || 1500)
		})
	}
}

const getColor = (type: string) => {
	switch (type) {
		case "ERROR":
			return "bg-red-100 border-red-500 text-red-700"
		case "SUCCESS":
			return "bg-green-100 border-green-500 text-green-700"
		default:
			return "bg-green-gray-300 border-gray-500 text-black"
	}
}

export default new Toast()
