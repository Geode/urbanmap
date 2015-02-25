Ext.namespace("UrbanMap");

UrbanMap.PrintForm = Ext.extend(Ext.form.FormPanel, {
    // configurables
    // anything what is here can be configured from outside
     border:false
    //Reference to the openlayers map 
    ,map:null
    //Fist Page Title
    ,title: 'UrbanMap'
    //Map Page Title
    ,mapTitle: 'Cartographie'
    ,proxyTmp : ''
    	    	
    // {{{
    ,initComponent:function() {

    	// The printProvider that connects us to the print service
		this.printProvider = new GeoExt.data.PrintProvider({
	        method: "POST", // "POST" recommended for production use
	        //url: "http://urbanmap.opengeode.be/print",
	        capabilities: printCapabilities, // from the info.json script in the html
	        customParams: {
	            title: this.title
	            ,mapTitle: this.mapTitle
	        },
			listeners: {
				"encodelayer": function(scope, layer, encLayer) {
					//Replace GWC uri by WMS ones
					if (encLayer != undefined && encLayer.type == "WMS") {
						if (encLayer.layers[0] == "rw-2009-2010")
						{
							encLayer.baseURL = "http://cartocit2.wallonie.be/arcgis/services/INFRASIG/ORTHOS_2009_2010/MapServer/WMSServer?";
							encLayer.layers[0] = "0";
						} 
						else if (encLayer.layers[0] == "PPNC" )
						{
							encLayer.baseURL = "http://cartopro1.wallonie.be/WMS/com.esri.wms.Esrimap/PPNC?version=1.1.1";
							encLayer.layers = ["1","2","3","4","5","6","PPNC Zone7"];
						} 
						else 
						{
							encLayer.baseURL = encLayer.baseURL.replace("geoserver/gwc/service/wms","geoserver/ows");
						}
					}
				}
			}
	    });
	    // Our print page. Stores scale, center and rotation and gives us a page
	    // extent feature that we can add to a layer.
	    this.printPage = new GeoExt.data.PrintPage({
	        printProvider: this.printProvider
	    });
	    // A layer to display the print page extent
	    var pageLayer = new OpenLayers.Layer.Vector();
	    pageLayer.addFeatures(this.printPage.feature);
	    
        // {{{
        Ext.apply(this, {
            // anything here, e.g. items, tools or buttons arrays,
            // cannot be changed from outside
			title: 'Impression',
	        bodyStyle: "padding:5px",
	        labelAlign: "top",
	        defaults: {anchor: "100%"},
	        items: [{
	            xtype: "textarea",
	            name: "comment",
	            value: "",
	            fieldLabel: "Commentaires",
	            plugins: new GeoExt.plugins.PrintPageField({
	                printPage: this.printPage
	            })
	        }, {
	            xtype: "combo",
	            store: this.printProvider.layouts,
	            displayField: "name",
	            fieldLabel: "Mise en page",
	            typeAhead: true,
	            mode: "local",
	            triggerAction: "all",
	            plugins: new GeoExt.plugins.PrintProviderField({
	                printProvider: this.printProvider
	            })
	        }, {
	            xtype: "combo",
	            store: this.printProvider.dpis,
	            displayField: "name",
	            fieldLabel: "Résolution",
	            tpl: '<tpl for="."><div class="x-combo-list-item">{name} dpi</div></tpl>',
	            typeAhead: true,
	            mode: "local",
	            triggerAction: "all",
	            plugins: new GeoExt.plugins.PrintProviderField({
	                printProvider: this.printProvider
	            }),
	            // the plugin will work even if we modify a combo value
	            setValue: function(v) {
	                v = parseInt(v) + " dpi";
	                Ext.form.ComboBox.prototype.setValue.apply(this, arguments);
	            }
	        }, {
	            xtype: "combo",
	            store: this.printProvider.scales,
	            displayField: "name",
	            fieldLabel: "Echelle",
	            typeAhead: true,
	            mode: "local",
	            triggerAction: "all",
	            plugins: new GeoExt.plugins.PrintPageField({
	                printPage: this.printPage
	            })
	        }, {
	            xtype: "textfield",
	            name: "rotation",
	            fieldLabel: "Rotation",
	            plugins: new GeoExt.plugins.PrintPageField({
	                printPage: this.printPage
	            })
	        }],
	        buttons: [new Ext.Button({ text:'Générer le PDF'  , handler:this.printPDF,   scope:this })]
        }); // e/o apply
        // }}}

        // call parent
        UrbanMap.PrintForm.superclass.initComponent.apply(this, arguments);

        // after parent code here, e.g. install event handlers

    } // e/o function initComponent
    // }}}
    // {{{
    ,onRender:function() {

        // before parent code

        // call parent
        UrbanMap.PrintForm.superclass.onRender.apply(this, arguments);

        // after parent code, e.g. install event handlers on rendered components
        
    } // e/o function onRender
    // }}}
    ,printPDF: function() {
    	// convenient way to fit the print page to the visible map area
    	//this.printPage.fit(this.map, true);
    	//This will only center the page and not erase previous configuration (ie: scale)
    	this.printPage.setCenter(this.map.getCenter());
    	// call print action
    	this.proxyTmp = OpenLayers.ProxyHost;
    	try
    	{
    		OpenLayers.ProxyHost = '';
    		this.printProvider.print(this.map, this.printPage);
    	}
    	catch(err)
    	{
    		OpenLayers.ProxyHost = this.proxyTmp;
    	}
    	OpenLayers.ProxyHost = this.proxyTmp;
	    
    }
    // any other added/overrided methods

}); // e/o extend

// register xtype
Ext.reg('urbanmapprintform', UrbanMap.PrintForm);