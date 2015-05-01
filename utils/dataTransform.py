"""
input: encounter_dx.csv , medication_orders.csv from the sample data 
output: encounters.json , descCounts.json , descAndMedCounts.json
"""
import csv
import json

encounterFile = open("encounter_dx.csv")
encounterReader = csv.reader(encounterFile)

resList = []
skipFirst = 1
descTypes = []
encounterIdDescMap = {}
# encounter json

for entry in encounterReader:
	if skipFirst!=1:
		encounterId = entry[5]
		encounterDesc = entry[3]
		encounterSev = entry[4]
		resList.append({"encounterId":encounterId,"encounterDesc":encounterDesc,"encounterSev":encounterSev})
		encounterIdDescMap[encounterId] = encounterDesc
		if encounterDesc not in descTypes:
			descTypes.append(encounterDesc)
	skipFirst = 0

with open('encounters.json', 'w') as outfile:
    json.dump(resList, outfile,indent=1)



#-------------------------

# event -> count json

with open('encounters.json') as data_file:    
    encounterData = json.load(data_file)

descTypesCountMap = {}
descMedicationMap = {}


for desc in descTypes:
	descTypesCountMap[desc] = 0
	descMedicationMap[desc] = []

for obj in encounterData:
	descTypesCountMap[obj['encounterDesc']] += 1

resList = []
for desc in descTypesCountMap.keys():
	resList.append({"event":desc,"count":descTypesCountMap[desc]})

with open('descCounts.json', 'w') as outfile:
    json.dump(resList, outfile,indent=1)

#-------------------------

medicationFile = open("medication_orders.csv")
medicationReader = csv.reader(medicationFile)

skipFirst = 1
for entry in medicationReader:
	if skipFirst!=1:
		drugName = entry[3]
		drugQuantity = float(entry[12])
		encounterId = entry[17]
		encounterDesc = encounterIdDescMap[encounterId]		
		descMedicationMap[encounterDesc].append({"drugName":drugName,"drugQuantity":int(drugQuantity)})
	skipFirst = 0

resList = []
for event in descMedicationMap.keys():
	drugMap = {}	
	medicationList = []
	for entry in descMedicationMap[event]:
		drugNameDrugQtyTuple = (entry['drugName'],entry['drugQuantity'])
		drugMap[drugNameDrugQtyTuple] = 0
	for entry in descMedicationMap[event]:
		drugNameDrugQtyTuple = (entry['drugName'],entry['drugQuantity'])
		drugMap[drugNameDrugQtyTuple]+= 1			
	
	for key in drugMap.keys():
		medicationList.append({"drugName":key[0],"drugQuantity":key[1],"count":drugMap[key]})
	
	resList.append({"event":event,"medicationList":medicationList})


with open('descAndMedCounts.json', 'w') as outfile:
    json.dump(resList, outfile,indent=1)