lizMap.events.on({
	'uicreated': function(e) {
		//set here the style parameters you want to change. example here with red color
		var sketchSymbolizers = {
			"Point": {
				pointRadius: 4,
				graphicName: "square",
				fillColor: "white",
				fillOpacity: 1,
				strokeWidth: 1,
				strokeOpacity: 1,
				strokeColor: "#ce1f2d"
			},
			"Line": {
				strokeWidth: 3,
				strokeOpacity: 1,
				strokeColor: "#ce1f2d",
				strokeDashstyle: "dash"
			},
			"Polygon": {
				strokeWidth: 2,
				strokeOpacity: 1,
				strokeColor: "#ce1f2d",
				strokeDashstyle: "dash",
				fillColor: "#ce1f2d",
				fillOpacity: 0.5
			}
		};
		var style = new OpenLayers.Style();
		style.addRules([
		new OpenLayers.Rule({symbolizer: sketchSymbolizers})
		]);
		var styleMap = new OpenLayers.StyleMap({"default": style});			
		var measureCtrl = lizMap.map.getControlsByClass("OpenLayers.Control.Measure");
		for(i in measureCtrl){
			measureCtrl[i].handlerOptions.layerOptions.styleMap = styleMap;
		}
	}
});
