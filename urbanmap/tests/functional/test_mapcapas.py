from urbanmap.tests import *

class TestMapcapasController(TestController):
    def test_index(self):
        response = self.app.get(url(controller='mapcapas'))
        # Test response...
