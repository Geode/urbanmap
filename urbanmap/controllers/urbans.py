import logging

from pylons import request, response, session, tmpl_context as c, url
from pylons.controllers.util import abort, redirect

from urbanmap.lib.base import BaseController, render

log = logging.getLogger(__name__)

class UrbansController(BaseController):
    """REST Controller styled on the Atom Publishing Protocol"""
    # To properly map this controller, ensure your config/routing.py
    # file has a resource setup:
    #     map.resource('urban', 'urbans')

    def index(self, format='html'):
        """GET /urbans: All items in the collection"""
        return render('/urban.mako')
        # url('urbans')

    def create(self):
        """POST /urbans: Create a new item"""
        # url('urbans')

    def new(self, format='html'):
        """GET /urbans/new: Form to create a new item"""
        # url('new_urban')

    def update(self, id):
        """PUT /urbans/id: Update an existing item"""
        # Forms posted to this method should contain a hidden field:
        #    <input type="hidden" name="_method" value="PUT" />
        # Or using helpers:
        #    h.form(url('urban', id=ID),
        #           method='put')
        # url('urban', id=ID)

    def delete(self, id):
        """DELETE /urbans/id: Delete an existing item"""
        # Forms posted to this method should contain a hidden field:
        #    <input type="hidden" name="_method" value="DELETE" />
        # Or using helpers:
        #    h.form(url('urban', id=ID),
        #           method='delete')
        # url('urban', id=ID)

    def show(self, id, format='html'):
        """GET /urbans/id: Show a specific item"""
        # url('urban', id=ID)

    def edit(self, id, format='html'):
        """GET /urbans/id/edit: Form to edit an existing item"""
        # url('edit_urban', id=ID)
