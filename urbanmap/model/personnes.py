from sqlalchemy import Column, types


from urbanmap.model.meta import Session, Base

class Personne(Base):
    __tablename__ = 'pe'
    __table_args__ = {
        "schema": 'public'
    }
    daa   = Column(types.Integer,  primary_key=True)
    pos   = Column(types.SMALLINT, primary_key=True)
    pe    = Column(types.Unicode(424))
    adr1 = Column(types.Unicode(60))
    adr2 = Column(types.Unicode(88))