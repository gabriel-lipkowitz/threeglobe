



import ThreeGlobe from "three-globe";
import * as THREE from '//unpkg.com/three/build/three.module.js';
import { TrackballControls } from 'three/addons/controls/TrackballControls.js';

const loader = new THREE.TextureLoader();

    // Gen random data
    const N = 300;
    const gData = [...Array(N).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      alt: Math.random() * 0.8 + 0.1,
      radius: Math.random() * 5,
      color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
    }));

    const texture = loader.load('./dist/us_.png', function() {
        console.log('Texture loaded successfully');
      }, undefined, function(error) {
        console.log('Error loading texture:', error);
      });


      

  
      const Globe = new ThreeGlobe()
        .globeImageUrl('//unpkg.com/three-globe/example/img/earth-blue-marble.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .customLayerData(gData)
        .customThreeObject(d => new THREE.Mesh(
          new THREE.SphereGeometry(d.radius),
          new THREE.MeshLambertMaterial({ map: texture })
        ))
        .customThreeObjectUpdate((obj, d) => {
          Object.assign(obj.position, Globe.getCoords(d.lat, d.lng, d.alt));
        });
  
      (function moveSpheres() {
        gData.forEach(d => d.lat += 0.2);
        Globe.customLayerData(Globe.customLayerData());
        requestAnimationFrame(moveSpheres);
      })();
  
      // Setup renderer
      const renderer = new THREE.WebGLRenderer();
      renderer.setSize(window.innerWidth, window.innerHeight);
      document.getElementById('globeViz').appendChild(renderer.domElement);
  
      // Setup scene
      const scene = new THREE.Scene();
      scene.add(Globe);
      scene.add(new THREE.AmbientLight(0xcccccc, Math.PI));
      scene.add(new THREE.DirectionalLight(0xffffff, 0.6 * Math.PI));
  
      // Setup camera
      const camera = new THREE.PerspectiveCamera();
      camera.aspect = window.innerWidth/window.innerHeight;
      camera.updateProjectionMatrix();
      camera.position.z = 500;
  
      // Add camera controls
      const tbControls = new TrackballControls(camera, renderer.domElement);
      tbControls.minDistance = 101;
      tbControls.rotateSpeed = 5;
      tbControls.zoomSpeed = 0.8;
  
      // Kick-off renderer
      (function animate() { // IIFE
        // Frame cycle
        tbControls.update();
        renderer.render(scene, camera);
        requestAnimationFrame(animate);
      })();