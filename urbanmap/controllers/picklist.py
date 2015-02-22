import logging

from pylons import request
from pylons.decorators import jsonify
from urbanmap.lib.base import BaseController
from urbanmap.model.meta import Session

from sqlalchemy.sql import select 
from sqlalchemy.sql.expression import label
log = logging.getLogger(__name__)

class PicklistController(BaseController):

    @jsonify
    def get(self):
        table_name=request.params['table_name']
        value_field=request.params['value_field']
        display_field=request.params['display_field'] 
        
        if(display_field != value_field):
            s= select([value_field,display_field],from_obj=[table_name])
    
            results = [{
                'value_field': {True: "", False: t[value_field]}[t[value_field] == None],
                'display_field': {True: "", False: t[display_field]}[t[display_field] == None]
            } for t in Session.connection().execute(s).fetchall()]   
        else:
            s= select([value_field],from_obj=[table_name])
            results = [{
                'value_field': {True: "", False: t[value_field]}[t[value_field] == None],
                'display_field': {True: "", False: t[value_field]}[t[value_field] == None] 
            } for t in Session.connection().execute(s).fetchall()]                 
        
        return { 'results' : results, 'len' : len(results) }
