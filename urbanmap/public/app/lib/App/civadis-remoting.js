
Ext.namespace("Civadis");

Civadis.remoting = (function() {
    /*
     * Private
     */
    var version = "0.0.1";

    /**
     * Method: findPermisList
     * Wrapper  JS <-> SOAP pour
     * findPermisList(String codeINS, String matriceCadastrale)
     * Retourne la liste des id de permis correspondant à une parcelle cadastrale
     *
     * Returns:
     * Array String : list des id de permis
     */
    var findPermisList = function(codeINS, matriceCadastrale, callback) {
        var payload_template =`
        <soap:Envelope xmlns:soap="http://schemas.xmlsoap.org/soap/envelope/">
            <soap:Body>
              <ns2:findPermisList xmlns:ns2="http://ws.permis.adehis.be/">
                 <arg0>{{code_ins}}</arg0>
                 <arg1>{{capa_key}}</arg1>
              </ns2:findPermisList>
            </soap:Body>
        </soap:Envelope>`;
        payload_template = payload_template.replace('{{code_ins}}',codeINS);
        payload_template = payload_template.replace('{{capa_key}}',matriceCadastrale);
        Ext.Ajax.request({
            url: 'http://192.168.8.5/permis/services/CartoServices',
            method: 'POST',
            headers : {
                'Content-Type': 'text/xml',
                'SOAPAction'  : '[""]'
            },
            xmlData : payload_template,
            success: callback,
            failure: function(){
                console.log('failure');
                console.log(payload_template);
            }
        });
    };
    /*
     * Public
     */
    return {
        echo : function(message) {
          //http://SERVER:PORT/permis/app/rest/carto/echo?name=Jean
          Ext.Ajax.request({
            url: 'http://192.168.8.5/permis/app/rest/carto/echo?name='+message,
            method: 'GET',
            success : function(result, request) {
              console.log('success echo');
              console.log(result.responseText);
            },
            failure: function(message){
                console.log('failure echo');
                console.log(message);
            }
          });
        },
        parcelsinfos : function(codeINS,matriceCadastrale) {
          ///permis/app/rest/carto/findPermisList?codeINS=${codeINS}&matriceCadastrale=${matriceCadastrale}
          Ext.Ajax.request({
            url: 'http://192.168.8.5/permis/app/rest/carto/findPermisList?codeINS='+codeINS+'&matriceCadastrale='+ matriceCadastrale,
            method: 'GET',
            success : function(result, request) {
              console.log('success findPermisList');
              console.log(result);
              console.log(request);
              var parcelleWin = new Ext.Window({
                  title: "Carte d'identité",
                  width: 400,
                  height: 400,
                  autoScroll: true,
                  items: [{
                      border: false,
                      autoScroll: true,
                      html : result.responseText
                  }]
              });
              parcelleWin.show();
            },
            failure: function(message){
                console.log('failure findPermisList');
                console.log(message);
            }
          });
        }
    };
})();
