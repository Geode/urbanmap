

Ext.namespace("UrbanMap");

UrbanMap.ParamForm = Ext.extend(Ext.form.FormPanel, {
    // configurables
    // anything what is here can be configured from outside
     border:false
     ,maxNumberOfResult:1000
     ,minNumberOfResult:50

    // {{{
    ,initComponent:function() {
        // {{{
        Ext.apply(this, {
            // anything here, e.g. items, tools or buttons arrays,
            // cannot be changed from outside
            title : "Paramètres de configuration"
    			  ,bodyStyle : 'padding:5px'
    			  ,labelWidth : 75
    			  ,defaultType : 'textfield'
    			  ,items : [{
    				fieldLabel: 'Buffer (m)'
    				,name : 'buffer'
    				,xtype : 'numberfield'
    				,decimalPrecision : 0
    				,maxValue : 2000
    				,minValue : 1
    				,value : UrbanMap.config.buffer_width
    			},{
    				fieldLabel: 'Limite de résultats'
    				,name : 'resultlimit'
    				,xtype : 'numberfield'
    				,decimalPrecision : 0
    				,maxValue : this.maxNumberOfResult
    				,minValue : this.minNumberOfResult
    				,value : UrbanMap.config.result_limit
    			}]
				,buttons : [
				   new Ext.Button({ text:'Réinitialiser', handler:this.resetForm, scope:this }),
					 new Ext.Button({ text:'Appliquer', handler:this.setParameters, scope:this })
				]
        }); // e/o apply
        // }}}

        // call parent
        UrbanMap.ParamForm.superclass.initComponent.apply(this, arguments);

        // after parent code here, e.g. install event handlers

    } // e/o function initComponent
    // }}}
    // {{{
    ,onRender:function() {

        // before parent code

        // call parent
        UrbanMap.ParamForm.superclass.onRender.apply(this, arguments);

        // after parent code, e.g. install event handlers on rendered components

    } // e/o function onRender
    // }}}

    // any other added/overrided methods
	,setParameters: function() {
		var myForm = this.getForm();
		var buffer = myForm.findField("buffer").getValue();
		UrbanMap.config.buffer_width = buffer;
		var resultlimit = myForm.findField("resultlimit").getValue();
		if (resultlimit > this.maxNumberOfResult)
		{
			resultlimit = this.maxNumberOfResult;
			myForm.findField("resultlimit").setValue(this.maxNumberOfResult);
		}

		if (resultlimit < this.minNumberOfResult)
		{
			resultlimit = this.minNumberOfResult;
			myForm.findField("resultlimit").setValue(this.minNumberOfResult);

		}
		UrbanMap.config.result_limit = resultlimit;

    	Ext.Msg.show({
            title: 'Configuration des parmètres',
            msg: 'paramètres enregistrés',
            minWidth: 200,
            modal: true,
            icon: Ext.Msg.INFO,
            buttons: Ext.Msg.OK
        });
	}

	,resetForm : function() {
		this.getForm().reset();
		this.setParameters();
	}

}); // e/o extend

// register xtype
Ext.reg('urbanmapparamform', UrbanMap.ParamForm);
