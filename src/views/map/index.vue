<script setup lang="ts">
import AMapLoader from '@amap/amap-jsapi-loader'
import mxbcData from './mxbc.json'

let map: any = null
let circles: any[] = []
let currentPositionMarker: any = null
let watchId: number | null = null

const radius = ref(1000)

function updateCircles(AMap: any) {
  circles.forEach(c => map.remove(c))
  circles = mxbcData.map((item: any) => {
    const lng = Number.parseFloat(item.经度)
    const lat = Number.parseFloat(item.纬度)
    return new AMap.Circle({
      center: [lng, lat],
      radius: radius.value,
      fillColor: '#FF4D4F',
      fillOpacity: 0.15,
      strokeColor: '#FF4D4F',
      strokeWeight: 1,
      strokeOpacity: 0.4,
    })
  })
  map.add(circles)
}

onMounted(() => {
  AMapLoader.load({
    key: 'dd99030a6655ffb1cfd535034c3fb8c8',
    version: '2.0',
    plugins: ['AMap.Scale'],
  })
    .then((AMap) => {
      map = new AMap.Map('container', {
        zoom: 11,
        center: [104.065_833, 30.657_458],
      })

      const markers = mxbcData.map((item: any) => {
        const lng = Number.parseFloat(item.经度)
        const lat = Number.parseFloat(item.纬度)
        return new AMap.CircleMarker({
          center: [lng, lat],
          radius: 6,
          fillColor: '#FF4D4F',
          fillOpacity: 0.9,
          strokeColor: '#fff',
          strokeWeight: 1,
        })
      })

      map.add(markers)
      updateCircles(AMap)
      startTrackingPosition(AMap)
    })
    .catch((error) => {
      console.log(error)
    })
})

watch(radius, () => {
  if (!map) return
  AMapLoader.load({ key: 'dd99030a6655ffb1cfd535034c3fb8c8', version: '2.0' }).then((AMap: any) => {
    updateCircles(AMap)
  })
})

function startTrackingPosition(AMap: any) {
  if (!navigator.geolocation) {
    console.warn('浏览器不支持地理定位')
    return
  }

  currentPositionMarker = new AMap.CircleMarker({
    radius: 10,
    fillColor: '#356EFF',
    fillOpacity: 1,
    strokeColor: '#fff',
    strokeWeight: 3,
    zIndex: 200,
  })
  map.add(currentPositionMarker)

  watchId = navigator.geolocation.watchPosition(
    (position) => {
      const { longitude, latitude } = position.coords
      const currentLngLat = new AMap.LngLat(longitude, latitude)
      currentPositionMarker.setCenter(currentLngLat)
    },
    (error) => {
      console.warn('获取位置失败:', error.message)
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 10_000,
    },
  )
}

onUnmounted(() => {
  if (watchId !== null) {
    navigator.geolocation.clearWatch(watchId)
  }
  map?.destroy()
})
</script>

<template>
  <div class="relative">
    <div class="absolute left-4 top-4 z-10 rounded-lg bg-white px-4 py-3 shadow-lg">
      <div class="mb-2 text-14 font-bold">
        覆盖半径：{{ radius }} 米
      </div>
      <n-slider v-model:value="radius" :min="100" :max="2000" :step="100" :marks="{ 100: '100m', 2000: '2000m' }" style="width: 240px;" />
    </div>
    <div id="container" />
  </div>
</template>

<style scoped>
#container {
  padding: 0px;
  margin: 0px;
  width: 100vw;
  height: 100vh;
}
</style>
