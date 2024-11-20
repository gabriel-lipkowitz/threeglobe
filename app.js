import * as THREE from 'three';
import ThreeGlobe from 'three-globe'
import { GLTFLoader } from './GLTFLoader.js';
import {Tween, Group} from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'
  import { TrackballControls } from './TrackballControls.js';
  import { OrbitControls } from './OrbitControls.js';


//   const models = {
//     'stanford': './models/hooverSmall.glb',
//     'singapore': './models/singapore.glb',
//     'nassau': './models/nassauSmall.glb',
//     'queens': './models/queens.glb',
//     'florence': './models/florence.glb',
//     'newYork': './models/newYorkSmall.glb',
//     'la': './models/la.glb',
//     'amsterdam': './models/amsterdam.glb',
//     'paris': './models/paris.glb',
//     'berlin': './models/berlin.glb',
//     'london': './models/londonSmall.glb',
//     'sf': './models/sf.glb',
//     'dc': './models/dc.glb',
//     'uva': './models/uva.glb',
//     'rotunda': './models/rotundaSmall.glb',
//     'charlottesville': './models/charlottesville.glb',
//     'imperial': './models/queensSmall.glb',
//     'trees0': './models/trees0.glb',
//     'trees1': './models/trees1Small.glb',
//     'trees2': './models/trees2.glb',
//     // 'uk': './models/uk.glb',
//     // 'california': './models/california.glb',
//     // 'princeton': './models/pton.glb',
//     // 'swiss': './models/swiss.glb',
//     // 'france': './models/france.glb',
//     // 'germany': './models/germany.glb',
//     // 'holland': './models/holland.glb',
//     // 'hungary': './models/hungary.glb',
//     // 'austria': './models/austria.glb',
//     // 'italy': './models/italy.glb',
//     // 'czech': './models/czech.glb',
//     // 'mexico': './models/mexico.glb',
//      // 'us': './models/us.glb',
    
// };

const models = {
    'stanford': './hooverSmall.glb',
    'singapore': './singapore.glb',
    'nassau': './nassauSmall.glb',
    'queens': './queens.glb',
    'florence': './florence.glb',
    'newYork': './newYorkSmall.glb',
    'la': './la.glb',
    'amsterdam': './amsterdam.glb',
    'paris': './paris.glb',
    'berlin': './berlin.glb',
    'london': './londonSmall.glb',
    'sf': './sf.glb',
    'dc': './dc.glb',
    'uva': './uva.glb',
    'rotunda': './rotundaSmall.glb',
    'charlottesville': './charlottesville.glb',
    'imperial': './queensSmall.glb',
    'trees0': './trees0.glb',
    'trees1': './trees1Small.glb',
    'trees2': './trees2.glb'
    
};


