from pylons import request, response, session, tmpl_context as c
from pylons.controllers.util import abort, redirect

from urbanmap.lib.base import BaseController
from urbanmap.model.mapcapas import Mapcapa
from urbanmap.model.meta import Session

from mapfish.protocol import Protocol, create_default_filter
from mapfish.decorators import geojsonify

from geoalchemy import functions
from shapely.wkb import loads as wkbloads
from geojson import dumps

class MapcapasController(BaseController):
    readonly = True # if set to True, only GET is supported

    def __init__(self):
        self.protocol = Protocol(Session, Mapcapa, self.readonly)

    @geojsonify
    def index(self, format='json'):
        """GET /: return all features."""
        # If no filter argument is passed to the protocol index method
        # then the default MapFish filter is used.
        #
        # If you need your own filter with application-specific params 
        # taken into acount, create your own filter and pass it to the
        # protocol read method.
        #
        # E.g.
        #
        # from sqlalchemy.sql import and_
        #
        # default_filter = create_default_filter(request, Mapcapa)
        # filter = and_(default_filter, Mapcapa.columname.ilike('%value%'))
        # return self.protocol.read(request, filter=filter)
        if format != 'json':
            abort(404)
        return self.protocol.read(request)

    @geojsonify
    def show(self, id, format='json'):
        """GET /id: Show a specific feature."""
        if format != 'json':
            abort(404)
        return self.protocol.read(request, response, id=id)

    def getCSV(self):        
        results = self.protocol.read(request)
        csv = ''
        sep = ';'
        textdelimiter = '"'
        
        for key in results.features[0].properties.keys():
            csv += textdelimiter + str(key) + textdelimiter + sep
        csv += "\r\n"

        for feature in results.features: 
            c = []
            for value in feature.properties.values():
                if value is not None:
                    if isinstance(value,unicode):
                        c.append(textdelimiter+ value +textdelimiter)
                    else:
                        c.append(textdelimiter+ str(value) +textdelimiter)
                else:
                    c.append(textdelimiter+' '+textdelimiter)
            csv += sep.join(c)
            csv += "\r\n"
        response.headers['content-type'] = 'text/csv; charset=utf8'
        response.headers['content-disposition'] = 'attachement;filename=results.csv'        
        return csv
  
    
    def buffer(self, id):
        id=request.params['capakey']
        width=request.params['width']
        buffer_geom = Session.query(
            functions.wkb(Mapcapa.the_geom.buffer(width))).filter(Mapcapa.capakey==id).first()
        if buffer_geom is None:
            abort(404)
        geometry = wkbloads(str(buffer_geom[0]))
        response.content_type = 'application/json'
        return dumps(geometry)

    @geojsonify
    def create(self):
        """POST /: Create a new feature."""
        return self.protocol.create(request, response)

    @geojsonify
    def update(self, id):
        """PUT /id: Update an existing feature."""
        return self.protocol.update(request, response, id)

    def delete(self, id):
        """DELETE /id: Delete an existing feature."""
        return self.protocol.delete(request, response, id)

    def count(self):
        """GET /count: Count all features."""
        return self.protocol.count(request)
