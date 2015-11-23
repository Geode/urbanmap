
Ext.namespace("UrbanMap");

UrbanMap.ParcelleGrid = Ext.extend(Ext.grid.GridPanel, {
    // configurables
    // anything what is here can be configured from outside
     border:false
    ,vectorLayer:null
    ,map:null
    ,capakeyToHighlight:null
    ,daStore:null
    ,scaleStore:null
    // {{{
    ,initComponent:function() {

		var store = new GeoExt.data.FeatureStore({
	        layer: this.vectorLayer,
	        fields: [
	            {name: 'codeparcelle', type: 'string'},
	            {name: 'co1', type: 'string'},
	            {name: 'prc', type: 'string'},
	            {name: 'na1', type: 'string'},
	            {name: 'sl1', type: 'string'},
	            {name: 'da', type: 'string'},
	            {name: 'ri1', type: 'string'},
	            {name: 'pe' , type: 'string'},
	            {name: 'daa' , type: 'string'},
	            {name: 'ord' , type: 'string'},
	            {name: 'in' , type: 'string'},
	            {name: 'ha1' , type: 'string'},
	            {name: 'rscod' , type: 'string'},
	            {name: 'acj' , type: 'string'},
	            {name: 'adr1' , type: 'string'},
	            {name: 'adr2' , type: 'string'}
	        ],
	        proxy: new GeoExt.data.ProtocolProxy({
	            protocol: new OpenLayers.Protocol.HTTP({
	                url: UrbanMap.config.proxy_url + UrbanMap.config.urbanmap_url + "/mapcapas"
	                ,format: new OpenLayers.Format.GeoJSON()
	                ,params: {
                       limit: UrbanMap.config.result_limit
                    }
	            })
	        }),
	        baseParams: {
	        	queryable : 'ins',
	        	ins : UrbanMap.config.INS
	        }
	        ,autoLoad: false
	        ,listeners: {
	        	'load' : {
					scope:this
					,fn : function(records, datas, options) {
						if (records.data.length == 0 && options.params)
						{
					        Ext.Msg.show({
	                            title: 'Recherche des parcelles',
	                            msg: 'Aucunes parcelles ne correspondent aux critères de votre recherche.',
	                            minWidth: 200,
	                            modal: true,
	                            icon: Ext.Msg.INFO,
	                            buttons: Ext.Msg.OK
	                        });
						}
					}
	        	}
	        }
	    });

	    var expander = new Ext.ux.grid.RowExpander({
	        tpl : new Ext.Template(
	        	'<table><tbody><tr><td><b>Capakey: </b></td><td>{codeparcelle}</td></tr>',
	        	'<tr><td><b>Année Construction: </b></td><td>{acj}</td></tr>',
	        	'<tr><td><b>Division et article: </b></td><td>{daa}</td></tr>',
	        	'<tr><td><b>RC Parc N.Batie: </b></td><td>{ha1}</td></tr>',
	        	'<tr><td><b>Code rue: </b></td><td>{rscod}</td></tr>',
	            '<tr><td><b>Propriétaire(s): </b></td><td>{pe}</td></tr>',
	            '<tr><td><b>CP(s) Loc(s): </b></td><td>{adr1}</td></tr></tbody></table>',
	            '<tr><td><b>Adr(s) Prop(s): </b></td><td>{adr2}</td></tr></tbody></table>',
	            '<br />'
	        )
	    });

        //TODO: merge with store from searchform.parcelles!
      	this.daStore =  new Ext.data.JsonStore({
	  		// url: UrbanMap.config.proxy_url + '/picklist/get'
    		autoDestroy: true
	  		,root: 'results'
	  		,fields: ['value_field','display_field']
      		//,method:'GET'
      		//already a proxy (no need UrbanMap.config.proxy_url + UrbanMap.config.urbanmap_url +):
    		,proxy:new Ext.data.HttpProxy({
    			url: UrbanMap.config.proxy_url + UrbanMap.config.urbanmap_url + '/picklist/get'
    			,method: 'GET'
    		})
    		,baseParams : {
	  			table_name : 'da'
	  			,display_field : 'dan1'
	  			,value_field : 'da'
	  		}
	  	});
      	this.daStore.load();

        var actionsGrid = new Ext.ux.grid.RowActions({
			header:'Actions'
			,keepSelection:true
			,widthSlope:24
			,actions:[{
				iconCls:'information'
				,tooltip:'Centrer sur la carte'
			},{
				iconCls:'server_gear'
				,tooltip:'Enquête publique'
			}]
			,scope: this
			,listeners: {
				'action' : {
					scope:this
					,fn : function(grid, record, action, row, col) {
						if(action == 'information') {
					    	grid.getSelectionModel().selectRecords([record]);
					    	this.map.zoomToExtent(record.data.feature.geometry.getBounds());
						}
						if(action == 'server_gear') {
					    	grid.getSelectionModel().selectRecords([record]);
				            this.doEnquetePublique(record.data.feature, UrbanMap.config.buffer_width ,UrbanMap.config.buffer_result_limit);
						}
					}
				}
			}
		});

        // {{{
        Ext.apply(this, {
            // anything here, e.g. items, tools or buttons arrays,
            // cannot be changed from outside
	        title: "Résultats",
	        region: "south",
	        collapsible: true,
	        store: store,
	        height: 250,
	        columns: [
	            expander
	            ,actionsGrid
	         ,{
	            header: "Division",
	            width: 165,
	            dataIndex: "da",
	            sortable: true,
	            renderer: function(v, params, record){
	            	return this.daStore.getAt(this.daStore.find('value_field',v)).get('display_field');
	            },
	            scope:this
	        }, {
	            header: "Division+Article",
	            width: 100,
	            dataIndex: "daa",
	            sortable: true
	        }, {
	            header: "Num. Parc.",
	            width: 70,
	            dataIndex: "prc",
	            sortable: true
	        }, {
	            header: "Nature",
	            width: 80,
	            dataIndex: "na1",
	            sortable: true
	        }, {
	            header: "Situation",
	            width: 150,
	            dataIndex: "sl1",
	            sortable: true
	        }, {
	            header: "Surface",
	            width: 70,
	            dataIndex: "co1"
	        }, {
	            header: "Revenu Cad.",
	            width: 80,
	            dataIndex: "ri1",
	            sortable: true
	        }, {
	            header: "Propriétaire",
	            width: 350,
	            dataIndex: "pe",
	            sortable: true
	        }]
	        ,sm: new GeoExt.grid.FeatureSelectionModel()
			,listeners:{
				rowdblclick: {
					scope: this
					,fn : function(grid, rowindex, e) {
						this.map.zoomToExtent(grid.getStore().getAt(rowindex).data.feature.geometry.getBounds());
					}
				}
			}
			,plugins:[actionsGrid,expander]
        }); // e/o apply
        // }}}

   		this.createBufferVectorLayer();

        // call parent
        UrbanMap.ParcelleGrid.superclass.initComponent.apply(this, arguments);

        // after parent code here, e.g. install event handlers
        this.store.on('load', function(store, records, options) {

        	if (records.length >= UrbanMap.config.result_limit) {
        		Ext.Msg.alert(
        				'Veuillez affiner vos critères de recherche',
        				'Le nombre de résultats affiché est limité aux ' + records.length + " premiers."
        		);
        	}

        	var paramsCSV = '?';
        	Ext.iterate(store.lastOptions.params, function(key,value) {
        		if(key != "limit") {
        			paramsCSV += key+'='+encodeURIComponent(value)+'&';
        		}
        	});


        	var urlCSV = UrbanMap.config.urbanmap_url + '/mapcapas/getCSV/getCSV'+paramsCSV;
        	var proxyUrlCSV = UrbanMap.config.proxy_url + urlCSV;
        	urlCSV = urlCSV.replace('\'', ' ');

        	this.setTitle("<a href='"+proxyUrlCSV+"'>Résultats (downloader CSV)</a>");

        	if (this.capakeyToHighlight != null)
        	{
            	var bufferOrigine = [];
            	this.getStore().each(function(rec){
            		if (this.capakeyToHighlight.indexOf(rec.data.codeparcelle) >= 0)
            		{
            			bufferOrigine.push(rec);
            		}
            	},this);
            	this.getSelectionModel().selectRecords(bufferOrigine);
            	this.capakeyToHighlight = null;
        	}
        	else
        	{
        		this.map.getLayersByName(UrbanMap.config.layer_buffer)[0].removeAllFeatures();
        	}
        }, this);

    } // e/o function initComponent
    // }}}
    // {{{
    ,onRender:function() {

        // before parent code

        // call parent
        UrbanMap.ParcelleGrid.superclass.onRender.apply(this, arguments);

        // after parent code, e.g. install event handlers on rendered components

    } // e/o function onRender
    // }}}

    // any other added/overrided methods
    ,doEnquetePubliqueFull : function(width, featuresLimit){
        if(!jsts) {
          alert("JSTS Depency is missing");
          return;
        }
        var geoJSONFormat =  new OpenLayers.Format.GeoJSON();
        var parser = new jsts.io.OpenLayersParser();
        var jstsGeomUnion = null;
        var olGeomUnion = null, olGeomUnionBuffer = null;
        this.capakeyToHighlight = [];
        
        //Merge(union) parcels polygons
        this.getStore().each(function(rec){
          var jstsjGeom = parser.read(rec.data.feature.geometry);
          this.capakeyToHighlight.push(rec.data.codeparcelle);
          if(jstsGeomUnion == null) {
            jstsGeomUnion = jstsjGeom;
          } else {
            jstsGeomUnion = jstsGeomUnion.union(jstsjGeom);
          }
        },this);

        olGeomUnion = parser.write(jstsGeomUnion);
        olGeomUnionBuffer = parser.write(jstsGeomUnion.buffer(width));
        var jsonGeom = geoJSONFormat.write(olGeomUnion);

        //Add the buffer to the map
        this.map.getLayersByName(UrbanMap.config.layer_buffer)[0].removeAllFeatures();
        var feat = new OpenLayers.Feature.Vector(olGeomUnionBuffer);
        this.map.getLayersByName(UrbanMap.config.layer_buffer)[0].addFeatures([feat]);
        //Reload the store with the result of the public survey
        this.getStore().reload({
          params:{geometry:jsonGeom,tolerance:width,limit:featuresLimit}
        });
    }
    ,doEnquetePublique : function(feature, width, featuresLimit){
    	var geoJSONFormat =  new OpenLayers.Format.GeoJSON();
    	var jsonGeom = geoJSONFormat.write(feature.geometry);
    	this.capakeyToHighlight = [feature.data.codeparcelle];
    	this.getStore().reload({
    		params:{geometry:jsonGeom,tolerance:width,limit:featuresLimit}
    	});

    	Ext.Ajax.request({
            url : UrbanMap.config.proxy_url + UrbanMap.config.urbanmap_url + '/mapcapas/buffer/buffer',
            method: 'GET',
            params: {capakey:feature.data.codeparcelle, width:width},
            scope: this,
            success: function ( result, request ) {
            	 this.map.getLayersByName(UrbanMap.config.layer_buffer)[0].removeAllFeatures();
                 var geoJSONFormat =  new OpenLayers.Format.GeoJSON();
                 var polygon = geoJSONFormat.read(result.responseText);
                 this.map.getLayersByName(UrbanMap.config.layer_buffer)[0].addFeatures(polygon);
            },
            failure: function ( result, request ) {
                 var jsonData = Ext.util.JSON.decode(result.responseText);
                 var resultMessage = jsonData.data.result;
                 if(console) {
                    console.log("Buffer request failure ");
                    console.log(resultMessage);
                 }
            }
          });
    }
    ,createBufferVectorLayer : function() {
		var style = new OpenLayers.Style();
		var rule = new OpenLayers.Rule({
			name:'Buffer'
			,symbolizer:{
				fillColor: "#0099FF",
			    fillOpacity: .35,
			    strokeColor: "blue",
			    strokeWidth: 1.5,
			    strokeOpacity: 1
		}
		});
		style.addRules([rule]);
    	var bufferStyle = new OpenLayers.StyleMap({'default': style,'select':style});

		var buffLayer = new OpenLayers.Layer.Vector(UrbanMap.config.layer_buffer, {styleMap:bufferStyle});
		this.map.addLayer(buffLayer);
		//this.map.setLayerZIndex(buffLayer, 150);
		return buffLayer;
	}

}); // e/o extend

// register xtype
Ext.reg('urbanmapparcellegrid', UrbanMap.ParcelleGrid);
