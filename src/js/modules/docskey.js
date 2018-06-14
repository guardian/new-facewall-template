/* This gets a config string from a placeholder div above each atom embed. Add a <div></div> element in composer just above your atom embed then embed and add key=some-string-here to the alt text field */

var allAtoms = window.parent.document.querySelectorAll(".interactive-atom-fence")

if (allAtoms.length===0) {
	allAtoms = window.document.querySelectorAll(".interactive-atom")
}

var allEmbeds = window.parent.document.querySelectorAll(".element-embed")

var allAtomKeys = []
var thisAtom = null
var thisAtomKey = null

allEmbeds.forEach(function(embed) {
	if (embed.hasAttribute("data-alt")) {
		if (embed.dataset.alt.substring(0,4) === "key=") {
			// Hide the elements we're using for vars
			embed.style.display = "none"
			allAtomKeys.push(embed.dataset.alt.slice(4))
			thisAtom = allAtomKeys.indexOf(embed.dataset.alt.slice(4));
		}
	}
});

thisAtomKey = allAtomKeys[thisAtom]

export { thisAtomKey }