import ThreeGlobe from "three-globe";
// import { TrackballControls } from './TrackballControls.js';
// import { OrbitControls } from './OrbitControls.js';

import * as THREE from 'three';
import { GLTFLoader } from './GLTFLoader.js';
// import { GLTFLoader } from 'https://cdn.jsdelivr.net/npm//three@0.165.0/examples/jsm/loaders/GLTFLoader.js'

const models = {
    'stanford': './models/stanford.glb',
    'singapore': './models/singapore.glb',
    'uk': './models/uk.glb',
    'california': './models/california.glb',
    'princeton': './models/pton.glb',
    'swiss': './models/swiss.glb',
    'france': './models/france.glb',
    'germany': './models/germany.glb',
    'holland': './models/holland.glb',
    'hungary': './models/hungary.glb',
    'austria': './models/austria.glb',
    'italy': './models/italy.glb',
    'us': './models/us.glb',
    'uva': './models/uva.glb',
    'imperial': './models/imperial.glb',
    'czech': './models/czech.glb',
    'mexico': './models/mexico.glb',
  };



const modelCache = {};
const loader = new GLTFLoader();
let camera, renderer, scene, canvas;
let rotationVelocity = 0;

const mouse = {
  x: undefined,
  y: undefined
}

var mouseDown = false,
mouseX = 0,
mouseY = 0;


