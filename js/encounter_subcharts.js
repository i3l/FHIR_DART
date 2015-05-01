function drawDrugsBar(dataToUse){
	if(dataToUse[0]["values"].length==0){
		dataToUse[0]["values"].push({"label":"","value":""});
	}
		nv.addGraph(function() {
		var chart = nv.models.discreteBarChart()
		    .x(function(d) { return d.label })    //Specify the data accessors.
		    .y(function(d) { return d.value })
		    .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
		    .tooltips(true)        //Don't show tooltips
		    .showValues(true)
		    .showXAxis(false);

		d3.select('#drugbarchart svg')
		    .datum(dataToUse)
		    .call(chart);

		nv.utils.windowResize(chart.update);
			return chart;
		});	
}

function drawLabTestBar(dataToUse){
	if(dataToUse[0]["values"].length==0){
		dataToUse[0]["values"].push({"label":"","value":""});
	}
	nv.addGraph(function() {
	var chart = nv.models.discreteBarChart()
	    .x(function(d) { return d.label })    //Specify the data accessors.
	    .y(function(d) { return d.value })
	    .staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
	    .tooltips(true)        //Don't show tooltips
	    .showValues(true)
	    .showXAxis(false);

	d3.select('#labtestbarchart svg')
	    .datum(dataToUse)
	    .call(chart);

	nv.utils.windowResize(chart.update);
		return chart;
	});
}

function drawVisitTypeDonut(dataToUse){
	if(dataToUse.length==0){
		dataToUse.push({"label":"","value":""});
	}	
	nv.addGraph(function() {
	var chart = nv.models.pieChart()
	    .x(function(d) { return d.label })
	    .y(function(d) { return d.value })
	    .showLabels(true)     //Display pie labels
	    .labelThreshold(.05)  //Configure the minimum slice size for labels to show up
	    .labelType("percent") //Configure what type of data to show in the label. Can be "key", "value" or "percent"
	    .donut(true)          //Turn on Donut mode. Makes pie chart look tasty!
	    .donutRatio(0.35);

	    d3.select("#visitypedonutchart svg")
	      .datum(dataToUse)
	      .transition().duration(350)
	      .call(chart);

	return chart;
	});
}
