import xr from 'xr';
import { Facewall } from './modules/facewall'
import { thisAtomKey } from './modules/docskey'

var key = (thisAtomKey===undefined) ? '1TLuFtjQr6mLZxKh9TXNypxvW2St6aIcHiPswp8DAc0I' : thisAtomKey ;

xr.get('https://interactive.guim.co.uk/docsdata/' + key + '.json').then((resp) => {

	let googledoc = resp.data.sheets;

	new Facewall(googledoc)
});
