"""Routes configuration

The more specific and detailed routes should be defined first so they
may take precedent over the more generic routes. For more information
refer to the routes manual at http://routes.groovie.org/docs/
"""
from routes import Mapper

def make_map(config):
    """Create, configure and return the routes Mapper"""
    map = Mapper(directory=config['pylons.paths']['controllers'],
                 always_scan=config['debug'])
    map.minimization = False
    map.explicit = False
    
    map.connect("/parcelles/count", controller="parcelles", action="count")
    map.resource("parcelle", "parcelles")
    
    map.connect("/mapcapas/count", controller="mapcapas", action="count")
    map.resource("mapcapa", "mapcapas")
    
    map.resource('urban', 'urbans')
    map.resource('personne', 'personnes')

    
    
    # The ErrorController route (handles 404/500 error pages); it should
    # likely stay at the top, ensuring it can always be resolved
    map.connect('/error/{action}', controller='error')
    map.connect('/error/{action}/{id}', controller='error')

    # CUSTOM ROUTES HERE

    from mapfish.controllers import printer
    printer.addRoutes(map, '/print/', 'printer')
    
    
    map.connect('/{controller}/{action}')
    map.connect('/{controller}/{action}/{id}')

    return map
