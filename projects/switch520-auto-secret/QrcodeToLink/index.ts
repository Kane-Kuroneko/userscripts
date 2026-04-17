/**
 * 二维码解析工具
 * 从 canvas 或 image 元素中解码 QR 码内容为文本链接
 */

/**
 * 从 canvas 元素中解码 QR 码
 * @param canvas QR码 canvas 元素
 * @returns 解码后的文本或 null
 */
export function decodeQrFromCanvas(canvas: HTMLCanvasElement): string | null {
	const ctx = canvas.getContext("2d");
	if (!ctx) return null;
	
	const { width, height } = canvas;
	const imageData = ctx.getImageData(0, 0, width, height);
	
	const result = jsQR(imageData.data, width, height);
	
	return result ? result.data : null;
}

/**
 * 从 image 元素中解码 QR 码
 * @param img QR码图片元素
 * @returns 解码后的文本或 null
 */
export function decodeQRFromImageElement(img: HTMLImageElement): string | null {
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
