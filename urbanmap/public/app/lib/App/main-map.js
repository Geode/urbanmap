
/*
 * @include App/main-layout.js
 */

Ext.namespace("UrbanMap");

(function() {

    // global settings
    
    // Override print url for opengeode production       	
    //printCapabilities.printURL = "http://urbanmap.opengeode.be/print/print.pdf?id=None";
    //printCapabilities.createURL = "http://urbanmap.opengeode.be/print/create.json?id=None";
    	
    OpenLayers.ImgPath = "lib/openlayers/img/";
    OpenLayers.ProxyHost = UrbanMap.config.proxy_url;

    //ExtJS QuickTips enable
    Ext.QuickTips.init();

    // run App.layout.init() when the page
    // is ready
    Ext.onReady(function() {
    	
    	UrbanMap.layout.init();
    	
        var hideMask = function () {
            Ext.get('loading').remove();
            Ext.fly('loading-mask').fadeOut({
                remove:true
            });
        };

        hideMask.defer(250);
    });
})();
