from urbanmap.tests import *

class TestParcellesController(TestController):
    def test_index(self):
        response = self.app.get(url(controller='parcelles'))
        # Test response...
