export function objectToFormData(obj: Record<string, any>): FormData {
	const formData = new FormData();
	
	for (const key in obj) {
		if (!obj.hasOwnProperty(key)) continue;
		
		const value = obj[key];
		
		if (Array.isArray(value)) {
			// 支持数组：key[]=a&key[]=b
			value.forEach(item => {
				formData.append(`${key}[]`, item);
			});
		} else if (value instanceof Blob || typeof value === 'object') {
			// 可选：支持 Blob 或嵌套对象的 JSON 化处理
			formData.append(key, JSON.stringify(value));
		} else if (value != null) {
			formData.append(key, String(value));
		}
	}
	
	return formData;
}
