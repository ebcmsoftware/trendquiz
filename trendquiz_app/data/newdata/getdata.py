#USAGE: python getchartdata.py "argument 1" "thing 2" arg3 "another arg" "the final argument"
import sys
import os
import urllib
import urllib2

u = 'tuftswhistling'
p = 'horsebatterystaple'

try:
    args = sys.argv[2:]
except IndexError:
    print 'USAGE: python getchartdata.py <category> "argument 1" ["thing 2" arg3 "another arg" "the final argument"]'
    sys.exit()
if args == []:
    print 'USAGE: python getchartdata.py <category> "argument 1" ["thing 2" arg3 "another arg" "the final argument"]'
    sys.exit()
urlargs = map(lambda x:urllib.quote(x), args)
query = ','.join(urlargs).replace('%20', '+').replace(' ', '+')

category = sys.argv[1]

filename = category+'.js'
newfile = not os.path.exists(filename)
f = open(filename, 'a')

url = 'http://www.google.com/trends/fetchComponent?q='+query+'&cid=TIMESERIES_GRAPH_0&export=3'

###################################signing in################################################
service = 'trendspro'
url_service = 'https://www.google.com/trends/'
url_download = url_service + 'trendsReport?'

login_params = {}

url_login = 'https://accounts.google.com/ServiceLogin'
url_authenticate = 'https://accounts.google.com/accounts/ServiceLoginAuth' #iono what this is used for
header_dictionary = {}

from cookielib import Cookie, CookieJar

ck = Cookie(version=0, name='I4SUserLocale', value='en_US', port=None, port_specified=False, domain='www.google.com', domain_specified=False,domain_initial_dot=False, path='/trends', path_specified=True, secure=False, expires=None, discard=False, comment=None, comment_url=None, rest=None)
ck_pref = Cookie(version=0, name='PREF', value='', port=None, port_specified=False, domain='www.google.com', domain_specified=False,domain_initial_dot=False, path='/trends', path_specified=True, secure=False, expires=None, discard=False, comment=None, comment_url=None, rest=None) 

cj = CookieJar()                            
cj.set_cookie(ck)
cj.set_cookie(ck_pref)
opener = urllib2.build_opener(urllib2.HTTPCookieProcessor(cj))

login_params['Email'] = u
login_params['Passwd'] = p
login_params['continue'] = url_service
login_params['GALX'] = '52jcsZdZ6vA'
login_params['service'] = service
login_params['passive'] = 1209600
login_params['followup'] = url_service

params = urllib.urlencode(login_params)
r = opener.open(url_login, params)
#r = opener.open(url)

#headers = [('User-Agent', 'Mozilla/5.0 (Windows NT 6.1; WOW64; rv:12.0) Gecko/20100101 Firefox/12.0'),
#           ("Accept", "text/html"),
#           ("Accept-Encoding", "gzip, deflate"),
#           ("Connection", "keep-alive")]


#opener.addheaders = headers #<---------- FUCK THIS LINE
urllib2.install_opener(opener)
#############################################################################################

#import requests
#r = requests.post(url_login, data=login_params, cookies=cj)
#jsontext = requests.get(url, cookies=cj).text
jsontext = urllib2.urlopen(url).read() #uses urllib2.

#HASHTAG VALIDATION
try:
    jsontext = jsontext.split("setResponse(")[1]
except IndexError:
    print "quota limit exceeded :\ try again in like 100000 days"
    sys.exit()
jsontext = jsontext.split(");")[0]
jsontext = jsontext.replace('new Date(', '"')
jsontext = jsontext.replace(')', '"')

import json 
response = json.loads(jsontext)

cols = response['table']['cols']

rows = response['table']['rows']

names = cols[1:]
for i in range(len(names)):
    names[i] = names[i]['label']

num_queries = len(names)
import re
s = '_and_'.join(names)
varname = re.sub(r'[\W_]+', '_', s)
print varname
sys.exit()

display_name = ' and '.join(map(lambda x:x.title(), args))

output = ''

if newfile:
    output += 'var ' + category + ' = [];\n'

output += 'var ' + varname + " = new DataPoints('"+display_name+"',"
output += "["

for row in rows:
    if row['c'][i+1]['v'] != None:
        output += "['"
        output += str(row['c'][0]['f']) + "',"
        for i in range(num_queries):
            output += str(row['c'][i+1]['v']) + ','
        output = output[:-1]; #erase last comma
        output += '],';

output = output[:-1]; #erase last comma

output += "]);\n"
output += category + ".push("+varname+");\n"

verbose = False
if verbose:
    print output

f.write(output)
f.close()

