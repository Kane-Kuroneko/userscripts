import React , {} from 'react';

import { render } from 'react-dom';
import { createReaxable } from 'reaxes';
import { reaxper } from 'reaxes-react';

const { store , setState } = createReaxable( {
	count : 0 ,
} );

const App = reaxper(() => {
	
	return <div onClick={() => setState({count : store.count + 1})}>
		{store.count}
	</div>;
});

render( <App /> , document.body );

import * as _ from 'lodash';

console.log(_);
