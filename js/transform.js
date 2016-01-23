var transform = {
	init: function(specs){

		if(specs.chart = "all"){
			transform.percentAnnual(specs);
		}
	},
	percentAnnual: function(specs) {
		//
		console.log(specs)
		console.log(specs.flatData[20])

		//First, we go through each key individually
		//And set a scale to return the identical date a year later
		//And if it doesn't exist, return undefined?

		specs.keys.forEach(function(dK,iK){
			thisSet = specs.flatData.filter(function(f){return f.key == dK});
			
		})
	}
}
