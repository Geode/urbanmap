from sqlalchemy import Column, types, Unicode

from geoalchemy import GeometryColumn, MultiPolygon

from mapfish.sqlalchemygeom import GeometryTableMixIn
from urbanmap.model.meta import Session, Base

class Mapcapa(Base, GeometryTableMixIn):
    __tablename__ = 'v_map_capa'
    __table_args__ = {
        "schema": 'public',
        "autoload": True,
        "autoload_with": Session.bind
    }
    the_geom = GeometryColumn(MultiPolygon(srid=31370))
    capakey = Column(Unicode(50),primary_key=True)
