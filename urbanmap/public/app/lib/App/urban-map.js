
/*
 * @include App/main-layout.js
 */

Ext.namespace("UrbanMap");

(function() {

    // global settings
    OpenLayers.ImgPath = "lib/openlayers/img/";
    OpenLayers.ProxyHost = UrbanMap.config.proxy_url;
    Ext.QuickTips.init();

    // run App.layout.init() when the page
    // is ready
    Ext.onReady(function() {
    	
    	UrbanMap.layout.init();
    	         
    });
})();

 