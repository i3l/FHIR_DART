function drawProviderLabTestCountMap(dataToUse){
	if(dataToUse[0]["values"].length==0){
		dataToUse[0]["values"].push({"label":"","value":""});
	}
	nv.addGraph(function() {
	var chart = nv.models.discreteBarChart()
			    .x(function(d) { return d.label })    //Specify the data accessors.
	    		.y(function(d) { return d.value })
	    		.staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
	    		.tooltips(true)        //Don't show tooltips
		    	.showValues(false)
		    	.showXAxis(false);


	chart.tooltipContent(function (key, date, e, graph) {
     var pId = graph.point.label;
     return  "<p><b>" + providerIdNameMap[pId] + "</b></p><p>Count: " + graph.point.value +"</p>";
	});



	d3.select('#providertotallabtestbar svg')
	    .datum(dataToUse)
	    .call(chart);

	chart.discretebar.dispatch.on("elementClick", function (e) {
		var selectedProviderId = e.point.label;//dataToUse[0]["values"][e.pointIndex]["label"];
		//console.log(e.point.label)
		//console.log(selectedProviderId)
        $("#providerlabdetailsname").html("<span style='color:#029eca'>" + providerIdNameMap[selectedProviderId] + "</span>");
        var formattedProviderLabCountMap = [];
        var providerLabCountMap = {};
        var allLabTests = [];
        for(var i=0;i<filteredEncounterDataByCondition.length;i++){
			if(filteredEncounterDataByCondition[i]["providerId"]==selectedProviderId){
				if(filteredEncounterDataByCondition[i]["labTest"]!=""){
					if(objectExistisInList(filteredEncounterDataByCondition[i]["labTest"],allLabTests)!=1){
						allLabTests.push(filteredEncounterDataByCondition[i]["labTest"]);
					}
				}
			}
		}

		for(var i=0;i<allLabTests.length;i++){
			providerLabCountMap[allLabTests[i]] = 0;
		}

		for(var i=0;i<filteredEncounterDataByCondition.length;i++){
			if(filteredEncounterDataByCondition[i]["providerId"]==selectedProviderId){
				if(filteredEncounterDataByCondition[i]["labTest"]!=""){
					providerLabCountMap[filteredEncounterDataByCondition[i]["labTest"]] += 1;					
				}
			}
		}

		for(var i=0;i<allLabTests.length;i++){
			formattedProviderLabCountMap.push({"label":allLabTests[i],"value":providerLabCountMap[allLabTests[i]]})
		}
		drawProviderLabCountDetailsDonut(clone(formattedProviderLabCountMap));

    });

	nv.utils.windowResize(chart.update);
		return chart;
	});	
}

function drawProviderConsultCountMap(dataToUse){
	if(dataToUse[0]["values"].length==0){
		dataToUse[0]["values"].push({"label":"","value":""});
	}
	nv.addGraph(function() {
	var chart = nv.models.discreteBarChart()
			    .x(function(d) { return d.label })    //Specify the data accessors.
	    		.y(function(d) { return d.value })
	    		.staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
	    		.tooltips(true)        //Don't show tooltips
		    	.showValues(false)
		    	.showXAxis(false);

	d3.select('#providerconsultationbar svg')
	    .datum(dataToUse)
	    .call(chart);

	chart.tooltipContent(function (key, date, e, graph) {
     var pId = graph.point.label;
     return  "<p><b>" + providerIdNameMap[pId] +"</b></p><p>Count: " + graph.point.value +"</p>";
	});

	chart.discretebar.dispatch.on("elementClick", function (e) {
		var selectedProviderId = e.point.label;//dataToUse[0]["values"][e.pointIndex]["label"];
		console.log(selectedProviderId)
        $("#providerconsultationdetailsname").html("<span style='color:#029eca'>" + providerIdNameMap[selectedProviderId] + "</span>");
        
        var formattedProviderConsultationCountMap = [];
        var providerConsultCountMap = {};
        var allConsults = [];
        for(var i=0;i<filteredEncounterDataByCondition.length;i++){
			if(filteredEncounterDataByCondition[i]["providerId"]==selectedProviderId){
				if(filteredEncounterDataByCondition[i]["consultOrdered"]!=""){
					if(objectExistisInList(filteredEncounterDataByCondition[i]["consultOrdered"],allConsults)!=1){
						allConsults.push(filteredEncounterDataByCondition[i]["consultOrdered"]);
					}
				}
			}
		}

		for(var i=0;i<allConsults.length;i++){
			providerConsultCountMap[allConsults[i]] = 0;
		}

		for(var i=0;i<filteredEncounterDataByCondition.length;i++){
			if(filteredEncounterDataByCondition[i]["providerId"]==selectedProviderId){
				if(filteredEncounterDataByCondition[i]["consultOrdered"]!=""){
					providerConsultCountMap[filteredEncounterDataByCondition[i]["consultOrdered"]] += 1;					
				}
			}
		}

		for(var i=0;i<allConsults.length;i++){
			formattedProviderConsultationCountMap.push({"label":allConsults[i],"value":providerConsultCountMap[allConsults[i]]})
		}
		//console.log(formattedProviderConsultationCountMap)
		drawProviderConsultationCountDetailsDonut(clone(formattedProviderConsultationCountMap));

    });

	nv.utils.windowResize(chart.update);
		return chart;
	});	
}

