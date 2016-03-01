

Ext.namespace("UrbanMap");

UrbanMap.ParamForm = Ext.extend(Ext.form.FormPanel, {
    // configurables
    // anything what is here can be configured from outside
     border:false
     ,maxNumberOfResult:1000
     ,minNumberOfResult:50
     ,BUFFER_WIDTH_KEY :"buffer_width"
     ,RESULT_LIMIT_KEY :"result_limit"

    // {{{
    ,initComponent:function() {
        var local_buffer_width = this.getLocalSetting(this.BUFFER_WIDTH_KEY);
        if(local_buffer_width){
          UrbanMap.config.buffer_width = local_buffer_width;
        }
        var local_result_limit = this.getLocalSetting(this.RESULT_LIMIT_KEY);
        if(local_result_limit){
          UrbanMap.config.result_limit = local_result_limit;
        }
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
    this.setLocalSetting(this.BUFFER_WIDTH_KEY,buffer);

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
    this.setLocalSetting(this.RESULT_LIMIT_KEY, resultlimit);
    
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
  ,getLocalSetting : function(key_name) {
    if(typeof(Storage) !== "undefined") {
      return localStorage.getItem(key_name);
    } else {
      return null;
    }
  }
  ,setLocalSetting : function(key_name, value) {
    if(typeof(Storage) !== "undefined") {
      return localStorage.setItem(key_name, value);
    } else {
      return null;
    }
  }

}); // e/o extend

// register xtype
Ext.reg('urbanmapparamform', UrbanMap.ParamForm);
