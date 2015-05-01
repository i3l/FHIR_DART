function compareProviders(){
	var provider1 = $("#provider1").val();
	var provider2 = $("#provider2").val();
	
	var provider1LabCount = {},provider2LabCount={},provider1DrugCount={},provider2DrugCount={},provider1ConsulCount={},provider2ConsulCount={},provider1EncounterCount={},provider2EncounterCount={},provider1PatientCount={},provider2PatientCount={};
	provider1LabCount[provider1]=0; 
	provider2LabCount[provider2]=0; 
	provider1DrugCount[provider1]=0; 
	provider2DrugCount[provider2]=0; 
	provider1ConsulCount[provider1]=0; 
	provider2ConsulCount[provider2]=0; 
	provider1EncounterCount[provider1]=0; 
	provider2EncounterCount[provider2]=0; 
	provider1PatientCount[provider1]=0; 
	provider2PatientCount[provider2]=0; 
	var coveredPatientsForP1 = [];
	var coveredPatientsForP2 = [];
	for(var i=0;i<allEncounters.length;i++){
		if(allEncounters[i].providerId==provider1){
			if(allEncounters[i].drugPrescribed!=""){
				provider1DrugCount[provider1]+=1;
			}else if(allEncounters[i].labTest!=""){
				provider1LabCount[provider1]+=1;
			}else if(allEncounters[i].consultOrdered!=""){
				provider1ConsulCount[provider1]+=1;
			}
			provider1EncounterCount[provider1] += 1
		}else if(allEncounters[i].providerId==provider2){
			if(allEncounters[i].drugPrescribed!=""){
				provider2DrugCount[provider2]+=1;
			}else if(allEncounters[i].labTest!=""){
				provider2LabCount[provider2]+=1;
			}else if(allEncounters[i].consultOrdered!=""){
				provider2ConsulCount[provider2]+=1;
			}
			provider2EncounterCount[provider2] += 1
		}
	}

	var formattedDataMap = [{"key":providerIdNameMap[provider1],"color":"#1f77b4","values":[{"label":"Total encounters","value":provider1EncounterCount[provider1]},{"label":"Drugs Prescribed","value":provider1DrugCount[provider1]},{"label":"Lab Tests","value":provider1LabCount[provider1]},{"label":"Consults ordered","value":provider1ConsulCount[provider1]}]},
							{"key":providerIdNameMap[provider2],"color":"#4DB84D","values":[{"label":"Total encounters","value":provider2EncounterCount[provider2]},{"label":"Drugs Prescribed","value":provider2DrugCount[provider2]},{"label":"Lab Tests","value":provider2LabCount[provider2]},{"label":"Consults ordered","value":provider2ConsulCount[provider2]}]}];
	drawProviderComparison(formattedDataMap);
}


function drawProviderComparison(dataToUse){
	
  nv.addGraph(function() {
    var chart = nv.models.multiBarHorizontalChart()
        .x(function(d) { return d.label })
        .y(function(d) { return d.value })
        .margin({top: 30, right: 20, bottom: 50, left: 175})
        .showValues(true)           //Show bar value next to each bar.
        .tooltips(true)             //Show tooltips on hover.
        .showControls(false)
        .color(function(d){return d.color });        //Allow user to switch between "Grouped" and "Stacked" mode.

    chart.yAxis
        .tickFormat(d3.format(',.2f'));

    d3.select('#providerencountercompare svg')
        .datum(dataToUse)
        .call(chart);

    d3.selectAll("g.nv-bar.positive").each(function(d){
    	if(d.series==1){
    		d3.select(this).select("rect").style("fill","#1f77b4")
    	}else{
    		d3.select(this).select("rect").style("fill","#c3e0f4")
    	}
    });
    var first = 1;
    d3.selectAll("g.nv-series").each(function(d){
    	console.log(d)
    	d3.select(this).select("circle").style("stroke","")
    	if(d.key){
    		if(first==1){
    			d3.select(this).select("circle").style("fill","#c3e0f4")    			
    		}else{
    			d3.select(this).select("circle").style("fill","#1f77b4")
    		}
    		first = 0
    	}
    });

    nv.utils.windowResize(chart.update);

    return chart;
  });

}