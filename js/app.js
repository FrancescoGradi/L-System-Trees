// these need to be accessed inside more than one function so we'll declare them first
let container;
let camera;
let controls;
let renderer;
let scene;

const mixers = [];
const clock = new THREE.Clock();

function init() {

  container = document.querySelector( '#scene-container' );

  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x000000 );

  createCamera();
  createControls();
  createLights();
  loadModels();
  createRenderer();

  renderer.setAnimationLoop( () => {

    update();
    render();

  } );

}

function createCamera() {

  camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 1, 100 );
  camera.position.set( -85, 0, 0 );

}

function createControls() {

  controls = new THREE.OrbitControls( camera, container );

}

function createLights(array, offset) {

  const ambientLight = new THREE.HemisphereLight( 0xddeeff, 0x0f0e0d, 5 );

  const mainLight = new THREE.DirectionalLight( 0xffffff, 5 );
  mainLight.position.set(10, 10, 10);

  scene.add( ambientLight, mainLight );

}

function loadModels() {

  const loader = new THREE.GLTFLoader();

  // A reusable function to set up the models. We're passing in a position parameter
  // so that they can be individually placed around the scene
  const onLoad = ( gltf, position ) => {

    const model = gltf.scene.children[ 0 ];
    model.position.copy( position );

    scene.add( model );

  };
  // the loader will report the loading progress to this function
  const onProgress = () => {};

  // the loader will send any error messages to this function, and we'll log
  // them to to console
  const onError = ( errorMessage ) => { console.log( errorMessage ); };
}

function arrangeTree(totalGeometry, iteration, branchLength, branchRadius, topPoint, thetaOld, phiOld, theta, phi) {

  x = - Math.sin(toRadians(phi)) * (branchLength / 2);
  y = Math.cos(toRadians(theta)) * (branchLength / 2) + topPoint.y;
  z = Math.sin(toRadians(theta)) * (branchLength / 2) + topPoint.z;

  newTopPoint = branchInsert(totalGeometry, x, y, z, thetaOld + theta, phiOld + phi,
      branchRadius * 0.85, branchRadius * 0.9, branchLength);

  return newTopPoint;

}


function branchInsert(totalGeometry, x, y, z, theta, phi, radiusTop, radiusBottom, height) {

  var branch = new THREE.CylinderGeometry(radiusTop, radiusBottom, height, 9);

  branch.rotateX(toRadians(theta));
  branch.rotateZ(toRadians(phi));

  var branchMesh = new THREE.Mesh(branch);

  branchMesh.position.set(x, y, z);

  branchMesh.updateMatrix();
  totalGeometry.merge(branchMesh.geometry, branchMesh.matrix);

  var newTopPoint = new THREE.Vector3(x - Math.cos(toRadians(phi)) * height / 2, y + Math.sin(toRadians(theta)) * height / 2,
      z - Math.sin(toRadians(theta)) * height / 2);

  return newTopPoint;

}


function createRenderer() {

  // create a WebGLRenderer and set its width and height
  renderer = new THREE.WebGLRenderer( { antialias: true } );
  renderer.setSize( container.clientWidth, container.clientHeight );

  renderer.setPixelRatio( window.devicePixelRatio );

  renderer.gammaFactor = 2.2;
  renderer.gammaOutput = true;

  renderer.physicallyCorrectLights = true;

  container.appendChild( renderer.domElement );

}

function update() {

  const delta = clock.getDelta();

  for ( const mixer of mixers ) {

    mixer.update( delta );

  }

}

function render() {

  renderer.render( scene, camera );

}

function onWindowResize() {

  camera.aspect = container.clientWidth / container.clientHeight;

  // update the camera's frustum
  camera.updateProjectionMatrix();

  renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

init();
