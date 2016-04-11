import logging
import simplejson


from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect
from pylons import config

from urbanmap.lib.base import BaseController, render

log = logging.getLogger(__name__)

class ConfigController(BaseController):

    def index(self):
        # Return a rendered template
        #return render('/config.mako')
        # or, return a string
        import pylons
        config = pylons.config
        urbanmap_url = "http://89.16.179.114:5000"

        try:
            urbanmap_url = config.get('urbanmap_url',urbanmap_url)
        except:
            log.info("urbanmap_url not set in configuration, taking default %s" % urbanmap_url)

        INS = '92088'
        try:
            INS =  config.get('INS',INS)
        except:
            log.info("INS is not set in the configuration, taking default %s" % INS)

        result_limit = '100'
        try:
            result_limit =  config.get('result_limit',result_limit)
        except:
            log.info("result_limit is not set in the configuration, taking default %s" % result_limit)

        buffer_width = '50'
        try:
            buffer_width =  config.get('buffer_width',buffer_width)
        except:
            log.info("buffer_width is not set in the configuration, taking default %s" % buffer_width)

        configdict = {}
        configdict['result_limit'] = result_limit
        configdict['buffer_result_limit'] = 500
        configdict['buffer_width'] = buffer_width
        configdict['layer_buffer'] = 'Buffer'
        configdict['proxy_url'] = '/proxy/get?url='
        configdict['urbanmap_url'] = urbanmap_url
        configdict['INS'] = INS
        config = {'config':configdict}
        resultString = "var UrbanMap = " + simplejson.dumps(config)
        return resultString
    def wmslist(self):
        import pylons
        config = pylons.config
        INS = '92088'
        try:
            INS =  config.get('INS')
        except:
            log.info("INS is not set in the configuration, taking default %s" % INS)
        result = {}
        result['servers'] = []
        result['servers'].append({"name": "Catalogue Geonode", "url":"https://geonode.imio.be/geoserver/wms&SERVICE=WMS&VERSION=1.1.1&REQUEST=getcapabilities"})
        result['servers'].append({"name": "Ortho","url":"http://geoservices.wallonie.be/arcgis/services/IMAGERIE/ORTHO_LAST/MapServer/WMSServer&request=GetCapabilities&service=WMS&VERSION=1.1.1"})
        result['servers'].append({"name": "PICC","url":"http://geoservices.wallonie.be/arcgis/services/TOPOGRAPHIE/PICC/MapServer/WMSServer&request=GetCapabilities&service=WMS&VERSION=1.1.1"})
        return simplejson.dumps(result)
