/*
 * @include GeoExt/widgets/MapPanel.js
 */
Ext.namespace("UrbanMap");

UrbanMap.MapPanel = Ext.extend(GeoExt.MapPanel, {
    // configurables
    // anything what is here can be configured from outside
     border:false
    ,map : null
    ,layerStore : null
    ,parcelleGrid : null
    ,vecLayer : null
    
    // style the sketch fancy
	,sketchSymbolizers : {
        "Point": {
            pointRadius: 4,
            graphicName: "square",
            fillColor: "white",
            fillOpacity: 1,
            strokeWidth: 1,
            strokeOpacity: 1,
            strokeColor: "#333333"
         },
         "Line": {
            strokeWidth: 3,
            strokeOpacity: 1,
            strokeColor: "#666666",
            strokeDashstyle: "dash"
         },
         "Polygon": {
            strokeWidth: 2,
            strokeOpacity: 1,
            strokeColor: "#666666",
            fillColor: "white",
            fillOpacity: 0.3
         }
    }
    
    // {{{
    ,initComponent:function() {
        // {{{
        this.addLayerWindow = new UrbanMap.WMSCapabilitiesWindow({"mapPanel":this});
        
        Ext.apply(this, {
            // anything here, e.g. items, tools or buttons arrays,
            // cannot be changed from outside
	        region: "center"
	        ,map: this.map
	        ,layers: this.layerStore
	        ,center: new OpenLayers.LonLat(14871588.220497, -3199348.255331)
	        ,zoom: 4
	        ,items: [{
	            xtype: "gx_zoomslider",
	            aggressive: true,
	            vertical: true,
	            height: 100,
	            x: 10,
	            y: 20,
	            plugins: new GeoExt.ZoomSliderTip({
	                 template: "Echelle: 1 : {scale}<br>Résolution: {resolution}"
	             })
            }]
            ,tbar: this.createTbarItems()
        }); // e/o apply
        
        this.map.addControl(new OpenLayers.Control.MousePosition({numDigits:2}));

        // }}}

        // call parent
        UrbanMap.MapPanel.superclass.initComponent.apply(this, arguments);

        // after parent code here, e.g. install event handlers

    } // e/o function initComponent
    // }}}
    // {{{
    ,onRender:function() {

        // before parent code

        // call parent
        UrbanMap.MapPanel.superclass.onRender.apply(this, arguments);

        // after parent code, e.g. install event handlers on rendered components
        
    } // e/o function onRender
    // }}}
    ,createTbarItems : function() {
        var actions = [];
        actions.push(new GeoExt.Action({
            iconCls: "pan",
            map: this.map,
            pressed: true,
            toggleGroup: "tools",
            allowDepress: false,
            tooltip: "Navigation",
            control: new OpenLayers.Control.Navigation()
        }));
        actions.push(new GeoExt.Action({
	        control: new OpenLayers.Control.ZoomToMaxExtent(),
	        map: this.map,
	        allowDepress: false,
	        toggleGroup: "tools",
	        tooltip: "Zoom vers l'étendue de départ",
	        iconCls: "fullextent"
	    }));
        actions.push(new GeoExt.Action({
            iconCls: "zoomin",
            map: this.map,
            toggleGroup: "tools",
            allowDepress: false,
            tooltip: "Zoomer",
            control: new OpenLayers.Control.ZoomBox({
                out: false
            })
        }));
        actions.push(new GeoExt.Action({
            iconCls: "zoomout",
            map: this.map,
            toggleGroup: "tools",
            allowDepress: false,
            tooltip: "Dézoomer",
            control: new OpenLayers.Control.ZoomBox({
                out: true
            })
        }));
        actions.push("-");
        var ctrl = new OpenLayers.Control.NavigationHistory();
        this.map.addControl(ctrl);
        actions.push(new GeoExt.Action({
            control: ctrl.previous,
            iconCls: "back",
            tooltip: "Précedent",
            disabled: true
        }));
        actions.push(new GeoExt.Action({
            control: ctrl.next,
            iconCls: "next",
            tooltip: "Suivant",
            disabled: true
        }));
        actions.push("-");

        var style = new OpenLayers.Style();
        style.addRules([
            new OpenLayers.Rule({symbolizer: this.sketchSymbolizers})
        ]);
        var styleMap = new OpenLayers.StyleMap({"default": style});
        actions.push(new GeoExt.Action({
            iconCls: "ruler",
            map: this.map,
            toggleGroup: "tools",
            allowDepress: false,
            tooltip: "Règle",
            control: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Path, {
                     persist: true
                     ,handlerOptions: {
                        layerOptions: {styleMap: styleMap}
                     }
                     ,eventListeners: {
				        measure: function(evt) {
				        	Ext.Msg.show({
	                            title: 'Mesure',
	                            msg: 'Distance de ' + evt.measure.toFixed(2) + evt.units,
	                            minWidth: 200,
	                            modal: true,
	                            icon: Ext.Msg.INFO,
	                            buttons: Ext.Msg.OK
	                        });
				        }
				     }
                }
            )
        }));
        actions.push(new GeoExt.Action({
            iconCls: "ruler_square",
            map: this.map,
            toggleGroup: "tools",
            allowDepress: false,
            tooltip: "Mesure d'aire",
            control: new OpenLayers.Control.Measure(
                OpenLayers.Handler.Polygon, {
                     persist: true
                     ,handlerOptions: {
                        layerOptions: {styleMap: styleMap}
                     }
                     ,eventListeners: {
				        measure: function(evt) {
					        Ext.Msg.show({
	                            title: 'Mesure',
	                            msg: 'Aire de ' + evt.measure.toFixed(2) + evt.units + '²',
	                            minWidth: 200,
	                            modal: true,
	                            icon: Ext.Msg.INFO,
	                            buttons: Ext.Msg.OK
	                        });
				        }
				     }
                }
            )
        }));
        actions.push("-");
        actions.push(new GeoExt.Action({
            iconCls: "information",
            map: this.map,
            toggleGroup: "tools",
            allowDepress: false,
            tooltip: "Information",
            control: new OpenLayers.Control.Click({
		        trigger: function(evt,lol) {
		        	var loc = this.map.getLonLatFromViewPortPx(evt.xy);
		            this.map.getLayersByName(UrbanMap.config.layer_buffer)[0].removeAllFeatures();
		            if (evt.ctrlKey == true || evt.shiftKey == true){
		            	var params = {limit : UrbanMap.config.result_limit, lon:loc.lon, lat:loc.lat, tolerance:0 };
		            	this.scope.loadFeaturesToSelection(params);
		            }
		            else{
		            	this.scope.parcelleGrid.getStore().reload({params: {limit : UrbanMap.config.result_limit, lon:loc.lon, lat:loc.lat, tolerance:0 }});
		            }
		        }
		        ,scope:this
		    })
        }));
        
        actions.push(new GeoExt.Action({
	        iconCls: "server_gear",
	        scope: this,
	        control: new OpenLayers.Control.SelectFeature(this.vecLayer, {
	            type: OpenLayers.Control.TYPE_TOGGLE,
	            hover: false,
	            onSelect : function(evt)
	            {
	            	this.parcelleGrid.doEnquetePublique(evt, UrbanMap.config.buffer_width ,UrbanMap.config.buffer_result_limit);
	            },
	            scope:this
	        }),
	        map: this.map,
            toggleGroup: "tools",
            allowDepress: false,
	        tooltip: "Enquête Publique"
	    }));
        actions.push("-");
	    actions.push({
	        iconCls: "add_layer"
	        ,xtype: 'button'
	        ,scope: this
            ,allowDepress: false
	        ,tooltip: "Ajout d'une couche"
	        ,listeners : {
	        	'click' : {
	        		fn : function(){
	        			this.addLayerWindow.show();
	        		}
	        	}
	        	,scope:this
	        }
	    });
	    
	     var zoomSelector = new Ext.form.ComboBox({
	         store: this.scaleStore,
	         emptyText: "Zoom Level",
	         tpl: '<tpl for="."><div class="x-combo-list-item">1 : {[parseInt(values.scale)]}</div></tpl>',
	         editable: false,
	         triggerAction: 'all', // needed so that the combo box doesn't filter by its current content
	         mode: 'local' // keep the combo box from forcing a lot of unneeded data refreshes
	     });
	     zoomSelector.on('select', 
	    	        function(combo, record, index) {
	    	            this.map.zoomTo(record.data.level);
	    	        },
	    	        this
	    	    ); 	
	     actions.push("-");
	     actions.push(zoomSelector);
	     
	     this.map.events.register('zoomend', this, function() {
	         var scale = this.scaleStore.queryBy(function(record){
	             return this.map.getZoom() == record.data.level;
	         });

	         if (scale.length > 0) {
	             scale = scale.items[0];
	             zoomSelector.setValue("1 : " + parseInt(scale.data.scale));
	         } else {
	             if (!zoomSelector.rendered) return;
	             zoomSelector.clearValue();
	         }
	     });
	     
        return actions;
    }
    
    ,loadFeaturesToSelection : function(params){
    	Ext.Ajax.request({
            url : UrbanMap.config.proxy_url + UrbanMap.config.urbanmap_url + '/mapcapas',
            method: 'GET',
            params: params,
            scope: this,
            success: function ( result, request ) {
                 this.map.getLayersByName(UrbanMap.config.layer_buffer)[0].removeAllFeatures();
                 var geoJSONFormat =  new OpenLayers.Format.GeoJSON();
                 var featuresCollection = geoJSONFormat.read(result.responseText);
                 var results = this.parcelleGrid.getStore().reader.readRecords(featuresCollection);
                 this.parcelleGrid.getStore().add(results.records);
            },
            failure: function ( result, request ) {
                 var jsonData = Ext.util.JSON.decode(result.responseText);
                 var resultMessage = jsonData.data.result;
                 if(console) {
                    console.log("Info parcelle request failure !");
                    console.log(resultMessage);
                 }
            }
          });
    }
    ,loadAndShowParcels : function(paramsArray){
    	this.map.getLayersByName(UrbanMap.config.layer_buffer)[0].removeAllFeatures();

    	for(var i=0; i < paramsArray.length; i++)
    	{
	    	Ext.Ajax.request({
	            url : UrbanMap.config.proxy_url + UrbanMap.config.urbanmap_url + '/mapcapas',
	            method: 'GET',
	            params: paramsArray[i],
	            scope: this,
	            success: function ( result, request ) {
	                 var geoJSONFormat =  new OpenLayers.Format.GeoJSON();
	                 var featuresCollection = geoJSONFormat.read(result.responseText);
	                 var results = this.parcelleGrid.getStore().reader.readRecords(featuresCollection);
	                 this.parcelleGrid.getStore().add(results.records);
	            },
	            failure: function ( result, request ) {
	                 var jsonData = Ext.util.JSON.decode(result.responseText);
	                 var resultMessage = jsonData.data.result;
	                 if(console) {
	                    console.log("Info parcelle request failure !");
	                    console.log(resultMessage);
	                 }
	            }
	          });
    	}
    }
    // any other added/overrided methods

}); // e/o extend

// register xtype
Ext.reg('urbanmappanel', UrbanMap.MapPanel);