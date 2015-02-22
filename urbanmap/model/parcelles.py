from sqlalchemy import Column, types

from geoalchemy import GeometryColumn, MultiPolygon

from mapfish.sqlalchemygeom import GeometryTableMixIn
from urbanmap.model.meta import Session, Base

class Parcelle(Base, GeometryTableMixIn):
    __tablename__ = 'capa'
    __table_args__ = {
        "autoload": True,
        "autoload_with": Session.bind
    }
    the_geom = GeometryColumn(MultiPolygon(srid=31370))
