import ThreeGlobe from "three-globe";
import { TrackballControls } from './node_modules/three/examples/jsm/controls/TrackballControls.js';
import * as THREE from 'three';
import { GLTFLoader } from './node_modules/three/examples/jsm/loaders/GLTFLoader.js';


    // Gen random data
    const N = 300;
    const gData = [...Array(N).keys()].map(() => ({
      lat: (Math.random() - 0.5) * 180,
      lng: (Math.random() - 0.5) * 360,
      size: Math.random() / 3,
      color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
    }));

    const Globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      .pointsData(gData)
      .pointAltitude('size')
      .pointColor('color');

    setTimeout(() => {
      gData.forEach(d => d.size = Math.random());
      Globe.pointsData(gData);
    }, 4000);

    // Setup renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('globeViz').appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xcccccc, 3*Math.PI));
    scene.add(new THREE.DirectionalLight(0xffffff, 3 * Math.PI));

    const ptonTarget = new THREE.Vector3(-74.0416446700265904, 65.88, 20.2);

        const loaderB = new GLTFLoader();

        loaderB.load(
          // resource URL
          './models/stanford.glb',
          // called when the resource is loaded
          function ( gltf ) {
            // gltf.scene.scale.set(100,100,100)
            gltf.scene.position.set(ptonTarget.x,ptonTarget.y,ptonTarget.z)
            gltf.scene.scale.set(100,100,100)
            scene.add( gltf.scene );
        
        
          },
          // called while loading is progressing
          function ( xhr ) {
        
            console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
        
          },
          // called when loading has errors
          function ( error ) {
        
            console.log( 'An error happened' );
        
          }
        );

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