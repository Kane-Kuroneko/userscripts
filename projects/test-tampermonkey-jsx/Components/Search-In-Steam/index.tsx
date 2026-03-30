

const {store,setState,mutate} = createReaxable({
	modalVisible : false,
	searchingText: ''
})

export const SearchInSteam = reaxper( () => {
	
	
	return <div>
		<button
			style={{
				backgroundColor : '#20a0ff',
				color : '#eee',
				width : '100%',
				padding : '12px 18px',
				borderRadius : '4px',
				border : 'none',
				cursor : 'pointer',
				fontSize : '16px',
				letterSpacing : '2px',
				margin : '0 0 24px 0'
			}}
			onClick = { () => {
				debugger;
				{
					const result = nameInArticle();
					if(result?.english){
						console.log('aaaaaaaaaa',result?.english);
						window.open( `https://store.steampowered.com/search/?l=schinese&term=${encodeURIComponent(result.english.trim()).replace(/%20/g, '+')}` );
						// window.open( `https://store.steampowered.com/search/?sort_by=_ASC&term=${ result.english }&supportedlang=schinese%2Cenglish` );
						return;
					}
				}
				{
					const { chinese , english } = nameInTitle() || {};
					if( english ) {
						window.open( `https://store.steampowered.com/search/?l=schinese&term=${encodeURIComponent(english.trim()).replace(/%20/g, '+')}` );
						// window.open( `https://store.steampowered.com/search/?sort_by=_ASC&term=${ english }&supportedlang=schinese%2Cenglish` );
					} else if( chinese ) {
						window.open( `https://store.steampowered.com/search/?l=schinese&term=${encodeURIComponent(chinese.trim()).replace(/%20/g, '+')}` );
						// window.open( `https://store.steampowered.com/search/?sort_by=_ASC&term=${ chinese }&supportedlang=schinese%2Cenglish` );
					}
				}
			} }
		>
			去Steam搜索此游戏
		</button>
		{/*<Modal
			isOpen={store.modalVisible}
			onRequestClose={() => setState({ modalVisible : false})}
			ariaHideApp={false}
		>
			<iframe
				src = { `https://store.steampowered.com/search/?sort_by=_ASC&term=${ '蓝精灵' }&supportedlang=schinese%2Cenglish` }
				frameborder = "0"
			/>
		</Modal>*/ }
	</div>;
} );
import { articleContainer , titleElement , nameInArticle , nameInTitle } from '../../DOM-finder';
import React , {} from 'react';
import Modal from 'react-modal';
import { reaxper ,createReaxable} from 'reaxes-react';
