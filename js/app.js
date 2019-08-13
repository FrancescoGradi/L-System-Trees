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
  scene.background = new THREE.Color( 0x8A8A8A );

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
  camera.position.set( -35, 0, 0 );

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

  // load the first model. Each model is loaded asynchronously,
  // so don't make any assumption about which one will finish loading first

  //const treePosition = new THREE.Vector3(0, -8, 0);
  //loader.load( 'models/tree.glb', gltf => onLoad(gltf, treePosition), onProgress(), onError());

  var root = new THREE.CylinderGeometry(0.5, 0.5, 11, 9);
  var branchR = new THREE.CylinderGeometry(0.3, 0.3, 5, 9);
  var branchL = new THREE.CylinderGeometry(0.3, 0.3, 5, 9);

  branchR.rotateZ(45)
  branchL.rotateZ(-45)

  var singleGeometry = new THREE.Geometry();

  var rootMesh = new THREE.Mesh(root);
  var branchRMesh = new THREE.Mesh(branchR);
  var branchLMesh = new THREE.Mesh(branchL)

  branchRMesh.position.set(-2, 6.5, 0)
  branchLMesh.position.set(2, 6.5, 0)

  rootMesh.updateMatrix();
  singleGeometry.merge(rootMesh.geometry, rootMesh.matrix);

  branchRMesh.updateMatrix();
  singleGeometry.merge(branchRMesh.geometry, branchRMesh.matrix);

  branchLMesh.updateMatrix();
  singleGeometry.merge(branchLMesh.geometry, branchLMesh.matrix)

  var material = new THREE.MeshPhongMaterial({color: 0x43231C});
  var mesh = new THREE.Mesh(singleGeometry, material);
  scene.add(mesh);


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
