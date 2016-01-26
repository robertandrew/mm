var transform = {
	init: function(specs){

		if(specs.chart = "all"){
			transform.percentAnnual(specs);
			transform.rank(specs,"value","descending");
			transform.rank(specs,"yoy","ascending");

		}
	},
	percentAnnual: function(specs) {
		//First, we go through each key individually
		//And set a scale to return the identical date a year later
		//And if it doesn't exist, return undefined

		minDate = d3_time.timeYear.offset(new Date(specs.dates[0]),1);

		specs.keys.forEach(function(dK,iK){
			var thesePoints = specs.flatData.filter(function(f){return f.key == dK});
			var getData = d3_scale.scaleOrdinal().domain(thesePoints.map(function(m){return (m.dateObj)}))
				.range(thesePoints.map(function(m){return m}))



			thesePoints.forEach(function(dP,iP){
				var thisDay = (dP.dateObj);
				var previousYear = d3_time.timeYear.offset(thisDay,-1)
				var previousData = getData(previousYear);

				//Mannually return undefined when needed.
				if(dP.dateObj>=minDate){
					dP.yoy = ((dP.value - previousData.value)/previousData.value)*100;
				} else {
					dP.yoy = undefined;
				}
			})
		})

		console.log(specs.minDates);

	},
	movingAverage: function(specs,periods){
		specs.flatData()
	},
	rank: function(specs,variable,direction){
		//Has this already been ranked?
		if(specs.flatData[specs.flatData.length-1][variable + "Rank"]==undefined){
			specs.dates.forEach(function(dDate,iDate){

				//Filter the data
				var thisDateData = specs.flatData.filter(function(d,i){return d.date == dDate});

				///Then sort the domain
				if(direction == "ascending"){
					thisDateData = thisDateData.sort(function(a,b){return d3.ascending(a[variable],b[variable])});
				} else if (direction == "descending"){
					thisDateData = thisDateData.sort(function(a,b){return d3.descending(a[variable],b[variable])});
				} else {
					console.log('Invalid sort direction for ' + specs.id + " in " + variable)
				}

				thisDateData.forEach(function(dData,iData){
					dData[variable + "Rank"] = iData + 1;
				})
			})

			console.log(specs.dates);
		} else {
			console.log("Err, this has already been ranked")
		}
		console.log(specs.flatData[100])
		console.log(specs.flatData[200])
	}
}
