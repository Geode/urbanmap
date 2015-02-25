

Ext.namespace("UrbanMap");

UrbanMap.WMSCapabilitiesWindow = Ext.extend(Ext.Window, {
    // configurables
    // anything what is here can be configured from outside
     border:false
    ,mapPanel:null
    ,width: 600
    ,height: 400
    
    // {{{
    ,initComponent:function() {
        // {{{
        
        // create a new WMS capabilities store
		this.wmsStore = new GeoExt.data.WMSCapabilitiesStore({});
		
		this.grid = new Ext.grid.GridPanel({
			store: this.wmsStore
		    ,columns: [
		    	{header: "Titre", dataIndex: "title", sortable: true}
		        ,{header: "Nom", dataIndex: "name", sortable: true}
		        ,{header: "Questionable", dataIndex: "queryable", sortable: true, width: 70}
		        ,{id: "description", header: "Description", dataIndex: "abstract"}
		    ]
		    ,border: false
		    ,region: 'center'
		    ,autoExpandColumn: "description"
		    ,xtype:'grid'			 			
		});
		
		this.serverListStore =  new Ext.data.JsonStore({
	  		 url: UrbanMap.config.proxy_url + UrbanMap.config.urbanmap_url + '/config/wmslist'
    		,autoDestroy: true
	  		,root: 'servers'
	  		,fields: ['name','url']
	  	});
	  	
        Ext.apply(this, {
            // anything here, e.g. items, tools or buttons arrays,
            // cannot be changed from outside
             title : "Catalogue UrbanMap"
			,layout: 'border'
			,items : [
			{
				region: 'north'
				,border: false
				,height: 50
				,bodyStyle : 'padding:10px'
				,layout: 'form'
				,labelWidth : 150
				,defaultType : 'textfield'
				,items: [{
					xtype: 'combo'
					,id : 'wmsCmb'
					,fieldLabel: 'Serveur à interroger'
					,mode:'local'
					,triggerAction:'all'
					,name : 'serverwms'
					,selectOnFocus:true
				    ,store: this.serverListStore
				    ,displayField: "name"
		        	,valueField: "url"
		        	,listeners : {
		        		'select' : {
		        			fn : function(infos) {
		        				//this.wmsStore.proxy.setUrl("/proxy/get?url="+ escape(infos.getValue()), true);
		        				this.wmsStore.proxy.setUrl(UrbanMap.config.proxy_url + infos.getValue(), true);
		        				this.wmsStore.load();
		        			}
		        			,scope: this
		        		} 
		        	}
		        }]
			}
			,this.grid
			]
			,closeAction   : 'hide'
            ,buttons: [{
                text:'Ajout'
                ,listeners: {
                	'click' : {
                		fn: function() {
			                var record = this.grid.getSelectionModel().getSelected();
			                if(record) {
			                    var copy = record.copy();
			                    // Ext 3.X does not allow circular references in objects passed 
			                    // to record.set 
			                    copy.data["layer"] = record.getLayer();
			                   
			                    copy.getLayer().mergeNewParams({
			                        format: "image/png",
			                        transparent: "true"
			                    });
			                    this.mapPanel.layers.add(copy);
			                    this.hide();
			                }
                		}
                		,scope:this
                	}
                }
            },{
                text: 'Fermer'
                ,listeners : {
                	'click' : {
                		fn : function() {
                			this.hide();
                		}
                		,scope: this
                	}
                }
            }]
        }); // e/o apply
        // }}}

        // call parent
        UrbanMap.WMSCapabilitiesWindow.superclass.initComponent.apply(this, arguments);

        // after parent code here, e.g. install event handlers

    } // e/o function initComponent
    // }}}
    // {{{
    ,onRender:function() {

        // before parent code

        // call parent
        UrbanMap.WMSCapabilitiesWindow.superclass.onRender.apply(this, arguments);

        // after parent code, e.g. install event handlers on rendered components
        this.serverListStore.load();
        
        
    } // e/o function onRender
    // }}}
    
    // any other added/overrided methods

}); // e/o extend

// register xtype
Ext.reg('urbanmapwmscapabilitieswindow', UrbanMap.WMSCapabilitiesWindow);
