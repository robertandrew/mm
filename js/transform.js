var transform = {
	init: function(specs){

		if(specs.chart = "all"){
			transform.percentAnnual(specs);
			transform.rank(specs,"value");
			transform.rank(specs,"yoy");

		}
	},
	percentAnnual: function(specs) {
		//First, we go through each key individually
		//And set a scale to return the identical date a year later
		//And if it doesn't exist, return undefined
		specs.keys.forEach(function(dK,iK){
			var thesePoints = specs.flatData.filter(function(f){return f.key == dK});
			var getData = d3.scale.ordinal().domain(thesePoints.map(function(m){return (m.dateObj)}))
				.range(thesePoints.map(function(m){return m}))

			thesePoints.forEach(function(dP,iP){
				var thisDay = (dP.dateObj);
				var previousYear = d3_time.timeYear.offset(thisDay,-1)
				var previousData = getData(previousYear);
				if(previousData.value == undefined){
					//It defaults to the first date in the series, I think.
					console.log(previousData)
				} else {
					dP.yoy = ((dP.value - previousData.value)/previousData.value)*100;
				}
			})
		})
	},
	rank: function(specs,variable){
		//Has this already been ranked?
		if(specs.flatData[0][variable + "Rank"]==undefined){
			console.log(specs.dates);
		} else {
			console.log("Err, this has already been ranked")
		}
	}
}
