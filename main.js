
import * as THREE from 'three';
import { GUI } from 'dat.gui'
import { Mesh, AnimationMixer } from 'three';
import {OrbitControls} from 'three/examples/jsm/controls/OrbitControls.js';
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader.js';
import { FBXLoader } from 'three/addons/loaders/FBXLoader.js';
import * as dat from 'dat.gui';
import { ShadowMapViewer } from 'three/addons/utils/ShadowMapViewer.js';


const monkeyUrl = new URL('/house/plaane.glb', import.meta.url);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);
const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45,
window.innerWidth / window.innerHeight,
    0.1,
    1000
);
//world color
renderer.setClearColor(0xA3A3A3);
renderer.shadowMap.enabled = true;
const orbit = new OrbitControls(camera, renderer.domElement);

// light

const ambientlight =new THREE.AmbientLight(0xffffff,0.5)
scene.add(ambientlight)

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.4);
directionalLight.position.set(50, 70, 20);
directionalLight.castShadow = true ;
scene.add(directionalLight);


//Hemisphere
// var light = new THREE.HemisphereLight(0xf6e86d, 0x404040, 1);
// scene.add(light);




// const spotLight = new THREE.SpotLight(0xFFFFFF);
// scene.add(spotLight);
// spotLight.position.set(-100, 100, 0);
// spotLight.castShadow = true;
// spotLight.intensity =1.2;
// spotLight.angle = 0.2;
// spotLight.penumbra =0.3

// spotLight.shadow.mapSize.width = 1024;
// spotLight.shadow.mapSize.height = 1024 ;
// spotLight.shadow.camera.near = 5;
// spotLight.shadow.camera.far = 10;
// spotLight.shadow.focus = 1 ;

// const sLightHelper = new THREE.SpotLightHelper(spotLight);
// scene.add(sLightHelper);

// const planeGeo = new THREE.PlaneGeometry(100, 100);

// const planeMat= new THREE.MeshPhongMaterial({
//     color: 0xFFFFFF,
//     side: THREE.DoubleSide ,
//     dithering:true
// });
// const plane = new THREE.Mesh(planeGeo, planeMat);
// scene.add(plane);
// plane.rotation.x = -0.5 * Math.PI;
// plane.receiveShadow = true;

// gui

const gui =new dat.GUI();


// camera

camera.position.set(10, 10, 10);
orbit.update();
// grid

const grid = new THREE.GridHelper(30, 30);
scene.add(grid);


//loaders

const assetLoader = new GLTFLoader();
// const assetLoader = new FBXLoader();
let mixer;
assetLoader.load(monkeyUrl.href, function(object) {
	
    const model = object.scene;
    scene.add(model);
    mixer = new THREE.AnimationMixer(model);
    const clips = object.animations;
    // model.position.set(1,3,1);

    model.castShadow = true ;
    model.traverse(function(node) {
        if(node.isMesh)
        node.castShadow = true ;
    });
    //in fbx use these below

	scene.add( object );
	// object.rotation.set (4.7,0,0)
// 	object.scale.set(0.01,0.01,0.01 )

    // Play a certain animation
    // const clip = THREE.AnimationClip.findByName(clips, 'HeadAction');
    // const action = mixer.clipAction(clip);
    // action.play();

    // Play all animations at the same time
    clips.forEach(function(clip) {
        const action = mixer.clipAction(clip);
        action.play();
    });
	
}, undefined, function(error) {
    console.error(error);
});

//animation

const clock = new THREE.Clock();
function animate() {
    if(mixer)
        mixer.update(clock.getDelta());
		
    renderer.render(scene, camera);
}

renderer.setAnimationLoop(animate);

//window resize

window.addEventListener('resize', function() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
});




// //plane

// const PlaneGeometry =new THREE.PlaneGeometry (100,100);
// const planeMaterial = new THREE.MeshPhongMaterial({color:0xFFFFFF 
// 	,side : THREE.DoubleSide,  dithering:true });
// 	// remove 3 double side if u want to see throw walls
// const plane = new THREE.Mesh(PlaneGeometry,planeMaterial);
// scene.add(plane);
// plane.rotation.x = -0.5* Math.PI;












