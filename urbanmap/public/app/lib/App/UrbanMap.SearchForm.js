

Ext.namespace("UrbanMap");

UrbanMap.SearchForm = Ext.extend(Ext.Panel, {
    // configurables
    // anything what is here can be configured from outside
     border:false
    ,parcelleGrid:null
    ,urbanmapsearchformparcelle : null
    ,urbanmapsearchformproprio  : null

    // {{{
    ,initComponent:function() {
      this.urbanmapsearchformparcelle = new UrbanMap.SearchForm.Parcelle({
        parcelleGrid : this.parcelleGrid,
        parent : this
      });
      this.urbanmapsearchformproprio = new UrbanMap.SearchForm.Proprietaire({
        parcelleGrid : this.parcelleGrid,
        parent : this
      });
        // {{{
        Ext.apply(this, {
          // anything here, e.g. items, tools or buttons arrays,
          // cannot be changed from outside
          title : "Recherche"
				  ,layout: "anchor"
  				,items : [
            this.urbanmapsearchformparcelle,
            this.urbanmapsearchformproprio
          ]
        }); // e/o apply
        // }}}

        // call parent
        UrbanMap.SearchForm.superclass.initComponent.apply(this, arguments);

        // after parent code here, e.g. install event handlers

    } // e/o function initComponent
    // }}}
    ,doMixedSearch: function() {
      var prc_loadParams = this.urbanmapsearchformparcelle.buildLoadParams();
      var prc_queryable = prc_loadParams.params.queryable;
      var prp_loadParams = this.urbanmapsearchformproprio.buildLoadParams();
      var mixed_loadParams = prc_loadParams;
      Ext.apply(mixed_loadParams.params,prp_loadParams.params);
      if(prc_queryable){
        mixed_loadParams.params.queryable = mixed_loadParams.params.queryable + "," +prc_queryable;
      }
      var featureStore = this.parcelleGrid.getStore();
      featureStore.reload(mixed_loadParams);
    }
    // {{{
    ,onRender:function() {

        // before parent code

        // call parent
        UrbanMap.SearchForm.superclass.onRender.apply(this, arguments);

        // after parent code, e.g. install event handlers on rendered components

    } // e/o function onRender
    // }}}

    // any other added/overrided methods

}); // e/o extend

// register xtype
Ext.reg('urbanmapsearchform', UrbanMap.SearchForm);
