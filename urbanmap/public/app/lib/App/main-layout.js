
/*
 * @include OpenLayers/Map.js
 * @include OpenLayers/Projection.js
 * @include OpenLayers/Layer/XYZ.js
 * @include OpenLayers/Tile/Image.js
 * @include OpenLayers/Control/Navigation.js
 * @include OpenLayers/Control/ZoomBox.js
 * @include OpenLayers/Control/NavigationHistory.js
 * @include GeoExt/data/LayerStore.js
 * @include GeoExt/widgets/Action.js
 * @include GeoExt/widgets/ZoomSlider.js
 * @include GeoExt/widgets/tips/ZoomSliderTip.js
 * @include GeoExt/widgets/tree/LayerContainer.js
 *
 * @include App/ClickControl.js
 * @include App/UrbanMap.MapPanel.js
 * @include App/UrbanMap.ParcelleGrid.js
 * @include App/UrbanMap.PrintForm.js
 * @include App/UrbanMap.SearchForm.js
 * @include App/UrbanMap.SearchForm.Parcelle.js
 * @include App/UrbanMap.SearchForm.Proprietaire.js
 */

Ext.namespace("UrbanMap");

UrbanMap.layout = (function() {
    /*
     * Private
     */

	var map = null;

    /**
     * Method: createMap
     * Create the map.
     *
     * Returns:
     * {OpenLayers.Map} The OpenLayers.Map instance.
     */
    var createMap = function() {
    	OpenLayers.DOTS_PER_INCH = 90.71428571428572;
        return new OpenLayers.Map({
            projection: new OpenLayers.Projection("EPSG:31370"),
            displayProjection: new OpenLayers.Projection("EPSG:31370"),
            units: "m",
            //numZoomLevels: 13,
            maxResolution: 200,
            resolutions: [280.0, 140.0, 28.0, 14.0, 7, 5.6, 2.8, 1.4, 0.7, 0.28, 0.21,0.14,0.07, 0.035],
            //resolutions: [42.711898437500054, 21.355949218750027, 10.677974609375013, 5.338987304687507, 2.6694936523437534, 1.3347468261718767, 0.6673734130859383, 0.33368670654296917, 0.16684335327148458, 0.08342167663574229, 0.041710838317871146, 0.020855419158935573],
            //maxExtent: new OpenLayers.Bounds(176643.072,130807.539,187577.318,141741.78500000003),
            maxExtent: new OpenLayers.Bounds(38000,20000,300000,190000),
            allOverlays: true,
            theme: null,
            controls: []
        });
    };

    /**
     * Method: createLayers
     * Create the layers.
     *
     * Returns:
     * {Array({OpenLayers.Layer}) Array of layers.
     */
    var createLayers = function() {
        return [
        ];
    };

    /**
     * Method: createLayerStore
     * Create a GeoExt layer store.
     *
     * Parameters:
     * map - {OpenLayers.Map} The Map instance.
     * layers - {Array({OpenLayers.Layer})} The layers to add to the store.
     *
     * Returns:
     * {GeoExt.data.LayerStore} The layer store.
     *
     */
    var createLayerStore = function() {

        var recordType = GeoExt.data.LayerRecord.create(
        	GEOB.ows.getRecordFields()
        );

        map = createMap();

        var ls = new LayerStore({
            map: map,
            sortInfo: {
                field: 'opaque',
                direction: 'DESC'
            },
            fields: recordType
        });

        var layer =  new OpenLayers.Layer("base_layer", {
            displayInLayerSwitcher: false,
            isBaseLayer: true
        });

        ls.add([new recordType({
            title: layer.name,
            layer: layer
        }, layer.id)]);

        map.addLayers(createLayers());

	    return ls;
    };

    /** api: constructor
     * A specific GeoExt.data.LayerStore.
     */
    var LayerStore = Ext.extend(GeoExt.data.LayerStore, {
        add: function(records) {
            records = filter(records);
            LayerStore.superclass.add.call(this, records);
        },
        insert: function(index, records) {
            records = filter(records);
            LayerStore.superclass.insert.call(this, index, records);
        }
    });

    /**
     * Method: filter
     * Filter the records and set "hideInLegend" in the records
     * when necessary (so the corresponding layers don't appear
     * in the legend panel).
     * Also modifies attribution field if necessary.
     * Generally speaking, handles every operation needed before
     * the records are added to the layerStore.
     *
     * Parameters:
     * records - {Array({GeoExt.data.LayerRecord})} The records.
     *
     * Returns:
     * {Array({GeoExt.data.LayerRecord})} The records that pass
     *     the filter.
     */
    var filter = function(records) {
        var errors = [], keep = [];

        Ext.each(records, function(r) {
        	//console.log('filtering layer r = '+r.data.name);
            var error = checkLayer(r);
            if (error) {
                // these are just warnings in fact, not errors
                // see http://csm-bretagne.fr/redmine/issues/1749
                errors.push(error);
            }

            // Note: queryable is required in addition to opaque,
            // because opaque is not a standard WMC feature
            // This enables us to remove rasters from legend panel
            if (r.get("opaque") === true || r.get("queryable") === false) {
                // this record is valid, set its "hideInLegend"
                // data field to true if the corresponding layer
                // is a raster layer, i.e. its "opaque" data
                // field is true
                r.set("hideInLegend", true);
                // we set opaque to true so that non queryable
                // layers are considered as baselayers
                r.set("opaque", true);
            }
            // Note that the ultimate solution would be to do a getCapabilities
            // request for each OGC server advertised in the WMC

            // Format attribution if required:
            var attr = r.get('attribution');
            var layer = r.get('layer');
            if (!attr || !attr.title) {
                var a;
                if (layer.url) {
                    var b = OpenLayers.Util.createUrlObject(layer.url);
                    if (b && b.host) {
                        a = b.host;
                    }
                }
                r.set('attribution', {
                    title: a || 'urbanmap'
                });
            }

            // set layer.metadataURL if record has metadataURLs
            // so that this can be saved in a WMC context
            if (r.get('metadataURLs') && r.get('metadataURLs')[0]) {
                layer.metadataURL = [r.get('metadataURLs')[0]];
            }

            // Errors should be non-blocking since http://csm-bretagne.fr/redmine/issues/1749
            // so we "keep" every layer, and only display a warning message
            keep.push(r);
        });

        if (errors.length > 0) {
            GEOB.util.infoDialog({
                title: 'Avertissement suite au chargement de couche',
                msg: errors.join('<br />')
            });
        }
        return keep;
    };

    /**
     * Method: checkLayer
     * Checks if the layer is valid (i.e. can be added to the LayerStore).
     * Doesn't return anything if the layer is valid, returns an error message
     *    if not.
     *
     * Returns:
     * {String} An error message.
     */
    var checkLayer = function(r) {
        var prefix = 'La couche <b>"' + r.get('title') + '"</b>' +
                     ' pourrait ne pas apparaître pour la raison suivante : ';

        var minScale = r.get('minScale');
        var maxScale = r.get('maxScale');

        // check if min and max scales are valid (i.e. positive)
        if ((minScale && minScale < 0) || (maxScale && maxScale < 0)) {
            return  prefix + OpenLayers.i18n('Les échelles min/max de visibilité sont invalides.');
        }

        // check if scales are in a valid range (compared to the map scales)
        if (map.baseLayer && (
            (minScale && minScale < map.baseLayer.maxScale) ||
            (maxScale && maxScale > map.baseLayer.minScale))) {
            return prefix + OpenLayers.i18n('La plage de visibilité ne correspond pas aux échelles de la carte.');
        }

        // check if layer extent and map extent match
        if (r.get('llbbox')) {
            var llbbox = r.get('llbbox');
            llbbox = new OpenLayers.Bounds(llbbox[0], llbbox[1], llbbox[2], llbbox[3]);

            var mapbbox = map.getMaxExtent().clone();
            mapbbox.transform(
                map.getProjectionObject(),
                new OpenLayers.Projection("EPSG:4326")
            );

            if (!llbbox.intersectsBounds(mapbbox)) {
                return prefix + "L'étendue géographique ne correspond pas à celle de la carte.";
            }
        }
    };


	var createParcelleVectorLayer = function(map) {

		var defaultStyle = new OpenLayers.Style();
		var selectStyle = new OpenLayers.Style();
		var defaultRule = new OpenLayers.Rule({
			name:'Parcelles'
			,symbolizer:{
				fillColor: "#66FF66",
			    fillOpacity: .35,
			    strokeColor: "black",
		        strokeWidth: 1,
		        strokeOpacity: 1
			}
		});
		var selectRule = new OpenLayers.Rule({
			name:'Parcelle sélectionnée'
			,symbolizer:{
				fillColor: "blue",
			    fillOpacity: .35,
			    strokeColor: "black",
		        strokeWidth: 1,
		        strokeOpacity: 1
			}
		});
		defaultStyle.addRules([defaultRule]);
		selectStyle.addRules([selectRule]);

    	var parcellesStyle = new OpenLayers.StyleMap({'default': defaultStyle,'select':selectStyle});

		var vecLayer = new OpenLayers.Layer.Vector("Parcelles sélectionnées", {styleMap:parcellesStyle});
		map.addLayer(vecLayer);
		return vecLayer;
	};

	var initQuerier = function()
	{
	       /*
         * Register to events on various modules to deal with
         * the communication between them. Really, we're
         * acting as a mediator between the modules with
         * the objective of making them independent.
         */
        /*if (GEOB.querier) {
            var querierTitle;
            GEOB.querier.events.on({
                "ready": function(panelCfg) {
                    // clear the previous filterbuilder panel, if exists
                    if (eastItems[0].getComponent(1)) {
                        eastItems[0].remove(eastItems[0].getComponent(1));
                    }
                    panelCfg.buttons.push({
                        text: OpenLayers.i18n('Fermer'),
                        handler: function() {
                            // we also need to hide querier vector layer:
                            eastItems[0].getComponent(1).tearDown();
                            eastItems[0].setTitle(OpenLayers.i18n("Couches disponibles"));
                            eastItems[0].getLayout().setActiveItem(0);
                        }
                    });
                    querierTitle = panelCfg.title;
                    eastItems[0].setTitle(querierTitle);
                    var panel = Ext.apply(panelCfg, {
                        // whatever here
                        title: null
                    });
                    eastItems[0].add(panel);
                    eastItems[0].getLayout().setActiveItem(1);
                    eastItems[0].getComponent(1).setUp();
                    eastItems[0].doLayout(); // required
                },
                "showrequest": function() {
                    eastItems[0].setTitle(querierTitle);
                    eastItems[0].getLayout().setActiveItem(1);
                    eastItems[0].getComponent(1).setUp();
                    eastItems[0].doLayout(); // required
                },
                "search": function(panelCfg) {
                    if (GEOB.resultspanel) {
                        GEOB.resultspanel.clean();
                    }
                    southPanel.removeAll();
                    var panel = Ext.apply({
                        bodyStyle: 'padding:5px'
                    }, panelCfg);
                    southPanel.add(panel);
                    southPanel.doLayout();
                    southPanel.expand();
                },
                "searchresults": function(options) {
                    if (GEOB.resultspanel) {
                        GEOB.resultspanel.populate(options);
                    }
                }
            });
        }*/

        if (GEOB.getfeatureinfo) {
            GEOB.getfeatureinfo.events.on({
                "search": function(panelCfg) {
                    if (GEOB.resultspanel) {
                        GEOB.resultspanel.clean();
                    }
                    southPanel.removeAll();
                    var panel = Ext.apply({
                        bodyStyle: 'padding:5px'
                    }, panelCfg);
                    southPanel.add(panel);
                    southPanel.doLayout();
                    southPanel.expand();
                },
                "searchresults": function(options) {
                    if (GEOB.resultspanel) {
                        GEOB.resultspanel.populate(options);
                    }
                }
            });
        }

        if (GEOB.resultspanel) {
            GEOB.resultspanel.events.on({
                "panel": function(panelCfg) {
                    southPanel.removeAll();
                    southPanel.add(panelCfg);
                    southPanel.doLayout();
                }
            });
        }
	};

    // this panel serves as the container for
    // the "search results" panel
    var southPanel = new Ext.Panel({
        region: "south",
        hidden: !GEOB.resultspanel, // hide this panel if
                                    // the resultspanel
                                    // module is undefined
        collapsible: true,
        split: true,
        layout: "fit",
        title: OpenLayers.i18n("Résultats de requête"),
        collapsed: true,
        height: 150,
        defaults: {
            border: false,
            frame: false
        },
        items: [{
            bodyStyle: 'padding: 5px',
            html: OpenLayers.i18n("Les résultats de requête sont affichés ici.")
        }],
        listeners: {
            "collapse": function() {
                // when the user collapses the panel
                // hide the features in the layer
                if (GEOB.resultspanel) {
                    GEOB.resultspanel.hide();
                }
            },
            "expand": function() {
                // when the user expands the panel
                // show the features in the layer
                if (GEOB.resultspanel) {
                    GEOB.resultspanel.show();
                }
            }
        }
    });
    /*
     * Public
     */
    return {

        /**
         * APIMethod: init
         * Initialize the page layout.
         */
        init: function() {
            var urlParameters = OpenLayers.Util.getParameters();
						if(urlParameters['INS']) {
							//Override config INS : called by urban
							UrbanMap.config.INS = urlParameters['INS'];
						}

						if (typeof(proxyUrl) != "undefined")
						{
							UrbanMap.config.proxy_url = proxyUrl;
						}
						//OpenLayers.ProxyHost = UrbanMap.config.proxy_url;
						var wmcUrlToLoad = null;
			            if (typeof(urbanMapWMCUrl) != "undefined")
						{
							wmcUrlToLoad = urbanMapWMCUrl;
							OpenLayers.ProxyHost = '';
						}
            if(!wmcUrlToLoad) {
            	wmcUrlToLoad = urlParameters['WMC'];
            }

            var layerStore = createLayerStore();
            var scaleStore = new GeoExt.data.ScaleStore({map: map});
						var vecLayer = createParcelleVectorLayer(map);
						var parcelleGrid = new UrbanMap.ParcelleGrid({
							vectorLayer:vecLayer,
							map:map,
							height: 200,
							collapsed: false,
							collapsible: true
						});
						var btnGetCarteIdentiteParcellaire = new Ext.Button({
									allowDepress: false,
									tooltip: "Carte d'identite parcellaire",
									iconCls: "fullextent",
									listeners: {
										'click' : {
											fn : function() {
												var selectedCapakeys = [];

												parcelleGrid.getStore().each(function(rec){
													selectedCapakeys.push(rec.data.fid);
												},this);

												Ext.Ajax.request({
														url : 'parcelsinfo',
														params: {capakey: selectedCapakeys},
														method: 'GET',
														scope: this,
														success: function(result, request) {

															var parcelleWin = new Ext.Window({
																title: "Carte d'identité",
																width: 400,
																height: 400,
																autoScroll: true,
																items: [{
																	border: false,
																	autoScroll: true,
																	html : result.responseText
																}]
															});
															parcelleWin.show();
														},
														failure : function(result, request) {
															console.log(result);
														}
												});
											}
											,scope : this
										}
									}
							});
						var urbanMapPanel = new UrbanMap.MapPanel({
			        map:map,
							layerStore:layerStore,
							parcelleGrid:parcelleGrid,
							vecLayer:vecLayer,
							scaleStore:scaleStore
						});
						var topMapPanelToolbar = urbanMapPanel.getTopToolbar();
						topMapPanelToolbar.addButton(btnGetCarteIdentiteParcellaire);
						if(wmcUrlToLoad) {
            	UrbanMap.WMCReader.init(layerStore);
            	UrbanMap.WMCReader.updateStoreFromWMC(wmcUrlToLoad);
            }

						GEOB.getfeatureinfo.init(map);
						GEOB.resultspanel.init(map);
						initQuerier();

            new Ext.Viewport({
                layout: "border",
                items: [{
                	region: "center",
                	layout: "border",
                	items : [
                	   urbanMapPanel
										,parcelleGrid
                	]
                },{
                    region: "west",
                    width: 300,
                    layout: "accordion",
                    items:[{
                    	 xtype: 'urbanmapsearchform'
                    	,parcelleGrid : parcelleGrid
                    },
                    Ext.apply({title:'Légende'}, GEOB.managelayers.create(layerStore))
                    ,{
                    	xtype: 'urbanmapprintform'
                    	,map: map
                    },{
                    	xtype: 'urbanmapparamform'
                    }]
                },southPanel]
            });

            if (typeof(urbanCapakeyArray) != "undefined")
						{
							var paramsArray = [];

							var params = {};
							params.queryable = "codeparcelle";
							for(var i=0 ; i < urbanCapakeyArray.length ; i++ ) {
								var params = {};
								params.queryable = "codeparcelle";
								params.codeparcelle__ilike = urbanCapakeyArray[i];
								paramsArray.push(params);
							}
							urbanMapPanel.loadAndShowParcels(paramsArray);
						}
        }
    };
})();
