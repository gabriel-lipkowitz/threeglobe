import * as THREE from 'three';

// Gen random data
const N = 300;
const gData = [...Array(N).keys()].map(() => ({
  lat: (Math.random() - 0.5) * 180,
  lng: (Math.random() - 0.5) * 360,
  alt: Math.random() * 0.8 + 0.1,
  radius: Math.random() * 5,
  color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
}));

const world = Globe()
  (document.getElementById('globeViz'))
  .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
  .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
  .pointOfView({ altitude: 3.5 })
  .customLayerData(gData)
  .customThreeObject(d => new THREE.Mesh(
    new THREE.SphereGeometry(d.radius),
    new THREE.MeshLambertMaterial({ color: d.color })
  ))
  .customThreeObjectUpdate((obj, d) => {
    Object.assign(obj.position, world.getCoords(d.lat, d.lng, d.alt));
  });

(function moveSpheres() {
  gData.forEach(d => d.lat += 0.2);
  world.customLayerData(world.customLayerData());
  requestAnimationFrame(moveSpheres);
})();