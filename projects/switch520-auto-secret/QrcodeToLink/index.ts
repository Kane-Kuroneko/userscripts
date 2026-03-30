export function decodeQrFromCanvas(canvas: HTMLCanvasElement): string {
	const ctx = canvas.getContext("2d");
	if (!ctx) return null;
	
	const { width, height } = canvas;
	const imageData = ctx.getImageData(0, 0, width, height);
	
	const result = jsQR(imageData.data, width, height);
	
	return result ? result.data : null;
}

export function decodeQRFromImageElement(img: HTMLImageElement): string {
	const canvas = document.createElement('canvas')
	const ctx = canvas.getContext('2d')
	
	if (!ctx) return null
	
	canvas.width = img.naturalWidth
	canvas.height = img.naturalHeight
	
	ctx.drawImage(img, 0, 0)
	
	const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height)
	
	const result = jsQR(
		imageData.data,
		imageData.width,
		imageData.height
	)
	
	return result?.data ?? null
}


import jsQR from "jsqr";
