Ext.namespace("UrbanMap");

//custom layer node UI class
var LayerNodeUI = Ext.extend(GeoExt.tree.LayerNodeUI,new GeoExt.tree.TreeNodeUIEventMixin());

UrbanMap.TreePanel = Ext.extend(Ext.tree.TreePanel, {
    // configurables
    // anything what is here can be configured from outside
     border:false
    //,map : null
    ,autoScroll: true
    ,enableDD: true
    ,rootVisible: false
    ,lines: false
    //,layerStore: null
    
    // {{{
    ,initComponent:function() {
        // {{{
        Ext.apply(this, {
            // anything here, e.g. items, tools or buttons arrays,
            // cannot be changed from outside
        	
        }); // e/o apply
        // }}}

        // call parent
        UrbanMap.TreePanel.superclass.initComponent.apply(this, arguments);

        // after parent code here, e.g. install event handlers

    } // e/o function initComponent
    // }}}
    // {{{
    ,onRender:function() {

        // before parent code

        // call parent
        UrbanMap.TreePanel.superclass.onRender.apply(this, arguments);

        // after parent code, e.g. install event handlers on rendered components
        
    } // e/o function onRender
    // }}}

    // apply the tree node component plugin to layer nodes
    
    /* classic way:
    ,root: {
        nodeType: "gx_layercontainer",
        layerStore: this.layerStore,
        leaf: false,
        expanded: true
    }
    ,loader: new Ext.tree.TreeLoader({
        applyLoader: false
    })
    */

    ,plugins: [{
        ptype: "gx_treenodecomponent"
    }]
    
    ,loader: {
        applyLoader: false,
        uiProviders: {
            "custom_ui": LayerNodeUI
        }
    }
    ,root: {
        nodeType: "gx_layercontainer",
        loader: {
            baseAttrs: {
                uiProvider: "custom_ui"
            }
    		,createNode:function(attr) {
            	if (attr.layer.CLASS_NAME == "OpenLayers.Layer.WMS")
            	{
                    // add a WMS legend to each node created
                	attr.component = {
                        xtype: "urb_wmslegend",
                        layerRecord: GeoExt.MapPanel.guess().layers.getByLayer(attr.layer),
                        showTitle: false,
                        cls: "legend"
                    };
                	
            	}
            	else if (attr.layer.CLASS_NAME == "OpenLayers.Layer.Vector")
            	{
            		attr.component = {
            			xtype: "gx_vectorlegend",
                        layerRecord: GeoExt.MapPanel.guess().layers.getByLayer(attr.layer),
                        showTitle:false,
                        cls: "legend"
                    };
            	}
            	return GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);
            }
         }
    }

});

//register xtype
Ext.reg('urbanmaptreepanel', UrbanMap.TreePanel);
