//@ts-nocheck


watch(document.body,() => {
	const cards = createNodeListRef()
	const textNode = createNodeRef()
	
	useMutation( () => {
		cardNode.current.addEventListener('click',(ev:MouseEvent) => {
			ev.stopPropagation();
			antd.modal();
		})
	} , [cards] );
	
	const target = useQueryDom();
	
	return <div id="posts">
		<div
			className="post grid"
			ref = {target}
		></div>
	</div>
})

class Card {
	tree(){
		
		
		useMatch(cardNode,() => {
			
		})
		
		
	
	}
	
	onMatch(){
		if(this.cardNode){
			useEffect(()=>{
				this.cardNode.render(<div>
					
				</div>)
			},[])
		}
	}
}
