let _DEBUG = false

export default {
	get DEBUG() {
		return _DEBUG
	},

	setDebugLevel(level: boolean) {
		_DEBUG = level
	},
}
