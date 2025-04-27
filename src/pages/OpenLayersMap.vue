<script lang="ts">
import { defineComponent, ref, onMounted, watch } from 'vue'
import type Feature from 'ol/Feature'
import Map from 'ol/Map'
import type Geometry from 'ol/geom/Geometry'
import View from 'ol/View'
import TileLayer from 'ol/layer/Tile'
import VectorLayer from 'ol/layer/Vector'
import OSM from 'ol/source/OSM'
import VectorSource from 'ol/source/Vector'
import GeoJSON from 'ol/format/GeoJSON'
import { Style, Icon } from 'ol/style'
import SensorCount from 'src/components/SensorCount.vue'
import sensorData from 'src/assets/mock-sensors.json'

export default defineComponent({
  name: 'SensorMap',
  components: {
    SensorCount,
  },
  setup() {
    const map = ref<Map>()
    const vectorSource = ref<VectorSource<Feature<Geometry>>>(new VectorSource<Feature<Geometry>>())
    const activeCount = ref(0)
    const filter = ref<'all' | 'active' | 'inactive'>('all')

    const iconStyle = new Style({
      image: new Icon({
        src: 'https://cdn-icons-png.flaticon.com/512/149/149060.png',
        scale: 0.05,
        anchor: [0.5, 1],
      }),
    })

    const updateCount = () => {
      // Get the current map view's extent (bounding box)
      const extent = map.value!.getView().calculateExtent()

      // Get all features in the vector source
      const featuresInExtent = vectorSource.value.getFeatures().filter((feature) => {
        const status = feature.get('status')
        const geom = feature.getGeometry()

        // Check if the feature's geometry intersects the extent of the map view
        return (
          geom &&
          geom.intersectsExtent(extent) &&
          (filter.value === 'all' || filter.value === status)
        )
      })

      // Update the active count
      activeCount.value = featuresInExtent.length
    }

    // Function to apply the filter based on the selected status
    const applyFilter = () => {
      vectorSource.value.getFeatures().forEach((feature) => {
        const status = feature.get('status')
        const visible = filter.value === 'all' || filter.value === status
        feature.setStyle(visible ? iconStyle : undefined)
      })
    }

    onMounted(() => {
      const features = new GeoJSON().readFeatures(sensorData, {
        featureProjection: 'EPSG:3857',
      })

      features.forEach((f) => f.setStyle(iconStyle))
      vectorSource.value.addFeatures(features)

      const vectorLayer = new VectorLayer<VectorSource<Feature<Geometry>>>({
        source: vectorSource.value as VectorSource<Feature<Geometry>>,
      })

      map.value = new Map({
        target: 'map',
        layers: [new TileLayer({ source: new OSM() }), vectorLayer],
        view: new View({
          center: [0, 0],
          zoom: 2,
        }),
      })

      updateCount()

      map.value.on('click', (evt) => {
        const feature = map.value!.forEachFeatureAtPixel(evt.pixel, (f) => f)
        if (feature) {
          const currentStatus = (feature as Feature<Geometry>).get('status')
          const newStatus = currentStatus === 'active' ? 'inactive' : 'active'
          ;(feature as Feature<Geometry>).set('status', newStatus)
          applyFilter()
          updateCount()
        }
      })

      map.value.on('moveend', () => {
        updateCount()
      })
    })

    // Watch for changes in filter to re-apply
    watch(filter, () => {
      applyFilter()
    })

    return {
      activeCount,
      filter,
    }
  },
})
</script>

<template>
  <div id="map-container">
    <div id="map" class="map"></div>
    <SensorCount :count="activeCount" />

    <!-- Filter Buttons -->
    <div class="controls">
      <button @click="filter = 'all'" :class="{ active: filter === 'all' }">All</button>
      <button @click="filter = 'active'" :class="{ active: filter === 'active' }">Active</button>
      <button @click="filter = 'inactive'" :class="{ active: filter === 'inactive' }">
        Inactive
      </button>
    </div>
  </div>
</template>

<style scoped>
#map-container {
  position: relative;
  width: 100%;
  height: 100vh;
}

#map {
  width: 100%;
  height: 100%;
}

.controls {
  position: absolute;
  top: 60px;
  left: 10px;
  display: flex;
  gap: 8px;
}

.controls button {
  padding: 6px 12px;
  border: none;
  border-radius: 4px;
  background-color: #eee;
  cursor: pointer;
  font-weight: bold;
}

.controls button.active {
  background-color: #2196f3;
  color: white;
}
</style>
