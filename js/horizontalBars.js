var horizontalBars = {
	draw: function(specs,variable){
		console.log(variable)
		horizontalBars.setSize(specs,'horizontalBars',variable);
		allCharts.size(specs,'horizontalBars',variable);
		horizontalBars.setScale(specs,variable);
		allCharts.setAxis(specs,'horizontalBars',variable);
		allCharts.callAxis(specs,'horizontalBars',variable);
		horizontalBars.viz(specs,variable);
		allCharts.tooltip(specs,'horizontalBars',variable);
		horizontalBars.tidy(specs,'horizontalBars',variable)

	},
	setSize: function(specs){
		specs.lineHeight = 10;
		specs.margin = {
			top:10,
			right:10,
			left:10,
			bottom:10
		};
		specs.width = $('div#charts').width() - specs.margin.right - specs.margin.left;
		specs.height = specs.keys.length * specs.lineHeight;
	},
	tidy: function(specs,chartType,variable){
		specs[chartType][variable].dom.canvas.selectAll('.axis.y text').style('text-anchor','start')
		// d3.selectAll('.tick text').style('text-anchor','start')
	},
	viz: function(specs,variable){
		specs.horizontalBars[variable].dom.viz = specs.horizontalBars[variable].dom.canvas.select('g.viz').selectAll('rect')
			.data(specs.upsAndDowns);

		specs.horizontalBars[variable].dom.viz.enter()
			.append('rect')
			.classed('down',true);

		// specs.horizontalBars[variable].dom.viz.enter()
		// 	.append('rect')
		// 	.classed('up',true);

		specs.horizontalBars[variable].dom.viz.exit()
			.remove('rect');

		d3.selectAll('.' + variable + "." + specs.id + ' .viz rect').attr('x',function(d){return specs.scale.x(-d.down)})
			.attr('y',function(d){return specs.scale.y(d.key)})
			.attr('class',function(d,i){return util.formatClass(d.key) + " down"})
			.attr('width',function(d){return specs.scale.x(0) - specs.scale.x(-d.down)})
			.attr('height',specs.lineHeight * 0.9)

		// specs.horizontalBars[variable].dom.viz.selectAll('rect.down').attr('x',function(d){return specs.scale.x(-d.down)})
		// 		.attr('y',function(d){return specs.scale.y(d.key)})
		// 		.attr('class',function(d,i){return util.formatClass(d.key) + " down"})
		// 		.attr('width',function(d){return specs.scale.x(0) - specs.scale.x(-d.down)})
		// 		.attr('height',specs.lineHeight * 0.9)

	},
	setScale: function(specs,variable){
		specs.scale = {
			x:d3.scale.linear()
				.domain([-d3.max(specs.upsAndDowns,function(d,i){return d.down}), d3.max(specs.upsAndDowns,function(d,i){return d.up})])
				.range([0,specs.width]),
			y:d3.scale.ordinal()
				.domain(specs.upsAndDowns.sort(function(a,b){return d3.descending(a.down,b.down)}).map(function(d){return d.key}))
				.rangePoints([specs.height,0])
		}
	},
}
