# rename CVE directories from <whatever>CVE-####-######<whatever> to CVE-####-######

from glob import glob
import os

contents = glob("./*")
for fileordir in contents:
    if(os.path.isdir(fileordir)):
        dirname = fileordir.split('./')[1]
        
        cve_index = dirname.index('CVE')

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
        