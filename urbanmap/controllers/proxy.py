import logging

import urllib2
import urllib
from urlparse import urlparse

from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort, redirect
from urbanmap.lib.base import BaseController

logger = logging.getLogger(__name__)

class ProxyController(BaseController):
    urlList = ["89.16.179.114:8008","89.16.179.114:5000","cartopro2.wallonie.be","localhost:5000","urbanmap.opengeode.be","geoserver.opengeode.be"]
    def get(self):
        try:
            url = request.params['url']
            infos = urlparse(url) 
            params = request.params
            logger.info((request.params))
            #import pdb;pdb.set_trace()
            #logger.info(url+"?%s" % urllib.urlencode(dict(request.params)))
            """
            try:
                self.urlList.index(infos.netloc)
            except ValueError:
                logger.error("Someone try to use not valid host for proxy : " +infos.netloc)
                abort(501)
            """
            pDict = dict(request.params)
            del pDict['url'];
            if '?' in url:
                logger.info('open url : '+url+"&%s" % urllib.urlencode(pDict))
                conn = urllib2.urlopen(url+"&%s" % urllib.urlencode(pDict))
            else:
                logger.info('open url : '+url+"?%s" % urllib.urlencode(pDict))
                conn = urllib2.urlopen(url+"?%s" % urllib.urlencode(pDict))
            return conn.read()
        except:
            abort(500)
    
        

   