const longLabelMap = {
    'Princeton': 'Princeton University: I did my undergraduate here, studied biology.',
    'Stanford': 'Stanford University, I did my PhD here, studied engineering.',
    'Singapore': 'Singapore, I work here now at NUS as an assistant professor!',
    'Charlottesville': 'Charlottesville, I grew up here!',
    'UVA': 'University of Virginia, where my mother is a professor of art and architecture.',
    'London': 'London, where I moved after graduating.',
    'Paris': 'Paris, the first place in Europe I visited.',
    'Geneva': 'Geneva, I visited here with my high school orchestra.',
    'Orlando': 'Orlando, I went here with my high school orchestra.',
    'Ithaca': 'Ithaca, New York, where I was born.',
    'Toms River': 'Toms River, where my grandmother lived.',
    'Los Angeles': 'Los Angeles. I visited a couple times on vacation during my PhD.',
    'Seattle': 'Seattle. ACM SCF 2022.',
    'Austin': 'Austin, Texas. SFF 2022 and 2023.',
    'Houston': 'Houston, I visited here with my parents as a kid.',
    'Berkeley': 'UC Berkeley. Many friends from PhD studied here.',
    'Cupertino': 'Cupertino. HQ of Apple, where my partner works!',
    'Chicago': 'Chicago, I visited on vacation during PhD.',
    'Philadelphia': 'Philadelphia, I visited on vacation during undergrad.',
    'Pittsburgh': 'Pittsburgh. ACM UIST 2024.',
    'Ann Arbor': 'Ann Arbor, Michigan, I gave a guest talk here at UMichigan',
    'New York City': 'New York City, where my grandparents lived.',
    'Outer Banks': 'The Outer Banks, I visited with friends after graduating from high school.',
    'San Diego': 'San Diego, I spoke at a conference here in 2022.',
    'San Francisco': 'San Francisco, maybe my favorite city. I lived here in 2024.',
    'Hamburg': 'Hamburg, Germany. ACM CHI 2023.',
    'Trier': 'Trier, Germany. ACM SUI 2024.',
    'Amsterdam': 'Amsterdam, near where extended family lives.',
    'Imperial': 'Imperial College London, where I did a masters in CS.',
    'Oxford': 'Oxford, visited during my masters.',
    'Cambridge': 'Cambridge, visited during my masters.',
    'Berlin': 'Berlin. Many friends and family friends here.',
    'Honolulu': 'Honolulu, Hawaii. ACM CHI 2023.',
    'Washington, DC': 'Washington, DC, where I visited many times with family growing up.',
    'Radford': 'Radford, Virginia, I did a summer camp here before high school.',
    'Virginia Beach': 'Virginia Beach, I played soccer here growing up.',
    'Rotterdam': 'Rotterdam, the Netherlands, near where extended family lives.',
    'Baltimore': 'Baltimore, my favorite (American) football team was from here.',
    'Yosemite': 'Yosemite, I hiked and backpacked here at the end of my PhD.',
    'Lake Tahoe': 'Lake Tahoe, I skiied here during my PhD.',
    'Richmond': 'Richmond, Virginia, I did an art summer camp here growing up.',
    'Puerto Rico': 'Puerto Rico, I visited here with friends at the end of college.',
    'Puerto Vallarta': 'Puerto Vallarta, Mexico. I visited here with my extended family a couple times growing up.',
    'Milan': 'Milan. Part of an Italy trip I did with friends at the end of college.',
    'Venice': 'Venice. Part of an Italy trip I did with friends at the end of college.',
    'Rome': 'Rome. Part of an Italy trip I did with friends at the end of college.',
    'Florence': 'Florence. Part of an Italy trip I did with friends at the end of college.',
    'Vienna': 'Vienna. Part of a central Europe trip I did with friends in college.',
    'Prague': 'Prague. Part of a central Europe trip I did with friends in college.',
    'Budapest': 'Budapest. Part of a central Europe trip I did with friends in college.',
    'Boston': 'Boston. I did an internship during college here.',
    'Augusta': 'Augusta. I did an internship during college here.',
    'Tokyo': 'Tokyo, I visited here with my partner en route to moving to Singapore.',
    'Kyoto': 'Kyoto, I visited here with my partner en route to moving to Singapore.'
};
  
  
  const modelCache = {};
  const loader = new GLTFLoader();
  let renderer, canvas;
  let rotationVelocity = 0;
  
  const mouse = {
      x: 0,
      y: 0,
      down: false
    }
  
  var mouseDown = false,
  mouseX = 0,
  mouseY = 0;
  
  
  function setModelScale(type, x, y, z) {
    const model = modelCache[type];
    if (model) {
        model.scale.set(x, y, z);
    } else {
        console.warn(`Model of type ${type} not found.`);
    }
  }
  
  const loadedModels = new Map();
  
  function preloadModels(callback) {
      const typeEntries = Object.entries(models);
      let loadedCount = 0;
  
      // Load models based on types
      typeEntries.forEach(([type, url]) => {
          loader.load(url, gltf => {
              const model = gltf.scene;
            //   model.scale.set(0,0,0); // Initial scale
              model.position.set(0, 0, -1);
              
              if (model.children && model.children.length) {
                model.children.forEach(child => {
                    child.scale.set(0.001, 0.001, 0.001);
                })
            }

              // Iterate over labelToTypeMap to store clones in modelCache for each label
              Object.keys(labelToTypeMap).forEach(label => {
                  if (labelToTypeMap[label] === type) {
                    const clonedModel = model.clone();
                    const randomRotationZ = Math.random() * 2 * Math.PI;
                    // clonedModel.rotation.z = randomRotationZ;
                    modelCache[label] = clonedModel;
                  }
              });
  
              loadedCount++;
              if (loadedCount === typeEntries.length) {
                  callback(); // All models are loaded, call the callback
              }
          }, undefined, error => {
              console.error(`Failed to load model ${type}:`, error);
          });
      });
  }
  
  const cities = {
      'Princeton': { lat: 40.6430, lng: -74.6514, visits: 4, duration: 5, start: 10.5 },
      'Stanford': { lat: 37.4275, lng: -121.5697, visits: 4, duration: 5, start: 20.5 },
      'Singapore': { lat: 1.3521, lng: 103.8198, visits: 4, duration: 5, start: 25.5 },
      'Charlottesville': { lat: 38.0293, lng: -78.4767, visits: 4, duration: 10, start: 0.5 },
      'Tokyo': { lat: 35.6895, lng: 139.6917, visits: 5, duration: 6, start: 30.0 },  // New Entry
    'Kyoto': { lat: 35.0116, lng: 135.7681, visits: 3, duration: 4, start: 32.5 },
      'UVA': { lat: 38.0293, lng: -78.4767, visits: 4, duration: 10, start: 0.5 },
      'London': { lat: 51.5074, lng: -0.1278, visits: 4, duration: 5, start: 15.5 },
      'Paris': { lat: 48.8566, lng: 2.3522, visits: 1, duration: 1, start: 5 },
      'Geneva': { lat: 46.2044, lng: 6.1432, visits: 1, duration: 1, start: 5.25 },
      'Orlando': { lat: 28.5383, lng: -81.3792, visits: 1, duration: 1, start: 3.5 },
      'Ithaca': { lat: 42.4430, lng: -76.5019, visits: 2, duration: 2, start: 0 },
      'Toms River': { lat: 39.958851, lng: -74.215336, visits: 2, duration: 2, start: 0 },
      'Los Angeles': { lat: 34.0522, lng: -117.6437, visits: 3, duration: 2.5, start: 23 },
      'Seattle': { lat: 47.6062, lng: -122.3321, visits: 2, duration: 2.5, start: 22 },
    //   'Ventura': { lat: 34.2746, lng: -119.2290, visits: 1, duration: 1.5, start: 20 },
      'Austin': { lat: 30.2672, lng: -97.7431, visits: 2, duration: 2.5, start: 21 },
      'Houston': { lat: 29.7604, lng: -95.3698, visits: 1, duration: 1.5, start: 20 },
      'Berkeley': { lat: 38.6715, lng: -121.2730, visits: 1, duration: 1.5, start: 18 },
        'Cupertino': { lat: 36.8229, lng: -121.0322, visits: 1, duration: 1.5, start: 19 },
      'Chicago': { lat: 41.8781, lng: -87.6298, visits: 1, duration: 1, start: 23 },
      'Philadelphia': { lat: 39.9526, lng: -75.1652, visits: 1, duration: 1, start: 23 },
      'Pittsburgh': { lat: 40.4406, lng: -79.9959, visits: 1, duration: 1, start: 23 },
      'Ann Arbor': { lat: 42.2808, lng: -83.7430, visits: 1, duration: 1, start: 24 },
      'New York City': { lat: 41.2128, lng: -74.0060, visits: 4, duration: 10, start: 8 },
      'Outer Banks': { lat: 35.5582, lng: -76.4665, visits: 1, duration: 1, start: 9 },
      'San Diego': { lat: 32.7157, lng: -116.6611, visits: 1, duration: 1, start: 21 },
      'San Francisco': { lat: 39.0749, lng: -122.3194, visits: 5, duration: 4, start: 21 },
      'Hamburg': { lat: 53.5511, lng: 9.9937, visits: 1, duration: 1, start: 22 },
      'Trier': { lat: 49.7490, lng: 6.6371, visits: 1, duration: 1, start: 25 },
      'Amsterdam': { lat: 52.3676, lng: 6.2041, visits: 3, duration: 3, start: 22 },
    //   'Cardiff': { lat: 51.4816, lng: -3.1791, visits: 1, duration: 1, start: 18 },
    'Imperial': { lat: 51.2074, lng: -0.8278, visits: 4, duration: 5, start: 15.5 },
      'Oxford': { lat: 52.7520, lng: -1.7577, visits: 1, duration: 1, start: 17 },
      'Cambridge': { lat: 53.2053, lng: -0.5218, visits: 1, duration: 1, start: 17.5 },
    //   'Bath': { lat: 51.3811, lng: -2.3590, visits: 1, duration: 1, start: 25 },
      'Berlin': { lat: 52.5200, lng: 13.4050, visits: 3, duration: 2.5, start: 22 },
      'Honolulu': { lat: 21.3069, lng: -157.8583, visits: 1, duration: 1, start: 25 },
      'Washington, DC': { lat: 38.9072, lng: -77.0369, visits: 3, duration: 3, start: 4 },
      'Radford': { lat: 37.1318, lng: -80.5764, visits: 1, duration: 1, start: 2.5 },
      'Virginia Beach': { lat: 36.8529, lng: -76.9780, visits: 1, duration: 1, start: 2 },
      'Rotterdam': { lat: 51.5225, lng: 4.6792, visits: 2, duration: 1, start: 22 },
      'Baltimore': { lat: 39.2904, lng: -75.3122, visits: 1, duration: 1, start: 3 },
      'Yosemite': { lat: 37.8651, lng: -119.5383, visits: 1.5, duration: 1.5, start: 25 },
      'Lake Tahoe': { lat: 39.0968, lng: -120.0324, visits: 1.5, duration: 1.5, start: 25 },
      'Richmond': { lat: 37.5407, lng: -77.4360, visits: 1, duration: 1.5, start: 3 },
      'Puerto Rico': { lat: 18.4655, lng: -66.1057, visits: 1, duration: 1, start: 15 },
      'Puerto Vallarta': { lat: 20.6534, lng: -104.2253, visits: 2, duration: 2, start: 4 },
      'Milan': { lat: 45.4642, lng: 9.1900, visits: 1, duration: 1, start: 15 },
      'Venice': { lat: 45.4408, lng: 12.3155, visits: 1, duration: 1, start: 15 },
      'Rome': { lat: 41.9028, lng: 12.4964, visits: 1, duration: 1, start: 15 },
      'Florence': { lat: 43.7696, lng: 11.2558, visits: 1, duration: 1, start: 15 },
      'Vienna': { lat: 48.2082, lng: 16.3738, visits: 1, duration: 1, start: 14.5 },
      'Prague': { lat: 50.0755, lng: 14.4378, visits: 1, duration: 1, start: 14.5 },
      'Budapest': { lat: 47.4979, lng: 19.0402, visits: 1, duration: 1, start: 14.5 },
      'Boston': { lat: 42.3601, lng: -71.8589, visits: 1.5, duration: 1.5, start: 12 },
      'Augusta': { lat: 44.3106, lng: -69.7795, visits: 1, duration: 1, start: 12 }
  };
  
  const camera = new THREE.PerspectiveCamera();
  camera.aspect = window.innerWidth/window.innerHeight;
  camera.updateProjectionMatrix();
  camera.position.z = 500;
  
  var projector = { x: 0, y: 0 };
  var sprite1;
  var canvas1, context1, texture1;
  
  // Setup scene
  const scene = new THREE.Scene();
  
  
  const raycaster = new THREE.Raycaster();
  // const mouse = new THREE.Vector2();
  
  var INTERSECTED;
  
  function onMouseMove(event) {
      event.preventDefault();
      mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
      mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    
      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);
    
      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children, true);
    
      if (intersects.length > 0) {
        // Get the closest intersected object
        const intersectedObject = intersects[0].object;
    
    
        // Optionally, highlight the fact that we've detected something without modifying its properties
        if (INTERSECTED !== intersectedObject) {
          INTERSECTED = intersectedObject;
        }
      } else {
        // Log that no object is currently intersected
        if (INTERSECTED) {
          console.log('No object detected.');
          INTERSECTED = null;
        }
      }
    }
  
  window.addEventListener('mousemove', onMouseMove);
    

