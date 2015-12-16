
Ext.namespace("UrbanMap");

UrbanMap.WMCReader = (function() {
    /*
     * Private
     */

    /**
     * Property: wmcFormat
     * {OpenLayers.Format.WMC} The format to read/write WMC.
     */
    var wmcFormat = null;

    /**
     * Property: layerStore
     * {GeoExt.data.LayerStore} The application's layer store.
     */
    var layerStore = null;

    /**
     * Property: wmcReader
     * {GeoExt.data.WMCReader} The wmc reader.
     */
    var wmcReader = null;

    /**
     * Method: writeWmcContext
     * Writes a wmc context object given a layer store.
     *
     * Parameters:
     * ls - {GeoExt.data.LayerStore} The layer store.
     *
     * Returns:
     * {Object} A wmc context object.
     */
    var writeWmcContext = function(ls) {
        var map = ls.map;
        var context = {
            bounds: map.getExtent(),
            maxExtent: map.maxExtent,
            projection: map.projection,
            size: map.getSize(),
            layersContext: []
        };

        ls.each(function (record) {

            var layer = record.get('layer');
            if(layer instanceof OpenLayers.Layer.WMS) {

                var layerContext = wmcFormat.layerToContext(layer);
                var queryable = record.get('queryable');
                var styles = record.get('styles');
                var formats = record.get('formats');

                if (queryable !== undefined) {
                    layerContext.queryable = queryable;
                }

                if (styles !== undefined && styles.length > 0) {
                    // if the context style has its href property
                    // set, which means the layer has an SLD
                    // parameters, we don't empty the styles
                    // array because we don't want to loose
                    // that style
                    var layerContextStyles = layerContext.styles;
                    if (!layerContextStyles[0].href) {
                        layerContext.styles = [];
                    }
                    Ext.each(styles, function (item, index, all) {
                        var style = {};
                        Ext.apply(style, {current: false}, item);
                        if(layer.params.STYLES === style.name) {
                            style.current = true;
                        }
                        layerContext.styles.push(style);
                    });
                }

                if (formats !== undefined && formats.length > 0) {
                    layerContext.formats = [];
                    Ext.each(formats, function (item, index, all) {
                        var format = {};
                        var f = (item instanceof Object) ? item.value : item;
                        Ext.apply(format, {current: false}, {value: f});
                        if(layer.params.FORMAT == f) {
                            format.current = true;
                        }
                        layerContext.formats.push(format);
                    });
                }

                context.layersContext.push(layerContext);
            }
        });


        return context;
    };


    return {

        /**
         * APIMethod: init
         * Initialize this module
         *
         * Parameters:
         * ls - {GeoExt.data.LayerStore} The layer store instance.
         */
        init: function(ls) {
            layerStore = ls;
            wmcFormat = new OpenLayers.Format.WMC({
                //layerOptions: GEOB.ows.defaultLayerOptions
                // why should we apply default layer options and not use those provided by the WMC ?
            });
            wmcReader = new GeoExt.data.WMCReader(
                {format: wmcFormat},
                layerStore.recordType
            );
        },


        /**
	     * Method: updateStoreFromWMC
	     * Updates the app LayerStore from a given WMC
	     *
	     * Parameters:
	     * wmcUrl - {String} The WMC document URL.
	     * resetMap - {String} Specifies if resetMap must be passed to
	     *            the GEOB.wmc.read function.
	     * callback - {Function} Callback function to be called once the
	                  WMC is read.
	     */
	    updateStoreFromWMC : function(wmcUrl, resetMap, callback) {
	        OpenLayers.Request.GET({
	            url: wmcUrl,
	            success: function(response) {
	                try {
	                    UrbanMap.WMCReader.read(response.responseText, resetMap);
	                    if (callback) {
	                        callback();
	                    }
	                } catch(err) {
	                   console.log(err);
	                   console.log("Erreur");
	                }
	            }
	        });
	    },
        /*
         * APIMethod: write
         * Write a wmc string given the layer store.
         *
         * Parameters:
         * options - {Object} Optionnal object to pass to wmc format write method
         *
         * Returns:
         * {String} The WMC string.
         */
        write: function(options) {
            var context = writeWmcContext(layerStore);
            return wmcFormat.write(context, options);
        },

        /*
         * APIMethod: read
         * Restore the layer store from a wmc string.
         *
         * Parameters:
         * wmcString - {String} The WMC string describing the context to restore.
         * resetMap - {Boolean} Specifies if the map and the fake base layer must
                      be reset.
         */
        read: function(wmcString, resetMap) {
            var map = layerStore.map;
            var newContext = wmcFormat.read(wmcString, {}); // get context from wmc
                                                         // using non-API feature

            if(map.getProjection() && (newContext.projection !== map.getProjection())) {
                // bounding box from wmc does not have the same projection system
                // as the current map
                /*
                GEOB.util.errorDialog({
                    msg: "Le fichier .wmc ne peut pas Ãªtre restaurÃ©. Son systÃ¨me de " +
                        "rÃ©fÃ©rence spatiale est diffÃ©rent de celui de la carte en cours."
                });
                * */
                alert("Le fichier .wmc ne peut pas Ãªtre restaurÃ©. Son systÃ¨me de " +
                        "rÃ©fÃ©rence spatiale est diffÃ©rent de celui de la carte en cours.");
                return;
            }

            // remove all current layers except the lowest index one
            // (our fake base layer)
            /*
            for (var i = map.layers.length -1; i >= 1; i--) {
                map.layers[i].destroy();
            }
            * */
            var maxExtent = newContext.maxExtent;
            if (resetMap === true && maxExtent) {
                map.setOptions({maxExtent: maxExtent});
                var fakeBaseLayer = map.layers[0];
                fakeBaseLayer.addOptions({maxExtent: maxExtent});
            }
            Ext.each(wmcReader.readRecords(newContext).records, function(r) {
                // restore metadataURLs in record
                var context = null;
                for (var i=0, l = newContext.layersContext.length; i<l; i++) {
                    if (newContext.layersContext[i]['name'] === r.get('name') &&
                        newContext.layersContext[i]['url'] === r.get('layer').url) {
                        context = newContext.layersContext[i];
                        break;
                    }
                }
                if (context && context.metadataURL) {
                    r.set("metadataURLs", [context.metadataURL]);
                }
                // add layer from wmc to the current map
                layerStore.addSorted(r);
            });

            // zoom to extent specified in the WMC doc
            map.zoomToExtent(newContext.bounds);
        }
    };
})();
