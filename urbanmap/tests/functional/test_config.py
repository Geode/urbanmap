from urbanmap.tests import *

class TestConfigController(TestController):

    def test_index(self):
        response = self.app.get(url(controller='config', action='index'))
        # Test response...
