Ext.namespace("UrbanMap");

UrbanMap.WMSLegend = Ext.extend(GeoExt.WMSLegend, {

    /** api: config[defaultStyleIsFirst]
     *  ``Boolean``
     *  The WMS spec does not say if the first style advertised for a layer in
     *  a Capabilities document is the default style that the layer is
     *  rendered with. We make this assumption by default. To be strictly WMS
     *  compliant, set this to false, but make sure to configure a STYLES
     *  param with your WMS layers, otherwise LegendURLs advertised in the
     *  GetCapabilities document cannot be used.
     */
    defaultStyleIsFirst: true,

    /** api: config[useScaleParameter]
     *  ``Boolean``
     *  Should we use the optional SCALE parameter in the SLD WMS
     *  GetLegendGraphic request? Defaults to true.
     */
    useScaleParameter: true,

    /** api: config[baseParams]
     * ``Object``
     *  Optional parameters to add to the legend url, this can e.g. be used to
     *  support vendor-specific parameters in a SLD WMS GetLegendGraphic
     *  request. To override the default MIME type of image/gif use the
     *  FORMAT parameter in baseParams.
     *     
     *  .. code-block:: javascript
     *     
     *      var legendPanel = new GeoExt.LegendPanel({
     *          map: map,
     *          title: 'Legend Panel',
     *          defaults: {
     *              style: 'padding:5px',
     *              baseParams: {
     *                  FORMAT: 'image/png',
     *                  LEGEND_OPTIONS: 'forceLabels:on'
     *              }
     *          }
     *      });   
     */
    baseParams: null,
    
    /** private: method[initComponent]
     *  Initializes the WMS legend. For group layers it will create multiple
     *  image box components.
     */
    initComponent: function() {
    	UrbanMap.WMSLegend.superclass.initComponent.call(this);
    }
    ,update: function() {
     	UrbanMap.WMSLegend.superclass.update.apply(this, arguments);   	
     	
     	this.add({
     		xtype:'button',
            tooltip:'Supprimer la couche',
            iconCls: 'trash',
            style: {},
            handler: function(button, event){
            	Ext.Msg.show({
                    title: 'Confirmation suppression couche',
                    msg: 'Voulez-vous enlever la couche '+this.layerRecord.data.layer.name+' ?',
                    minWidth: 200,
                    modal: true,
                    icon: Ext.MessageBox.QUESTION,
                    buttons: Ext.Msg.OKCANCEL,
                    fn:function(button){
                    	if (button == 'ok')
                    		GeoExt.MapPanel.guess().map.removeLayer(this.layerRecord.data.layer);
                    },
                    scope:this
                });
            },
            scope:this
        });
    	this.doLayout();
    }
});

/** private: method[supports]
 *  Private override
 */
UrbanMap.WMSLegend.supports = function(layerRecord) {
    return layerRecord.getLayer() instanceof OpenLayers.Layer.WMS;
};

/** api: legendtype = gx_wmslegend */
GeoExt.LayerLegend.types["urb_wmslegend"] = UrbanMap.WMSLegend;

/** api: xtype = gx_wmslegend */
Ext.reg('urb_wmslegend', UrbanMap.WMSLegend);