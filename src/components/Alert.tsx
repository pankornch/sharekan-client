import React, {
	forwardRef,
	useEffect,
	useImperativeHandle,
	useState,
} from "react"

interface Props {
	title?: string
	body?: string
	type?: string
	delay?: number
}

const Alert = forwardRef<any, Props>((props, ref) => {
	const [show, setShow] = useState<boolean>(false)
	const [title, setTitle] = useState<string>("")
	const [body, setBody] = useState<string>("")
	const [type, setType] = useState<string>("")

	const open = (params: { title?: string; body?: string; type?: string }) => {
		return new Promise((resolve) => {
			if (params?.title) {
				setTitle(params.title!)
			}

			if (params?.body) {
				setBody(params.body!)
			}

			if (params?.type) {
				setType(params.type)
			}

			setShow(true)

			setTimeout(() => {
				close()
				resolve(null)
			}, props.delay || 3000)
		})
	}

	const close = () => {
		setShow(false)
	}

	const getAlertColor = () => {
		switch (type) {
			case "ERROR":
				return "bg-red-100 border-red-500 text-red-700"
			case "SUCCESS":
				return "bg-green-100 border-green-500 text-green-700"
		}
	}

	useImperativeHandle(ref, () => ({
		open,
		close,
	}))

	useEffect(() => {
		setTitle(props.title!)
		setBody(props.body!)
		setType(props.type || "ERROR")
	}, [])

	if (!show) return <></>

	return (
		<div
			className={`fixed top-3 right-0 w-full border-l-4 p-4 z-50 ${getAlertColor()}`}
			role="alert"
		>
			<p className="font-bold">{title}</p>
			<p>{body}</p>
		</div>
	)
})

Alert.displayName = "Alert"

export default Alert
