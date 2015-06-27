#!/usr/bin/env python

from google.appengine.ext.webapp import template
from google.appengine.ext.webapp.util import run_wsgi_app
from google.appengine.ext import ndb
from google.appengine.ext import db

import os
import logging
import urllib
import webapp2

import datetime
import time

key = 1029384756

def set_record():
  return ndb.Key('Global Records', key)


class Record(ndb.Model):
  score = ndb.IntegerProperty(default=0)
  num_answered = ndb.IntegerProperty(default=0)
  sname = ndb.StringProperty(default='Anonymous')
  nname = ndb.StringProperty(default='Anonymous')
  #stime = ndb.DateTimeProperty(default=datetime.datetime.now())
  #ntime = ndb.DateTimeProperty(default=datetime.datetime.now())
  stime = ndb.DateTimeProperty(default=datetime.datetime(1, 1, 1, 0, 0))
  ntime = ndb.DateTimeProperty(default=datetime.datetime(1, 1, 1, 0, 0))

  @classmethod
  def get_records(self):
    return self.query(ancestor=set_record())


class RecordHistory(ndb.Model):
  score = ndb.StringProperty(repeated=True) #it is not an array
  num_answered = ndb.StringProperty(repeated=True)

  @classmethod
  def get_record_history(self):
    return self.query(ancestor=set_record())

#Record.get_records().fetch(1)[0].key.delete()
#RecordHistory.get_record_history().fetch(1)[0].key.delete()

if Record.get_records().fetch(1) == []:
  set_score = Record(parent=set_record())
  set_score.put()
if RecordHistory.get_record_history().fetch(1) == []:
  set_score2 = RecordHistory(parent=set_record())
  set_score2.put()

class MainHandler(webapp2.RequestHandler):
  def get(self):
     path = os.path.join(os.path.dirname(__file__), 'trendquiz.html')
     self.response.headers.add_header("Access-Control-Allow-Origin", "*")
     self.response.out.write(template.render(path, {}))

def unix_time(dt):
    epoch = datetime.datetime.utcfromtimestamp(0)
    delta = dt - epoch
    return delta.total_seconds()

def unix_time_millis(dt):
    if dt == None:
      return 0
    return unix_time(dt) * 1000.0

class SetRecord(webapp2.RequestHandler):
  def post(self):
    score = -1
    num_answered = -1
    try:
      score = int(self.request.get('score'))
    except ValueError:
      pass
    try:
      num_answered = int(self.request.get('num_answered'))
    except ValueError:
      pass
    sname = self.request.get('sname')
    nname = self.request.get('nname')
    logging.info(score)
    logging.info(num_answered)
    logging.info(sname)
    logging.info(nname)
    if sname == '':
      sname = 'Anonymous'
    if nname == '':
      nname = 'Anonymous'

    records_obj = Record.get_records().fetch(1)[0]
    logging.info(records_obj)
    record_history = RecordHistory.get_record_history().fetch(1)[0]

    if score != None and score < 9999999 and score >= 0: #is anyone ever going to get 9,999,999 that's >10k questions in a row
      records_obj.score = score
      records_obj.sname = sname
      records_obj.stime = datetime.datetime.now()
      record_history.score.append(str(score) + ': ' + sname + ': ' + datetime.datetime.now().strftime('%B %d, %Y %I:%M:00'))
    if num_answered != None and num_answered < 3000 and num_answered >= 0: #are we ever gonna get 3k topics
      records_obj.num_answered = num_answered
      records_obj.nname = nname
      records_obj.ntime = datetime.datetime.now()
      record_history.num_answered.append(str(num_answered) + ': ' + nname + ': ' + datetime.datetime.now().strftime('%B %d, %Y %I:%M:00'))
    record_history.put()
    records_obj.put()
    logging.info(records_obj)

class ControlPanel(webapp2.RequestHandler):
  def get(self):
    self.response.write(
    """
<form method="post" action="/setrecord">
  score:
  <input type="text" name="score" value=0><br>
  score name:
  <input type="text" name="sname" value="Anonymous"><br>
  <button type="submit">reset score</button>
</form>
<br><br><br>
<form method="post" action="/setrecord">
  num_answered:
  <input type="text" name="num_answered" value=0><br>
  num_answered name:
  <input type="text" name="nname" value="Anonymous"><br>
  <button type="submit">reset num answered</button>
</form>
"""
    )

class GetRecordHistory(webapp2.RequestHandler):
  def get(self):
    record_history = RecordHistory.get_record_history().fetch(1)[0]
    self.response.headers.add_header("Access-Control-Allow-Origin", "*")
    score = 'SCORE: <br>'
    num_answered = 'ANSWERED: <br>'
    for s in record_history.score:
        score += s + '<br>' 
    score += '<br>'
    for s in record_history.num_answered:
        num_answered += s + '<br>' 
    self.response.write(score + num_answered)


class GetRecords(webapp2.RequestHandler):
  def get(self):
    records_obj = Record.get_records().fetch(1)[0]
    logging.info(records_obj)
    self.response.headers.add_header("Access-Control-Allow-Origin", "*")
    self.response.write(
    """{
      "score" : ["%s", %s, %s],
      "num_answered" : ["%s", %s, %s]
}""" %(records_obj.sname, records_obj.score, unix_time_millis(records_obj.stime),
       records_obj.nname, records_obj.num_answered, unix_time_millis(records_obj.ntime))
    )


class Legacy(webapp2.RequestHandler):
  def get(self):
    self.redirect('legacy/index.html')
    #path = os.path.join(os.path.dirname(__file__), 'legacy\index.html')
    #self.response.out.write(template.render(path, {}))


class Donate(webapp2.RequestHandler):
  def options(self):      
      self.response.headers['Access-Control-Allow-Origin'] = '*'
      self.response.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept'
      self.response.headers['Access-Control-Allow-Methods'] = 'POST, GET, PUT, DELETE'
    
  def get(self):
        self.redirect("http://ebcmsoftware.com/donate")


app = webapp2.WSGIApplication([
    ('/', MainHandler),
    ('/trendquiz', MainHandler),
    ('/trendquiz.html', MainHandler),
    ('/legacy', Legacy),
    ('/donate', Donate),
    ('/hbs', ControlPanel),
    ('/getrecordjson', GetRecords),
    ('/getrecordhistory', GetRecordHistory),
    ('/setrecord', SetRecord)
], debug=True)

def main():
  run_wsgi_app(app)

if __name__ == "__main__":
  main()