const raycaster = new THREE.Raycaster();
const mouseVector = new THREE.Vector2();

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
            model.scale.set(0,0,0); // Initial scale
            model.position.set(0, 0, -1);
            
            // Iterate over labelToTypeMap to store clones in modelCache for each label
            Object.keys(labelToTypeMap).forEach(label => {
                if (labelToTypeMap[label] === type) {
                    modelCache[label] = model.clone();
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
    'Princeton': { lat: 40.3430, lng: -74.6514, visits: 4, duration: 5, start: 10.5 },
    'Stanford': { lat: 37.4275, lng: -122.1697, visits: 4, duration: 5, start: 20.5 },
    'Singapore': { lat: 1.3521, lng: 103.8198, visits: 4, duration: 5, start: 25.5 },
    'Charlottesville': { lat: 38.0293, lng: -78.4767, visits: 4, duration: 10, start: 0.5 },
    'London': { lat: 51.5074, lng: -0.1278, visits: 4, duration: 5, start: 15.5 },
    'Paris': { lat: 48.8566, lng: 2.3522, visits: 1, duration: 1, start: 5 },
    'Geneva': { lat: 46.2044, lng: 6.1432, visits: 1, duration: 1, start: 5.25 },
    'Orlando': { lat: 28.5383, lng: -81.3792, visits: 1, duration: 1, start: 3.5 },
    'Ithaca': { lat: 42.4430, lng: -76.5019, visits: 2, duration: 2, start: 0 },
    'Toms River': { lat: 39.958851, lng: -74.215336, visits: 2, duration: 2, start: 0 },
    'Los Angeles': { lat: 34.0522, lng: -118.2437, visits: 3, duration: 2.5, start: 23 },
    'Seattle': { lat: 47.6062, lng: -122.3321, visits: 2, duration: 2.5, start: 22 },
    'Austin': { lat: 30.2672, lng: -97.7431, visits: 2, duration: 2.5, start: 21 },
    'Chicago': { lat: 41.8781, lng: -87.6298, visits: 1, duration: 1, start: 23 },
    'Ann Arbor': { lat: 42.2808, lng: -83.7430, visits: 1, duration: 1, start: 24 },
    'New York City': { lat: 40.7128, lng: -74.0060, visits: 4, duration: 10, start: 8 },
    'Outer Banks': { lat: 35.5582, lng: -75.4665, visits: 1, duration: 1, start: 9 },
    'San Diego': { lat: 32.7157, lng: -117.1611, visits: 1, duration: 1, start: 21 },
    'San Francisco': { lat: 37.7749, lng: -122.4194, visits: 5, duration: 4, start: 21 },
    'Hamburg': { lat: 53.5511, lng: 9.9937, visits: 1, duration: 1, start: 22 },
    'Trier': { lat: 49.7490, lng: 6.6371, visits: 1, duration: 1, start: 25 },
    'Amsterdam': { lat: 52.3676, lng: 4.9041, visits: 3, duration: 3, start: 22 },
    'Cardiff': { lat: 51.4816, lng: -3.1791, visits: 1, duration: 1, start: 18 },
    'Oxford': { lat: 51.7520, lng: -1.2577, visits: 1, duration: 1, start: 17 },
    'Cambridge': { lat: 52.2053, lng: 0.1218, visits: 1, duration: 1, start: 17.5 },
    'Bath': { lat: 51.3811, lng: -2.3590, visits: 1, duration: 1, start: 25 },
    'Berlin': { lat: 52.5200, lng: 13.4050, visits: 3, duration: 2.5, start: 22 },
    'Honolulu': { lat: 21.3069, lng: -157.8583, visits: 1, duration: 1, start: 25 },
    'Washington, DC': { lat: 38.9072, lng: -77.0369, visits: 3, duration: 3, start: 4 },
    'Radford': { lat: 37.1318, lng: -80.5764, visits: 1, duration: 1, start: 2.5 },
    'Virginia Beach': { lat: 36.8529, lng: -75.9780, visits: 1, duration: 1, start: 2 },
    'Rotterdam': { lat: 51.9225, lng: 4.4792, visits: 2, duration: 1, start: 22 },
    'Baltimore': { lat: 39.2904, lng: -76.6122, visits: 1, duration: 1, start: 3 },
    'Yosemite': { lat: 37.8651, lng: -119.5383, visits: 1.5, duration: 1.5, start: 25 },
    'Lake Tahoe': { lat: 39.0968, lng: -120.0324, visits: 1.5, duration: 1.5, start: 25 },
    'Richmond': { lat: 37.5407, lng: -77.4360, visits: 1, duration: 1.5, start: 3 },
    'Puerto Rico': { lat: 18.4655, lng: -66.1057, visits: 1, duration: 1, start: 15 },
    'Puerto Vallarta': { lat: 20.6534, lng: -105.2253, visits: 2, duration: 2, start: 4 },
    'Milan': { lat: 45.4642, lng: 9.1900, visits: 1, duration: 1, start: 15 },
    'Venice': { lat: 45.4408, lng: 12.3155, visits: 1, duration: 1, start: 15 },
    'Rome': { lat: 41.9028, lng: 12.4964, visits: 1, duration: 1, start: 15 },
    'Florence': { lat: 43.7696, lng: 11.2558, visits: 1, duration: 1, start: 15 },
    'Vienna': { lat: 48.2082, lng: 16.3738, visits: 1, duration: 1, start: 14.5 },
    'Prague': { lat: 50.0755, lng: 14.4378, visits: 1, duration: 1, start: 14.5 },
    'Budapest': { lat: 47.4979, lng: 19.0402, visits: 1, duration: 1, start: 14.5 },
    'Boston': { lat: 42.3601, lng: -71.0589, visits: 1.5, duration: 1.5, start: 12 },
    'Augusta': { lat: 44.3106, lng: -69.7795, visits: 1, duration: 1, start: 12 }
};

const labelToTypeMap = {
    'Princeton': 'princeton',
    'Stanford': 'stanford',
    'Singapore': 'singapore',
    'Charlottesville': 'uva',
    'London': 'imperial',
    'Milan': 'italy',
    'Venice': 'italy',
    'Rome': 'italy',
    'Florence': 'italy',
    'Vienna': 'austria',
    'Prague': 'czech',
    'Budapest': 'hungary',
    'Boston': 'us',
    'Augusta': 'us',
    'Paris': 'france',
    'Geneva': 'swiss',
    'Orlando': 'us',
    'Ithaca': 'us',
    'Los Angeles': 'california',
    'Toms River': 'us',
    'Seattle': 'us',
    'Austin': 'us',
    'Chicago': 'us',
    'Ann Arbor': 'us',
    'New York City': 'us',
    'Outer Banks': 'us',
    'San Diego': 'california',
    'San Francisco': 'california',
    'Hamburg': 'germany',
    'Trier': 'germany',
    'Amsterdam': 'holland',
    'Cardiff': 'uk',
    'Oxford': 'uk',
    'Cambridge': 'uk',
    'Bath': 'uk',
    'Berlin': 'germany',
    'Honolulu': 'us',
    'Washington, DC': 'us',
    'Radford': 'us',
    'Virginia Beach': 'us',
    'Rotterdam': 'holland',
    'Baltimore': 'us',
    'Yosemite': 'california',
    'Lake Tahoe': 'california',
    'Richmond': 'us',
    'Puerto Rico': 'us',
    'Puerto Vallarta': 'mexico'
};

export async function initializeGlobe() {

    const ARC_REL_LEN = 0.7; // relative to whole arc
    const FLIGHT_TIME = 1000;

    const Globe = new ThreeGlobe()
      .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
    //   .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
    //   .pointAltitude('size')
    //   .pointColor('color')
        .objectFacesSurface(true)
        .objectsData([
            { lat: 40.3430, lng: -74.6514, label: 'Princeton' },  // Princeton
            { lat: 37.4275, lng: -122.1697, label: 'Stanford' },   // Stanford
            { lat: 1.3521, lng: 103.8198,  label: 'Singapore' } ,
            { lat: 38.0293, lng: -78.4767, label: 'Charlottesville' },  // Charlottesville
            { lat: 51.5074, lng: -0.1278, label: 'London' }, 
            { lat: 45.4642, lng: 9.1900, label: 'Milan' },    // Milan
            { lat: 45.4408, lng: 12.3155, label: 'Venice' },   // Venice
            { lat: 41.9028, lng: 12.4964, label: 'Rome' },   // Rome
            { lat: 43.7696, lng: 11.2558, label: 'Florence' },   // Florence
            { lat: 48.2082, lng: 16.3738,  label: 'Vienna' },   // Vienna
            { lat: 50.0755, lng: 14.4378, label: 'Prague' },   // Prague
            { lat: 47.4979, lng: 19.0402,  label: 'Budapest' },     
            { lat: 42.3601, lng: -71.0589, label: 'Boston'},  // Boston
            { lat: 44.3106, lng: -69.7795, label: 'Augusta' },   // Augusta
            { lat: 48.8566, lng: 2.3522, label: 'Paris' },  // Paris
            { lat: 46.2044, lng: 6.1432,  label: 'Geneva' },  // Geneva
            { lat: 28.5383, lng: -81.3792,  label: 'Orlando' },  // Orlando
            { lat: 42.4430, lng: -76.5019, label: 'Ithaca' },  // Ithaca
            { lat: 34.0522, lng: -118.2437, label: 'Los Angeles' },  // Los Angeles
            { lat: 39.958851, lng: -74.215336, label: 'Toms River' },  // Toms River
            { lat: 47.6062, lng: -122.3321, label: 'Seattle' },  // Seattle
            { lat: 30.2672, lng: -97.7431, label: 'Austin' },  // Austin
            { lat: 41.8781, lng: -87.6298,  label: 'Chicago' },  // Chicago
            { lat: 42.2808, lng: -83.7430,  label: 'Ann Arbor' },  // Ann Arbor
            { lat: 40.7128, lng: -74.0060, label: 'New York City' },  // New York City
            { lat: 35.5582, lng: -75.4665, label: 'Outer Banks' },  // Outer Banks
            { lat: 32.7157, lng: -117.1611, label: 'San Diego' },  // San Diego
            { lat: 37.7749, lng: -122.4194,  label: 'San Francisco' },  // San Francisco
            { lat: 53.5511, lng: 9.9937,  label: 'Hamburg' },  // Hamburg
            { lat: 49.7490, lng: 6.6371,  label: 'Trier' },  // Trier
            { lat: 52.3676, lng: 4.9041,  label: 'Amsterdam' },  // Amsterdam
            { lat: 51.4816, lng: -3.1791,  label: 'Cardiff' },  // Cardiff
            { lat: 51.7520, lng: -1.2577, label: 'Oxford' },  // Oxford
            { lat: 52.2053, lng: 0.1218,  label: 'Cambridge' },  // Cambridge
            { lat: 51.3811, lng: -2.3590,  label: 'Bath' },  // Bath
            { lat: 52.5200, lng: 13.4050, label: 'Berlin' },  // Berlin
            { lat: 21.3069, lng: -157.8583,  label: 'Honolulu' },  // Honolulu
            { lat: 38.9072, lng: -77.0369,  label: 'Washington, DC' }, //DC
            { lat: 37.1318, lng: -80.5764,  label: 'Radford' },  // Radford
            { lat: 36.8529, lng: -75.9780,  label: 'Virginia Beach' },   // Virginia Beach
            { lat: 51.9225, lng: 4.4792, label: 'Rotterdam' },  // Rotterdam
            { lat: 39.2904, lng: -76.6122,  label: 'Baltimore' },  // Baltimore
            { lat: 37.8651, lng: -119.5383,  label: 'Yosemite' },        // Yosemite
            { lat: 39.0968, lng: -120.0324, label: 'Lake Tahoe' },        // Lake Tahoe
            { lat: 37.5407, lng: -77.4360,  label: 'Richmond' },   // Richmond
            { lat: 18.4655, lng: -66.1057,  label: 'Puerto Rico' }, //PR
            { lat: 20.6534, lng: -105.2253,  label: 'Puerto Vallarta' }  // Puerto Vallarta
        ])
        .objectThreeObject(data => {
            console.log(data.label)
            return modelCache[data.label].clone();  // Use a clone of the loaded model
        })
        // .objectLabel(obj => `<div style="
        //     font-family: 'Helvetica', 'Arial', sans-serif;
        //     color: black;
        //     font-size: 14px;  /* Adjust font size as needed */
        //     padding: 5px;
        //     background: rgba(255, 255, 255, 0.8); /* Optional: Light background to contrast text */
        //     border-radius: 5px;
        //     box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2); /* Optional: shadow for better visibility */
        // ">${obj.label}</div>`)
        // .arcsData(arcsData)
        .arcColor(arc => {
          // Determine color based on the "from" parameter of the arc
          switch (arc.group) {
              case 'Charlottesville':
              case 'charlottesvilleSmall':
                  return 'darkblue';
              case 'Princeton':
              case 'princetonSmall':
                  return 'orange';
              case 'Stanford':
              case 'stanfordSmall':
                  return 'darkred';
              case 'London':
              case 'londonSmall':
                  return 'lightblue';
              default:
                  return 'black'; // Default color if no match found
          }
      })
      .arcsTransitionDuration(0)
      .arcDashLength(ARC_REL_LEN)
      .arcDashGap(2)
      .arcDashInitialGap(1)
    //   .arcDashAnimateTime(FLIGHT_TIME)
        // (document.getElementById('globeViz'));

        let camera_anim = gsap.timeline();

        // let curvePath = await loadCurveFromJSON(scene, curvePathJSON);

        function animateModelScaleSequential({label, increment, delay, duration}) {
        
            const model = modelCache[label];

            if (model) {
                const currentScaleX = model.scale.x;
                const currentScaleY = model.scale.y;
                const currentScaleZ = model.scale.z;
        
                const targetScaleX = currentScaleX + increment;
                const targetScaleY = currentScaleY + increment;
                const targetScaleZ = currentScaleZ + increment;
        
                console.log("Target Scale:", targetScaleX, targetScaleY, targetScaleZ);
        
                console.log("label ", label)
                gsap.to(model.scale, {
                    x: targetScaleX,
                    y: targetScaleY,
                    z: targetScaleZ,
                    duration: duration / 1000,
                    delay: delay / 1000
                });
            } else {
                console.warn(`Object with label ${label} not found.`);
            }
        }

        let prevCoords = { lat: cities['Ithaca'].lat, lng: cities['Ithaca'].lng };

        // Function to emit arcs
        function emitArc({ startLat, startLng, endLat, endLng, duration }) {
            // Update previous coordinates after the duration
            setTimeout(() => { prevCoords = { lat: endLat, lng: endLng } }, duration);

            // Add and remove arc after 1 cycle
            const arc = { startLat, startLng, endLat, endLng };
            Globe.arcsData([...Globe.arcsData(), arc]);

            // Remove the arc after 2 cycles (adjust timing as needed)
            setTimeout(() => {
                Globe.arcsData(Globe.arcsData().filter(d => d !== arc));
            }, duration * 2);
        }

        // Function to initiate sequential arcs based on cityPairs
        function sequentialArcs(cityPairs) {
            let totalDelay = 2000; // Track the cumulative delay for sequential calls

            cityPairs.forEach((pair, index) => {
                const { from, to, delay, duration, incrementCity, durationCity } = pair;
                const startCoords = cities[from];
                const endCoords = cities[to];

                // Schedule arc emission after cumulative delay
                setTimeout(() => {
                    emitArc({
                        startLat: prevCoords.lat,
                        startLng: prevCoords.lng,
                        endLat: endCoords.lat,
                        endLng: endCoords.lng,
                        duration: FLIGHT_TIME * duration // You can specify different durations if needed
                    });

                    // animateModelScaleSequential({label: to, increment: incrementCity, delay: FLIGHT_TIME, duration: durationCity * 1000})

                    // Update prevCoords to the end coordinates of this arc
                    prevCoords = { lat: endCoords.lat, lng: endCoords.lng };
                }, totalDelay);

                // Add to the cumulative delay (duration + delay for next arc)
                totalDelay += delay * 1000; // Convert delay to milliseconds
            });
        }


        const cityPairs = [
            { from: 'Ithaca', to: 'Charlottesville', delay: 4, duration: 1, incrementCity: 3, durationCity: 3 },
            { from: 'Charlottesville', to: 'New York City', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'New York City', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Toms River', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Toms River', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Washington, DC', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Washington, DC', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'New York City', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'New York City', to: 'Charlottesville', delay: 3, duration: 1, incrementCity: 2, durationCity: 2 },
            { from: 'Charlottesville', to: 'Toms River', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Toms River', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'New York City', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'New York City', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Virginia Beach', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Virginia Beach', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Richmond', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Richmond', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Radford', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Radford', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Baltimore', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Baltimore', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Charlottesville', to: 'Orlando', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            { from: 'Orlando', to: 'Charlottesville', delay: 2, duration: 1, incrementCity: 1, durationCity: 1 },
            
            
          ];


// Start emitting arcs sequentially
sequentialArcs(cityPairs);


        function updateArcs() {
          const currentTime = Date.now();
      
          arcsData.forEach(arc => {
            if (currentTime < arc.removeAfter) {
              if (currentTime > start + arc.arcDashInitialGap * 1500) {
                if (!arc.cameraAdjusted) {

                }
              }
              
            }
          });
        
          arcsData = arcsData.filter(arc => currentTime < arc.removeAfter);
          Globe.arcsData(arcsData);
      
        }

        // Globe.onObjectClick((obj, event, { lat, lng, altitude }) => {
        //     console.log(`Clicked on ${obj.label}: Latitude ${lat}, Longitude ${lng}, Altitude ${altitude}`);
        
        //     // Define the new target position
        //     const target = { lat, lng, altitude: 0.5 };
        
        //     // Get the current camera position to interpolate from
        //     const currentPosition = globe.pointOfView();
        
        //     // Animate the transition using gsap
        //     gsap.to(currentPosition, {
        //         lat: target.lat,
        //         lng: target.lng,
        //         altitude: target.altitude,  // Adjust the altitude if needed
        //         duration: 2,  // Duration in seconds
        //         ease: "power2.inOut",  // Smooth easing
        //         onUpdate: () => {
        //             // Update the globe camera point of view gradually
        //             Globe.pointOfView(currentPosition);
        //         }
        //     });
        
        //     console.log('object position', globe.camera().position);
        // });

     var camPosIndex = 0;

      const londonTarget = new THREE.Vector3(-2.0416446700265904, 82.88, 58.2);
      const cvilleTarget = new THREE.Vector3(-80.0416446700265904, 62.88, 16.2);
      const ptonTarget = new THREE.Vector3(-74.0416446700265904, 65.88, 20.2);

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

            console.log(model)
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


    

    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.getElementById('globeViz').appendChild(renderer.domElement);

    // Setup scene
    const scene = new THREE.Scene();
    scene.add(Globe);
    scene.add(new THREE.AmbientLight(0xcccccc, 3*Math.PI));
    scene.add(new THREE.DirectionalLight(0xffffff, 3 * Math.PI));

    const camera = new THREE.PerspectiveCamera();
    camera.aspect = window.innerWidth/window.innerHeight;
    camera.updateProjectionMatrix();
    camera.position.z = 500;

    // const tbControls = new TrackballControls(camera, renderer.domElement);
    // tbControls.minDistance = 101;
    // tbControls.rotateSpeed = 5;
    // tbControls.zoomSpeed = 0.8;

      function animate() {

        

        const lookAts = [
            { city: 'charlottesville', lookAt: cvilleTarget, duration: 10000 }, // Duration in milliseconds
            { city: 'princeton', lookAt: ptonTarget, duration: 5000 },
            { city: 'london', lookAt: londonTarget, duration: 5000 }
        ];
    
        let currentIndex = 0;
        let lastChangeTime = Date.now();
        let target = lookAts[0].lookAt;

        // Helper vector to store the interpolated lookAt position
        const smoothLookAt = new THREE.Vector3().copy(target);

        requestAnimationFrame(function loop(time) {

            // tbControls.update();

            const now = Date.now();

            if (now - lastChangeTime > lookAts[currentIndex].duration) {
                currentIndex = (currentIndex + 1) % lookAts.length; // Move to the next target
                const newTarget = lookAts[currentIndex].lookAt; // Update to the next lookAt target
    
                // Smoothly animate the camera's lookAt using GSAP
                gsap.to(smoothLookAt, {
                    x: newTarget.x,
                    y: newTarget.y,
                    z: newTarget.z,
                    duration: lookAts[currentIndex].duration / 1000, // Convert to seconds for GSAP
                    ease: "power2.inOut"
                });
    
                lastChangeTime = now; // Reset the timer
            }


        Globe.objectThreeObject(data => {
          return modelCache[data.label].clone();  // Use a clone of the loaded model
        })

        // globe.camera().lookAt(target); // Orient camera to look at next point
        // globe.camera().lookAt(smoothLookAt);
        // globe.renderer().render(globe.scene(), globe.camera());

        renderer.render(scene, camera);


        // globe.camera().lookAt();
        
        requestAnimationFrame(loop)

        })

        


      };

      Object.keys(cities).forEach(label => {
        animateModelScale(label);
    });

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
    