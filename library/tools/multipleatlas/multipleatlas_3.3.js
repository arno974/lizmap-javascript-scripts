/**
 * @license Mozilla Public License Version 2.0
 * This script has been developed by the "community"
 * There isn't any guarantee that this script will work on another version of Lizmap Web Client.
 */

var lizAtlas = function() {

    lizMap.events.on({
        'uicreated':function(evt){

            // Configure here your atlas. Parameters are the same than the original Lizmap atlas ones.
            // This is an example based on "Montpellier - Transports" project.
            var lizAtlasLayers = {
                layerOptions: {
                    VilleMTP_MTP_Quartiers_2011_432620130116112610876: {
                        atlasMaxWidth: 25,
                        atlasDuration: 5,
                        atlasFeatureLabel: "LIBQUART",
                        atlasZoom: "center",
                        atlasPrimaryKey: "QUARTMNO",
                        atlasTriggerFilter: "False",
                        atlasHighlightGeometry: "True",
                        atlasDisplayLayerDescription: "True",
                        atlasDisplayPopup: "False",
                        atlasSortField: "LIBQUART",
                        atlasAutoPlay: "False"
                    },
                    SousQuartiers20160121124316563: {
                        atlasMaxWidth: 25,
                        atlasDuration: 5,
                        atlasFeatureLabel: "LIBSQUART",
                        atlasZoom: "zoom",
                        atlasPrimaryKey: "SQUARTMNO",
                        atlasTriggerFilter: "False",
                        atlasHighlightGeometry: "True",
                        atlasDisplayLayerDescription: "True",
                        atlasDisplayPopup: "False",
                        atlasSortField: "LIBSQUART",
                        atlasAutoPlay: "False"
                    }
                },
                globalOptions: {
                    atlasShowAtStartup: "True"
                }
            }

            var lizAtlasLayersCount = Object.keys(lizAtlasLayers.layerOptions).length;
            var getFeatureDataCallbackCounter = 0;

            var atlasGlobalOptions = lizAtlasLayers.globalOptions;
            var lizAtlasGlobalConfig = {
                'showAtStartup': atlasGlobalOptions['atlasShowAtStartup'] == 'True' ? true : false
            };

            var lizAtlasConfigArray = [];

            var layerOrder = 0;

            for(var layerId in lizAtlasLayers.layerOptions){
                var getLayerConfig = lizMap.getLayerConfigById( layerId );
                if ( !getLayerConfig )
                    return;
                var layerConfig = getLayerConfig[1];
                var featureType = getLayerConfig[0];

                var atlasLayerOptions = lizAtlasLayers.layerOptions[layerId];

                var primaryKey = atlasLayerOptions['atlasPrimaryKey'] != '' ? atlasLayerOptions['atlasPrimaryKey'] : null;
                if(!primaryKey)
                    return;
                var titleField = atlasLayerOptions['atlasFeatureLabel'] != '' ? atlasLayerOptions['atlasFeatureLabel'] : null;
                if(!titleField)
                    return;
                var sortField = atlasLayerOptions['atlasSortField'] != '' ? atlasLayerOptions['atlasSortField'] : titleField;

                var lizAtlasConfig = {
                    'layername': featureType,
                    'layerId': layerConfig.id,
                    'displayLayerDescription': atlasLayerOptions['atlasDisplayLayerDescription'] == 'True' ? true : false,
                    'primaryKey': primaryKey,
                    'titleField': titleField,
                    'sortField': sortField,
                    'duration': atlasLayerOptions['atlasDuration'],
                    'autoPlay': atlasLayerOptions['atlasAutoPlay'] == 'True' ? true : false,
                    'maxWidth': atlasLayerOptions['atlasMaxWidth'] +'%',
                    'drawFeatureGeom': atlasLayerOptions['atlasHighlightGeometry'] == 'True' ? true : false,
                    'atlasDisplayPopup': atlasLayerOptions['atlasDisplayPopup'] == 'True' ? true : false,
                    'triggerFilter': atlasLayerOptions['atlasTriggerFilter'] == 'True' ? true : false,
                    'zoom': atlasLayerOptions['atlasZoom'] == '' ? false : atlasLayerOptions['atlasZoom']
                };
                var lizAtlasTimer;

                // Launch Atlas feature
                getAtlasData(lizAtlasConfig, layerOrder);
                layerOrder++;
            }

            function getAtlasData(lizAtlasConfig, layerOrder) {

                var featureType = lizAtlasConfig.layername;

                // Get data
                lizMap.getFeatureData(featureType, featureType+':', null, 'geom', false, null, null,
                    function(aName, aFilter, aFeatures, aAliases) {

                        lizAtlasConfig['features'] = aFeatures;
                        lizAtlasConfig['featureType'] = featureType;
                        prepareFeatures(lizAtlasConfig);

                        lizAtlasConfigArray[layerOrder] = lizAtlasConfig;

                        // Launch atlas when last ajax request had finished
                        getFeatureDataCallbackCounter++;
                        if(getFeatureDataCallbackCounter === lizAtlasLayersCount){
                            launchAtlas(lizAtlasConfigArray, lizAtlasGlobalConfig);
                        }
                        
                        $('body').css('cursor', 'auto');
                        return false;
                    });
            }

            function updateAtlasData() {
                // Get data
                lizMap.getFeatureData(lizAtlasConfig['featureType'], lizAtlasConfig['featureType']+':', null, 'geom', false, null, null,
                    function(aName, aFilter, aFeatures, aAliases){
                        lizAtlasConfig['features'] = aFeatures;
                        prepareFeatures();

                        var options = '<option value="-1"> --- </option>';
                        var pkey_field = lizAtlasConfig['primaryKey'];
                        for(var i in lizAtlasConfig['features_sorted']){
                            var item = lizAtlasConfig['features_sorted'][i];

                            // Add option
                            options+= '<option value="'+i+'">';
                            options+= item[lizAtlasConfig['titleField']];
                            options+= '</option>';
                        }

                        var val = $('#liz-atlas-select').val();
                        $('#liz-atlas-select').html(options);
                        // reset val
                        $('#liz-atlas-select').val(val);
                        // get popup
                        $('#liz-atlas-select').change();

                        return false;
                    });
            }

            function prepareFeatures(lizAtlasConfig){

                // Get and order features
                lizAtlasConfig['features_with_pkey'] = {};
                var items = [];
                var pkey_field = lizAtlasConfig['primaryKey'];
                var s_field = lizAtlasConfig['sortField'];
                if ( !s_field )
                    s_field = pkey_field;
                for(var i in lizAtlasConfig.features){

                    // Get feature
                    var feat = lizAtlasConfig.features[i];
                    var fid = feat.id.split('.').pop();
                    var pk_val = feat.properties[pkey_field];

                    // Add feature in dictionary for further ref
                    lizAtlasConfig['features_with_pkey'][pk_val] = feat;

                    // Add feature to sorted oject
                    items.push(feat.properties);
                }

                items.sort(function(a, b) {
                    var nameA = a[s_field];
                    var nameB = b[s_field];
                    if( typeof(nameA) == 'string' || typeof(nameB) == 'string' ){
                        if (!nameA)
                            nameA = '';
                        else
                            nameA = nameA.toUpperCase(); // ignore upper and lowercase
                        if (!nameB)
                            nameB = '';
                        else
                            nameB = nameB.toUpperCase(); // ignore upper and lowercase
                    }
                    if (nameA < nameB) {
                        return -1;
                    }
                    if (nameA > nameB) {
                        return 1;
                    }

                    // names must be equal
                    return 0;
                });

                lizAtlasConfig['features_sorted'] = items;
            }

            function getAtlasHome(lizAtlasConfig){


                var home = '';

                // Add description
                if( lizAtlasConfig['displayLayerDescription'] ){
                    var labstract = lizMap.config.layers[lizAtlasConfig.layername]['abstract'];
                    if(labstract != ''){
                        home+= '<p id="liz-atlas-item-layer-abstract">' + lizMap.config.layers[lizAtlasConfig.layername]['abstract'] + '</p>';
                    }
                }

                // Add combobox with all data
                home+= '<p style="padding:0px 10px;">';
                home+= '<select id="liz-atlas-select">';
                home+= '<option value="-1"> --- </option>';
                var pkey_field = lizAtlasConfig['primaryKey'];
                for(var i in lizAtlasConfig['features_sorted']){
                    var item = lizAtlasConfig['features_sorted'][i];

                    // Add option
                    home+= '<option value="'+i+'">';
                    home+= item[lizAtlasConfig['titleField']];
                    home+= '</option>';
                }
                home+= '</select>';
                home+= '<br><span>';
                home+= '<button class="btn btn-mini btn-primary liz-atlas-item" value="-1">'+lizDict['atlas.toolbar.prev']+'</button>';
                home+= '&nbsp;';
                home+= '<button class="btn btn-mini btn-primary liz-atlas-item" value="1">'+lizDict['atlas.toolbar.next']+'</button>';
                home+= '&nbsp;';
                home+= '<button class="btn btn-mini btn-wanrning liz-atlas-run" value="1">'+lizDict['atlas.toolbar.play']+'</button>';
                home+= '&nbsp;';
                home+= '</span>';
                home+= '</span>';
                home+= '</br>';
                home+= '</p>';
                home+= '<div id="liz-atlas-item-detail" style="display:none;">';
                home+= '</div>';
                home+= '</div>';

                lizAtlasConfig.home = home;
                return home;
            }

            function launchAtlas(lizAtlasConfigArray, lizAtlasGlobalConfig){
                // Build select to choose between atlas layers
                var select = '<select id="select-atlas-layer">';
                for (var i = 0; i < lizAtlasConfigArray.length; i++) {
                    select += '<option value="'+lizAtlasConfigArray[i].layerId+'">'+lizMap.config.layers[lizAtlasConfigArray[i].layername]['title']+'</option>';
                }

                select += '</select>';

                select += '<div id="atlas-content" style="border-top: #F0F0F0 dashed 1px;padding-top: 5px;"></div>';

                // Add dock
                lizMap.addDock(
                    'atlas',
                    lizDict['atlas.toolbar.title'],
                    'right-dock',
                    select,
                    'icon-globe'
                );

                $('#select-atlas-layer')
                .change( function(){
                    // deactivate current atlas
                    deactivateAtlas();

                    var layerId = $(this).val();

                    for (var i = 0; i < lizAtlasConfigArray.length; i++) {
                        if(layerId === lizAtlasConfigArray[i].layerId){
                            lizAtlasConfig = lizAtlasConfigArray[i];

                            // Get Atlas home
                            var home = getAtlasHome(lizAtlasConfig);

                            $("#atlas-content").html(home);

                            // Add events
                            activateAtlasTrigger(lizAtlasConfig);

                            // Only if features in layer
                            if( lizAtlasConfig.features.length != 0 ) {
                                // Activate filter
                                if ( lizAtlasConfig.triggerFilter && lizAtlasConfig.hideFeaturesAtStratup ) {
                                    // Select feature
                                    lizMap.events.triggerEvent('layerfeatureselected',
                                        {'featureType': lizAtlasConfig.featureType, 'fid': -99999, 'updateDrawing': false}
                                    );
                                    // Filter selected feature
                                    lizMap.events.triggerEvent('layerfeaturefilterselected',
                                        {'featureType': lizAtlasConfig.featureType}
                                    );
                                }
                            }

                            lizMap.events.triggerEvent("uiatlascreated", lizAtlasConfig);

                            lizMap.events.on({
                                lizmapeditionfeaturecreated: function(e) {
                                    if ( e.layerId == lizAtlasConfig.layerId )
                                        updateAtlasData();
                                },
                                lizmapeditionfeaturemodified: function(e) {
                                    if ( e.layerId == lizAtlasConfig.layerId )
                                        updateAtlasData();
                                },
                                lizmapeditionfeaturedeleted: function(e) {
                                    if ( e.layerId == lizAtlasConfig.layerId )
                                        updateAtlasData();
                                }
                            });

                            // Start animation
                            if( lizAtlasConfig['autoPlay'] && !lizMap.checkMobile() ){
                                $('button.liz-atlas-run').click();
                            }
                            
                        }
                    }

                    lizMap.events.triggerEvent("atlasready", lizAtlasConfig);
                    return false;
                });

                // Display first atlas layer
                $('#select-atlas-layer').change();

                // Show dock
                if( lizAtlasGlobalConfig['showAtStartup'] && !lizMap.checkMobile() ){
                    $('#mapmenu li.atlas:not(.active) a').click();
                    // Hide legend
                    $('#mapmenu li.switcher.active a').click();
                }

                // Limit dock size
                adaptAtlasSize();

            }

            function adaptAtlasSize(){
                lizMap.events.on({
                    // Adapt dock size to display metadata
                    rightdockopened: function(e) {
                        if ( e.id == 'atlas') {
                            // Size : add class to content to enabled specific css to be applied
                            $('#content').addClass('atlas-visible');
                            lizMap.updateContentSize();

                        }
                    },
                    rightdockclosed: function(e) {
                        if ( e.id == 'atlas' ) {

                            // Set right-dock default size by removing #content class
                            $('#content').removeClass('atlas-visible');
                            lizMap.updateContentSize();

                            // Deactivate atlas and stop animation
                            deactivateAtlas();
                        }
                    }
                });
            }

            function activateAtlasTrigger(){
                $('#liz-atlas-select')
                .change( function(){
                    var i = $(this).val();
                    var len = lizAtlasConfig['features_sorted'].length;

                    if( i == -1 ){
                        deactivateAtlas();
                        return false;
                    }
                    if( i && i>= 0 && i < len ){
                        var item = lizAtlasConfig['features_sorted'][i];

                        var pkey_field = lizAtlasConfig['primaryKey'];

                        if(item[pkey_field] in lizAtlasConfig['features_with_pkey'] ){
                            var feature = lizAtlasConfig['features_with_pkey'][item[pkey_field]];
                            runAtlasItem( feature );

                        }else{
                            console.log("no feature found");
                        }
                    }
                    return false;
                });

                $('#atlas div.menu-content button.liz-atlas-item')
                .click(function(){
                    var a = parseInt($(this).val());
                    var curval = parseInt($('#liz-atlas-select').val());
                    var nextval = a + curval;
                    var len = lizAtlasConfig['features_sorted'].length;
                    if(nextval >= len){
                        nextval = 0;
                    }
                    if( nextval >= 0 && nextval < len){
                        $('#liz-atlas-select').val(nextval).change();
                    }
                    return false;
                });

                // Timer
                $('#atlas div.menu-content button.liz-atlas-run').click(function(){
                    // Get button value
                    var a = $(this).val();

                    // Get animation duration
                    var duration = lizAtlasConfig.duration;
                    if( !(parseInt(duration) > 0) )
                        duration = 5;
                    var step = parseInt(duration) * 1000;
                    if(step < 2 || step > 60000){
                        step = 5000;
                    }

                    // Run or stop animation
                    if( a == '1' ){
                        // Click on the next button
                        $('button.liz-atlas-item[value="1"]').click();

                        // Change the run button value into 0
                        $(this).val(0);

                        // Change button look
                        $(this).text(lizDict['atlas.toolbar.stop']).addClass('btn-danger');

                        // Run timer
                        lizAtlasTimer = setInterval(function(){
                            // Click on then next button for each step
                            $('button.liz-atlas-item[value="1"]').click();
                        }, step);
                    }else{
                        deactivateAtlas();
                    }
                });
            }


            function runAtlasItem(feature){

                // Use OL tools to reproject feature geometry
                var format = new OpenLayers.Format.GeoJSON();
                var feat = format.read(feature)[0];
                var f = feat.clone();
                var proj = lizMap.config.layers[lizAtlasConfig.layername]['featureCrs'];
                f.geometry.transform(proj, lizMap.map.getProjection());

                // Zoom to feature
                if( lizAtlasConfig['zoom']){
                    if( lizAtlasConfig['zoom'].toLowerCase() == 'center' ){
                        // center
                        var lonlat = f.geometry.getBounds().getCenterLonLat();
                        lizMap.map.setCenter(lonlat);
                    }
                    else{
                        // zoom
                        lizMap.map.zoomToExtent(f.geometry.getBounds());
                    }
                }

                // Draw feature geometry
                var getLayer = lizMap.map.getLayersByName('locatelayer');
                if ( lizAtlasConfig.drawFeatureGeom && getLayer.length > 0 ){
                    alayer = getLayer[0];
                    alayer.destroyFeatures();
                    alayer.addFeatures([f]);
                }

                // Display popup
                if( lizAtlasConfig['atlasDisplayPopup'] ){
                    lizMap.getFeaturePopupContent(lizAtlasConfig.featureType, feature, function(data){
                        var popupContainerId = 'liz-atlas-item-detail';
                        // Add class to table
                        var popupReg = new RegExp('lizmapPopupTable', 'g');
                        text = data.replace( popupReg, 'table table-condensed lizmapPopupTable');
                        var text = '<div class="lizmapPopupContent">'+text+'</div>';
                        // Remove <h4> with layer title
                        var titleReg = new RegExp('<h4>.+</h4>');
                        text = text.replace(titleReg, '');
                        $('#'+popupContainerId).html(text).show();

                        // Trigger event ? a bit buggy
                        lizMap.events.triggerEvent("lizmappopupdisplayed", {'popup': null, 'containerId': popupContainerId} );

                        // Add children
                        lizMap.addChildrenFeatureInfo( data, popupContainerId );
                        // Display the plots of the children layers features filtered by popup item
                        lizMap.addChildrenDatavizFilteredByPopupFeature( data, popupContainerId );

                    });
                }

                // Trigger Filter
                if( lizAtlasConfig['triggerFilter'] ){

                    var fid = feature.id.split('.').pop();

                    // Select feature
                    lizMap.events.triggerEvent('layerfeatureselected',
                        {'featureType': lizAtlasConfig.featureType, 'fid': fid, 'updateDrawing': false}
                    );
                    // Filter selected feature
                    lizMap.events.triggerEvent('layerfeaturefilterselected',
                        {'featureType': lizAtlasConfig.featureType}
                    );
                }
            }

            function deactivateAtlas(){
                // Stop animation
                if( lizAtlasTimer ){
                    var btrun = $('#atlas div.menu-content button.liz-atlas-run');
                    // Change button value
                    btrun.val(1);

                    // Change button look
                    btrun.text(lizDict['atlas.toolbar.play']).removeClass('btn-danger');

                    // Reset interval and time
                    clearInterval(lizAtlasTimer);
                    lizAtlasTimer = null;
                }

                // Deactivate highlight
                var layer = lizMap.map.getLayersByName('locatelayer');
                if ( lizAtlasConfig.drawFeatureGeom && layer.length > 0 ){
                    layer = layer[0];
                    layer.destroyFeatures();
                }

                // Deactivate filter
                if ( lizAtlasConfig.triggerFilter && lizMap.lizmapLayerFilterActive ){
                    if ( lizAtlasConfig.hideFeaturesAtStratup ) {
                        // Select feature
                        lizMap.events.triggerEvent('layerfeatureselected',
                            {'featureType': lizAtlasConfig.featureType, 'fid': -99999, 'updateDrawing': false}
                        );
                        // Filter selected feature
                        lizMap.events.triggerEvent('layerfeaturefilterselected',
                            {'featureType': lizAtlasConfig.featureType}
                        );
                    } else
                        lizMap.events.triggerEvent( "layerfeatureremovefilter",
                            { 'featureType': lizAtlasConfig.featureType}
                        );
                }
                // Hide some containers
                $('#liz-atlas-item-detail').hide();
            }

        } // uicreated
    });
}();
