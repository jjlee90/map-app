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

    // const sampleData = {
    //   type: 'FeatureCollection',
    //   features: Array.from({ length: 100 }, (_, i) => {
    //     const isActive = Math.random() > 0.5
    //     return {
    //       type: 'Feature',
    //       properties: {
    //         name: `Sensor ${i + 1}`,
    //         status: isActive ? 'active' : 'inactive',
    //       },
    //       geometry: {
    //         type: 'Point',
    //         coordinates: [
    //           (Math.random() * 360 - 180).toFixed(2), // longitude [-180, 180]
    //           (Math.random() * 180 - 90).toFixed(2), // latitude [-90, 90]
    //         ],
    //       },
    //     }
    //   }),
    // }

    const updateCount = () => {
      const features = vectorSource.value.getFeatures()
      activeCount.value = features.filter((f) => f.get('status') === 'active').length
    }

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