// Function to handle window resizing


  const labelToTypeMap = {
      'Princeton': 'nassau',
      'Stanford': 'stanford',
      'Singapore': 'singapore',
      'Tokyo': 'trees2',
      'Kyoto': 'trees2',
      'Charlottesville': 'charlottesville',
      'UVA': 'rotunda',
      'London': 'london',
      'Philadelphia': 'trees2',
      'Pittsburgh': 'trees2',
      'Milan': 'trees2',
      'Venice': 'trees2',
      'Rome': 'trees1',
      'Florence': 'florence',
      'Vienna': 'trees1',
      'Prague': 'trees2',
      'Budapest': 'trees2',
      'Boston': 'trees0',
      'Augusta': 'trees2',
      'Paris': 'paris',
      'Geneva': 'trees1',
      'Orlando': 'trees2',
      'Ithaca': 'trees2',
      'Los Angeles': 'la',
    //   'Ventura': 'trees0',
      'Toms River': 'trees2',
      'Seattle': 'trees1',
      'Austin': 'trees2',
      'Houston': 'trees2',
      'Berkeley': 'trees2',
      'Cupertino': 'trees2',
      'Chicago': 'trees2',
      'Ann Arbor': 'trees2',
      'New York City': 'newYork',
      'Outer Banks': 'trees2',
      'San Diego': 'trees1',
      'San Francisco': 'sf',
      'Hamburg': 'trees1',
      'Trier': 'trees2',
      'Amsterdam': 'amsterdam',
      'Imperial': 'queens',
      'Oxford': 'trees2',
      'Cambridge': 'trees2',
    //   'Bath': 'trees2',
      'Berlin': 'berlin',
      'Honolulu': 'trees1',
      'Washington, DC': 'dc',
      'Radford': 'trees2',
      'Virginia Beach': 'trees2',
      'Rotterdam': 'trees2',
      'Baltimore': 'trees2',
      'Yosemite': 'trees0',
      'Lake Tahoe': 'trees1',
      'Richmond': 'trees2',
      'Puerto Rico': 'trees2',
      'Puerto Vallarta': 'trees1'
  };

  

  
  export async function initializeGlobe() {
  
      const ARC_REL_LEN = 0.7; // relative to whole arc
      const FLIGHT_TIME = 500;

      const universityLabels = ["Princeton", "Stanford", "UVA", "Imperial", "Singapore"];
  
      let currentHovered = null;
        let originalScale = { x: 1, y: 1, z: 1 };
        let isExpanding = false;
      // const Globe = new ThreeGlobe()
      const globe = new Globe()
        // .globeImageUrl('./imgs/8081_earthspec10k-2.png')
        .globeImageUrl('./8081_earthspec10k-2.png')
        // .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        // .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        // .backgroundImageUrl('./imgs/night-sky.png')
        .backgroundImageUrl('./night-sky.png')
      //   .pointAltitude('size')
      //   .pointColor('color')
          .objectFacesSurface(true)
        //   .backgroundColor('#D3D3D3')
          .atmosphereColor('lightblue')
          .objectsData([
              { lat: 40.6430, lng: -74.6514, label: 'Princeton' },  // Princeton
              { lat: 37.4275, lng: -121.5697, label: 'Stanford' },   // Stanford
              { lat: 35.6895, lng: 139.6917, label: 'Tokyo' },
              { lat: 35.0116, lng: 135.7681, label: 'Kyoto' },
              { lat: 1.3521, lng: 103.8198,  label: 'Singapore' } ,
              { lat: 38.0293, lng: -78.4767, label: 'Charlottesville' },  // Charlottesville
              { lat: 38.0293, lng: -78.4767, label: 'UVA' },
              { lat: 51.5074, lng: -0.1278, label: 'London' }, 
              { lat: 45.4642, lng: 9.1900, label: 'Milan' },    // Milan
              { lat: 45.4408, lng: 12.3155, label: 'Venice' },   // Venice
              { lat: 41.9028, lng: 12.4964, label: 'Rome' },   // Rome
              { lat: 43.7696, lng: 11.2558, label: 'Florence' },   // Florence
              { lat: 48.2082, lng: 16.3738,  label: 'Vienna' },   // Vienna
              { lat: 50.0755, lng: 14.4378, label: 'Prague' },   // Prague
              { lat: 47.4979, lng: 19.0402,  label: 'Budapest' },     
              { lat: 42.3601, lng: -71.8589, label: 'Boston'},  // Boston
              { lat: 44.3106, lng: -69.7795, label: 'Augusta' },   // Augusta
              { lat: 48.8566, lng: 2.3522, label: 'Paris' },  // Paris
              { lat: 46.2044, lng: 6.1432,  label: 'Geneva' },  // Geneva
              { lat: 28.5383, lng: -81.3792,  label: 'Orlando' },  // Orlando
              { lat: 42.4430, lng: -76.5019, label: 'Ithaca' },  // Ithaca
              { lat: 34.0522, lng: -117.6437, label: 'Los Angeles' },  // Los Angeles
            //   { lat: 34.2746, lng: -119.2290, label: 'Ventura' },  // Los Angeles
              { lat: 39.958851, lng: -74.215336, label: 'Toms River' },  // Toms River
              { lat: 47.6062, lng: -122.3321, label: 'Seattle' },  // Seattle
              { lat: 30.2672, lng: -97.7431, label: 'Austin' },  // Austin
              { lat: 29.7604, lng: -95.3698, label: 'Houston' },  // Houston
              { lat: 38.6715, lng: -121.2730, label: 'Berkeley' },  // Houston
              { lat: 36.8229, lng: -121.0322, label: 'Cupertino' },  // Houston
              { lat: 41.8781, lng: -87.6298,  label: 'Chicago' },  // Chicago
              { lat: 42.2808, lng: -83.7430,  label: 'Ann Arbor' },  // Ann Arbor
              { lat: 41.2128, lng: -74.0060, label: 'New York City' },  // New York City
              { lat: 39.9526, lng: -75.1652,  label: 'Philadelphia' },  // Ann Arbor
              { lat: 40.4406, lng: -79.9959, label: 'Pittsburgh' },  // New York City
              { lat: 35.5582, lng: -76.4665, label: 'Outer Banks' },  // Outer Banks
              { lat: 32.7157, lng: -116.6611, label: 'San Diego' },  // San Diego
              { lat: 39.0749, lng: -122.3194,  label: 'San Francisco' },  // San Francisco
              { lat: 53.5511, lng: 9.9937,  label: 'Hamburg' },  // Hamburg
              { lat: 49.7490, lng: 6.6371,  label: 'Trier' },  // Trier
              { lat: 52.3676, lng: 6.2041,  label: 'Amsterdam' },  // Amsterdam
              { lat: 51.2074, lng: -0.8278,  label: 'Imperial' },  // Cardiff
              { lat: 52.7520, lng: -1.7577, label: 'Oxford' },  // Oxford
              { lat: 53.2053, lng: -0.5218,  label: 'Cambridge' },  // Cambridge
            //   { lat: 51.3811, lng: -2.3590,  label: 'Bath' },  // Bath
              { lat: 52.5200, lng: 13.4050, label: 'Berlin' },  // Berlin
              { lat: 21.3069, lng: -157.8583,  label: 'Honolulu' },  // Honolulu
              { lat: 38.9072, lng: -77.0369,  label: 'Washington, DC' }, //DC
              { lat: 37.1318, lng: -80.5764,  label: 'Radford' },  // Radford
              { lat: 36.8529, lng: -76.9780,  label: 'Virginia Beach' },   // Virginia Beach
              { lat: 51.5225, lng: 4.6792, label: 'Rotterdam' },  // Rotterdam
              { lat: 39.2904, lng: -75.3122,  label: 'Baltimore' },  // Baltimore
              { lat: 37.8651, lng: -119.5383,  label: 'Yosemite' },        // Yosemite
              { lat: 39.0968, lng: -120.0324, label: 'Lake Tahoe' },        // Lake Tahoe
              { lat: 37.5407, lng: -77.4360,  label: 'Richmond' },   // Richmond
              { lat: 18.4655, lng: -66.1057,  label: 'Puerto Rico' }, //PR
              { lat: 20.6534, lng: -104.2253,  label: 'Puerto Vallarta' }  // Puerto Vallarta
          ])
          .objectThreeObject(data => {
            //   console.log(data.label)
              return modelCache[data.label].clone();  // Use a clone of the loaded model
          })
        .objectLabel(data => {
            const longLabel = longLabelMap[data.label] || data.label; // Fallback to data.label if no mapping exists
            return `
                <div style="
                    font-family: 'Courier New';
                    color: black;
                    font-size: 14px;  /* Adjust font size as needed */
                    padding: 5px;
                    background: rgba(255, 255, 255, 0.8); /* Optional: Light background to contrast text */
                    border-radius: 5px;
                    box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2); /* Optional: shadow for better visibility */
                ">
                    ${longLabel}
                </div>
            `;
        })
        //   .arcsData(arcsData)
        // .arcColor(arc => {
        //     return 'grey'; 
        // })
        // .arcsTransitionDuration(0)
        // .arcDashLength(ARC_REL_LEN)
        // .arcDashGap(2)
        // .arcDashInitialGap(1)
        // .arcDashAnimateTime(FLIGHT_TIME)
        // .arcStroke(0.05)
        .onObjectHover((obj, prevObj) => {
            // Handle when the mouse moves to an object
            
            if (obj != null && prevObj != null) {

                const model = modelCache[obj.label];
          
                if (model) {


                    if (universityLabels.includes(obj.label)) {

                        // Iterate through each child in the model
                        // Check if the model has a child and proceed to its children
                        if (model.children && model.children.length > 0) {
                            const mainChild = model.children[0]; // Assuming there's only one main child as mentioned

                            // Iterate through the children of the main child
                            mainChild.children.forEach(subChild => {
                                if (subChild.name.startsWith('building')) {

                                    if (!subChild.userData.originalPosition) {
                                        subChild.userData.originalPosition = subChild.position.clone()
                                    }

                                    // Increase scale to 3 for the sub-child named 'building'
                                    gsap.to(subChild.scale, {
                                        x: 2,
                                        y: 2,
                                        z: 2,
                                        duration: 1
                                    });

                                    // Move position up along the z-axis for the sub-child
                                    gsap.to(subChild.position, {
                                        z: 1, // Adjust as needed
                                        duration: 1
                                    });

                                    // Rotate by -30, 30, -30 degrees in x, y, z directions for the sub-child
                                    gsap.to(subChild.rotation, {
                                        x: THREE.MathUtils.degToRad(-30),
                                        y: THREE.MathUtils.degToRad(30),
                                        z: THREE.MathUtils.degToRad(-30),
                                        duration: 1
                                    });
                                }
                            });
                        }
                    
                    } else {

                        if (model.children && model.children.length) {
                            model.children.forEach(child => {
                                // Check if the child's name is 'flag' before applying the animation
                                    gsap.to(child.scale, {
                                        x: 2,
                                        y: 2,
                                        z: 2,
                                        duration: 1
                                    });
                            });
                        }
                    }
                } else {
                    console.warn(`Object with label ${label} not found.`);
                }
                    isExpanding = true;  // Update the state to indicate scaling is occurring
                
            } else if (obj == null && prevObj != null) {

                const model = modelCache[prevObj.label];
          
                if (model) {

                    if (universityLabels.includes(prevObj.label)) {
                        // Return scale back to normal (assuming original scale is 1)

                        if (model.children && model.children.length > 0) {
                            const mainChild = model.children[0];

                            mainChild.children.forEach(subChild => {
                                if (subChild.name.startsWith('building') && subChild.userData.originalPosition) {

                                    gsap.to(subChild.scale, {
                                        x: 1,
                                        y: 1,
                                        z: 1,
                                        duration: 1
                                    });

                                    const originalPosition = subChild.userData.originalPosition;
                                
                                    // Return position to original along the z-axis
                                    gsap.to(subChild.position, {
                                        z: originalPosition.z, // Adjust to match the exact original z position
                                        duration: 1
                                    });
                                
                                    // Return rotation to original
                                    gsap.to(subChild.rotation, {
                                        x: 0,
                                        y: 0,
                                        z: 0,
                                        duration: 1
                                    });
                                }
                            })
                        }


                        
                    } else {


                        if (model.children && model.children.length) {
                            model.children.forEach(child => {
                                // Check if the child's name is 'flag' before applying the animation
                                    gsap.to(child.scale, {
                                        x: 1,
                                        y: 1,
                                        z: 1,
                                        duration: 1
                                    });
                            });
                        }

                    }
        
                    
                } else {
                    console.warn(`Object with label ${label} not found.`);
                }
        
                isExpanding = false;  // Update the state to indicate no object is currently expanded
            }
            
            if (obj != null && prevObj != null && obj != prevObj) {

                const model = modelCache[prevObj.label];
          
                if (model) {

                    if (universityLabels.includes(prevObj.label)) {
                        // Return scale back to normal (assuming original scale is 1)
                        if (model.children && model.children.length > 0) {
                            const mainChild = model.children[0];

                            mainChild.children.forEach(subChild => {
                                if (subChild.name.startsWith('building') && subChild.userData.originalPosition) {

                                    gsap.to(subChild.scale, {
                                        x: 1,
                                        y: 1,
                                        z: 1,
                                        duration: 1
                                    });
                                
                                    // Return position to original along the z-axis
                                    const originalPosition = subChild.userData.originalPosition;
                                
                                    // Return position to original along the z-axis
                                    gsap.to(subChild.position, {
                                        z: originalPosition.z, // Adjust to match the exact original z position
                                        duration: 1
                                    });
                                
                                    // Return rotation to original
                                    gsap.to(subChild.rotation, {
                                        x: 0,
                                        y: 0,
                                        z: 0,
                                        duration: 1
                                    });
                                }
                            })
                        }

                    } else {

                        if (model.children && model.children.length) {
                            model.children.forEach(child => {
                                // Check if the child's name is 'flag' before applying the animation
                                // if (child.name === "flag") {
                                    gsap.to(child.scale, {
                                        x: 1,
                                        y: 1,
                                        z: 1,
                                        duration: 1
                                    });
                                // }
                            });
                        }
                    }
        
                    
                } else {
                    console.warn(`Object with label ${label} not found.`);
                }
        
                isExpanding = false;  // Update the state to indicate no object is currently expanded
            }
        })
          (document.getElementById('globeViz'));
  
          // scene.add(globe);
        //   globe.scene().add(new THREE.AmbientLight(0xcccccc, 3*Math.PI));
        //   globe.scene().add(new THREE.DirectionalLight(0xffffff, 3 * Math.PI));
  
          let camera_anim = gsap.timeline();

          

          function onWindowResize() {
            // Update camera aspect ratio
            globe.camera().aspect = window.innerWidth / window.innerHeight;
            globe.camera().updateProjectionMatrix();
        
            // Update renderer size
            globe.renderer().setSize(window.innerWidth, window.innerHeight);
        
            // If you use other controls like OrbitControls or TrackballControls, update them here if necessary
            tbControls.handleResize();
        }
        
        // Add event listener for resize
        window.addEventListener('resize', onWindowResize, false);

            function findAllLights(scene) {
                const lights = [];  // Array to hold all lights
                scene.traverse((object) => {  // Traverse every object in the scene
                    if (object.isLight) {  // Check if the object is a light
                        lights.push(object);  // Add to the lights array
                    }
                });
                return lights;  // Return the array of lights
            }

            const allLights = findAllLights(globe.scene());




            function animateCamera(cityName) {

                const cityData = cities[cityName];

                let altitude;
                let durationMove;
                switch (currentIndex) {
                    case 0:
                        altitude = 0.18;
                        durationMove = 3;
                        break;
                    case 1:
                        altitude = 0.2;
                        durationMove = 3;
                        break;
                    case 2:
                        altitude = 0.38;
                        durationMove = 3;
                        break;
                    case 3:
                        altitude = 0.38;
                        durationMove = 3;
                        break;
                    default:
                        durationMove = 3;
                        altitude = 0.3; // Fallback to a default altitude if needed
                }
                
                // Define the new target position using the data from the cities object
                const target = {
                    lat: cityData.lat,
                    lng: cityData.lng,
                    altitude: altitude  // Set the altitude
                };

                // Get the current camera position to interpolate from
                const currentPosition = globe.pointOfView();

                // Animate the transition using gsap
                gsap.to(currentPosition, {
                    lat: target.lat,
                    lng: target.lng,
                    altitude: target.altitude,  // Adjust the altitude if needed
                    duration: durationMove,  // Duration in seconds
                    ease: "power2.inOut",  // Smooth easing
                    onUpdate: () => {
                        // Update the globe camera point of view gradually
                        globe.pointOfView(currentPosition);
                    },
                    onComplete: () => {

                    //   const currentPosition = globe.pointOfView();
  
                    //   // Second Animation: Fading out the object, starts after the first completes
                    //   gsap.to(currentPosition, {
                    //       lat: target.lat,
                    //       lng: target.lng,
                    //       altitude: 0.15,  // Adjust the altitude if needed
                    //       duration: 5,  // Duration in seconds
                    //     //   ease: "power2.In",  // Smooth easing
                    //       onUpdate: () => {
                    //           // Update the globe camera point of view gradually
                    //           globe.pointOfView(currentPosition);
                    //       }
                    //   });
                    }
                });
            }

        const delay = 0.5
          const duration = 0.5
          const delay2 = 0.25
          const duration2 = 0.25
          const incrementSmall = 2
          const durationCity = 0.5
          const incrementLarge = 3
          

          const incrementCity = 1;
const incrementUni = 3;

const cityPairsUSSouth = [
    { from: 'Charlottesville', to: 'Charlottesville', delay, duration, increment: incrementCity, durationCity },
    { from: 'Charlottesville', to: 'UVA', delay, duration, increment: incrementCity, durationCity },
    { from: 'UVA', to: 'Baltimore', delay, duration, increment: incrementCity, durationCity },
    { from: 'Baltimore', to: 'Radford', delay, duration, increment: incrementCity, durationCity },
    { from: 'Radford', to: 'Washington, DC', delay, duration, increment: incrementCity, durationCity },
    { from: 'Washington, DC', to: 'Virginia Beach', delay, duration, increment: incrementCity, durationCity },
    { from: 'Virginia Beach', to: 'Orlando', delay, duration, increment: incrementCity, durationCity },
    { from: 'Orlando', to: 'Outer Banks', delay, duration, increment: incrementCity, durationCity }

]

const cityPairsAsia = [
    { from: 'Singapore', to: 'Singapore', delay, duration, increment: incrementCity, durationCity },
    { from: 'Singapore', to: 'Tokyo', delay, duration, increment: incrementCity, durationCity },
    { from: 'Tokyo', to: 'Kyoto', delay, duration, increment: incrementCity, durationCity },
]

const cityPairsUSEast = [
    { from: 'New York City', to: 'New York City', delay, duration, increment: incrementCity, durationCity },
    { from: 'New York City', to: 'Princeton', delay, duration, increment: incrementCity, durationCity },
    { from: 'Princeton', to: 'Boston', delay, duration, increment: incrementCity, durationCity },
    { from: 'Boston', to: 'Augusta', delay, duration, increment: incrementCity, durationCity },
    { from: 'Augusta', to: 'Puerto Rico', delay, duration, increment: incrementCity, durationCity },
    { from: 'Puerto Rico', to: 'Toms River', delay, duration, increment: incrementCity, durationCity },
    { from: 'Toms River', to: 'Pittsburgh', delay, duration, increment: incrementCity, durationCity },
    { from: 'Pittsburgh', to: 'Ann Arbor', delay, duration, increment: incrementCity, durationCity },
    { from: 'Ann Arbor', to: 'Chicago', delay, duration, increment: incrementCity, durationCity },
    { from: 'Chicago', to: 'Philadelphia', delay, duration, increment: incrementCity, durationCity },
];

const cityPairsUSWest = [
    { from: 'Stanford', to: 'Stanford', delay, duration, increment: incrementCity, durationCity },
    { from: 'Stanford', to: 'Lake Tahoe', delay, duration, increment: incrementCity, durationCity },
    { from: 'Lake Tahoe', to: 'Yosemite', delay, duration, increment: incrementCity, durationCity },
    { from: 'Yosemite', to: 'San Francisco', delay, duration, increment: incrementCity, durationCity },
    { from: 'San Francisco', to: 'Cupertino', delay, duration, increment: incrementCity, durationCity },
    { from: 'Cupertino', to: 'Berkeley', delay, duration, increment: incrementCity, durationCity },
    { from: 'Berkeley', to: 'Los Angeles', delay, duration, increment: incrementCity, durationCity },
    { from: 'Los Angeles', to: 'San Diego', delay, duration, increment: incrementCity, durationCity },
    // { from: 'Ventura', to: 'San Diego', delay, duration, increment: incrementCity, durationCity },
    { from: 'San Diego', to: 'Puerto Vallarta', delay, duration, increment: incrementCity, durationCity },
    { from: 'Puerto Vallarta', to: 'Austin', delay, duration, increment: incrementCity, durationCity },
    { from: 'Austin', to: 'Houston', delay, duration, increment: incrementCity, durationCity },
    { from: 'Houston', to: 'Seattle', delay, duration, increment: incrementCity, durationCity },
    { from: 'Seattle', to: 'Honolulu', delay, duration, increment: incrementCity, durationCity }
];

function toggleButtonDisabled(buttonId, isDisabled) {
    
    
    const button = document.getElementById(buttonId);
    if (isDisabled) {
        button.classList.add("disabled");
    } else {
        button.classList.remove("disabled");
    }
}

const animationFlags = {
    useSouth: false,
    useEast: false,
    useWest: false,
    europe: false
};

function emitArcIfNotPlayed(animationName, params) {
    if (!animationFlags[animationName]) {
        emitArc(params);
        animationFlags[animationName] = true; // Mark as played
    }
}

const cityPairsEurope = [
    { from: 'London', to: 'London', delay, duration, increment: incrementCity, durationCity },
    { from: 'London', to: 'Oxford', delay, duration, increment: incrementCity, durationCity },
    { from: 'Oxford', to: 'Imperial', delay, duration, increment: incrementCity, durationCity },
    { from: 'Imperial', to: 'Cambridge', delay, duration, increment: incrementCity, durationCity },
    { from: 'Cambridge', to: 'Paris', delay, duration, increment: incrementCity, durationCity },
    // { from: 'Bath', to: 'Paris', delay, duration, increment: incrementCity, durationCity },
    { from: 'Paris', to: 'Geneva', delay, duration, increment: incrementCity, durationCity },
    { from: 'Geneva', to: 'Vienna', delay, duration, increment: incrementCity, durationCity },
    { from: 'Vienna', to: 'Prague', delay, duration, increment: incrementCity, durationCity },
    { from: 'Prague', to: 'Budapest', delay, duration, increment: incrementCity, durationCity },
    { from: 'Budapest', to: 'Venice', delay, duration, increment: incrementCity, durationCity },
    { from: 'Venice', to: 'Milan', delay, duration, increment: incrementCity, durationCity },
    { from: 'Milan', to: 'Florence', delay, duration, increment: incrementCity, durationCity },
    { from: 'Florence', to: 'Rome', delay, duration, increment: incrementCity, durationCity },
    { from: 'Rome', to: 'Hamburg', delay, duration, increment: incrementCity, durationCity },
    { from: 'Hamburg', to: 'Berlin', delay, duration, increment: incrementCity, durationCity },
    { from: 'Berlin', to: 'Trier', delay, duration, increment: incrementCity, durationCity },
    { from: 'Trier', to: 'Rotterdam', delay, duration, increment: incrementCity, durationCity },
    { from: 'Rotterdam', to: 'Amsterdam', delay, duration, increment: incrementCity, durationCity },
];

function animateModelScaleSequential({label, increment, delay, duration}) {
    const model = modelCache[label];

    if (model) {

            const currentScaleX = model.scale.x;
                const currentScaleY = model.scale.y;
                const currentScaleZ = model.scale.z;

                const targetScaleX = currentScaleX + increment;
                const targetScaleY = currentScaleY + increment;
                const targetScaleZ = currentScaleZ + increment;

                // Calculate random additional delay, ensure it's only making the delay longer
                const additionalDelay = Math.random() * 1000; // up to 500 milliseconds extra

                
                // Apply GSAP animation to each child's scale
                gsap.to(model.scale, {
                    x: targetScaleX,
                    y: targetScaleY,
                    z: targetScaleZ,
                    duration: duration / 1000,
                    delay: (delay + additionalDelay) / 1000,
                    ease: "power1.inOut", // Adjust easing as necessary
                    // onComplete: () => console.log(`Scaling complete for ${model.name}`) // Optional completion log
                });
        

        
    } else {
        console.warn(`Object with label ${label} not found.`);
    }
}

  
  
function animateModelScaleSequentialChildren({label, increment, delay, duration}) {
    const model = modelCache[label];

    if (model) {

        
            
            // Check if the model has children and iterate through them
        if (model.children && model.children.length) {
            model.children.forEach(child => {
                const currentScaleX = child.scale.x;
                const currentScaleY = child.scale.y;
                const currentScaleZ = child.scale.z;

                const targetScaleX = currentScaleX + increment;
                const targetScaleY = currentScaleY + increment;
                const targetScaleZ = currentScaleZ + increment;

                // Calculate random additional delay, ensure it's only making the delay longer
                const additionalDelay = Math.random() * 1000; // up to 500 milliseconds extra

                // Apply GSAP animation to each child's scale
                gsap.to(child.scale, {
                    x: targetScaleX,
                    y: targetScaleY,
                    z: targetScaleZ,
                    duration: duration / 1000,
                    delay: (delay + additionalDelay) / 1000,
                    ease: "power1.inOut", // Adjust easing as necessary
                    // onComplete: () => console.log(`Scaling complete for ${child.name}`) // Optional completion log
                });
            });
        } else {
            console.warn(`No children found in model with label ${label}.`);
        }
        
    } else {
        console.warn(`Object with label ${label} not found.`);
    }
}
  
        //   let prevCoords = { lat: cities['Ithaca'].lat, lng: cities['Ithaca'].lng };
          
        function emitArc({ prevCoords, startLat, startLng, endLat, endLng, duration, label, increment, delay, durationC }) {
              // Update previous coordinates after the duration
              setTimeout(() => { prevCoords = { lat: endLat, lng: endLng } }, duration);
  
              // Add and remove arc after 1 cycle
              const arc = { startLat, startLng, endLat, endLng };
            //   globe.arcsData([...globe.arcsData(), arc]);

            

                animateModelScaleSequentialChildren({label: label, increment: increment, delay: delay, duration: durationC})
              
  
              // Remove the arc after 2 cycles (adjust timing as needed)
              setTimeout(() => {
                  globe.arcsData(globe.arcsData().filter(d => d !== arc));
              }, duration * 2);
          }
  
          function sequentialArcs(cityPairs) {
            let prevCoords = cityPairs.length > 0 && cities[cityPairs[0].from]
                ? { lat: cities[cityPairs[0].from].lat, lng: cities[cityPairs[0].from].lng }
                : { lat: 0, lng: 0 };
        
            let totalDelay = 2000; // Track the cumulative delay for sequential calls
            // console.log("currentIndex", currentIndex)

            // let totalDelay = (currentIndex === 2 || currentIndex === 3) ? 4000 : 2000;

            cityPairs.forEach((pair, index) => {
                const { from, to, delay, duration, increment, durationCity } = pair;
                const startCoords = cities[from];
                const endCoords = cities[to];
        
                setTimeout(() => {

                    const effectiveTime = (currentIndex === 3 || currentIndex === 4) ? FLIGHT_TIME / 2 : FLIGHT_TIME; 

                    emitArc({
                        prevCoords: prevCoords,
                        startLat: prevCoords.lat,
                        startLng: prevCoords.lng,
                        endLat: endCoords.lat,
                        endLng: endCoords.lng,
                        duration: FLIGHT_TIME * duration,
                        label: to,
                        increment: increment,
                        delay: FLIGHT_TIME,
                        durationC: durationCity * 1000
                    });
                    prevCoords = { lat: endCoords.lat, lng: endCoords.lng };
                }, totalDelay);
        
                totalDelay += delay * 1000;
            });
        }



        //   document.getElementById('updateButton').addEventListener('click', function() {
        //     console.log("click") // Example: Toggle color change
        //     sequentialArcs(cityPairsUSEast);
            
        //     animateCamera("New York City")

        // });

        // document.getElementById('updateButton4').addEventListener('click', function() {
        //     console.log("click") // Example: Toggle color change
        //     sequentialArcs(cityPairsUSSouth);
            
        //     animateCamera("Washington, DC")

        // });

        // document.getElementById('updateButton2').addEventListener('click', function() {
        //     console.log("click") // Example: Toggle color change
        //     sequentialArcs(cityPairsEurope);

        //     animateCamera("Geneva")
        // });
          
        // document.getElementById('updateButton3').addEventListener('click', function() {
        //     console.log("click") // Example: Toggle color change
        //     sequentialArcs(cityPairsUSWest);

        //     animateCamera("Stanford")
        // });

        let currentAnimationIndex = 0; // Track the current animation step
        const animationSequence = [
            { city: 'Washington, DC', animation: cityPairsUSSouth, played: false },
            { city: 'New York City', animation: cityPairsUSEast, played: false },
            { city: 'London', animation: cityPairsEurope, played: false },
            { city: 'Stanford', animation: cityPairsUSWest, played: false },
            { city: 'Singapore', animation: cityPairsAsia, played: false }
            
        ];

        // Function to play the current animation based on the current index
        
        

        const homeNames = [" Charlottesville, USA", " Princeton, USA", " London, UK", " Stanford, USA"];

        
        
        function fadeOutCityName() {
            document.getElementById("cityNameDisplay").style.opacity = "0";
            document.getElementById("yearDisplay").style.opacity = "0";

            if (currentIndex >= 0 && currentIndex < homeNames.length) {
                cityNameDisplay.innerText = " " + homeNames[currentIndex];
            }
        }
        
        function fadeInCityName() {
            // document.getElementById("cityNameDisplay").style.opacity = "1";
            document.getElementById("yearDisplay").style.opacity = "1";
        }

        const cityYearPairs = [
            { year: "2010", city: "Charlottesville", played: false },
            { year: "2015", city: "Princeton", played: false },
            { year: "2020", city: "Geneva", played: false },
            { year: "2023", city: "Stanford", played: false },
            { year: "2024", city: "Singapore", played: false },
          ];
          
          let currentIndex = 0;

          function updateUI() {
            // Fade out current labels
            fadeOutCityName();
            
            // After fade-out completes, update to new year and city
            setTimeout(() => {
              document.getElementById("yearDisplay").innerText = cityYearPairs[currentIndex-1].year;
              document.getElementById("cityNameDisplay").innerText = cityYearPairs[currentIndex-1].city;
              
              fadeInCityName();
            }, 1500);  // Adjust this delay to match your fade-out duration
          }
          
          function playAnimationOrMoveCamera() {

            console.log("currentIndex in playAnimationOrMoveCamera", currentIndex)

            const currentPair = cityYearPairs[currentIndex];
          
            animateCamera(cityYearPairs[currentIndex].city);

            if (!currentPair.played) {
              sequentialArcs(animationSequence[currentIndex].animation);
            //   currentPair.played = true;  // Mark animation as played

            } 
          }
          
          document.getElementById("updateButton2").addEventListener("click", () => {
            // if (currentIndex < cityYearPairs.length) {
            //   console.log("aaaaaaa")
            // console.log("currentIndex in button before forward", currentIndex)
              playAnimationOrMoveCamera();
              updateUI();
              updateButtonState();
              currentIndex++;
            //   console.log("currentIndex in button after forward", currentIndex)
            // }
          });
          
          document.getElementById("updateButton3").addEventListener("click", () => {
            if (currentIndex > 0) {
                
              currentIndex--;
              console.log("currentIndex in button before back", currentIndex)
              animateCamera(cityYearPairs[currentIndex-1].city);  // Move camera without playing animation
              updateUI();
              updateButtonState();
              console.log("currentIndex in button after back", currentIndex)
            }
          });
          
          function updateButtonState() {
            document.getElementById("updateButton3").disabled = currentIndex === 0;
            document.getElementById("updateButton2").disabled = currentIndex === cityYearPairs.length;
          }

        toggleButtonDisabled('updateButton3', true);
        

        document.getElementById('updateButton2').addEventListener('click', function () {
            toggleButtonDisabled('updateButton3', true);
            toggleButtonDisabled('updateButton2', true);
        
            const baseDelay = 8000; // Base delay in milliseconds
            let reenableDelay = (currentIndex === 3) ? baseDelay * 2 : baseDelay;

            reenableDelay = (currentIndex === 4) ? baseDelay * 1.5 : reenableDelay;

            reenableDelay = (currentIndex === 5) ? baseDelay * 0.25 : reenableDelay;

    if (cityYearPairs[currentIndex-1].played) {
        reenableDelay = 3000; // Reduce delay if the animation has already been played
    }

    cityYearPairs[currentIndex-1].played = true;

    
            
            // Your animation or interaction logic here
        
            // Re-enable the button after the interaction
            setTimeout(() => {
                if (currentIndex > 1) {
                    toggleButtonDisabled('updateButton3', false);
                }
                if (currentIndex < animationSequence.length) {
                    toggleButtonDisabled('updateButton2', false);
                }
            }, reenableDelay);
        });
        
        document.getElementById('updateButton3').addEventListener('click', function () {
            toggleButtonDisabled('updateButton3', true);
            toggleButtonDisabled('updateButton2', true);
        
            const baseDelay = 3500; // Base delay in milliseconds for back button
            const reenableDelay = (currentIndex === 3) ? baseDelay * 1 : baseDelay;
        
            // Your animation or interaction logic here
        
            // Re-enable the button after the interaction
            setTimeout(() => {
                if (currentIndex > 1) {
                    toggleButtonDisabled('updateButton3', false);
                }
                if (currentIndex < animationSequence.length) {
                    toggleButtonDisabled('updateButton2', false);
                }
            }, reenableDelay);
        });

        
  
  
        //   globe.onObjectClick((obj, event, { lat, lng, altitude }) => {
        //       console.log(`Clicked on ${obj.label}: Latitude ${lat}, Longitude ${lng}, Altitude ${altitude}`);
          
        //       // Define the new target position
        //       const target = { lat, lng, altitude: 0.25 };
          
        //       // Get the current camera position to interpolate from
        //       const currentPosition = globe.pointOfView();
          
        //       // Animate the transition using gsap
        //       gsap.to(currentPosition, {
        //           lat: target.lat,
        //           lng: target.lng,
        //           altitude: target.altitude,  // Adjust the altitude if needed
        //           duration: 2,  // Duration in seconds
        //           ease: "power2.inOut",  // Smooth easing
        //           onUpdate: () => {
        //               // Update the globe camera point of view gradually
        //               globe.pointOfView(currentPosition);
        //           }
        //       });
          

        //   });
  
       var camPosIndex = 0;
  
        const londonTarget = new THREE.Vector3(-2.0416446700265904, 82.88, 58.2);
        const cvilleTarget = new THREE.Vector3(-80.0416446700265904, 62.88, 16.2);
        const ptonTarget = new THREE.Vector3(-74.0416446700265904, 65.88, 20.2);
        const ptonTargetAtlantic = new THREE.Vector3(-84.0416446700265904, 65.88, 30.2);
          
        const spline = new THREE.CatmullRomCurve3([
          cvilleTarget,
          ptonTarget,
          londonTarget
        ]); 
  
        const geometry = new THREE.BoxGeometry(2, 2, 2); // Create a 1x1x1 cube
        const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 }); // Green color for the cube
        const box = new THREE.Mesh(geometry, material);
  
        box.position.set(londonTarget.x, londonTarget.y, londonTarget.z);
        box.position.set(cvilleTarget.x, cvilleTarget.y, cvilleTarget.z)
        box.position.set(ptonTarget.x, ptonTarget.y, ptonTarget.z)
  
      //   globe.scene().add(box)
  
  
        
  
        let isAnimating = false;
  
  
  
        function onMouseScroll(event){
          // handleScrollTarget(event, positionAlongPathState);
        }
  
        window.addEventListener('wheel', onMouseScroll, false);
  
        function animateModelScale(label) {
          
          // const model = globe.scene().children.find(obj => obj.userData.label === 'princeton');
          const targetScale = cities[label].visits
  
          const delay = cities[label].start
  
          const duration = cities[label].duration
  
          const model = modelCache[label];
  
          // const model = loadedModels.get('princeton');
  
          if (model) {
  
              gsap.to(model.scale, {
                  x: targetScale,
                  y: targetScale,
                  z: targetScale,
                  duration: duration,
                  delay: delay
              });
          } else {
              console.warn(`Object with label ${label} not found.`);
          }
      }
  
      var target = cvilleTarget
  
  
      
  
      // const renderer = new THREE.WebGLRenderer();
  
      // const renderer = globe.renderer()
  
      globe.renderer().setSize(window.innerWidth, window.innerHeight);
      // document.getElementById('globeViz').appendChild(globe.renderer().domElement);
  
      
  
      
  
      const tbControls = new TrackballControls(camera, globe.renderer().domElement);
      tbControls.minDistance = 101;
      tbControls.rotateSpeed = 5;
      tbControls.zoomSpeed = 0.8;
  
  
      canvas1 = document.createElement('canvas');
      context1 = canvas1.getContext('2d');
      context1.font = "Bold 20px Arial";
      context1.fillStyle = "rgba(0,0,0,0.95)";
      context1.fillText('Hello, world!', 0, 20);
      
      // canvas contents will be used for a texture
      texture1 = new THREE.Texture(canvas1) 
      texture1.needsUpdate = true;
      
      
  
        function animate() {

            

            console.log(globe.lights)
  
            // Array to hold the lights
const lights = [];

// Parameters for light placement
const radius = 300; // Distance of lights from the globe's center
const intensity = 2; // Intensity of each light

// Add 8 directional lights distributed evenly around the globe
for (let i = 0; i < 8; i++) {
    const angle = (i / 8) * Math.PI * 2; // Divide the sphere into 8 sections
    const x = radius * Math.cos(angle); // X-coordinate
    const z = radius * Math.sin(angle); // Z-coordinate
    const y = (i % 2 === 0) ? radius : -radius; // Alternate between north and south

    // Create a directional light
    const light = new THREE.DirectionalLight(0xffffff, intensity);
    light.position.set(x, y, z);

    // Set the light's target to the globe's center
    light.target.position.set(0, 0, 0);
    light.target.updateMatrixWorld();

    // Add the light and its target to the scene
    globe.scene().add(light);
    globe.scene().add(light.target);

    light.intensity = 1

    // Push to lights array
    lights.push(light);
}

// Replace globe's lights with the new array of 8 lights
globe.lights(lights);
  
          const lookAts = [
              { city: 'charlottesville', lookAt: cvilleTarget, duration: 10000 }, // Duration in milliseconds
              { city: 'princeton', lookAt: ptonTarget, duration: 5000 },
              { city: 'london', lookAt: londonTarget, duration: 5000 }
          ];
      
          let currentIndex = 0;
          let lastChangeTime = Date.now();
          let target = lookAts[0].lookAt;
  
          // Helper vector to store the interpolated lookAt position
        //   const smoothLookAt = new THREE.Vector3().copy(target);
  
          requestAnimationFrame(function loop(time) {
  
            globe.objectThreeObject(data => {
                return modelCache[data.label].clone();  // Use a clone of the loaded model
              })

              tbControls.update();
  
              const now = Date.now();
  
            //   if (now - lastChangeTime > lookAts[currentIndex].duration) {
            //       currentIndex = (currentIndex + 1) % lookAts.length; // Move to the next target
            //       const newTarget = lookAts[currentIndex].lookAt; // Update to the next lookAt target
      
            //       // Smoothly animate the camera's lookAt using GSAP
            //       gsap.to(smoothLookAt, {
            //           x: newTarget.x,
            //           y: newTarget.y,
            //           z: newTarget.z,
            //           duration: lookAts[currentIndex].duration / 1000, // Convert to seconds for GSAP
            //           ease: "power2.inOut"
            //       });
      
            //       lastChangeTime = now; // Reset the timer
            //   }
  
  
              
  
          // globe.renderer().render(globe.scene(), globe.camera());
  
          // renderer.render(scene, camera);
  
          // globe.camera().lookAt();
          
          requestAnimationFrame(loop)
  
          })
  
          
  
  
        };
  
    //     Object.keys(cities).forEach(label => {
    //       animateModelScale(label);
    //   });
  
          // Define your points of view with durations
          const lookAts  = [
              { city: 'charlottesville', lookAt: cvilleTarget },
              { city: 'princeton', lookAt: ptonTarget },
              { city: 'london', lookAt: londonTarget }
          ];
  
          // Setup renderer
      
      
  
      
  
      // const ptonTarget = new THREE.Vector3(-74.0416446700265904, 65.88, 20.2);
  
          // const loaderB = new GLTFLoader();
  
          // loaderB.load(
          //   // resource URL
          //   './models/stanford.glb',
          //   // called when the resource is loaded
          //   function ( gltf ) {
          //     // gltf.scene.scale.set(100,100,100)
          //     gltf.scene.position.set(ptonTarget.x,ptonTarget.y,ptonTarget.z)
          //     gltf.scene.scale.set(100,100,100)
          //     scene.add( gltf.scene );
          
          
          //   },
          //   // called while loading is progressing
          //   function ( xhr ) {
          
          //     console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );
          
          //   },
          //   // called when loading has errors
          //   function ( error ) {
          
          //     console.log( 'An error happened' );
          
          //   }
          // );
  
      // Setup camera
      
          
        animate();
  
      //   (function animate() { // IIFE
      //     // Frame cycle
      //   //   tbControls.update();
      //     renderer.render(scene, camera);
      //     requestAnimationFrame(animate);
      //   })();
  }
  
  preloadModels(initializeGlobe);
  
  
      
  
      // // Gen random data
      // const N = 300;
      // const gData = [...Array(N).keys()].map(() => ({
      //   lat: (Math.random() - 0.5) * 180,
      //   lng: (Math.random() - 0.5) * 360,
      //   size: Math.random() / 3,
      //   color: ['red', 'white', 'blue', 'green'][Math.round(Math.random() * 3)]
      // }));
  
      // const Globe = new ThreeGlobe()
      //   .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
      //   .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
      //   .pointsData(gData)
      //   .pointAltitude('size')
      //   .pointColor('color');
  
      // setTimeout(() => {
      //   gData.forEach(d => d.size = Math.random());
      //   Globe.pointsData(gData);
      // }, 4000);
  
      
  
  
      // Kick-off renderer
      