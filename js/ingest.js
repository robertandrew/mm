var ingest = {
	init: function(specs,error,data){
		specs.data = data;
		ingest.addKeysAndDates(specs)
		ingest.unpivot(specs);
		ingest.nest(specs);
	},
	addKeysAndDates: function(specs) {
		specs.keys = d3.keys(specs.data[0]).filter(function(f){return f != specs.dateCol});
		specs.dates = specs.data.map(function(d){return d[specs.dateCol]})
	},
	unpivot: function(specs){
		specs.flatData = [];

		specs.data.forEach(function(dD,iD){
			//Splits the date object to account for weird FRED formatting
			var dateObj = d3_time.timeDay.floor(new Date(dD[specs.dateCol].split('-')));

			specs.keys.forEach(function(dC,iC){
				var thisValue = dD[dC];
				if(thisValue.search(/([A-Z]|[_,!@#$%^&*();\/"'])/g)==-1){
					specs.flatData.push({
						date: dD[specs.dateCol],
						dateObj:dateObj,
						value:+thisValue,
						key:dC,
					})
				} else {console.log(specs.id + " series " + dC + " on " + dD.date + " is " + dD[dC] + ", which contains characters we should probably worry about")}
			})
		})
	},
	validate: function(specs){
		//Uses some popular regex or something to valuidate all the data and make sure there are no rogue elements

	},
	nest: function(specs){
		specs.nestedData = d3.nest().key(function(d){return d.key})
			.entries(specs.flatData);
	},
}
