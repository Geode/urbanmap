

Ext.namespace("UrbanMap");

UrbanMap.SearchForm = Ext.extend(Ext.Panel, {
    // configurables
    // anything what is here can be configured from outside
     border:false
    ,parcelleGrid:null
    
    // {{{
    ,initComponent:function() {
        // {{{
        Ext.apply(this, {
            // anything here, e.g. items, tools or buttons arrays,
            // cannot be changed from outside
            	 title : "Recherche"
				,layout: "anchor"
				,items : [{
					 xtype: 'urbanmapsearchformparcelle'
					,parcelleGrid:this.parcelleGrid					
				 },{
					 xtype: 'urbanmapsearchformproprio'
					,parcelleGrid:this.parcelleGrid
				}]
        }); // e/o apply
        // }}}

        // call parent
        UrbanMap.SearchForm.superclass.initComponent.apply(this, arguments);

        // after parent code here, e.g. install event handlers

    } // e/o function initComponent
    // }}}
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


 

