import logging

from pylons.decorators import jsonify
from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

from urbanmap.model.meta import Session
from urbanmap.lib.base import BaseController, render
from urbanmap.model.personnes import Personne

from sqlalchemy.sql import and_

log = logging.getLogger(__name__)

class PersonnesController(BaseController):
    """REST Controller styled on the Atom Publishing Protocol"""
    # To properly map this controller, ensure your config/routing.py
    # file has a resource setup:
    #     map.resource('personne', 'personnes')
    def __before__(self):
        self.personne_q = Session.query(Personne)
            
    @jsonify
    def index(self, format='json'):
        """GET /personnes: All items in the collection"""
        # url('personnes')
        
        pe_f=request.params.get('pe',None)
        if pe_f != None:
            self.personne_q = self.personne_q.filter(Personne.pe.ilike(pe_f))
        
        adr_f=request.params.get('adr',None)
        if adr_f != None:
            self.personne_q = self.personne_q.filter(Personne.adr2.ilike(adr_f +'%'))
            
        zip_f=request.params.get('zip',None)
        if zip_f != None:
            self.personne_q = self.personne_q.filter(Personne.adr1.ilike(zip_f +'%'))
        
        objs = self.personne_q.all()

        res = { 'daalist' : [{'daa': o.daa }  for o in objs] }
        return res
        
    def create(self):
        """POST /personnes: Create a new item"""
        # url('personnes')

    def new(self, format='html'):
        """GET /personnes/new: Form to create a new item"""
        # url('new_personne')

    def update(self, id):
        """PUT /personnes/id: Update an existing item"""
        # Forms posted to this method should contain a hidden field:
        #    <input type="hidden" name="_method" value="PUT" />
        # Or using helpers:
        #    h.form(url('personne', id=ID),
        #           method='put')
        # url('personne', id=ID)

    def delete(self, id):
        """DELETE /personnes/id: Delete an existing item"""
        # Forms posted to this method should contain a hidden field:
        #    <input type="hidden" name="_method" value="DELETE" />
        # Or using helpers:
        #    h.form(url('personne', id=ID),
        #           method='delete')
        # url('personne', id=ID)

    def show(self, id, format='html'):
        """GET /personnes/id: Show a specific item"""
        # url('personne', id=ID)

    def edit(self, id, format='html'):
        """GET /personnes/id/edit: Form to edit an existing item"""
        # url('edit_personne', id=ID)
