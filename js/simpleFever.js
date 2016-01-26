var simpleFever = {
	draw: function(specs,variable){
		simpleFever.setScale(specs,variable);
		allCharts.setAxis(specs,'simpleFever',variable);
		allCharts.callAxis(specs,'simpleFever',variable);
		simpleFever.viz(specs,variable);
		allCharts.tooltip(specs,'simpleFever',variable);
	},
	viz: function(specs,variable){
		specs.simpleFever[variable].dom.viz = specs.simpleFever[variable].dom.canvas.select('g.viz').selectAll('path')
			.data(specs.nestedData);

		specs.simpleFever[variable].dom.viz.enter()
			.append('path');

		specs.simpleFever[variable].dom.viz.exit()
			.remove('path');

		specs.simpleFever[variable].dom.viz.attr('d',function(d){return simpleFever.liner(d.values,specs,variable)})
			.attr('class',function(d,i){return util.formatClass(d.key)})
	},
	liner: function(dataset,specs,variable){
		var lineSet = dataset.sort(function(a,b){return d3.ascending(a.dateObj,b.dateObj)}).filter(function(f){return f[variable]!=undefined})
		var lineGenerator = d3.svg.line()
			.x(function(d){
				var thisX = specs.scale.x(d.dateObj);
				if(isNaN(thisX) == true){
					console.log(d.date + " x isNaN with " + d.key)
				} else {
					return thisX;
				}
			})
			.y(function(d){
				var thisY = specs.scale.y(d[variable]);
				if(isNaN(thisY)== true ){
					console.log(d.date + " y isNaN with " + d.key)
				} else {
					return thisY;
				}
			})
			// .interpolate('cardinal')

		return lineGenerator(lineSet);
	},
	setScale: function(specs,variable){
		specs.scale = {
			x:d3.time.scale()
				.domain([d3.min(specs.flatData,function(d,i){
					return d.dateObj }), new Date()])
				.range([0,specs.width]),
			y:d3.scale.linear()
				.domain(d3.extent(specs.flatData,function(d,i){return d[variable]}))
				.range([specs.height,0])
		}
	},
}
