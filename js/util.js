var util = {
    destroyTransitions: function(selector){
        //Fantastic obliterator of transitions that I borrowed and modified from Mike Bostock and friends
        //Interrupts transitions on specific element types

        d3.selectAll(selector).interrupt();

        d3.selection.prototype.interrupt = function(){
            return this.each(function(){
                var lock = this.__transition__;
                if (lock) {
                    var active = -1;
                    for (var id in lock) if ((id = +id) > active) active = id;
                lock.active = active + 1;
                }
            })
        }

    },
    rounderRect: function(x, y, rectW, rectH, tl, tr, bl, br, flag, key) {
        //I borrowed this from an excellent stack overflow post and rewrote it for my own purposes.
        var rectPath;

        //The starting point
        rectPath  = "M" + (x + tl) + "," + y;
        //add top path
        rectPath += "h" + (rectW - tl - tr);

        //add top right
        rectPath += "a" + tr + "," + tr + " 0 0 1 " + tr + "," + tr;
        //add right path
        rectPath += "v" + (rectH - tr - br);

        //add bottom right
        rectPath += "a" + br + "," + br + " 0 0 1 " + -br + "," + br;
        //add bottom path
        rectPath += "h" + ((br+bl) - rectW);

        //add bottom left
        rectPath += "a" + bl + "," + bl + " 0 0 1 " + -bl + "," + -bl;
        //add left path
        rectPath += "v" + ((bl + tl) - rectH);

        //add top left
        rectPath += "a" + tl + "," + tl + " 0 0 1 " + tl + "," + -tl;

        //end it all
        rectPath += "z";

        //And spit it out
        return rectPath;
    },
    quickTable: function(dataset){
          //Quick tabler of data
          d3.select('body').append('table')
            .style('outline','0.25px solid white')
            .style('font-size','60%');

          var heders = d3.keys(dataset[0]);

          var thisHeder = d3.select('table').append('tr');
          thisHeder.selectAll('th').data(heders).enter().append('th').text(function(d){return d});
          thisHeder.append('th').text('index');

          dataset.forEach(function(dRow,iRow){
            var thisRow = d3.select('table').append('tr');

            heders.forEach(function(dCell){
              thisRow.append('td').text(dRow[dCell]);
            })
            thisRow.append('td').text(iRow);
          })
    },
	addCommas: function(datapoint){
		var thisFormat = d3.format(',');
		return thisFormat(datapoint);

	},
	removeCommas: function(datapoint){
		datapoint = datapoint.replace(/,/g,'')
		return datapoint;
	},
	formatClass: function(datapoint){
		datapoint = datapoint.replace(/ /g,'')
		return datapoint.toLowerCase();
	},
	cleanDate: function(dateObj){
	//Turns a date object into something that can be matched without trouble
	var month = dateObj.getMonth()+1;
	var day = dateObj.getDate();
	var year = dateObj.getFullYear();

	return 	month + "/" + day + "/" + year;
	},

    selectDistinct: function(dataset,value){
      //Create an empty array
      var distinctSet = [];

      //Go through the dataset and find unique entries
      dataset.forEach(function(dSet,iSet){

        //...the first entry will always be unique
        if(iSet==0){
          distinctSet.push(dSet[value]);}
        //...otherwise, we filter the set to see if the value in the dataset matches
        else if (distinctSet.filter(function(dFilter,iFilter){
        return dFilter == dSet[value]}).length==0){
            distinctSet.push(dSet[value]);
        }
      })
      return distinctSet;
	},
	loadTimer: function(){
		var loadTime = window.performance.timing.domContentLoadedEventEnd- window.performance.timing.navigationStart;

		console.log('Loaded in ' + loadTime)
	}
}
