/*
 * Copyright (C) 2009  Camptocamp
 *
 * This file is part of GeoBretagne
 *
 * MapFish Client is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * GeoBretagne is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with GeoBretagne.  If not, see <http://www.gnu.org/licenses/>.
 */

Ext.namespace("UrbanMap");

UrbanMap.LayerStore = Ext.extend(GeoExt.data.LayerStore, {
    add: function(records) {
       records = this.filter(records);
       UrbanMap.LayerStore.superclass.add.call(this, records);
    },
    insert: function(index, records) {
       records = this.filter(records);
       UrbanMap.LayerStore.superclass.insert.call(this, index, records);
    },
        
    /**
     * Method: filter
     * Filter the records and set "hideInLegend" in the records
     * when necessary (so the corresponding layers don't appear
     * in the legend panel).
     * Also modifies attribution field if necessary.
     * Generally speaking, handles every operation needed before 
     * the records are added to the layerStore.
     *
     * Parameters:
     * records - {Array({GeoExt.data.LayerRecord})} The records.
     *
     * Returns:
     * {Array({GeoExt.data.LayerRecord})} The records that pass
     *     the filter.
     */
    filter: function(records) {
        var errors = [], keep = [];
        var checkl = this.checkLayer;
        var themap = this.map;
        Ext.each(records, function(r) {
            var error = checkl(r,themap);
            if (error) {
                // these are just warnings in fact, not errors 
                // see http://csm-bretagne.fr/redmine/issues/1749
                errors.push(error);
            } 
            
            // Note: queryable is required in addition to opaque, 
            // because opaque is not a standard WMC feature
            // This enables us to remove rasters from legend panel
            if (r.get("opaque") === true || r.get("queryable") === false) { 
                // this record is valid, set its "hideInLegend"
                // data field to true if the corresponding layer
                // is a raster layer, i.e. its "opaque" data
                // field is true
                r.set("hideInLegend", true);
                // we set opaque to true so that non queryable 
                // layers are considered as baselayers
                r.set("opaque", true);
            }
            // Note that the ultimate solution would be to do a getCapabilities 
            // request for each OGC server advertised in the WMC
            
            // Format attribution if required:
            var attr = r.get('attribution');
            var layer = r.get('layer');
            if (!attr || !attr.title) {
                var a;
                if (layer.url) {
                    var b = OpenLayers.Util.createUrlObject(layer.url);
                    if (b && b.host) {
                        a = b.host;
                    }
                }
                r.set('attribution', {
                    title: a || 'urbanmap'
                });
            }
            
            // set layer.metadataURL if record has metadataURLs
            // so that this can be saved in a WMC context
            if (r.get('metadataURLs') && r.get('metadataURLs')[0]) {
                layer.metadataURL = [r.get('metadataURLs')[0]];
            }
            
            // Errors should be non-blocking since http://csm-bretagne.fr/redmine/issues/1749
            // so we "keep" every layer, and only display a warning message
            keep.push(r);
        });
        
        if (errors.length > 0) {
            GEOB.util.infoDialog({
                title: 'Avertissement suite au chargement de couche',
                msg: errors.join('<br />')
            });
        }
        return keep;
    },

    /**
     * Method: checkLayer
     * Checks if the layer is valid (i.e. can be added to the LayerStore).
     * Doesn't return anything if the layer is valid, returns an error message
     *    if not.
     *
     * Returns:
     * {String} An error message.
     */
    checkLayer : function(r,map) {
        var prefix = 'La couche <b>"' + r.get('title') + '"</b>' +
                     ' pourrait ne pas apparaître pour la raison suivante : ';

        var minScale = r.get('minScale');
        var maxScale = r.get('maxScale');

        // check if min and max scales are valid (i.e. positive)
        if ((minScale && minScale < 0) || (maxScale && maxScale < 0)) {
            return  prefix + OpenLayers.i18n('Les échelles min/max de visibilité sont invalides.');
        }

        // check if scales are in a valid range (compared to the map scales)
        if (map.baseLayer && (
            (minScale && minScale < map.baseLayer.maxScale) ||
            (maxScale && maxScale > map.baseLayer.minScale))) {
            return prefix + OpenLayers.i18n('La plage de visibilité ne correspond pas aux échelles de la carte.');
        }

        // check if layer extent and map extent match
        if (r.get('llbbox')) {
            var llbbox = r.get('llbbox'); 
            llbbox = new OpenLayers.Bounds(llbbox[0], llbbox[1], llbbox[2], llbbox[3]);
            
            var mapbbox = map.getMaxExtent().clone();
            mapbbox.transform(
                map.getProjectionObject(),
                new OpenLayers.Projection("EPSG:4326")
            );
            
            if (!llbbox.intersectsBounds(mapbbox)) {
                return prefix + "L'étendue géographique ne correspond pas à celle de la carte.";
            }
        }
    }
}); // e/o extend

// register xtype
Ext.reg('urbanmaplayerstore', UrbanMap.LayerStore);