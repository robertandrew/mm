var transform = {
	init: function(specs){

		if(specs.chart == "all"){
			transform.dates.transform(specs);
			transform.countUpsAndDowns(specs,"changeFromPrevious",new Date(2005,1,1));
			transform.changeSince(specs,"value",new Date(2005,1,1));
			transform.rank(specs,"value","descending");
			transform.rank(specs,"valueYoy","ascending");
			transform.rank(specs,"value12periodAverageYoy","ascending");


		}
	},
	dates :{
		transform: function(specs) {
			//First, we go through each key individually
			//And set a scale to return the identical date a year later
			//And if it doesn't exist, return undefined

			//Set the scale for all date-based transformations
			specs.keys.forEach(function(dK,iK){
				var thesePoints =
				specs.flatData.filter(function(f){return f.key == dK;}).sort(function(a,b){return d3.ascending(a.dateObj,b.dateObj);});
				var getData = d3_scale.scaleOrdinal().domain(thesePoints.map(function(m){return (m.dateObj);}))
					.range(thesePoints.map(function(m){return m;}));

				//Go through the points and perform all transformations
				thesePoints.forEach(function(dP,iP){
					transform.dates.yoy(specs,dP,'value',getData);
					transform.dates.fromPrevious(specs,dP,'value',thesePoints,iP);
					transform.dates.movingAverage(specs,dP,'value',12,thesePoints,iP);
					transform.dates.yoy(specs,dP,'value12periodAverage',getData);


				});
			});
		},
		yoy: function(specs,datapoint,variable,scale){
			// if(datapoint[variable]!=undefined){
			// 	console.log('again? with ' + variable + " " + specs.id + " " + datapoint.date)
			// }
			var previousYear = d3_time.timeYear.offset(datapoint.dateObj,-1);
			var previousYearData = scale(previousYear);
			minDate = d3_time.timeYear.offset(new Date(specs.dates[0]),1);

			//Mannually return undefined when needed.
			if(datapoint.dateObj>=minDate){
				datapoint[variable+'Yoy'] = ((datapoint[variable] - previousYearData[variable])/previousYearData[variable])*100;
			} else {
				datapoint[variable+'Yoy'] = undefined;
			}
		},
		fromPrevious: function(specs,datapoint,variable,dataset,index){
			if(index!=0){
				var thisOne = datapoint[variable];
				var lastOne = dataset[index-1][variable];
				var changeFromPrevious = (thisOne - lastOne).toFixed(2);

				if((changeFromPrevious) !== undefined && isNaN(changeFromPrevious) === false)	{

					datapoint.changeFromPrevious = changeFromPrevious;
					datapoint.percentFromPrevious = (thisOne-lastOne)/lastOne *100;
				}
			}
			else {
				datapoint.changeFromPrevious = undefined;
				datapoint.percentFromPrevious = undefined;
			}
		},
		movingAverageSmart: function(specs,datapoint,variable,months,dataset){
			//It's "smart" because it bases everything on months not periods, but that also makes it super duper slow.
			minDate = d3_time.timeMonth.offset(new Date(specs.dates[0]),months);

			//Make sure it's averageable!
			if(datapoint.dateObj>=minDate){
				var earlierMonth=d3_time.timeMonth.offset(datapoint.dateObj,-months);
				var inRange = dataset.filter(function(f){return (f.dateObj>=earlierMonth && f.dateObj<=datapoint.dateObj)});
				var average = d3.mean(inRange,function(d){return d[variable]})

				datapoint[variable + months + "monthAverage"] = average;

			} else {
				datapoint[variable + months + "monthAverage"] = undefined;
			}
		},
		movingAverage: function(specs,datapoint,variable,periods,dataset,index){
			//The dumb version just takes periods and sorted data and works based on index level
			if(index>=periods && datapoint[variable]!==undefined){
				var problemFlag = 0;
				var averageSet = [];
				d3.range(index-periods+1, index+1).forEach(function(d,i){
					var thisValue = dataset[d][variable];
					if(thisValue===undefined){
						problemFlag++;
					} else {
						averageSet.push(thisValue);
					}
				});
				if(problemFlag!==0){
					datapoint[variable + periods + "periodAverage"] = undefined;
				} else {
					datapoint[variable + periods + "periodAverage"] = d3.mean(averageSet,function(d){return d;});
				}

			} else {
				datapoint[variable + periods + "periodAverage"] = undefined;
			}
		}
	},
	countUpsAndDowns: function(specs,variable,startDate) {
		if(startDate===undefined){
			startDate = new Date(1600,1,1);
		}

		var upsAndDowns = [];
		specs.keys.forEach(function(d,i){
			upsAndDowns[d] = {
				up:0,
				down:0,
				flat:0
			};
		});
		specs.flatData.forEach(function(d,i){
			if (d.dateObj >= startDate && d[variable]!==undefined){
				if(d[variable]>0){
					upsAndDowns[d.key].up++;
				} else if (d[variable]<0) {
					upsAndDowns[d.key].down++;
				} else if (d[variable]===0){
					upsAndDowns[d.key].flat++;
				} else {
					console.log('Problem defining ' + d[variable] + " " + d.key + " " + d.date);
				}
				d.steps = upsAndDowns[d.key].up - upsAndDowns[d.key].down;
			}
		});

		specs.upsAndDowns = [];
		specs.keys.forEach(function(d,i){
			specs.upsAndDowns.push({
				up:upsAndDowns[d].up,
				down:upsAndDowns[d].down,
				flat:upsAndDowns[d].flat,
				key:d
			});
		});

	},
	changeSince: function(specs, variable, startDate) {
		//Defaults to the earlierst possible date
		if(startDate === undefined) {
			startDate = specs.dates[0];
		}
		//End date is always most recent possible date
		var endDate = specs.dates[specs.dates.length-1];

		var changeSince = [];

		specs.keys.forEach(function(dK,iK){
			changeSince[dK] = {'key':d.key};
		});

		specs.flatData.forEach(function(d,i){

			if(d.date == startDate){
				changeSince[d.key].start = d[variable];
			} else if (d.date == endDate) {
				changeSince[d.key].end = d[variable];
			}
		});

		specs.changeSince = [];

		changeSince.forEach(function(d,i){
			specs.changeSince.push({
				"start":d.start,
				"end":d.end,
				"change":d.start-d.end,
				"percentChange":((d.start-d.end)/d.end) * 100
			});
		});

	},

	rank:function(specs,variable,direction){

		//Has this already been ranked?
		if(specs.flatData[specs.flatData.length-1][variable + "Rank"]===undefined){
			specs.dates.forEach(function(dDate,iDate){

				//Filter the data
				var thisDateData = specs.flatData.filter(function(d,i){return d.date == dDate;});

				///Then sort the domain
				if(direction == "ascending"){
					thisDateData = thisDateData.sort(function(a,b){return d3.ascending(a[variable],b[variable]);});
				} else if (direction == "descending"){
					thisDateData = thisDateData.sort(function(a,b){return d3.descending(a[variable],b[variable]);});
				} else {
					console.log('Invalid sort direction for ' + specs.id + " in " + variable);
				}

				thisDateData.forEach(function(dData,iData){
					if(dData[variable]!==undefined && isNaN(dData[variable])===false){
						dData[variable + "Rank"] = iData + 1;
					} else {
							dData[variable + "Rank"] = undefined;
						}
				});
			});

		} else {
			console.log("Err, this has already been ranked");
		}
	}
};
