addEventListener('message', async ({ data: [id, value] }) => {
	try {
		let fn = Function('count', `return (${value.compiled})(count)`)

		postMessage([id, await fn(value.count)])
	} catch (e) {
		postMessage([id, e])
	}
})
