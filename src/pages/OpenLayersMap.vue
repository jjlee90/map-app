<template>
  <div id="map" class="map"></div>
  <div id="popup" class="ol-popup"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted } from 'vue'
import Map from 'ol/Map'
import View from 'ol/View'
import Overlay from 'ol/Overlay'
// import TileLayer from 'ol/layer/Tile'
import Feature from 'ol/Feature'
import Point from 'ol/geom/Point'
import { Icon, Style } from 'ol/style'
import { OGCMapTile, Vector as VectorSource } from 'ol/source'
import { Tile as TileLayer, Vector as VectorLayer } from 'ol/layer'
import 'bootstrap/dist/css/bootstrap.min.css'
import * as bootstrap from 'bootstrap'

export default defineComponent({
  name: 'OpenLayersMap',
  setup() {
    onMounted(() => {
      // Initialize the map layers
      const rasterLayer = new TileLayer({
        source: new OGCMapTile({
          url: 'https://maps.gnosis.earth/ogcapi/collections/NaturalEarth:raster:HYP_HR_SR_OB_DR/map/tiles/WebMercatorQuad',
          crossOrigin: '',
        }),
      })

      const iconFeature = new Feature({
        geometry: new Point([0, 0]),
        name: 'Null Island',
        population: 4000,
        rainfall: 500,
      })

      const iconStyle = new Style({
        image: new Icon({
          scale: 0.5,
          anchor: [32, 32],
          anchorXUnits: 'pixels',
          anchorYUnits: 'pixels',
          src: 'public/icons/favicon-32x32.png',
          // imgSize: [32, 32],
        }),
      })

      iconFeature.setStyle(iconStyle)

      const vectorSource = new VectorSource({
        features: [iconFeature],
      })

      const vectorLayer = new VectorLayer({
        source: vectorSource,
      })

      // Initialize the map
      const map = new Map({
        layers: [rasterLayer, vectorLayer],
        target: 'map',
        view: new View({
          center: [0, 0], // EPSG:3857 coordinates
          zoom: 2,
        }),
      })

      // Popup logic
      const element = document.getElementById('popup')
      const popup = new Overlay({
        element: element!,
        positioning: 'bottom-center',
        stopEvent: false,
      })
      map.addOverlay(popup)

      let popover: bootstrap.Popover | undefined
      function disposePopover() {
        if (popover) {
          popover.dispose()
          popover = undefined
        }
      }

      // Display popup on click
      map.on('click', (evt) => {
        const feature = map.forEachFeatureAtPixel(evt.pixel, (feature) => feature)
        disposePopover()
        if (!feature) {
          return
        }
        popup.setPosition(evt.coordinate)
        popover = new bootstrap.Popover(element!, {
          placement: 'top',
          html: true,
          content: feature.get('name'),
        })
        popover.show()
      })

      // Change mouse cursor when over marker
      map.on('pointermove', (e) => {
        const hit = map.hasFeatureAtPixel(e.pixel)
        ;(map.getTarget() as HTMLElement).style.cursor = hit ? 'pointer' : ''
      })

      // Close popup on map move
      map.on('movestart', disposePopover)
    })

    return {}
  },
})
</script>

<style scoped>
#map {
  width: 100%;
  height: 100vh;
}

.ol-popup {
  /* background-color: white; */
  padding: 10px;
  /* border: 1px solid black; */
  border-radius: 5px;
  position: absolute;
  bottom: 12px;
  left: -50px;
  min-width: 150px;
  text-align: center;
}
</style>
