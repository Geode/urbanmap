
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
            //scales:[100000,75000,50000,30000,20000,15000,10000,7500,5000,3000,2000,1000,500,250,100],
            maxResolution: 200,
            //resolutions: [42.711898437500054, 21.355949218750027, 10.677974609375013, 5.338987304687507, 2.6694936523437534, 1.3347468261718767, 0.6673734130859383, 0.33368670654296917, 0.16684335327148458, 0.08342167663574229, 0.041710838317871146, 0.020855419158935573],
            resolutions: [280.0, 140.0, 28.0, 14.0, 7, 5.6, 2.8, 1.4, 0.7, 0.28, 0.21,0.14,0.07, 0.035],
            //maxExtent: new OpenLayers.Bounds(176643.072,130807.539,187577.318,141741.78500000003),
            //maxExtent: new OpenLayers.Bounds(0,0,300000,300000),
            maxExtent: new OpenLayers.Bounds(38000.0,20000.0,324720.0,235040.0),
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
        /*
        	new OpenLayers.Layer.WMS(
                    "PPNC", "http://cartopro1.wallonie.be/WMS/com.esri.wms.Esrimap/PPNC?version=1.1.1&",
                    {
                        layers: 'ppnc1,ppnc2,ppnc3,ppnc4,ppnc5,ppnc6,ppnc7',
                        styles: '',
                        srs: 'EPSG:31370',
                        format: 'image/jpeg',
                        minScale:0,
                        maxScale:5000
                    },
                    {singleTile: false, ratio: 1}
            )
            */
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
     /*
    var createLayerStore = function(map, layers) {
        return new GeoExt.data.LayerStore({
            map: map,
            layers: layers
        });
    };
	*/
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
    var createLayerStore = function(map, layers) {

        var recordType = GeoExt.data.LayerRecord.create(
        	GEOB.ows.getRecordFields()
        );

        var ls = new UrbanMap.LayerStore({
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

        map.addLayers(layers);

	    return ls;
    };

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
			OpenLayers.ProxyHost = ''; //UrbanMap.config.proxy_url;

            var map = createMap();
            var scaleStore = new GeoExt.data.ScaleStore({map: map});
            var layers = createLayers();
            var layerStore = createLayerStore(map, layers);

            var wmcUrlToLoad = null;
            if (typeof(urbanMapWMCUrl) != "undefined")
			{
				wmcUrlToLoad = urbanMapWMCUrl;
			}
            if(!wmcUrlToLoad) {
            	wmcUrlToLoad = urlParameters['WMC'];
            }

            // WMC Stuff
            /*
            if(wmcUrlToLoad) {
            	UrbanMap.WMCReader.init(layerStore);
            	//Sample WMC value = "/app/WMC/wmc.xml"
            	UrbanMap.WMCReader.updateStoreFromWMC(wmcUrlToLoad);
            }
            */
            //end WMC Stuff

			var vecLayer = createParcelleVectorLayer(map);
			var parcelleGrid = new UrbanMap.ParcelleGrid({
				vectorLayer:vecLayer,
				map:map,
				height: 200,
				collapsed: false,
				collapsible: true
			});
			var urbanMapPanel = new UrbanMap.MapPanel({
                map:map,
				layerStore:layerStore,
				parcelleGrid:parcelleGrid,
				vecLayer:vecLayer,
				scaleStore:scaleStore
			});

			//Remove MouseWheel (Map Zooming) for urban only
			var navigationControl = map.getControlsByClass("OpenLayers.Control.Navigation")[0];
			navigationControl.disableZoomWheel();

			//Add button for carte d'identité parcellaire
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

			var topMapPanelToolbar = urbanMapPanel.getTopToolbar();
			topMapPanelToolbar.addButton(btnGetCarteIdentiteParcellaire);

            var urbanView = new Ext.Panel({
                layout: "border",
                items: [{
                	region: "center",
                	layout: "border",
                	items : [{
                        layout: "accordion",
                        region: 'west',
                        width: 200,
                        items : [
                        	Ext.apply({title:'Légende'},
                        	GEOB.managelayers.create(layerStore))
                        ]
                    }
                	,urbanMapPanel
					,parcelleGrid
                	]
                }]
            });

            var panelCtn = new Ext.Panel({
            	renderTo: 'urbanmapctn',
            	layout: 'fit',
            	width: Ext.get('urbanmapctn').getWidth(),
            	height: Ext.get('urbanmapctn').getHeight(),
            	items: [urbanView]
            });

            if(wmcUrlToLoad) {
            	UrbanMap.WMCReader.init(layerStore);
            	//Sample WMC value = "/app/WMC/wmc.xml"

            	UrbanMap.WMCReader.updateStoreFromWMC(wmcUrlToLoad);
            }

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
