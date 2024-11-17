import * as THREE from 'three';
import { GLTFLoader } from './GLTFLoader.js';

const models = {
  'stanford': './models/stanford.glb',
  // add other models
};
const modelCache = {};

async function loadModel(url) {
    console.log(url)
  const loader = new GLTFLoader();
  return new Promise((resolve, reject) => {
    loader.load(url, gltf => resolve(gltf.scene), undefined, reject);
  });
}

async function preloadModels() {
  const loadPromises = Object.entries(models).map(([label, url]) =>
    loadModel(url).then(model => {
      modelCache[label] = model;
    })
  );
  
  await Promise.all(loadPromises);
  console.log("All models loaded!");
  initializeGlobe();  // Initialize the globe after all models are loaded
}

function initializeGlobe() {
  const globe = Globe()
  (document.getElementById('globeViz'))
    .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    .objectFacesSurface(true)
        .objectsData([
            { lat: 40.3430, lng: -74.6514, label: 'stanford' }])
    .objectThreeObject(data => modelCache[data.label].clone())
    .objectLabel(obj => `<div>${obj.label}</div>`);
    
//   document.getElementById('globeViz').appendChild(globe.renderer().domElement);
//   globe.renderer().render(globe.scene(), globe.camera());
}

// Start preloading and then initialize the globe
preloadModels();