function drawProviderMedicationCountMap(dataToUse){
	if(dataToUse[0]["values"].length==0){
		dataToUse[0]["values"].push({"label":"","value":""});
	}
	nv.addGraph(function() {
	var chart = nv.models.discreteBarChart()
			    .x(function(d) { return d.label })    //Specify the data accessors.
	    		.y(function(d) { return d.value })
	    		.staggerLabels(true)    //Too many bars and not enough room? Try staggering labels.
	    		.tooltips(true)        //Don't show tooltips
		    	.showValues(false)
		    	.showXAxis(false);

	d3.select('#providertotalmedicationbar svg')
	    .datum(dataToUse)
	    .call(chart);


	chart.tooltipContent(function (key, date, e, graph) {
     var pId = graph.point.label;
     return  "<p><b>" + providerIdNameMap[pId] + "</b></p><p>Count: " + graph.point.value +"</p>";
	});

	chart.discretebar.dispatch.on("elementClick", function (e) {
		var selectedProviderId = e.point.label;//dataToUse[0]["values"][e.pointIndex]["label"];
		console.log(selectedProviderId)
        $("#providermedicationdetailsname").html("<span style='color:#029eca'>" + providerIdNameMap[selectedProviderId] + "</span>");
        var formattedProviderMedicationCountMap = [];
        var providerMedicationCountMap = {};
        var allMedications = [];
        for(var i=0;i<filteredEncounterDataByCondition.length;i++){
			if(filteredEncounterDataByCondition[i]["providerId"]==selectedProviderId){
				if(filteredEncounterDataByCondition[i]["drugPrescribed"]!=""){
					if(objectExistisInList(filteredEncounterDataByCondition[i]["drugPrescribed"],allMedications)!=1){
						allMedications.push(filteredEncounterDataByCondition[i]["drugPrescribed"]);
					}
				}
			}
		}

		for(var i=0;i<allMedications.length;i++){
			providerMedicationCountMap[allMedications[i]] = 0;
		}

		for(var i=0;i<filteredEncounterDataByCondition.length;i++){
			if(filteredEncounterDataByCondition[i]["providerId"]==selectedProviderId){
				if(filteredEncounterDataByCondition[i]["drugPrescribed"]!=""){
					providerMedicationCountMap[filteredEncounterDataByCondition[i]["drugPrescribed"]] += 1;					
				}
			}
		}

		for(var i=0;i<allMedications.length;i++){
			formattedProviderMedicationCountMap.push({"label":allMedications[i],"value":providerMedicationCountMap[allMedications[i]]})
		}
		drawProviderMedicationCountDetailsDonut(clone(formattedProviderMedicationCountMap));

    });

	nv.utils.windowResize(chart.update);
		return chart;
	});	
}



function drawProviderLabCountDetailsDonut(dataToUse){
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

	    d3.select("#providerlabdetailsdonut svg")
	      .datum(dataToUse)
	      .transition().duration(350)
	      .call(chart);

	return chart;
	});
}

function drawProviderConsultationCountDetailsDonut(dataToUse){
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

	    d3.select("#providerconsultationdetailsdonut svg")
	      .datum(dataToUse)
	      .transition().duration(350)
	      .call(chart);

	return chart;
	});
}

function drawProviderMedicationCountDetailsDonut(dataToUse){
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

	    d3.select("#providermedicationdetailsdonut svg")
	      .datum(dataToUse)
	      .transition().duration(350)
	      .call(chart);

	return chart;
	});
}