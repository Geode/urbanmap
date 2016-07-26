
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
    	var pageParameters = Ext.urlDecode(window.location.search.substring(1));
        var parcelles = pageParameters.idParcelle instanceof Array ? pageParameters.idParcelle : [pageParameters.idParcelle];
        var licences  = pageParameters.idPermis instanceof Array ? pageParameters.idPermis : [pageParameters.idPermis];
        var ins = pageParameters.ins;
        if(ins) {
            NISNum = ins;
        }
        if(parcelles) {
            urbanCapakeyArray = parcelles;
        }
        //TODO Do something with licences

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
