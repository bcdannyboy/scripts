# rename CVE directories from <whatever>CVE-####-######<whatever> to CVE-####-######

from glob import glob
import os

windows = false

if(windows):
    contents = glob(".\\*")
else:
    contents = glob("./*")
for fileordir in contents:
    if(os.path.isdir(fileordir)):
        if(windows):
            dirname = fileordir.split('.\\')[1]
        else:
            dirname = fileordir.split('./')[1]
            
        nocve = 0
        if('cve' in dirname):
            cve_index = dirname.index('cve')
        elif('CVE' in dirname)
            cve_index = dirname.index('cve')
        else:
            print("no cve in dirname...")
            nocve = 1

        
            
        
        if(not nocve):
            dirname = dirname[cve_index:]

            finalcve = dirname[:9]

            endofcve = dirname[9:]

            for char in endofcve:
                try:
                    charint = int(char)
                    finalcve = finalcve + char
                except: # break at non-number char
                    break
            
            os.rename(fileordir, './' + finalcve)
            
