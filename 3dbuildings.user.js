// ==UserScript==
// @name GEFS buildings
// @description Adds community added buildings to GEFS
// @namespace GEFS-Plugins
// @match http://www.gefs-online.com/gefs.php*
// @match http://gefs-online.com/gefs.php*
// @run-at document-end
// @version 1
// @grant unsafeWindow
// ==/UserScript==

var BUILDINGS = null;
var BUILDINGS_IN_WORLD = [];

var distance = function (a, b)
{
    return Math.sqrt((a[0] - b[0]) * (a[0] - b[0]) + (a[1] - b[1]) * (a[1] - b[1]));
}

$.getJSON("https://yotam1-1212.appspot.com/model.glb?href=gs://yotamsbucket/buildings.json", function (data)
{
    BUILDINGS = data[0]['buildings'];
    console.log(BUILDINGS);
});

buildingsInterval = setInterval(function ()
{
    if (!BUILDINGS) return;
    for (var i = 0; i < BUILDINGS.length; i++) {
        if (distance(gefs.aircraft.llaLocation, BUILDINGS[i]['location']) <= 0.1 && !BUILDINGS[i]['onscreen']) {
            var model = gefs.api.loadModel("https://yotam1-1212.appspot.com/model.glb?href=" + BUILDINGS[i]['model']);
            gefs.api.setModelPositionOrientationAndScale(model, BUILDINGS[i]['location'], [0, 0, 0], [1, 1, 1]);
            BUILDINGS[i]['onscreen'] = true;
            BUILDINGS_IN_WORLD.push({"location": BUILDINGS[i]['location'], "model": model, "index": i});
            console.log("Added 3d model " + BUILDINGS[i]['name']);
        }
    }
    /*for (var i = 0; i < BUILDINGS_IN_WORLD.length; i++) {
        if (distance(gefs.aircraft.llaLocation, BUILDINGS_IN_WORLD[i]['location']) > 0.1 && BUILDINGS[BUILDINGS_IN_WORLD[i]['index']]['onscreen']) {
            console.log("Removing " + BUILDINGS[BUILDINGS_IN_WORLD[i]['index']]['name']);
            gefs.api.removeModelFromWorld(BUILDINGS_IN_WORLD[i]['model']);
            gefs.api.destroyModel(BUILDINGS_IN_WORLD[i]['model']);
            BUILDINGS[i]['onscreen'] = false;
            console.log("Removed 3d model " + BUILDINGS[i]['name']);
            BUILDINGS_IN_WORLD.splice(i, 1);
        }
    }*/
}, 300);