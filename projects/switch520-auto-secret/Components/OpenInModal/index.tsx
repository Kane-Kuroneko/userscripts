export const OpenInModal = reaxper(() => {
	const { modalOpened , iframeURL } = reaxel_OpenInModal.store;
	return <Modal
		open = { modalOpened }
		onClose = { () => {
			reaxel_OpenInModal.setState({ modalOpened : false , iframeURL : null });
		} }
		onCancel = { () => {
			reaxel_OpenInModal.setState({ modalOpened : false , iframeURL : null });
		} }
		bodyStyle = { { height : '80vh' } }
		centered = { true }
		footer = { null }
		width = "85%"
		style={{padding : 0}}
		destroyOnClose = { true }
		wrapStyle = { {
			display : 'flex' ,
			justifyContent : 'center' ,
			alignItems : 'center' ,
		} }
		maskStyle = { {
			backgroundColor : 'rgba(0, 0, 0, 0.75)' ,
		} }
		title = { <div style={{
			display : 'flex',
			alignItems : 'center',
			userSelect : 'none'
		}}>
			<a
				style = { {
					color : 'blueviolet' ,
					marginRight : 8,
				} }
				onClick = { () => window.open(iframeURL) }
			>{ iframeURL }</a>
			<svg
				onClick={async () => {
					await navigator.clipboard.writeText(iframeURL);
					message.success('复制成功');
				}}
				style={{ cursor : 'pointer'}}
				className = "icon"
				viewBox = "0 0 1024 1024"
				version = "1.1"
				xmlns = "http://www.w3.org/2000/svg"
				p-id = "9105"
				width = "32"
				height = "32"
			>
				<path
					d = "M589.3 260.9v30H371.4v-30H268.9v513h117.2v-304l109.7-99.1h202.1V260.9z"
					fill = "#E1F0FF"
					p-id = "9106"
				></path>
				<path
					d = "M516.1 371.1l-122.9 99.8v346.8h370.4V371.1z"
					fill = "#E1F0FF"
					p-id = "9107"
				></path>
				<path
					d = "M752.7 370.8h21.8v435.8h-21.8z"
					fill = "#446EB1"
					p-id = "9108"
				></path>
				<path
					d = "M495.8 370.8h277.3v21.8H495.8z"
					fill = "#446EB1"
					p-id = "9109"
				></path>
				<path
					d = "M495.8 370.8h21.8v124.3h-21.8z"
					fill = "#446EB1"
					p-id = "9110"
				></path>
				<path
					d = "M397.7 488.7l-15.4-15.4 113.5-102.5 15.4 15.4z"
					fill = "#446EB1"
					p-id = "9111"
				></path>
				<path
					d = "M382.3 473.3h135.3v21.8H382.3z"
					fill = "#446EB1"
					p-id = "9112"
				></path>
				<path
					d = "M382.3 479.7h21.8v348.6h-21.8zM404.1 806.6h370.4v21.8H404.1z"
					fill = "#446EB1"
					p-id = "9113"
				></path>
				<path
					d = "M447.7 545.1h261.5v21.8H447.7zM447.7 610.5h261.5v21.8H447.7zM447.7 675.8h261.5v21.8H447.7z"
					fill = "#6D9EE8"
					p-id = "9114"
				></path>
				<path
					d = "M251.6 763h130.7v21.8H251.6z"
					fill = "#446EB1"
					p-id = "9115"
				></path>
				<path
					d = "M251.6 240.1h21.8v544.7h-21.8zM687.3 240.1h21.8v130.7h-21.8zM273.4 240.1h108.9v21.8H273.4z"
					fill = "#446EB1"
					p-id = "9116"
				></path>
				<path
					d = "M578.4 240.1h130.7v21.8H578.4zM360.5 196.5h21.8v108.9h-21.8zM382.3 283.7h196.1v21.8H382.3zM534.8 196.5h65.4v21.8h-65.4z"
					fill = "#446EB1"
					p-id = "9117"
				></path>
				<path
					d = "M360.5 196.5h65.4v21.8h-65.4zM404.1 174.7h152.5v21.8H404.1zM578.4 196.5h21.8v108.9h-21.8z"
					fill = "#446EB1"
					p-id = "9118"
				></path>
			</svg>
		</div> }
		closeIcon = { <span style = { { transform : 'scale(1.5)' } }>
			<svg
				className = "icon"
				viewBox = "0 0 1024 1024"
				version = "1.1"
				xmlns = "http://www.w3.org/2000/svg"
				p-id = "16863"
				width = "32"
				height = "32"
			>
				<path
					d = "M38.04 518.35a475.12 487.33 0 1 0 950.24 0 475.12 487.33 0 1 0-950.24 0Z"
					fill = "#07AA74"
					p-id = "16864"
				></path>
				<path
					d = "M513.16 18.75C258.74 18.75 52.5 224.99 52.5 479.41c0 254.42 206.25 460.66 460.66 460.66s460.66-206.25 460.66-460.66c0.01-254.42-206.24-460.66-460.66-460.66z m0 769.72c-170.69 0-309.06-138.37-309.06-309.06s138.37-309.06 309.06-309.06 309.06 138.37 309.06 309.06c0.01 170.69-138.37 309.06-309.06 309.06z"
					fill = "#56D8B0"
					p-id = "16865"
				></path>
				<path
					d = "M656.21 556.84c18.12 18.12 18.12 47.5 0 65.62-9.06 9.07-20.93 13.59-32.8 13.59-11.88 0-23.75-4.53-32.81-13.59l-77.43-77.43-77.44 77.43c-9.06 9.07-20.93 13.59-32.8 13.59-11.88 0-23.75-4.53-32.81-13.59-18.11-18.11-18.11-47.49 0-65.62l77.44-77.43-77.44-77.44c-18.11-18.11-18.11-47.49 0-65.62 18.12-18.11 47.5-18.11 65.62 0l77.44 77.44 77.43-77.44c18.12-18.11 47.5-18.11 65.62 0 18.12 18.12 18.12 47.5 0 65.62l-77.43 77.44 77.41 77.43z"
					fill = "#FFFFFF"
					p-id = "16866"
				></path>
			</svg>
		</span> }
	>
		<iframe
			src = { iframeURL }
			width = "100%"
			height = "100%"
		/>
	</Modal>;
});

import './antd.override.less';
import {} from 'reaxes-react';
import { reaxel_OpenInModal } from './reaxel';
import { reaxper } from 'reaxes-react';
import { Modal , message } from 'antd';
