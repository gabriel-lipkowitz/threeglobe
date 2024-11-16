import * as THREE from 'three';
import ThreeGlobe from 'three-globe'
import { GLTFLoader } from './GLTFLoader.js';
import {Tween, Group} from 'https://unpkg.com/@tweenjs/tween.js@23.1.3/dist/tween.esm.js'
  import { TrackballControls } from './TrackballControls.js';
  import { OrbitControls } from './OrbitControls.js';


  

const models = {
    'midAtlantic': './models/midAtlantic.glb',
    'northeast': './models/northeast.glb',
    'tree': './models/tree.glb'
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
      'midAtlantic': { lat: 38.0293, lng: -78.4767, visits: 4, duration: 10, start: 0.5 },
      'northeast': { lat: 40.3430, lng: -74.6514, visits: 4, duration: 5, start: 10.5 },
      'Ann Arbor': { lat: 42.2808, lng: -83.7430, visits: 1, duration: 1, start: 24 },
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
    
    //   console.log("intersects ", intersects)
      if (intersects.length > 0) {
        // Get the closest intersected object
        const intersectedObject = intersects[0].object;
    
        // Log the name of the intersected object
        // if (intersectedObject.name) {
        //   console.log('Detected object:', intersectedObject.name);
        // } else {
        //   console.log('Detected an unnamed object.');
        // }
    
        // Optionally, highlight the fact that we've detected something without modifying its properties
        if (INTERSECTED !== intersectedObject) {
          INTERSECTED = intersectedObject;
        }
      } else {
        // Log that no object is currently intersected
        if (INTERSECTED) {
        //   console.log('No object detected.');
          INTERSECTED = null;
        }
      }
    }
  
  window.addEventListener('mousemove', onMouseMove);
    
  
  const labelToTypeMap = {
      'midAtlantic': 'midAtlantic',
      'Ann Arbor': 'tree',
      'northeast': 'northeast'
  };

  

  
  export async function initializeGlobe() {
  
      const ARC_REL_LEN = 0.7; // relative to whole arc
      const FLIGHT_TIME = 500;

      const universityLabels = ["Princeton", "Stanford", "Charlottesville", "London", "Singapore"];
  
      let currentHovered = null;
        let originalScale = { x: 1, y: 1, z: 1 };
        let isExpanding = false;
      // const Globe = new ThreeGlobe()
      const globe = new Globe()
        .globeImageUrl('./imgs/8081_earthspec10k-2.png')
        // .globeImageUrl('//unpkg.com/three-globe/example/img/earth-dark.jpg')
        .bumpImageUrl('//unpkg.com/three-globe/example/img/earth-topology.png')
        .backgroundImageUrl('./imgs/night-sky.png')
      //   .pointAltitude('size')
      //   .pointColor('color')
          .objectFacesSurface(true)
        //   .backgroundColor('#D3D3D3')
          .atmosphereColor('lightblue')
          .objectsData([
              { lat: 38.0293, lng: -78.4767, label: 'midAtlantic' },  // Charlottesville
              { lat: 38.0293, lng: -78.4767, label: 'northeast' },  // Charlottesville
              { lat: 42.2808, lng: -83.7430,  label: 'Ann Arbor' },  // Ann Arbor
              { lat: 28.5383, lng: -81.3792,  label: 'Orlando' },  // Orlando
          ])
          .objectThreeObject(data => {
            //   console.log(data.label)
              return modelCache[data.label].clone();  // Use a clone of the loaded model
          })
          .objectLabel(data => `<div style="
              font-family: 'Helvetica', 'Arial', sans-serif;
              color: black;
              font-size: 14px;  /* Adjust font size as needed */
              padding: 5px;
              background: rgba(255, 255, 255, 0.8); /* Optional: Light background to contrast text */
              border-radius: 5px;
              box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.2); /* Optional: shadow for better visibility */
          ">${data.label}</div>`)
        //   .arcsData(arcsData)
        .arcColor(arc => {
            return 'grey'; 
        })
        .arcsTransitionDuration(0)
        .arcDashLength(ARC_REL_LEN)
        .arcDashGap(2)
        .arcDashInitialGap(1)
        .arcDashAnimateTime(FLIGHT_TIME)
        .arcStroke(0.05)
        .onObjectHover((obj, prevObj) => {
            // Handle when the mouse moves to an object
            
            if (obj != null && prevObj != null) {
                // console.log("Current object:", obj);
                // console.log("Previous object:", prevObj);

                const model = modelCache[obj.label];
          
                if (model) {

                    // console.log(model)

                    if (universityLabels.includes(obj.label)) {
                        // Increase scale to 3
                        gsap.to(model.scale, {
                            x: 3,
                            y: 3,
                            z: 3,
                            duration: 1
                        });
                    
                        // Move position up along the z-axis
                        gsap.to(model.position, {
                            z: -0.9, // Less of an increase, adjust as needed
                            duration: 1
                        });
                    
                        // Rotate by 15 degrees in x, y, z directions
                        gsap.to(model.rotation, {
                            x: THREE.MathUtils.degToRad(-30),
                            y: THREE.MathUtils.degToRad(-30),
                            z: THREE.MathUtils.degToRad(-30),
                            duration: 1
                        });
                    
                    } else {

                        if (model.children && model.children.length) {
                            model.children.forEach(child => {
                                // Check if the child's name is 'flag' before applying the animation
                                if (child.name === "flag") {
                                    gsap.to(child.scale, {
                                        x: 4,
                                        y: 4,
                                        z: 4,
                                        duration: 1
                                    });
                                }
                            });
                        }
                    }
                } else {
                    console.warn(`Object with label ${label} not found.`);
                }
                    isExpanding = true;  // Update the state to indicate scaling is occurring
                
            } else if (obj == null && prevObj != null) {
                // console.log("Mouse left the object:", prevObj);

                const model = modelCache[prevObj.label];
          
                if (model) {

                    if (universityLabels.includes(prevObj.label)) {
                        // Return scale back to normal (assuming original scale is 1)
                        gsap.to(model.scale, {
                            x: 2,
                            y: 2,
                            z: 2,
                            duration: 1
                        });
                    
                        // Return position to original along the z-axis
                        gsap.to(model.position, {
                            z: -1, // Adjust to match the exact original z position
                            duration: 1
                        });
                    
                        // Return rotation to original
                        gsap.to(model.rotation, {
                            x: 0,
                            y: 0,
                            z: 0,
                            duration: 1
                        });
                    } else {

                        // console.log(model)

                        if (model.children && model.children.length) {
                            model.children.forEach(child => {
                                // Check if the child's name is 'flag' before applying the animation
                                if (child.name === "flag") {
                                    gsap.to(child.scale, {
                                        x: 2,
                                        y: 2,
                                        z: 2,
                                        duration: 1
                                    });
                                }
                            });
                        }

                    }
        
                    
                } else {
                    console.warn(`Object with label ${label} not found.`);
                }
        
                isExpanding = false;  // Update the state to indicate no object is currently expanded
            }
            
            if (obj != null && prevObj != null && obj != prevObj) {
                // console.log("Mouse left the object:", prevObj);

                const model = modelCache[prevObj.label];
          
                if (model) {

                    if (universityLabels.includes(prevObj.label)) {
                        // Return scale back to normal (assuming original scale is 1)
                        gsap.to(model.scale, {
                            x: 2,
                            y: 2,
                            z: 2,
                            duration: 1
                        });
                    
                        // Return position to original along the z-axis
                        gsap.to(model.position, {
                            z: -1, // Adjust to match the exact original z position
                            duration: 1
                        });
                    
                        // Return rotation to original
                        gsap.to(model.rotation, {
                            x: 0,
                            y: 0,
                            z: 0,
                            duration: 1
                        });
                    } else {

                        if (model.children && model.children.length) {
                            model.children.forEach(child => {
                                // Check if the child's name is 'flag' before applying the animation
                                if (child.name === "flag") {
                                    gsap.to(child.scale, {
                                        x: 2,
                                        y: 2,
                                        z: 2,
                                        duration: 1
                                    });
                                }
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

          


            function findAllLights(scene) {
                const lights = [];  // Array to hold all lights
                scene.traverse((object) => {  // Traverse every object in the scene
                    if (object.isLight) {  // Check if the object is a light
                        lights.push(object);  // Add to the lights array
                        // console.log(object);  // Optionally log the light details
                    }
                });
                return lights;  // Return the array of lights
            }

            const allLights = findAllLights(globe.scene());
// console.log(allLights);




            function animateCamera(cityName) {
                // Access the city's data from the cities object
                const cityData = cities[cityName];
                // console.log("cityData ", cityData)
                // Define the new target position using the data from the cities object
                const target = {
                    lat: cityData.lat,
                    lng: cityData.lng,
                    altitude: 0.25  // Set the altitude
                };

                // Get the current camera position to interpolate from
                const currentPosition = globe.pointOfView();

                // Animate the transition using gsap
                gsap.to(currentPosition, {
                    lat: target.lat,
                    lng: target.lng,
                    altitude: target.altitude,  // Adjust the altitude if needed
                    duration: 3,  // Duration in seconds
                    ease: "power2.inOut",  // Smooth easing
                    onUpdate: () => {
                        // Update the globe camera point of view gradually
                        globe.pointOfView(currentPosition);
                    },
                    onComplete: () => {
  
                      const currentPosition = globe.pointOfView();
  
                      // Second Animation: Fading out the object, starts after the first completes
                      gsap.to(currentPosition, {
                          lat: target.lat,
                          lng: target.lng,
                          altitude: 0.3,  // Adjust the altitude if needed
                          duration: 5,  // Duration in seconds
                        //   ease: "power2.inOut",  // Smooth easing
                          onUpdate: () => {
                              // Update the globe camera point of view gradually
                              globe.pointOfView(currentPosition);
                          }
                      });
                    }
                });
            }

        const delay = 0.5
          const duration = 0.5
          const incrementSmall = 2
          const durationCity = 0.5
          const incrementLarge = 3
          

          const incrementCity = 1;
const incrementUni = 3;

const cityPairsUSEast = [
    { from: 'midAtlantic', to: 'midAtlantic', delay, duration, increment: incrementCity, durationCity }
];

const cityPairsUSWest = [
    { from: 'northeast', to: 'northeast', delay, duration, increment: incrementCity, durationCity },
    { from: 'Ann Arbor', to: 'Ann Arbor', delay, duration, increment: incrementCity, durationCity }
];

const cityPairsEurope = [
    { from: 'London', to: 'London', delay, duration, increment: incrementCity, durationCity },
    { from: 'London', to: 'Oxford', delay, duration, increment: incrementCity, durationCity },
    { from: 'Oxford', to: 'Cardiff', delay, duration, increment: incrementCity, durationCity },
    { from: 'Cardiff', to: 'Cambridge', delay, duration, increment: incrementCity, durationCity },
    { from: 'Cambridge', to: 'Bath', delay, duration, increment: incrementCity, durationCity },
    { from: 'Bath', to: 'Paris', delay, duration, increment: incrementCity, durationCity },
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
        // console.log("label ", label);

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
                    onComplete: () => console.log(`Scaling complete for ${child.name}`) // Optional completion log
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
            //   setTimeout(() => { prevCoords = { lat: endLat, lng: endLng } }, duration);
  
            //   // Add and remove arc after 1 cycle
            //   const arc = { startLat, startLng, endLat, endLng };
            //   globe.arcsData([...globe.arcsData(), arc]);

              animateModelScaleSequential({label: label, increment: increment, delay: delay, duration: durationC})
  
              // Remove the arc after 2 cycles (adjust timing as needed)
            //   setTimeout(() => {
            //       globe.arcsData(globe.arcsData().filter(d => d !== arc));
            //   }, duration * 2);
          }
  
          // Function to initiate sequential arcs based on cityPairs
          function sequentialArcs(cityPairs) {

            let prevCoords = cityPairs.length > 0 && cities[cityPairs[0].from] ? { lat: cities[cityPairs[0].from].lat, lng: cities[cityPairs[0].from].lng } : { lat: 0, lng: 0 };          // Function to emit arcs

              let totalDelay = 2000; // Track the cumulative delay for sequential calls
  
              cityPairs.forEach((pair, index) => {
                  const { from, to, delay, duration, increment, durationCity } = pair;
                  const startCoords = cities[from];
                  const endCoords = cities[to];
                //   console.log(startCoords, endCoords)
  
                  // Schedule arc emission after cumulative delay
                  setTimeout(() => {
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
  
                      
  
                      // Update prevCoords to the end coordinates of this arc
                      prevCoords = { lat: endCoords.lat, lng: endCoords.lng };
                  }, totalDelay);
  
                  // Add to the cumulative delay (duration + delay for next arc)
                //   totalDelay += delay * 1000; // Convert delay to milliseconds
              });
          }

          document.getElementById('updateButton').addEventListener('click', function() {
            // console.log("click") // Example: Toggle color change
            sequentialArcs(cityPairsUSEast);
            
            animateCamera("midAtlantic")

        });

        document.getElementById('updateButton2').addEventListener('click', function() {
            // console.log("click") // Example: Toggle color change
            sequentialArcs(cityPairsEurope);

            // animateCamera("Geneva")
        });
          
        document.getElementById('updateButton3').addEventListener('click', function() {
            console.log("click") // Example: Toggle color change
            sequentialArcs(cityPairsUSWest);

            animateCamera("northeast")
        });
  
          globe.onObjectClick((obj, event, { lat, lng, altitude }) => {
              console.log(`Clicked on ${obj.label}: Latitude ${lat}, Longitude ${lng}, Altitude ${altitude}`);
          
              // Define the new target position
              const target = { lat, lng, altitude: 0.25 };
          
              // Get the current camera position to interpolate from
              const currentPosition = globe.pointOfView();
          
              // Animate the transition using gsap
              gsap.to(currentPosition, {
                  lat: target.lat,
                  lng: target.lng,
                  altitude: target.altitude,  // Adjust the altitude if needed
                  duration: 2,  // Duration in seconds
                  ease: "power2.inOut",  // Smooth easing
                  onUpdate: () => {
                      // Update the globe camera point of view gradually
                      globe.pointOfView(currentPosition);
                  }
              });
          
              console.log('object position', globe.camera().position);

          });
  
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
  
            //   console.log(model)
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

            // console.log(globe.lights)
  
            let lights = globe.lights();

// Loop through each light and set its intensity to zero
lights.forEach(light => {
    light.intensity = 2;
});

// Update the lights in the globe with the modified intensities
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
      