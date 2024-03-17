import { mathJax3Payload } from "./mathjax3"

interface protocol {
	cmd: string,
	for: string,
	from: string,
	type?: 'forward',
	html?: string,
	data?: {
		mjx3?: mathJax3Payload,
		[key: string]: unknown
	}
}