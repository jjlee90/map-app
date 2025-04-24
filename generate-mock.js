import fs from 'fs'

const createMockSensors = (count = 200) => {
  const features = []

  for (let i = 1; i <= count; i++) {
    const lon = Math.random() * 360 - 180
    const lat = Math.random() * 180 - 90
    const status = Math.random() > 0.5 ? 'active' : 'inactive'

    features.push({
      type: 'Feature',
      properties: {
        name: `Sensor ${i}`,
        status,
      },
      geometry: {
        type: 'Point',
        coordinates: [lon, lat],
      },
    })
  }

  return {
    type: 'FeatureCollection',
    features,
  }
}

fs.writeFileSync('mock-sensors.json', JSON.stringify(createMockSensors(), null, 2))
console.log('✅ mock-sensors.json created.')
