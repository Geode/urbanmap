

Ext.namespace("UrbanMap");

UrbanMap.UrbanLayerNode = Ext.extend(GeoExt.tree.LayerNode, {
    constructor: function(config) {
         config.text = config.layer.name;
         config.qtip = config.layer.name;
         UrbanMap.UrbanLayerNode.superclass.constructor.apply(this, [config]);
    }
}); // e/o extend

// register xtype
Ext.reg('urban_layernode', UrbanMap.UrbanLayerNode);

Ext.tree.TreePanel.nodeTypes.urban_layer = UrbanMap.UrbanLayerNode;

UrbanMap.UrbanLayerNodePanel = Ext.extend(Ext.Panel, {
    // configurables
    // anything what is here can be configured from outside
     border:false
    // {{{
    ,initComponent:function() {
        // {{{
        Ext.apply(this, {
            // anything here, e.g. items, tools or buttons arrays,
            // cannot be changed from outside
			items : [{
                xtype: "toolbar",
                buttons: [
                	{ text: 'Delete' },{text:'up'},{text:'down'}
                ]
            }]
        }); // e/o apply
        // }}}

        // call parent
        UrbanMap.UrbanLayerNodePanel.superclass.initComponent.apply(this, arguments);

        // after parent code here, e.g. install event handlers

    } // e/o function initComponent
    // }}}
    // {{{
    ,onRender:function() {

        // before parent code

        // call parent
        UrbanMap.UrbanLayerNodePanel.superclass.onRender.apply(this, arguments);

        // after parent code, e.g. install event handlers on rendered components
        
    } // e/o function onRender
    // }}}
    
    // any other added/overrided methods

}); // e/o extend

// register xtype
Ext.reg('urban_layernodepanel', UrbanMap.UrbanLayerNodePanel);


UrbanMap.TreePanel2 = Ext.extend(Ext.tree.TreePanel, {
    // configurables
    // anything what is here can be configured from outside
    border:false   
    ,layerStore : null
    // {{{
    ,initComponent:function() {
    	this.layerContainer = new GeoExt.tree.LayerContainer({
		    layerStore: this.layerStore,
            loader: {
                baseAttrs: {
                    nodeType: "urban_layer",
                    uiProvider: "custom_ui"
                }
                ,createNode: function(attr) {
                	console.log(attr);
                    attr.component = {xtype:'urban_layernodepanel'};
                    return GeoExt.tree.LayerLoader.prototype.createNode.call(this, attr);
                }
            }    	
    	});

        // {{{
        Ext.apply(this, {
            // anything here, e.g. items, tools or buttons arrays,
            // cannot be changed from outside
            autoScroll: true,
    		enableDD: true,
        	loader: {
                 applyLoader: false
	             ,uiProviders: {
	                "custom_ui": LayerNodeUI
	             }
            },
            // apply the tree node component plugin to layer nodes
	        plugins: [{
	            ptype: "gx_treenodecomponent"
	        }],
            lines: false,
            rootVisible: false,
            root: this.layerContainer,
            buttons: [{
               text: 'Ajouter des couches',
               handler: function() {
			   		console.log("couche");
               }
            }],
            listeners: {
                action: function() {
                	console.log("action");
                }
            } 
        }); // e/o apply
        // }}}

        // call parent
        UrbanMap.TreePanel2.superclass.initComponent.apply(this, arguments);
        // after parent code here, e.g. install event handlers

    } // e/o function initComponent
    // }}}
    // {{{
    ,onRender:function() {
        // before parent code
        // call parent
        UrbanMap.TreePanel2.superclass.onRender.apply(this, arguments);
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
});

//register xtype
Ext.reg('urban_maptreepanel', UrbanMap.TreePanel2);

 

