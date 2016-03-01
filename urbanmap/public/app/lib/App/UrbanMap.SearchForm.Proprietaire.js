

Ext.namespace("UrbanMap.SearchForm");

UrbanMap.SearchForm.Proprietaire = Ext.extend(Ext.form.FormPanel, {
    // configurables
    // anything what is here can be configured from outside
     border:false
    ,parcelleGrid:null
    ,parent:null
    ,collapsible: true

    // {{{
    ,initComponent:function() {
        // {{{
        Ext.apply(this, {
            // anything here, e.g. items, tools or buttons arrays,
            // cannot be changed from outside
             title : "Par propriétaire"
			,bodyStyle : 'padding:5px'
			,labelWidth : 75
			,defaultType : 'textfield'
			,items :[{
				fieldLabel : 'Nom',
				name : 'nomprop'
			 },{
				fieldLabel : 'Prenom',
				name : 'prenomprop'
			 },{
				fieldLabel : 'Adresse',
				name : 'adrprop'
			 },{
				fieldLabel : 'Num',
				name : 'numprop'
			 },{
				fieldLabel : 'Code Postal',
				name : 'zipprop'
			 },{
				fieldLabel : 'Localité',
				name : 'localiteprop'
			 }],
			 buttons :[
			 	 new Ext.Button({ text:'Effacer'  , handler:this.clearForm,   scope:this })
			 	,new Ext.Button({ text:'Recherche', handler:this.sendRequest, scope:this })
			 ]
        }); // e/o apply
        // }}}

        // call parent
        UrbanMap.SearchForm.Proprietaire.superclass.initComponent.apply(this, arguments);

        // after parent code here, e.g. install event handlers

    } // e/o function initComponent
    // }}}
    // {{{
    ,onRender:function() {

        // before parent code

        // call parent
        UrbanMap.SearchForm.Proprietaire.superclass.onRender.apply(this, arguments);

        // after parent code, e.g. install event handlers on rendered components

    } // e/o function onRender
    // }}}

    // any other added/overrided methods
    ,clearForm: function() {
    	this.getForm().reset();
    }
    ,buildLoadParams : function() {
      var myForm = this.getForm();
  		var nomProprio = myForm.findField("nomprop").getValue();
  		var prenomProprio = myForm.findField("prenomprop").getValue();

  		var adresseProprio = myForm.findField("adrprop").getValue();
  		var numeroProprio = myForm.findField("numprop").getValue();
  		var zipProprio = myForm.findField("zipprop").getValue();
  		var localiteProprio = myForm.findField("localiteprop").getValue();
  		var loadParams = {params : {limit : UrbanMap.config.result_limit}};

  		var queryable = [];
  		queryable.push("ins");//Because setting queryable in params override baseparams with the same name
  		if (nomProprio != "" || prenomProprio != "") {
  			queryable.push("pe");
  		    if (prenomProprio != "") {
  				loadParams.params.pe__ilike = "%" +nomProprio+ "%,%" + prenomProprio + "%";
  			} else {
  				loadParams.params.pe__ilike = "%" +nomProprio+ "%";
  			}
  		}
  		if (adresseProprio != "") {
  			queryable.push("adr2");
  			loadParams.params.adr2__ilike = "%" +adresseProprio+ "%"+ localiteProprio+ "%"+ numeroProprio + "%";
  		}
  		if (zipProprio != "") {
  			queryable.push("adr1");
  			loadParams.params.adr1__ilike = "%" +zipProprio+ "%";
  		}
  		loadParams.params.queryable = queryable.join(",");
      return loadParams;
    }
    ,sendRequest: function() {
      this.parent.doMixedSearch();
    }

}); // e/o extend

// register xtype
Ext.reg('urbanmapsearchformproprio', UrbanMap.SearchForm.Proprietaire);
