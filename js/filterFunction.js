function objectExistisInList(obj,list){
	for(var i=0;i<list.length;i++){
		if(obj==list[i]){
			return 1;
		}
	}
	return 0;
}

function getCombinations(inpArr){
	var resList = [];
	console.log(inpArr.length)
	for(var i=0;i<inpArr.length;i++){
		for(var j=0;j<inpArr.length;j++){
			if(objectExistisInList([inpArr[i],inpArr[j]],resList)==0){
				resList.push([inpArr[i],inpArr[j]]);
			}
			//console.log(inpArr[i],inpArr[j])
		}
	}
	return resList;
}

function applyFilters(){
	
	filteredEncounterData = [];
	filteredChronologicalVisData = [];

	var selectedJobs = [], selectedImmunizations = [], selectedMaritialStatuses = [];
	$('#immunizationoptionlist input:checked').each(function() {
    	selectedImmunizations.push($(this).attr('value'));
	});

	$('#joboptionlist input:checked').each(function() {
    	selectedJobs.push($(this).attr('value'));
	});

	$('#marriagestatusoptionlist input:checked').each(function() {
    	selectedMaritialStatuses.push($(this).attr('value'));
	});

	var startYear = parseInt($("#daterangestart").val());
	var endYear = parseInt($("#daterangeend").val());

	var startAge = parseInt($("#agerangestart").val());
	var endAge = parseInt($("#agerangeend").val());


	var showBoth = 0, showMale = 0, showFemale = 0;
	if($("#genderboth").is(":checked")){
		showBoth = 1;
	}
	if($("#gendermale").is(":checked")){
		showMale = 1;
	}
	if($("#genderfemale").is(":checked")){
		showFemale = 1;
	}
	
	//console.log(married,single,separated,divorced)
	//filteredEncounterData
	
	for(var i=0; i<allEncounters.length; i++){
		var currentEncounterAge = parseInt(allEncounters[i]['age']);
		var currentEncounterYear = parseInt(allEncounters[i]['encounterDate'].substring(0,4));
		var currentEncounterGender = allEncounters[i]['gender'].toLowerCase();
		var currentEncounterMarriageStatus = allEncounters[i]['marriage_status'];
		var currentEncounterImmunizationsList = allEncounters[i]['immunizations'];		
		var currentEncounterJob = allEncounters[i]['job'];
		var skipCurrent = 0;

		//age filter
		if(currentEncounterAge<startAge || currentEncounterAge>endAge){
			continue;
		}

		//year range filter
		if(currentEncounterYear<startYear || currentEncounterYear>endYear){
			continue;
		}
		
		//immunization filter
		for(var j=0;j<selectedImmunizations.length;j++){
			var vaccine = selectedImmunizations[j];
			if(objectExistisInList(vaccine,currentEncounterImmunizationsList)==1){				

			}else{
				skipCurrent=1;
				break;
			}
		}
		if(skipCurrent==1){
			continue;
		}

		//job filter
		if(objectExistisInList(currentEncounterJob,selectedJobs)==0){
			continue;
		}

		//gender filter
		if(showBoth==1){
			if(objectExistisInList(currentEncounterMarriageStatus,selectedMaritialStatuses)==1){
				filteredEncounterData.push(allEncounters[i]);
			}			
		}else if(showMale==1){
			if(currentEncounterGender=="male"){
				if(objectExistisInList(currentEncounterMarriageStatus,selectedMaritialStatuses)==1){
					filteredEncounterData.push(allEncounters[i]);
				}
			}else{
				continue;
			}
		}else if(showFemale==1){
			if(currentEncounterGender=="female"){
				if(objectExistisInList(currentEncounterMarriageStatus,selectedMaritialStatuses)==1){
					filteredEncounterData.push(allEncounters[i]);
				}
			}else{
				continue;
			}
		}
	}
	//console.log(filteredEncounterData.length)
	for(var i=0; i<encounterHistoryData.length; i++){
		var currentEncounterAge = parseInt(encounterHistoryData[i]['age']);
		var currentEncounterGender = encounterHistoryData[i]['gender'].toLowerCase();
		var currentEncounterMarriageStatus = encounterHistoryData[i]['marriage_status'];
		var currentEncounterImmunizationsList = encounterHistoryData[i]['immunizations'];		
		var currentEncounterJob = encounterHistoryData[i]['job'];
		var skipCurrent = 0;		
		//age filter
		if(currentEncounterAge<startAge || currentEncounterAge>endAge){
			continue;
		}

		//immunization filter
		for(var j=0;j<selectedImmunizations.length;j++){
			var vaccine = selectedImmunizations[j];
			if(objectExistisInList(vaccine,currentEncounterImmunizationsList)==1){				

			}else{
				skipCurrent=1;
				break;
			}
		}
		if(skipCurrent==1){
			continue;
		}

		//job filter
		if(objectExistisInList(currentEncounterJob,selectedJobs)==0){
			continue;
		}

		//gender filter
		if(showBoth==1){
			if(objectExistisInList(currentEncounterMarriageStatus,selectedMaritialStatuses)==1){
				filteredChronologicalVisData.push(encounterHistoryData[i]);
			}			
		}else if(showMale==1){
			if(currentEncounterGender=="male"){
				if(objectExistisInList(currentEncounterMarriageStatus,selectedMaritialStatuses)==1){
					filteredChronologicalVisData.push(encounterHistoryData[i]);
				}
			}else{
				continue;
			}
		}else if(showFemale==1){
			if(currentEncounterGender=="female"){
				if(objectExistisInList(currentEncounterMarriageStatus,selectedMaritialStatuses)==1){
					filteredChronologicalVisData.push(encounterHistoryData[i]);
				}
			}else{
				continue;
			}
		}
	}
	for(var i=0;i<filteredChronologicalVisData.length;i++){
		var currentEncounterList = filteredChronologicalVisData[i]["encounterList"];
		var filteredEncounterList = [];
		for(var j=0;j<currentEncounterList.length;j++){
			var currentEncounterYear = parseInt(currentEncounterList[j]["date"].split("-")[0]);
			if(currentEncounterYear>=startYear && currentEncounterYear<=endYear){
				filteredEncounterList.push(currentEncounterList[j])
			}
		}
		filteredChronologicalVisData[i]["encounterList"] = filteredEncounterList;
		filteredChronologicalVisData[i]["encounterCount"] = filteredEncounterList.length;
	}
	
	$("#membercounttext").html("<h1>Patients: <span style='color:#029eca'>" + filteredChronologicalVisData.length + "</span></h1>");
	//console.log(filteredChronologicalVisData.length)

	var nodeList = [];
	for(var i=0;i<filteredChronologicalVisData.length;i++){
		for(var j=0;j<filteredChronologicalVisData[i]["encounterList"].length;j++){
			if(objectExistisInList(filteredChronologicalVisData[i]["encounterList"][j]["event"],nodeList)==0){
				nodeList.push(filteredChronologicalVisData[i]["encounterList"][j]["event"])
			}
		}
	}
	//console.log(nodeList)
	var nodeCountMap = {};
	for(var i=0;i<nodeList.length;i++){
		nodeCountMap[nodeList[i]] = 0;
	}	/*
	for(var i=0;i<filteredChronologicalVisData.length;i++){//for each patient
		for(var j=0;j<filteredChronologicalVisData[i]["encounterList"].length;j++){ //for each encounter
			nodeCountMap[filteredChronologicalVisData[i]["encounterList"][j]["event"]]+=1
		}
	}
	console.log(filteredChronologicalVisData)*/
	var tsum =0 ;
	/*for(var i=0;i<filteredChronologicalVisData.length;i++){
		tsum+=filteredChronologicalVisData[i]["encounterList"].length;
	}
	console.log(tsum)*/
	console.log("NODE COUNT MAP" + JSON.stringify(nodeCountMap))
	var linksList = getCombinations(nodeList);
	//console.log(linksList)
	var linkCountMap = {};
	for(var i=0;i<linksList.length;i++){
		linkCountMap[linksList[i]] = 0;
	}
	console.log(linkCountMap)
	for(var i=0;i<filteredChronologicalVisData.length;i++){//for each patient
		var currentEncounterList = filteredChronologicalVisData[i]["encounterList"];
		for(var j=0;j<currentEncounterList.length-1;j++){
			var curAndNextTuple = [currentEncounterList[j]["event"],currentEncounterList[j+1]["event"]];
			linkCountMap[curAndNextTuple]+=1;
		}
	}	
	for(var i=0;i<linksList.length;i++){
		nodeCountMap[linksList[i][0]] += linkCountMap[linksList[i]]
	}	
	//console.log(nodeCountMap)
	//if (!(sourceTargetPair in Object.keys(sourceTargetDict)))
	var markovLinks = [];
	for(var i=0;i<linksList.length;i++){
		var curTuple = [linksList[i][0],linksList[i][1]];
		var outGoingCount = nodeCountMap[curTuple[0]];
		var linkCount = linkCountMap[curTuple];
		var curProbability = parseFloat(linkCount/outGoingCount);
		if(curProbability>0){
			markovLinks.push({"source":nodeList.indexOf(curTuple[0]),"target":nodeList.indexOf(curTuple[1]),"probability":""+curProbability})		
		}
	}
	//console.log(links);
	var markovNodes = [];
	var startX = 30;
	for(var i=0;i<nodeList.length;i++){
		markovNodes.push({"name":nodeList[i],"count":nodeCountMap[nodeList[i]],"x":startX,"y":250,"fixed":true});
		startX+=200;
	} 
	//console.log(typeof(markovNodes),typeof(markovLinks))
	drawMarkov(markovNodes,markovLinks,nodeList,2);

	d3.select("#bubbleChart").selectAll("svg").remove();
	d3.select('#barlabtest').selectAll('svg').remove();
	d3.select('#bardrugs').selectAll('svg').remove();
	d3.select('#visittypedougnut').selectAll('svg').remove();
	d3.select('#visithistogram').selectAll('svg').remove();
	$(".selected-bubble").html("<h3>Selected Condition: <span style='color:#029eca'>" + "---" + "</span></h3>");
	$("#patients-in-condition-cohort").html("");	
	$(".visittypesheading").remove();
	activeCondition = " ";
	filterByCondition(activeCondition)
	//console.log(filteredEncounterData.length)
	//BUBBLE CHART FUNCTION CALL HERE
	//drawBubbleChart(); //use the filteredEncounterData variable - it is global
	bubbleChart(filteredEncounterData);
	//draw_charts_all();	
}

