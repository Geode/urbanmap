<!DOCTYPE html>
<html>
    <head>
        <meta http-equiv="content-type" content="text/html; charset=utf-8" />
        <meta http-equiv="content-language" content="fr" />
        <title>URBAN Map</title>
        <style type="text/css" media="screen">
	        #loading-mask{
		        background-color:white;
		        height:100%;
		        position:absolute;
		        left:0;
		        top:0;
		        width:100%;
		        z-index:20000;
			}
			#loading{
		        height:auto;
		        position:absolute;
		        width: 300px;
		        left:40%;
		        top:40%;
		        padding:2px;
		        z-index:20001;
	    	}
		    #loading a {
		        color:#225588;
		    }
		    #loading .loading-indicator{
		        background:white;
		        color:#444;
		        font:bold 13px Helvetica, Arial, sans-serif;
		        height:auto;
		        margin:0;
		        padding:10px;
		        border: 1px solid black;
		    }
		    #loading-msg {
		        font-size: 10px;
		        font-weight: normal;
		    }
		    #loading-title{
		    	font-size: 2em;
		    	font-weight: bold;
		    }
        </style>
        <link rel="stylesheet" type="text/css" href="http://89.16.179.114:5000/lib/ext/Ext/resources/css/ext-all.css"/>
	    <link rel="stylesheet" type="text/css" href="http://89.16.179.114:5000/lib/ext/Ext/resources/css/xtheme-gray.css"/>
	    <link rel="stylesheet" type="text/css" href="http://89.16.179.114:5000/lib/openlayers/theme/default/style.css"/>
	    <link rel="stylesheet" type="text/css" href="http://89.16.179.114:5000/lib/ext/Ext/ux/grid.RowActions.css"/>
	    <link rel="stylesheet" type="text/css" href="http://89.16.179.114:5000/app/css/main.css"/>
    </head>

    <body>
    

    
    <script type="text/javascript" src="http://89.16.179.114:5000/lib/ext/Ext/adapter/ext/ext-base.js"></script>
    
    <!--Debug mode (begin) -->
    <!--<script type="text/javascript" src="http://89.16.179.114:5000/lib/openlayers/lib/OpenLayers.js"></script>-->
    <!--<script type="text/javascript" src="http://89.16.179.114:5000/lib/geoext/lib/GeoExt.js"></script>-->
    <!--<script type="text/javascript" src="http://89.16.179.114:5000/lib/ext/Ext/ext-all-debug.js"></script>-->
    <!--Debug mode (end) -->
    
    <!-- non debug mode (begin) -->
    <script type="text/javascript" src="lib/ext/Ext/ext-all-debug.js"></script>
    <script type="text/javascript" src="lib/openlayers/lib/OpenLayers.js"></script>
    <script type="text/javascript" src="lib/geoext/lib/GeoExt.js"></script>
    <!-- non debug mode (end) -->
     
    
    <!-- The script below will load the configuration of the application -->
    <script type="text/javascript" src="http://89.16.179.114:5000/config/index"></script>
    <!-- The script below will load the capabilities of the print service
         and save them into the global printCapabilities variable. Instead
         of this, the PrintProvider can be configured with a url and take
         care of fetching the capabilities. --> 
    <script type="text/javascript" src="http://89.16.179.114:5000/print/info.json?var=printCapabilities"></script>
       
    
    <!-- debug mode (begin) -->
    <script type="text/javascript" src="http://89.16.179.114:5000/app/lib/App/ClickControl.js"></script>
    <script type="text/javascript" src="http://89.16.179.114:5000/lib/ext/Ext/ux/grid.RowActions.js"></script>
    <script type="text/javascript" src="http://89.16.179.114:5000/app/lib/App/UrbanMap.PrintForm.js"></script> 
    <script type="text/javascript" src="http://89.16.179.114:5000/app/lib/App/UrbanMap.ParcelleGrid.js"></script>     
    <script type="text/javascript" src="http://89.16.179.114:5000/app/lib/App/UrbanMap.SearchForm.js"></script>
    <script type="text/javascript" src="http://89.16.179.114:5000/app/lib/App/UrbanMap.SearchForm.Proprietaire.js"></script>
    <script type="text/javascript" src="http://89.16.179.114:5000/app/lib/App/UrbanMap.SearchForm.Parcelle.js"></script>
    <script type="text/javascript" src="http://89.16.179.114:5000/app/lib/App/UrbanMap.ParamForm.js"></script>
    
    <script type="text/javascript" src="app/lib/App/GEOB_util.js"></script>
    <script type="text/javascript" src="app/lib/App/GEOB_ows.js"></script>
    <script type="text/javascript" src="app/lib/App/GEOB_managelayers.js"></script>
    <script type="text/javascript" src="app/lib/App/GEOB_FeatureDataModel.js"></script>
    <script type="text/javascript" src="app/lib/App/GEOB_resultspanel.js"></script>
    <script type="text/javascript" src="app/lib/App/GEOB_getfeatureinfo.js"></script>
    
    <script type="text/javascript" src="http://89.16.179.114:5000/app/lib/App/UrbanMap.MapPanel.js"></script>
    <script type="text/javascript" src="http://89.16.179.114:5000/app/lib/App/UrbanMap.WMSLegend.js"></script>
    <script type="text/javascript" src="http://89.16.179.114:5000/app/lib/App/UrbanMap.TreePanel.js"></script>
    <script type="text/javascript" src="http://89.16.179.114:5000/app/lib/App/UrbanMap.WMSCapabilitiesWindow.js"></script>
    <script type="text/javascript" src="http://89.16.179.114:5000/app/lib/App/UrbanMap.UrbanLayerNode.js"></script>
    <script type="text/javascript" src="app/lib/App/UrbanMap.LayerStore.js"></script>
 
    <script type="text/javascript" src="app/lib/App/UrbanMap.WMCReader.js"></script>
        
    <script type="text/javascript" src="app/lib/App/urban-layout.js"></script>
    <script type="text/javascript" src="app/lib/App/urban-map.js"></script>   
    <!-- debug mode (end) -->
        
    <!-- non debug mode (begin) -->
    <!--
    <script type="text/javascript" src="build/app.js"></script>
   -->
    <!-- non debug mode (end) -->

	<div id="urbanmapctn" style="width:1024px; height:800px"></div>
    </body>
</html>
