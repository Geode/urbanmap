Ext.namespace("UrbanMap.SearchForm");

UrbanMap.SearchForm.Parcelle = Ext.extend(Ext.form.FormPanel, {
    // configurables
    // anything what is here can be configured from outside
     border:false
    ,parcelleGrid:null
    ,collapsible: true

    // {{{
    ,initComponent:function() {
        // {{{
        
      	this.daStore =  new Ext.data.JsonStore({
	  		 url: UrbanMap.config.proxy_url + UrbanMap.config.urbanmap_url + '/picklist/get'
    		,autoDestroy: true
	  		,root: 'results'
	  		,fields: ['value_field','display_field']
	  		,baseParams : {
	  			table_name : 'da'
	  			,display_field : 'dan1'
	  			,value_field : 'da'
	  		}
	  	});
	  	
	  	this.sectionStore =  new Ext.data.JsonStore({
	  		 url: UrbanMap.config.proxy_url + UrbanMap.config.urbanmap_url + '/picklist/get'
    		,autoDestroy: true
	  		,root: 'results'
	  		,fields: ['value_field','display_field']
	  		,baseParams : {
	  			table_name : 'v_sections'
	  			,display_field : 'section_text'
	  			,value_field : 'section'
	  		}	  			  		
	  	});
	  	
        Ext.apply(this, {
            // anything here, e.g. items, tools or buttons arrays,
            // cannot be changed from outside
             title : "Par parcelle"
			,bodyStyle : 'padding:5px'
			,labelWidth : 60
			,defaultType : 'textfield'
			,items : [{
		         xtype: 'combo'
		        ,id: 'daCmb'
		        ,fieldLabel: "Division"
		        ,name: "division"
		        ,triggerAction: "all"
		        ,loadingText: "Chargement..."
		        ,emptyText: "Division..."
		        ,selectOnFocus:true
		        ,store: this.daStore
		        ,mode:'local'
		        ,displayField: "display_field"
		        ,valueField: "value_field"
		        ,forceSelection: true
		        ,editable: false
		        ,width:220
		        ,listeners: {
		        	select : {
		        		fn : function(combo, value) {
		        			//this.sectionStore.load()
		        		}
		        		,scope: this
		        	}
		        }

			},{
				xtype: 'combo'
				,id : 'sectionCmb'
				,fieldLabel: 'Section'
				,mode:'local'
				,triggerAction:'all'
				,name : 'section' 
		        ,emptyText: "..."
		        ,store: this.sectionStore
		        ,displayField: "display_field"
		        ,valueField: "value_field"	
		        ,width: 50 
		        ,editable: false    
		        ,triggerAction : 'all'
			},{
				fieldLabel: 'Radical'
				,name : 'radical'
			},{
				fieldLabel: 'Bis'
				,name : 'bis'
			},{
				fieldLabel: 'Exposant'
				,name : 'exposant'
				,maxLength : 1
			},{
				fieldLabel: 'Situation'
				,name : 'situation'
				,maxLength : 74
			},{
				fieldLabel: 'Nature'
				,name : 'nature'
				,maxLength : 20
			}]
			,buttons : [
				 new Ext.Button({ text:'Effacer'  , handler:this.clearForm,   scope:this })
				,new Ext.Button({ text:'Recherche', handler:this.sendRequest, scope:this })
			]
        }); // e/o apply
        // }}}

        // call parent
        UrbanMap.SearchForm.Parcelle.superclass.initComponent.apply(this, arguments);

        // after parent code here, e.g. install event handlers

    } // e/o function initComponent
    // }}}
    // {{{
    ,onRender:function() {

        // before parent code

        // call parent
        UrbanMap.SearchForm.Parcelle.superclass.onRender.apply(this, arguments);

        // after parent code, e.g. install event handlers on rendered components
        this.daStore.load();
        this.sectionStore.load();
    } // e/o function onRender
    // }}}
    
    // any other added/overrided methods
    ,clearForm: function() {
    	this.getForm().reset();
    }
	,sendRequest: function() {
		var myForm = this.getForm();
		if (!myForm.isValid())
		{
		    Ext.Msg.alert(
    			'Formulaire de recherche de parcelles',
    			'Certaines valeurs sont incorrectes.'
    		);
		} else {
			var featureStore = this.parcelleGrid.getStore();
			var division = myForm.findField("division").getValue();
			var section = myForm.findField("section").getValue();
			var radical = myForm.findField("radical").getValue();
			
			var bis = myForm.findField("bis").getValue();
			var exposant = myForm.findField("exposant").getValue();
			
			var situation = myForm.findField("situation").getValue();
			var nature    = myForm.findField("nature").getValue();
			var loadParams = {params : {limit : UrbanMap.config.result_limit}};
			
			var queryable = []; 
			queryable.push("ins");//Because setting queryable in params override baseparams with the same name	
			if(division != "") {
				queryable.push("da");
				loadParams.params.da__eq = division;
			}	
			if(section != "") {
				queryable.push("section");
				loadParams.params.section__ilike = section;
			}
			if(radical != "" && !isNaN(parseInt(radical))) {
				queryable.push("radical");
				loadParams.params.radical__eq = parseInt(radical);
			}	
			if(bis != "" && !isNaN(parseInt(bis))) {
				queryable.push("bis");
				loadParams.params.bis__eq = parseInt(bis);
			}
			if(exposant != "") {
				queryable.push("exposant");
				loadParams.params.exposant__ilike = exposant;
			}
			if(situation != "") {
				queryable.push("sl1");
				loadParams.params.sl1__ilike = "%" +situation+ "%";
			}
			if(nature != "") {
				queryable.push("na1");
				loadParams.params.na1__ilike = "%" +nature+ "%";
			}
			
			loadParams.params.queryable = queryable.join(",");		
			featureStore.reload(loadParams);
		}
	}
}); // e/o extend

// register xtype
Ext.reg('urbanmapsearchformparcelle', UrbanMap.SearchForm.Parcelle);  