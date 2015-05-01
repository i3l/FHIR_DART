import json
import csv

encounterMap = {}
memberMap = {}

encounterFile = open("encounter_outpatient.csv")
encounterReader = csv.reader(encounterFile)

encounterDxFile = open("encounter_dx.csv")
encounterDxReader = csv.reader(encounterDxFile)

skipFirst = 1 
for line in encounterReader:
	if skipFirst!=1:
		encounterMap[line[1]] = {}
	skipFirst = 0

skipFirst = 1 
for line in encounterDxReader:
	if skipFirst!=1:
		if line[5] not in encounterMap.keys():
			encounterMap[line[5]] = {}
	skipFirst = 0


for key in encounterMap.keys():
	encounterMap[key]["visit_type"] = ""
	encounterMap[key]["visit_date"] = ""
	encounterMap[key]["memberId"] = ""
	encounterMap[key]["condition"] = ""
	encounterMap[key]["conditionType"] = ""
	encounterMap[key]["labTest"] = ""
	encounterMap[key]["drugPrescribed"] = ""


encounterFile = open("encounter_outpatient.csv")
encounterReader = csv.reader(encounterFile)

encounterDxFile = open("encounter_dx.csv")
encounterDxReader = csv.reader(encounterDxFile)

labTestFile = open("lab_results.csv")
labTestFileReader = csv.reader(labTestFile)

medicationFile = open("medication_orders.csv")
medicationFileReader = csv.reader(medicationFile)


skipFirst = 1 
for line in encounterReader:
	if skipFirst!=1:
		visit_type = line[14]
		visit_date = line[5][:10]
		memberId = line[2]		
		encounterMap[line[1]]["visit_type"] = visit_type
		encounterMap[line[1]]["visit_date"] = visit_date
		encounterMap[line[1]]["memberId"] = memberId		
	skipFirst = 0

skipFirst = 1 
for line in encounterDxReader:
	if skipFirst!=1:
		eventDesc = line[3]
		encounterMap[line[5]]["condition"] = eventDesc
		encounterMap[line[5]]["conditionType"] = ""
	skipFirst = 0

skipFirst = 1
for line in labTestFileReader:
	if skipFirst!=1:
		testName = line[7]
		if line[20] in encounterMap.keys():
			encounterMap[line[20]]["labTest"] = testName
	skipFirst = 0

skipFirst = 1
for line in medicationFileReader:
	if skipFirst!=1:
		drugName = line[3]
		if line[17] in encounterMap.keys():
			encounterMap[line[17]]["drugPrescribed"] = drugName
	skipFirst = 0


enrollmentFile = open("enrollment.csv")
enrollmentReader = csv.reader(enrollmentFile)

immunizationFile = open("immunization.csv")
immunizationReader = csv.reader(immunizationFile)

skipFirst = 1 
for line in enrollmentReader:
	if skipFirst!=1:
		memberMap[line[1]] = {}
	skipFirst = 0

skipFirst = 1 
for line in immunizationReader:
	if skipFirst!=1:
		if line[1] not in memberMap.keys():
			memberMap[line[1]] = {}
	skipFirst = 0

for key in memberMap.keys():
	memberMap[key]["gender"] = ""
	memberMap[key]["age"] = 0
	memberMap[key]["job"] = ""
	memberMap[key]["state"] = ""
	memberMap[key]["marriage_status"] = ""
	memberMap[key]["immunization"] = []

enrollmentFile = open("enrollment.csv")
enrollmentReader = csv.reader(enrollmentFile)

immunizationFile = open("immunization.csv")
immunizationReader = csv.reader(immunizationFile)

skipFirst = 1 
for line in enrollmentReader:	
	if skipFirst!=1:		
		gender = line[9]
		year_of_birth = line[8][-4:]
		age = 2015-int(year_of_birth)
		job = line[14]
		state = line[18]
		marriage_status = line[12]		
		memberMap[line[1]]["gender"] = gender
		memberMap[line[1]]["age"] = age
		memberMap[line[1]]["job"] = job
		memberMap[line[1]]["state"] = state
		memberMap[line[1]]["marriage_status"] = marriage_status				
	skipFirst = 0

immunizationFile = open("immunization.csv")
immunizationReader = csv.reader(immunizationFile)

skipFirst = 1 
for line in immunizationReader:
	if skipFirst!=1:
		if line[1] in memberMap.keys():
			vaccine = line[2]
			if vaccine not in memberMap[line[1]]['immunization']:
				memberMap[line[1]]['immunization'].append(vaccine)
	skipFirst = 0


"""
for key in memberMap.keys():
	print key,memberMap[key]
"""
resList = []
for eId in encounterMap.keys():
	condition = encounterMap[eId]["condition"]
	conditionType = encounterMap[eId]["conditionType"]
	encounterDate = encounterMap[eId]["visit_date"]
	visit_type = encounterMap[eId]["visit_type"]
	labTest = encounterMap[eId]["labTest"]
	drugPrescribed = encounterMap[eId]["drugPrescribed"]
	encounterMemberId = encounterMap[eId]["memberId"]	
	if encounterMemberId!="":			
		gender = memberMap[encounterMemberId]["gender"]
		age = memberMap[encounterMemberId]["age"]
		job = memberMap[encounterMemberId]["job"]
		state = memberMap[encounterMemberId]["state"]
		immunizations = memberMap[encounterMemberId]["immunization"]
		marriage_status = memberMap[encounterMemberId]["marriage_status"]

		resList.append({"condition":condition,"labTest":labTest,"drugPrescribed":drugPrescribed,"conditionType":conditionType,"visit_type":visit_type,"encounterDate":encounterDate,"gender":gender,"age":age,"job":job,"state":state,"marriage_status":marriage_status,"immunizations":immunizations})		

with open('encounters.json', 'w') as outfile:
    json.dump(resList, outfile,indent=1)