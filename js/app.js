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

    camera = new THREE.PerspectiveCamera( 35, container.clientWidth / container.clientHeight, 1, 1000 );
    camera.position.set( -200, 0, 0 );

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

    const onLoad = ( gltf, position ) => {

        const model = gltf.scene.children[ 0 ];
        model.position.copy( position );

        scene.add( model );

    };
    const onProgress = () => {};

    const onError = ( errorMessage ) => { console.log( errorMessage ); };
}


function branchInsert(totalGeometry, branchLength, branchRadius, topTargetPoint, theta, rho, phi) {

    if (branchLength < 0 || branchRadius < 0)
        return topTargetPoint;

    var branch = new THREE.CylinderGeometry(branchRadius * (1 - radiusReductionFactor), branchRadius, branchLength, 9);

    // Calcolo il top e il bottom point del cilindro e guardo dove sono dopo la rotazione
    var newTopPoint = new THREE.Vector3(0, branchLength / 2, 0);
    var bottomPoint = new THREE.Vector3(0, - branchLength / 2, 0);

    var branchMesh = new THREE.Mesh(branch);

    // Eseguo la rotazione
    branchMesh.rotateX(toRadians(theta));
    branchMesh.rotateY(toRadians(rho));
    branchMesh.rotateZ(toRadians(phi));

    branchMesh.updateMatrix();

    // Calcolo i nuovi punti ruotati
    newTopPoint.applyEuler(branchMesh.rotation);
    bottomPoint.applyEuler(branchMesh.rotation);

    // Eseguo una traslazione per allineare il bottom al top target in entrata, salvo il nuovo topPoint
    newTopPoint.x = newTopPoint.x + topTargetPoint.x - bottomPoint.x;
    newTopPoint.y = newTopPoint.y + topTargetPoint.y - bottomPoint.y;
    newTopPoint.z = newTopPoint.z + topTargetPoint.z - bottomPoint.z;

    branchMesh.position.set(topTargetPoint.x - bottomPoint.x, topTargetPoint.y - bottomPoint.y, topTargetPoint.z - bottomPoint.z);
    branchMesh.updateMatrix();

    totalGeometry.merge(branchMesh.geometry, branchMesh.matrix);

    return newTopPoint;

}

function ruleOne(totalGeometry, topPoint, iterations, preXAngle, preYAngle, preZAngle, rightX, rightY, rightZ, j) {

    if (iterations === 0)
        return;

    for (let i = 0; i < rule1.length; i++) {

        if (rule1.charAt(i) === "+") {
            rightX += 1;
            continue;
        }

        if (rule1.charAt(i) === "-") {
            rightX -= 1;
            continue;
        }

        if (rule1.charAt(i) === "^") {
            rightY += 1;
            continue;
        }

        if (rule1.charAt(i) === "v") {
            rightY -= 1;
            continue;
        }

        if (rule1.charAt(i) === ">") {
            rightZ += 1;
            continue;
        }

        if (rule1.charAt(i) === "<") {
            rightZ -= 1;
            continue;
        }

        if (rule1.charAt(i) === "f") {
            topPoint = branchInsert(totalGeometry, branchLength * (1 - j * lengthReductionFactor),
                branchRadius * (1 - j * radiusReductionFactor), topPoint, angle * rightX + preXAngle,
                angle * rightY + preYAngle, angle * rightZ + preZAngle);
            j += 1;

            preXAngle += angle * rightX;
            preYAngle += angle * rightY;
            preZAngle += angle * rightZ;
            rightX = 0;
            rightY = 0;
            rightZ = 0;
        }

        if (rule1.charAt(i) === "A") {
            ruleOne(totalGeometry, topPoint, iterations - 1, preXAngle, preYAngle, preZAngle, rightX, rightY,
                rightZ, j);
            continue;
        }

        if (rule1.charAt(i) === "B") {
            ruleTwo(totalGeometry, topPoint, iterations - 1, preXAngle, preYAngle, preZAngle, rightX, rightY,
                rightZ, j);
            continue;
        }

    }

}

function ruleTwo(totalGeometry, topPoint, iterations, preXAngle, preYAngle, preZAngle, rightX, rightY, rightZ, j) {

    if (iterations === 0)
        return;

    for (let i = 0; i < rule2.length; i++) {

        if (rule2.charAt(i) === "+") {
            rightX += 1;
            continue;
        }

        if (rule2.charAt(i) === "-") {
            rightX -= 1;
            continue;
        }

        if (rule2.charAt(i) === "^") {
            rightY += 1;
            continue;
        }

        if (rule2.charAt(i) === "v") {
            rightY -= 1;
            continue;
        }

        if (rule2.charAt(i) === ">") {
            rightZ += 1;
            continue;
        }

        if (rule2.charAt(i) === "<") {
            rightZ -= 1;
            continue;
        }

        if (rule2.charAt(i) === "f") {
            topPoint = branchInsert(totalGeometry, branchLength * (1 - j * lengthReductionFactor),
                branchRadius * (1 - j * radiusReductionFactor), topPoint, angle * rightX + preXAngle,
                angle * rightY + preYAngle, angle * rightZ + preZAngle);
            j += 1;

            preXAngle += angle * rightX;
            preYAngle += angle * rightY;
            preZAngle += angle * rightZ;
            rightX = 0;
            rightY = 0;
            rightZ = 0;
        }

        if (rule2.charAt(i) === "A") {
            ruleOne(totalGeometry, topPoint, iterations - 1, preXAngle, preYAngle, preZAngle, rightX, rightY,
                rightZ, j);
            continue;
        }

        if (rule2.charAt(i) === "B") {
            ruleTwo(totalGeometry, topPoint, iterations - 1, preXAngle, preYAngle, preZAngle, rightX, rightY,
                rightZ, j);
            continue;
        }

    }

}


function createRenderer() {

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

    camera.updateProjectionMatrix();

    renderer.setSize( container.clientWidth, container.clientHeight );

}

window.addEventListener( 'resize', onWindowResize );

init();
