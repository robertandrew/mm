var allCharts = {
	dom: function(specs,chartType,variable){
		//Set a blank variable for each active chart type, so that selections always exist and are live

		if(specs[chartType]==undefined){
			specs[chartType] = [];
		}

		if(specs[chartType][variable]==undefined){
			specs[chartType][variable]= {
				dom : {
									//These are just three random placeholders. They could really be anything.
									svg:null
								}
			}

		}
		console.log(specs);

		specs[chartType][variable].dom.div = d3.select('#charts')
			.append('div')
			.attr('class',specs.id + " " + chartType + " " + variable);

		specs[chartType][variable].dom.div.append('h3')
			.text(specs.description + " (" + variable + ")");

		specs[chartType][variable].dom.svg = specs[chartType][variable].dom.div.append('svg');

		specs[chartType][variable].dom.canvas = specs[chartType][variable].dom.svg.append('g')
			.attr('class','canvas')

		specs[chartType][variable].dom.canvas.append('g')
			.attr('class','x axis')

		specs[chartType][variable].dom.canvas.append('g')
			.attr('class','y axis')

		specs[chartType][variable].dom.canvas.append('g')
			.attr('class','viz')
		specs[chartType][variable].dom.canvas.key = specs[chartType][variable].dom.canvas.append('g')
			.attr('class','key')

		specs[chartType][variable].dom.canvas.key.tooltip = specs[chartType][variable].dom.canvas.key.append('text')
			.attr('class','tooltip');


	},
	size: function(specs,chartType,variable){
		specs[chartType][variable].dom.svg.attr('height',specs.height + specs.margin.top + specs.margin.bottom)
			.attr('width',specs.width + specs.margin.left + specs.margin.right);
		specs[chartType][variable].dom.canvas.attr('transform','translate(' + specs.margin.left + ',' + specs.margin.top + ')');
	},
	setSize: function(specs){
		specs.margin = {
			top:10,
			right:10,
			left:40,
			bottom:20
		};
		specs.width = $('div#charts').width() - specs.margin.right - specs.margin.left;
		specs.height = 553 - specs.margin.top - specs.margin.bottom;
	},
	setAxis: function(specs){
		specs.axis = {
			x:d3.svg.axis()
				.scale(specs.scale.x)
				.orient('bottom'),
			y:d3.svg.axis()
				.scale(specs.scale.y)
				.orient('left')
		}

	},
	callAxis: function(specs,chartType,variable){
		specs[chartType][variable].dom.canvas.select('.axis.x')
			.call(specs.axis.x)
			.attr('transform','translate(0,' + specs.height + ')');

		specs[chartType][variable].dom.canvas.select('.axis.y')
			.call(specs.axis.y);
	},
	tooltip: function(specs,chartType,variable){
		//One place to set the x and y offsets, because why not?
		var thisOffset = 8;

		//Object is pre-loaded with default tooltip positioning, which is for reference, mostly.
		var tip = {direction:'left',
			xOffset:-thisOffset,
			yOffset:thisOffset,
			anchor:'start',
			}

		//Set right-handed or left-handed tooltipping, to be called on mousemove and mouseover
		function setDirection(coord){
			if(coord[0]<=specs.width/2){
				tip.direction = "left";
				tip.xOffset = thisOffset;
				tip.anchor = 'start';
			} else {
				tip.direction = "right";
				tip.xOffset = -thisOffset;
				tip.anchor = 'end';
			}
		}

		//Tooltip appears on mouseover...
		specs[chartType][variable].dom.viz.on('mouseover',function(d,i){

			var thisMouse = d3.mouse(this);
			setDirection(thisMouse);

			specs[chartType][variable].dom.canvas.key.tooltip
				.text(d.key)
				.attr('x',thisMouse[0] + tip.xOffset)
				.attr('y',thisMouse[1] + tip.yOffset)
				.style('opacity',1)
				.style('text-anchor',tip.anchor)

			d3.select(this).classed('on',true)

		})
		//...moves when the mouse moves...
		.on('mousemove',function(d,i){
			var thisMouse = d3.mouse(this);
			setDirection(thisMouse);

			specs[chartType][variable].dom.canvas.key.tooltip
			.attr('x',thisMouse[0] + tip.xOffset)
			.attr('y',thisMouse[1] + tip.yOffset)
			.style('text-anchor',tip.anchor)
		})
		//And exits when the mouse exits.
		.on('mouseout',function(d,i){
			specs[chartType][variable].dom.canvas.key.tooltip
				.text('')
				d3.select(this).classed('on',false)
			})
	}
}
