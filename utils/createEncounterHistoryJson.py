import json
import csv
import datetime

memberMap = {}

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
	memberMap[key]["encounterList"] = {}
	memberMap[key]["orderedEncounterList"] = []

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
		vaccine = line[2]
		if vaccine not in memberMap[line[1]]['immunization']:
			memberMap[line[1]]['immunization'].append(vaccine)
	skipFirst = 0

encounterFile = open("encounter_outpatient.csv")
encounterFileReader = csv.reader(encounterFile)

skipFirst = 1
for line in encounterFileReader:
	if skipFirst!=1:
		if line[2] in memberMap.keys():
			date_of_visit = str(line[5][:10])
			memberMap[line[2]]["encounterList"][date_of_visit] = line[14]
	skipFirst = 0

for key in memberMap.keys():
	d = memberMap[key]["encounterList"]
	sortedEncounterDates = sorted(d, key=lambda x: datetime.datetime.strptime(x, '%Y-%m-%d'))
	for date in sortedEncounterDates:
		memberMap[key]["orderedEncounterList"].append({"date":date,"event":memberMap[key]["encounterList"][date]})


for key in memberMap.keys():
	memberMap[key].pop("encounterList", None)

resList = []
for key in memberMap.keys():
	encounterList = memberMap[key]["orderedEncounterList"]
	age = memberMap[key]["age"]
	state = memberMap[key]["state"]
	job = memberMap[key]["job"]
	marriage_status = memberMap[key]["marriage_status"]
	immunizations = memberMap[key]["immunization"]
	gender = memberMap[key]["gender"]

	resList.append({"memberId":key,"encounterList":encounterList,"state":state,"job":job,"marriage_status":marriage_status,"immunizations":immunizations,"age":age,"gender":gender})

with open('encounterHistory.json', 'w') as outfile:
    json.dump(resList, outfile,indent=1)