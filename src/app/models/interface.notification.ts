interface InterfaceNotificationModel {
	created_at: Date,
	ref_name: string,
	ref_id: number | null | undefined,
	notification: {
		title: string,
		subtitle?: string,
		message: string,
		notification_id?: string | number,
		recipients?: number,
	}
}

export default InterfaceNotificationModel
