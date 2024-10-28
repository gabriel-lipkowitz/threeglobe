import { OrbitControls } from './OrbitControls.js';
import * as THREE from 'three';
import { GLTFLoader } from './GLTFLoader.js';
// import Globe from 'globe.gl'
import Globe from 'globe.gl'
// import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm//three@0.165.0/examples/jsm/loaders/GLTFLoader.js'

const models = {
@@ -55,8 +55,6 @@ function setModelScale(type, x, y, z) {

const loadedModels = new Map();

const textureLoader = new THREE.TextureLoader();

function preloadModels(callback) {
    const typeEntries = Object.entries(models);
    let loadedCount = 0;
@@ -68,16 +66,6 @@ function preloadModels(callback) {
            model.scale.set(0,0,0); // Initial scale
            model.position.set(0, 0, -1);

            const texture = textureLoader.load('./dist/us_.png', (tex) => {
                model.traverse((child) => {
                    if (child.isMesh) {
                        console.log("mapp")
                        child.material.map = tex;
                        child.material.needsUpdate = true;
                    }
                });
            });

            // Iterate over labelToTypeMap to store clones in modelCache for each label
            Object.keys(labelToTypeMap).forEach(label => {
                if (labelToTypeMap[label] === type) {
@@ -145,8 +133,6 @@ const cities = {
    'Augusta': { lat: 44.3106, lng: -69.7795, visits: 1, duration: 1, start: 12 }
};



const camera = new THREE.PerspectiveCamera();
camera.aspect = window.innerWidth/window.innerHeight;
camera.updateProjectionMatrix();
@@ -165,19 +151,6 @@ const raycaster = new THREE.Raycaster();

var INTERSECTED;

function updateTextureForObject(object, flagKey) {
    const texturePath = './dist/us_.png';
    if (texturePath) {
        const texture = textureLoader.load(texturePath);
        object.traverse((child) => {
            if (child.isMesh) {
                child.material.map = texture;
                child.material.needsUpdate = true;
            }
        });
    }
}

function onMouseMove(event) {
    event.preventDefault();
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
@@ -278,7 +251,7 @@ export async function initializeGlobe() {
    //   .pointAltitude('size')
    //   .pointColor('color')
        .objectFacesSurface(true)
        .customLayerData([
        .objectsData([
            { lat: 40.3430, lng: -74.6514, label: 'Princeton' },  // Princeton
            { lat: 37.4275, lng: -122.1697, label: 'Stanford' },   // Stanford
            { lat: 1.3521, lng: 103.8198,  label: 'Singapore' } ,
@@ -327,25 +300,10 @@ export async function initializeGlobe() {
            { lat: 18.4655, lng: -66.1057,  label: 'Puerto Rico' }, //PR
            { lat: 20.6534, lng: -105.2253,  label: 'Puerto Vallarta' }  // Puerto Vallarta
        ])
        // .customThreeObject(data => {
        //     console.log(data.label)


        //     let model = modelCache[data.label].clone()

        //     const texture = textureLoader.load('./us_.png', (tex) => {
        //         model.traverse((child) => {
        //             if (child.isMesh) {
        //                 console.log("mapp")
        //                 child.material.map = tex;
        //                 child.material.needsUpdate = true;
        //             }
        //         });
        //     });

        //     return model;  // Use a clone of the loaded model
        // })

        .objectThreeObject(data => {
            console.log(data.label)
            return modelCache[data.label].clone();  // Use a clone of the loaded model
        })
        // .objectLabel(obj => `<div style="
        //     font-family: 'Helvetica', 'Arial', sans-serif;
        //     color: black;
@@ -676,48 +634,13 @@ sequentialArcs(cityPairs);
            }


        globe.customThreeObject(data => {

            let model = modelCache[data.label].clone()

            const texture = textureLoader.load('./dist/us_.png', (tex) => {
                model.traverse((child) => {
                    if (child.isMesh) {
                        console.log("mapp")
                        child.material.map = tex;
                        child.material.needsUpdate = true;
                    }
                });
            });

            return model;  // Use a clone of the loaded model
        })

        globe.customThreeObjectUpdate((obj, d) => {
            const cityData = cities[d.label];
            if (cityData) {
                const coords = globe.getCoords(cityData.lat, cityData.lng, 0); // Assuming the altitude is 0 if not provided

                const texture = textureLoader.load('./dist/us_.png', (tex) => {
                    obj.traverse((child) => {
                        if (child.isMesh) {
                            console.log("mapp")
                            child.material.map = tex;
                            child.material.needsUpdate = true;
                        }
                    });
                });

                Object.assign(obj.position, coords);

            } else {
                console.error('City data not found for:', d.label);
            }
        globe.objectThreeObject(data => {
          return modelCache[data.label].clone();  // Use a clone of the loaded model
        })

        // globe.camera().lookAt(target); // Orient camera to look at next point
        // globe.camera().lookAt(smoothLookAt);
        // globe.renderer().render(globe.scene(), globe.camera());
        globe.renderer().render(globe.scene(), globe.camera());

        // renderer.render(scene, camera);