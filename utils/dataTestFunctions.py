import csv
import json

data_file = open("../data/encounters.json","r")
data = json.load(data_file)
resList = []
for obj in data:
	if obj['condition']=="General medical examination":
		resList.append(obj["drugPrescribed"])

print resList
"""
resList = []
for obj in data:
	if obj['condition']!="":
		if obj['visit_type'] not in resList:
			resList.append(obj['visit_type'])

print resList
"""
"""
memberList = []
for obj in data:
	memberList.append(obj['memberId'])

print len(memberList)
print len(set(memberList))
"""