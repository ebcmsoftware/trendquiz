import os
import sys
import time

filenames = sys.argv[1:]
files = []

if filenames != []:
    print "filenames:",
    print filenames

if filenames == []:
    for file in os.listdir("./"):
        if file.lower().endswith(".js"):
            if not file.lower().endswith("loaddata.js") and not file.lower().endswith("data2.js") and not file.lower().endswith("_old.js"):
                files.append(open(file, 'r'))
else:
    for filename in filenames:
        files.append(open(filename+'.js', 'r'))

for file in files:
    category = file.name.split('.js')[0]
    text = file.readlines()[1::2]
    os.system('cp ' + category + '.js ' + category+'_old.js')
    file = open(category+'.js', 'w')
    file.close()
    for item in text:
        america = not 'false)' in item
        try:
            term = item.split("'")[1]
        except IndexError: #if blank line
            continue
        print category + ' - ' + term
        if america:
            os.system("python getdata.py " + category + ' "' + term + '" --exact')
        else:
            os.system("python getdata.py " + category + ' "' + term + '" --exact --international')
        time.sleep(5) #goggle pls dont h8 me
    print 
    print 
    print 

