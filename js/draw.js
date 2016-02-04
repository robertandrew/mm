var draw = {
	//This should be called just once for each dataset, and once for each chart type within each dataset
	init: function(specs,chartType,variable){
		allCharts.dom(specs,chartType,variable);
		draw.draw(specs,chartType,variable);
	},
	//If something needs to be redrawn on resize or whatever, this is where it happens.
	draw: function(specs,chartType,variable){
		draw[chartType](specs,variable);
	},
	//Give each chart an object so that it can be called in draw.draw via the passed chartType variable
	simpleFever: function(specs,variable){
		//Declare the needed transformations for this chart
		simpleFever.draw(specs,variable);
	},
	horizontalBars: function(specs,variable){
		horizontalBars.draw(specs,variable)
	},
	segmentedRankedFever: function(specs,variable){
		segmentedRankedFever.draw(specs);
	}
}
