# (FR) Panoramax

_English below_

Ce script permet d'afficher dans votre projet les photos provenant du projet Panoramax
(https://panoramax.openstreetmap.fr/ et/ou https://panoramax.ign.fr/) dans Lizmap Web Client. À noter qu'il n'est pas
nécessaire que votre projet soit dans une projection spécifique pour que ce script fonctionne. C'est QGIS qui se
chargera de la reprojection.

![alt text](image-3.png)

## Pré-requis

- Lizmap Web Client ≥ 3.8

- Pour des raisons de performance et du fait qu'OpenLayers ne permette pas la reprojection de tuiles vectorielles,
  **la ou les couches de données Panoramax doivent être ajoutées depuis votre projet QGIS**.
  **Un groupe ou une couche nommée Panoramax doit absolument exister dans votre projet QGIS. Sinon le script générera
  une erreur**. Vous pouvez changer le nom de votre couche/groupe mais dans ce cas il sera nécessaire de modifier
  la variable `PANORAMAX_QGIS_LAYER_NAME` du script pour qu'elle corresponde au nom de votre couche. Vous pouvez
  également modifier depuis QGIS le style de votre couche de tuiles vectorielles si vous le souhaitez.

![alt text](image.png)
![alt text](image-1.png)

## Utilisation
Deux fichiers JavaScript sont disponibles :
- **panoramax3_3.9.js** : utilise l'API V3 de Panoramax (historique, stable)
- **panoramax4_3.9.js** : utilise l'API V4 de Panoramax (Web Components, recommandé)

**Nous recommandons d'utiliser la V4** qui est plus moderne et mieux maintenue.

Pour utiliser le script Panoramax dans votre projet :
1. assurez-vous d'avoir une couche Panoramax présente dans votre projet QGIS
2. copier `panoramax3_3.9.js` ou `panoramax4_3.9.js` dans le dossier `media/js/default` de votre répertoire (ou `media/js/nom du projet`)
3. le bouton Panoramax s'affichera dans Lizmap Web Client
4. en cliquant sur ce bouton, un dock s'ouvrira affichant le visualiseur de photos
5. cliquez sur un point de la couche Panoramax sur la carte pour afficher la photo correspondante
   - une flèche directionnelle indique l'azimut de la photo
   - la carte se centre automatiquement sur le point

## Personnalisation

Si vous modifiez le nom du groupe ou de la couche Panoramax dans QGIS, vous devrez adapter la variable
`PANORAMAX_QGIS_LAYER_NAME` dans le script pour qu'elle corresponde au nom de la couche dans votre projet.

Vous pouvez également personnaliser l'apparence du bouton ou le comportement d'affichage selon vos besoins via des
ajustements dans le fichier JavaScript.

## Modes d'affichage (V4, position minidock uniquement)

Quand `DOCK_POSITION` vaut `minidock`, deux boutons en haut à droite du viewer changent
la disposition :

- **Moitié d'écran.** La zone carte est partagée entre la carte à gauche et les photos à droite. Un séparateur entre les deux se déplace à la souris (de 20 % à 80 %). Si un panneau Lizmap est ouvert (couches, impression, etc.), la carte et les photos se placent à
  sa droite.
- **Pleine carte.** Les photos prennent toute la zone carte et la carte devient une vignette   en bas à gauche, qui continue de suivre la navigation. Un clic sur la vignette rétablit la disposition normale.

Un second clic sur le bouton actif, ou la fermeture du minidock, rétablit la disposition normale. Les deux modes sont désactivés en affichage mobile et n'existent pas en position `dock`. Les constantes `SPLIT_*` et `MAP_THUMBNAIL_*` en tête du script permettent d'ajuster la répartition par défaut, les bornes du séparateur et la taille de la vignette.

`![alt text](half-panoramax.png)`

`![alt text](full-panoramax.png)`

# (EN) Panoramax

This script allows you to display photos from the Panoramax project (https://panoramax.openstreetmap.fr/ and/or
https://panoramax.ign.fr/) in your Lizmap Web Client project. It is not necessary for your project to have a specific
projection for this script to work. QGIS will handle the reprojection.

![alt text](image-3.png)

## Display modes (V4, minidock position only)

When `DOCK_POSITION` is `minidock`, two buttons at the top right of the viewer change the
layout:

- **Half screen.** The map area is shared between the map on the left and the photos on the   right. A splitter between them can be dragged (from 20% to 80%). If a Lizmap panel is open   (layers, print, etc.), the map and the photos are placed to its right. 
- **Full map.** The photos take the whole map area and the map becomes a thumbnail at the   bottom left, still following the navigation. Clicking the thumbnail restores the normal layout.

A second click on the active button, or closing the minidock, restores the normal layout. Both modes are disabled on mobile display and do not exist in the `dock` position. The `SPLIT_*` and `MAP_THUMBNAIL_*` constants at the top of the script adjust the default split, the splitter bounds and the thumbnail size.

`![alt text](half-panoramax.png)`

`![alt text](full-panoramax.png)`


## Requirements

- Lizmap Web Client ≥ 3.8

- For performance reasons and because OpenLayers does not allow the reprojection of vector tiles, **the Panoramax data   layer(s) must be added from your QGIS project**. **A layer or group named Panoramax must exist in your QGIS project.   Otherwise, the script will generate an error**. You can change the name of your layer/group, but in that case, you will need to modify the PANORAMAX_QGIS_LAYER_NAME variable in the script to match the name of your layer. You can also modify the vector tiles style in QGIS.

![alt text](image.png)
![alt text](image-1.png)


## Usage
Two JavaScript files are available:
- **panoramax3_3.9.js**: uses the Panoramax V3 API (legacy, stable)
- **panoramax4_3.9.js**: uses the Panoramax V4 API (Web Components, recommended)

**We recommend using V4**, which is more modern and better maintained.

To use the Panoramax script in your project:
1. ensure you have a Panoramax layer present in your QGIS project
2. copy `panoramax3_3.9.js` or `panoramax4_3.9.js` to the `media/js/default` folder of your project directory (or `media/js/project name`)
3. the Panoramax button will appear in Lizmap Web Client
4. by clicking on this button, a dock will open displaying the photo viewer
5. click on a point in the Panoramax layer on the map to display the corresponding photo
   - a directional arrow indicates the photo's azimuth
   - the map automatically centers on the point

## Customization

If you change the name of the Panoramax group or layer in QGIS, you will need to adjust the `PANORAMAX_QGIS_LAYER_NAME`
variable in the script to match the name of your layer.

You can also customize the appearance of the button or the display behavior according to your needs by making
adjustments to the JavaScript file.
