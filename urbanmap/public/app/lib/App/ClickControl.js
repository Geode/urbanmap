     OpenLayers.Control.Click= OpenLayers.Class( OpenLayers.Control, {
            defaultHandlerOptions:{
                'single': true,
                'double': false,
                'pixelTolerance': 0,
                'stopSingle': false,
                'stopDouble': false
            },
           /**
             * Constructor
             */
            initialize: function(options) {
                OpenLayers.Control.prototype.initialize.apply(this,arguments);
                this.handlerOptions= OpenLayers.Util.extend({},this.defaultHandlerOptions);
                this.handler= new OpenLayers.Handler.Click(
                    this, {'click': this.trigger}, this.handlerOptions);
            }

        });