function filterByCondition(condition){
	drawProviderLabCountDetailsDonut([]);
	drawProviderConsultationCountDetailsDonut([]);
	drawProviderMedicationCountDetailsDonut([]);
	$("#providerlabdetailsname").html("<span style='color:#029eca'></span>");
	$("#providerconsultationdetailsname").html("<span style='color:#029eca'></span>");
	$("#providermedicationdetailsname").html("<span style='color:#029eca'></span>");
	//bar charts :
	filteredEncounterDataByCondition = [];
	filteredMemberDataByCondition = [];
	for(var i=0;i<filteredEncounterData.length;i++){
		var currentCondition = filteredEncounterData[i]['condition'];
		if(currentCondition==condition){
			filteredEncounterDataByCondition.push(filteredEncounterData[i]);
		}
	}
	if(condition==" "){
		$(".selected-bubble").html("<h3>Selected Condition: <span style='color:#029eca'>" + "---" + "</span></h3>");		
	}else{
		$(".selected-bubble").html("<h3>Selected Condition: <span style='color:#029eca'>" + condition + "</span></h3>");
	}
	var labtestarray = [{"values":[]}];
	var allLabTestNames = [];
	var drugPrescribedArray = [{"values":[]}];
	var allDrugNames = [];
	for(var i=0;i<filteredEncounterDataByCondition.length;i++){
		if(filteredEncounterDataByCondition[i]["labTest"]!=""){
			//console.log(filteredEncounterDataByCondition[i])
			try {
				//console.log(allLabTestNames)
			    if(objectExistisInList(filteredEncounterDataByCondition[i]["labTest"],allLabTestNames)!=1){
					allLabTestNames.push(filteredEncounterDataByCondition[i]["labTest"]);
				}
			}
			catch(err) {
			    console.log(err.message);
			}			
		}
		if(filteredEncounterDataByCondition[i]["drugPrescribed"]!=""){
			//console.log(filteredEncounterDataByCondition[i])
			try {
				//console.log(allLabTestNames)
			    if(objectExistisInList(filteredEncounterDataByCondition[i]["drugPrescribed"],allDrugNames)!=1){
					allDrugNames.push(filteredEncounterDataByCondition[i]["drugPrescribed"]);
				}
			}
			catch(err) {
			    console.log(err.message);
			}			
		}
	}
	var labTestCountMap = {};
	for(var i =0 ;i<allLabTestNames.length;i++){
		labTestCountMap[allLabTestNames[i]] = 0;
	}
	var drugCountMap = {};
	for(var i =0 ;i<allDrugNames.length;i++){
		drugCountMap[allDrugNames[i]] = 0;
	}

	for(var i=0;i<filteredEncounterDataByCondition.length;i++){
		try {
			labTestCountMap[filteredEncounterDataByCondition[i]["labTest"]]+=1;
			drugCountMap[filteredEncounterDataByCondition[i]["drugPrescribed"]]+=1;
		}
		catch(err) {
		    console.log(err.message);
		}		
	}

	for(var i=0;i<allLabTestNames.length;i++){
		labtestarray[0]["values"].push({"label":allLabTestNames[i],"value":labTestCountMap[allLabTestNames[i]]});
	}
	for(var i=0;i<allDrugNames.length;i++){
		drugPrescribedArray[0]["values"].push({"label":allDrugNames[i],"value":drugCountMap[allDrugNames[i]]});
	}
	//console.log(labtestarray)
	//draw_charts_all();
	labtestarray[0]["values"].sort(function(a, b) {
    return b.value - a.value;
	});
	drugPrescribedArray[0]["values"].sort(function(a, b) {
    return b.value - a.value;
	});

	drawLabTestBar(clone(labtestarray));
	drawDrugsBar(clone(drugPrescribedArray));
	

	// condition-cohort patient counts:
	var count = 0;
	//console.log(filteredChronologicalVisData.length)
	for(var i=0;i<filteredChronologicalVisData.length;i++){
		var curPatientEncounterList = filteredChronologicalVisData[i]["encounterList"];
		for(var j=0;j<curPatientEncounterList.length;j++){
			if(curPatientEncounterList[j]["complain"]==condition){
				count += 1;
				break;
			}
		}		
	}
	$(".patients-in-condition-cohort").html("<h3>Number of patients: <span style='color:#029eca'>" + count + "</span></h3>");
	
	//histogram code:
	var filteredPatientEncounterList = [];
	for(var i=0;i<filteredChronologicalVisData.length;i++){
		filteredPatientEncounterList = [];
		var currentEncounterList = filteredChronologicalVisData[i]['encounterList'];
		for(var j=0; j<currentEncounterList.length; j++){
			if(currentEncounterList[j]['complain']==condition){
				//console.log("1:"+currentEncounterList[j]['complain'])
				//console.log(condition)
				filteredPatientEncounterList.push(currentEncounterList[j])
			}
		}
		//console.log(currentEncounterList)
		//var temp = filteredChronologicalVisData[i];
		var temp = JSON.parse(JSON.stringify(filteredChronologicalVisData[i]));
		temp['encounterList'] = filteredPatientEncounterList;
		temp['encounterCount'] = temp['encounterList'].length;
		//console.log(temp)
		filteredMemberDataByCondition.push(temp);
	}
	//generate_histogram("#visithistogram");
	//console.log(filteredMemberDataByCondition.length)
	//console.log(filteredMemberDataByCondition)


	// donut chart code:
	var mapForDonut = {};	
	var coveredVisitTypes = [];
	for(var i=0;i<filteredEncounterDataByCondition.length;i++){
		if(objectExistisInList(filteredEncounterDataByCondition[i]['visit_type'],coveredVisitTypes)==0){
			if(filteredEncounterDataByCondition[i]['condition']==condition){
				mapForDonut[filteredEncounterDataByCondition[i]['visit_type']] = 0;
				coveredVisitTypes.push(filteredEncounterDataByCondition[i]['visit_type']);
			}
		}
	}
	//console.log(mapForDonut)
	var mapLabels = Object.keys(mapForDonut);
	for(var i=0;i<filteredEncounterDataByCondition.length;i++){
		var currentVisitType = filteredEncounterDataByCondition[i]['visit_type'];
		if(objectExistisInList(currentVisitType,mapLabels)==1){
			mapForDonut[currentVisitType]+=1;
		}
	}
	var formattedOutputForDonut = [];
	
	for(var i=0;i<mapLabels.length;i++){
		formattedOutputForDonut.push({"label":mapLabels[i],"value":mapForDonut[mapLabels[i]]});
	}
	//console.log(mapForDonut)
	//drawDonutChart(mapForDonut);
	drawVisitTypeDonut(clone(formattedOutputForDonut));
	

	//provider lab counts
	var allProviders = [];
	var formattedProviderLabCountMap = [{"values":[]}];
	for(var i=0;i<filteredEncounterDataByCondition.length;i++){
		if(objectExistisInList(filteredEncounterDataByCondition[i]["providerId"],allProviders)!=1){
			allProviders.push(filteredEncounterDataByCondition[i]["providerId"]);
		}
	}	

	var providerLabCountMap = {};
	for(var i=0;i<allProviders.length;i++){
		providerLabCountMap[allProviders[i]] = 0;
	}
	for(var i=0;i<filteredEncounterDataByCondition.length;i++){
		if(filteredEncounterDataByCondition[i]["labTest"]!=""){
			providerLabCountMap[filteredEncounterDataByCondition[i]["providerId"]]+=1;
		}
	}

	for(var i=0;i<allProviders.length;i++){
		if(providerLabCountMap[allProviders[i]]!=0){
			formattedProviderLabCountMap[0]["values"].push({"label":allProviders[i],"value":providerLabCountMap[allProviders[i]]});
		}
	}
	formattedProviderLabCountMap[0]["values"].sort(function(a, b) {
    return b.value - a.value;
	});

	drawProviderLabTestCountMap(clone(formattedProviderLabCountMap))

	// provider consult counts
	var formattedProviderConsultCountMap = [{"values":[]}];
	var providerConsultCountMap = {};
	for(var i=0;i<allProviders.length;i++){
		providerConsultCountMap[allProviders[i]] = 0;
	}
	for(var i=0;i<filteredEncounterDataByCondition.length;i++){
		if(filteredEncounterDataByCondition[i]["consultOrdered"]!=""){
			providerConsultCountMap[filteredEncounterDataByCondition[i]["providerId"]]+=1;
		}
	}
	for(var i=0;i<allProviders.length;i++){
		if(providerConsultCountMap[allProviders[i]]!=0){
			formattedProviderConsultCountMap[0]["values"].push({"label":allProviders[i],"value":providerConsultCountMap[allProviders[i]]});
		}
	}
	formattedProviderConsultCountMap[0]["values"].sort(function(a, b) {
    return b.value - a.value;
	});

	drawProviderConsultCountMap(clone(formattedProviderConsultCountMap))


	//provider medication counts
	var formattedProviderMedicationCountMap = [{"values":[]}];
	var providerMedicationCountMap = {};
	for(var i=0;i<allProviders.length;i++){
		providerMedicationCountMap[allProviders[i]] = 0;
	}
	for(var i=0;i<filteredEncounterDataByCondition.length;i++){
		if(filteredEncounterDataByCondition[i]["drugPrescribed"]!=""){
			providerMedicationCountMap[filteredEncounterDataByCondition[i]["providerId"]]+=1;
		}
	}
	for(var i=0;i<allProviders.length;i++){
		if(providerMedicationCountMap[allProviders[i]]!=0){
			formattedProviderMedicationCountMap[0]["values"].push({"label":allProviders[i],"value":providerMedicationCountMap[allProviders[i]]});
		}
	}
	formattedProviderMedicationCountMap[0]["values"].sort(function(a, b) {
    return b.value - a.value;
	});
	drawProviderMedicationCountMap(clone(formattedProviderMedicationCountMap))




	//
	var filteredPatientEncounterList = [];
	for(var i=0;i<filteredChronologicalVisData.length;i++){
		var curPatient = filteredChronologicalVisData[i]["memberId"];
		var currentEncounterList = filteredChronologicalVisData[i]["encounterList"];
		var listToAdd = [];
		for(var j=0;j<currentEncounterList.length;j++){
			if(currentEncounterList[j]["complain"]==condition){
				console.log(currentEncounterList[j]["complain"])
				listToAdd.push(currentEncounterList[j])
			}
		}
		console.log(listToAdd)
		filteredPatientEncounterList.push({"memberId":curPatient,"encounterList":clone(listToAdd)});
	}
	//console.log(filteredPatientEncounterList);

	var nodeList = [];
	for(var i=0;i<filteredPatientEncounterList.length;i++){
		for(var j=0;j<filteredPatientEncounterList[i]["encounterList"].length;j++){
			if(objectExistisInList(filteredPatientEncounterList[i]["encounterList"][j]["event"],nodeList)==0){
				nodeList.push(filteredPatientEncounterList[i]["encounterList"][j]["event"])
			}
		}
	}
	//console.log(nodeList)
	var nodeCountMap = {};
	for(var i=0;i<nodeList.length;i++){
		nodeCountMap[nodeList[i]] = 0;
	}
	/*
	for(var i=0;i<filteredPatientEncounterList.length;i++){
		for(var j=0;j<filteredPatientEncounterList[i]["encounterList"].length;j++){
			nodeCountMap[filteredPatientEncounterList[i]["encounterList"][j]["event"]]+=1
		}
	}*/
	//console.log(getCombinations(nodeList))
	var linksList = getCombinations(nodeList);
	var linkCountMap = {};
	for(var i=0;i<linksList.length;i++){
		linkCountMap[linksList[i]] = 0;
	}
	//console.log(linkMap)
	for(var i=0;i<filteredPatientEncounterList.length;i++){//for each patient
		var currentEncounterList = filteredPatientEncounterList[i]["encounterList"];
		for(var j=0;j<currentEncounterList.length-1;j++){
			var curAndNextTuple = [currentEncounterList[j]["event"],currentEncounterList[j+1]["event"]];
			linkCountMap[curAndNextTuple]+=1;
		}
	}
	for(var i=0;i<linksList.length;i++){
		nodeCountMap[linksList[i][0]] += linkCountMap[linksList[i]]
	}	
	//console.log(nodeCountMap)
	//console.log(linkCountMap)
	//if (!(sourceTargetPair in Object.keys(sourceTargetDict)))
	var markovLinks = [];
	for(var i=0;i<linksList.length;i++){
		var curTuple = [linksList[i][0],linksList[i][1]];
		var outGoingCount = nodeCountMap[curTuple[0]];
		var linkCount = linkCountMap[curTuple];
		var curProbability = parseFloat(linkCount/outGoingCount);
		if(curProbability>0){
			markovLinks.push({"source":nodeList.indexOf(curTuple[0]),"target":nodeList.indexOf(curTuple[1]),"probability":""+curProbability})		
		}
	}
	//console.log(links);
	var markovNodes = [];
	var startX = 30;
	for(var i=0;i<nodeList.length;i++){
		markovNodes.push({"name":nodeList[i],"count":nodeCountMap[nodeList[i]],"x":startX,"y":100,"fixed":true});
		startX+=200;
	} 
	//console.log(typeof(markovNodes),typeof(markovLinks))
	drawMarkov(markovNodes,markovLinks,nodeList,1);
}