import facewall_template from '../../templates/facewall_template.html'
import panel_template from '../../templates/panel_template.html'
import { Toolbelt } from '../modules/toolbelt'
import palette from '../modules/palette'
import { $, $$, round, numberWithCommas, wait, getDimensions } from '../modules/util'
import Ractive from 'ractive'
import chroma from 'chroma-js'
import smoothscroll from 'smoothscroll-polyfill';
Ractive.DEBUG = false;

smoothscroll.polyfill();


export class Facewall {

	constructor(data) {

		var self = this

		this.toolbelt = new Toolbelt()

		this.index = 0

		this.categories = []

		this.googledoc = data

		this.colours = this.googledoc.settings[0].colours.split(",").map(function(item) {

  			return item.trim();

		});

		this.categorise = (this.googledoc.settings[0].categorise==='TRUE') ? true : false ;

		this.topbar = (this.googledoc.settings[0].topbar==='TRUE') ? true : false ;

		this.ratio = +this.googledoc.settings[0].ratio

		this.colourPalette = []

		this.scale = chroma.scale(self.colours)

		this.googledoc.data.forEach(function(item, index) {

			let filtered = self.categories.filter( (value) => {

				return value.category === item.category

			});

			if (filtered.length === 0) {

				let obj = {};

				obj["category"] = item.category

				obj["cards"] =  [item]

				self.categories.push(obj);

			} else {

				filtered[0].cards.push(item)

			}

		})

		this.increment = 1 / self.categories.length 

		this.pos = this.increment

		for (var i = 0; i < self.categories.length; i++) {

			self.categories[i].colour = self.scale( self.pos ).hex()

			self.pos = self.pos + self.increment
		}

		this.database = []

		this.categories.forEach(function(item, index) {

			let colour = item.colour

			item.cards.forEach(function(value) {

				value["index"] = self.index;

				value.colour = item.colour

				value.rgb = self.toolbelt.hexToRgb(colour)

				self.database.push(value)

				self.index += 1;

			});

		});

		this.facewall = this.database

		this.facewall.forEach(function(item, index) {

			item.order = ( index + 1 ) * 2

		});

		this.ractivate()
		
	}

	ractivate() {

		var self = this

		console.log(self.categorise)

		var menu = (self.categories.length > 1 && self.categorise) ? true : false

		this.render = function () {

			var ractive = new Ractive({

				target: "#app",

				template: facewall_template,

				data: { 

					menu: menu,

					topbar: self.topbar,

					categories: self.categories,

					facewall: self.facewall,

					sizer: function() {

						return ( 100 / self.distance ) + '%'

					}
				}

			});

			ractive.on( 'activate', function ( context, number, filter ) {

				self.activate(context.node, number)

			});

			ractive.on( 'menu', function ( context, category ) {

				self.menulize(category)

			});

			ractive.on( 'close', function ( context ) {

				$('.facewall_panel').style.display = "none"

			});


		};

		this.render();

	}

	activate( target, number ) {

		var self = this

		let face = getDimensions( $('.facewall') )

		let dem = getDimensions(target)

		let percentage =  100 / face[0] * dem[0] ;

		let multiplyer = (percentage <= 25) ? 4 :
						(percentage >= 25 && percentage <= 33) ? 3 :
						(percentage >= 33 && percentage <= 50) ? 2 : 1 ;

		let arr = []

		for (var i = 0; i < self.facewall.length; i++) {

			arr.push(i)

		}

		let mutiples = self.toolbelt.multiples(arr, multiplyer)

		let last = mutiples[mutiples.length - 1]

		if ( number < last ) { 

			let index = self.toolbelt.getNextHighestIndex(mutiples, number)

			let order = ( mutiples[index] * 2 ) + 1

			self.panelize( number, order )

		} else {

			let order = ( arr.length * 2 ) + 1

			self.panelize( number, order )

		}
	}

	menulize(category) {

		var self = this

		if (category) {

			self.facewall = self.database.filter( (value) => {

				return value.category === category ;

			});

		} else {

			self.facewall = self.database

		}

		this.facewall.shuffle()

		this.facewall.forEach(function(item, index) {

			item.order = ( index + 1 ) * 2 ;

			item.index  = index;

		});

		$('.facewall_panel').style.display = "none";

		this.render();

	}

	panelize(index, order) {

		var self = this

		this.panel = function () {

			var ractive = new Ractive({

				target: "#facewall_panel",

				template: panel_template,

				data: { 

					category: self.facewall[index].category,	
					image: self.facewall[index].image,	
					title: self.facewall[index].title,	
					subtitle: self.facewall[index].subtitle,	
					panel_title: self.facewall[index].panel_title,	
					panel_subtitle: self.facewall[index].panel_subtitle,	
					description: self.facewall[index].description,
					rgb: self.facewall[index].rgb

				}

			});

		};

		this.panel();




		$('.facewall_panel').style.backgroundColor = `rgba(${self.facewall[index].rgb.r}, ${self.facewall[index].rgb.g}, ${self.facewall[index].rgb.b}, 0.1)`

		$('.facewall_panel').style.order = order

		$('.facewall_panel').style.display = "block"

        setTimeout(function() {

            var elementTop = window.pageYOffset + $('.facewall_panel').getBoundingClientRect().top

            window.scroll({
              top: elementTop,
              behavior: "smooth"
            });

        }, 400);

	}

}