const notificationKey = 'search-on-steam';
//todo: 搜索改为中文?l=schinese
const getSelection = () => window.getSelection().toString();

document.addEventListener( 'mouseup' , ( evt ) => {
	if( (evt.target as HTMLElement).className?.includes?.( 'ant-notification' ) ) {
		return;
	}
	const selection = getSelection();
	console.log( evt.target , getSelection() );
	setState( { selection } );
} );

const { store , setState , mutate } = createReaxable( {
	open : false ,
	selection : '' ,
} );

obsReaction( ( first ) => {
	if( first ) return;
	const { selection } = store;
	if( selection ) {
		setState( { open : true } );
	} else {
		setState( { open : false } );
	}
} , () => [ store.selection ] );

const App = reaxper( () => {
	const [ api , contextHolder ] = notification.useNotification();
	const { open , selection } = store;
	
	if( open ) {
		api.open( {
			message : <a
				style = { { color : 'black' , fontSize : '18px' , display : "inline-block" } }
				onClick = { ( e ) => {
					e.preventDefault();
					// window.open( `https://store.steampowered.com/search/?sort_by=_ASC&term=${ selection }&supportedlang=schinese%2Cenglish` );
					window.open( `https://store.steampowered.com/search/?l=schinese&term=${encodeURIComponent(selection.trim()).replace(/%20/g, '+')}` );
				} }
			>
				Steam搜索：
				<div style = { {
					color : '#7f7fff',
					display:'flex',
					maxHeight : '30px',
					overflow:  'hidden',   
				} }>{ selection }</div>
			</a> ,
			placement : 'top' ,
			key : notificationKey ,
			duration : null ,
			closable : false ,
			onClose : null ,
			closeIcon : null
		} );
	} else {
		api.destroy( notificationKey );
	}
	return contextHolder;
} );

const container = document.createElement( 'div' );
document.body.append( container );
const reactRoot = createRoot( container );
reactRoot.render( <App /> );

import { notification } from 'antd';
import { reaxper } from 'reaxes-react';

import { obsReaction , createReaxable } from 'reaxes';
import { createRoot } from 'react-dom/client';
import "./style.module.less";
