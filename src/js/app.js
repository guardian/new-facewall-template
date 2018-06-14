import xr from 'xr';
import { Facewall } from './modules/facewall'
import { thisAtomKey } from './modules/docskey'

var key = (thisAtomKey===undefined) ? '1ChpvMeV5XCuQaYrpxZdyudpN9S9ijS02PE5R_qRy2LA' : thisAtomKey ;

xr.get('https://interactive.guim.co.uk/docsdata/' + key + '.json').then((resp) => {

	let googledoc = resp.data.sheets;

	new Facewall(googledoc)
});
