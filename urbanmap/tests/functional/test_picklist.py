from urbanmap.tests import *

class TestPicklistController(TestController):

    def test_index(self):
        response = self.app.get(url(controller='picklist', action='index'))
        # Test response...
