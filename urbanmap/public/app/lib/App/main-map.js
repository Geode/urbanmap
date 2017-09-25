
/*
 * @include App/main-layout.js
 */

Ext.namespace("UrbanMap");

(function() {

    // global settings
    var urbanMapHost = document.domain.replace("-urban.imio-app.be","-carto.imio-app.be");
    if(printCapabilities.createURL && printCapabilities.createURL.indexof("127.0.0.1") > 0) {
        var printUrl = printCapabilities.printURL.substring(22);
        var createUrl =printCapabilities.createURL.substring(22);
        printCapabilities.printURL = "https://" + urbanMapHost + printUrl;
        printCapabilities.createURL = "https://" + urbanMapHost + createUrl;
    }
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
