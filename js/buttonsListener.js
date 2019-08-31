lastTreeId = null;
let axiom = "";
let rule1 = "";
let rule2 = "";
var angle = 0;
var branchLength = 5;
var branchRadius = 0.4;
var lengthReductionFactor = 0.05;
var radiusReductionFactor = 0.05;


$(document).ready(function() {

    $('#rendering').on('click', function (e) {

        e.preventDefault();

        if (lastTreeId != null)
            scene.remove(scene.getObjectByName('lastTree'));

        axiom = document.getElementById("axiom").value;
        rule1 = document.getElementById("rule1").value;
        rule2 = document.getElementById("rule2").value;
        let iterations = document.getElementById("iterations").value;

        angle = document.getElementById("degrees").value;
        branchLength = document.getElementById("length").value;
        branchRadius = document.getElementById("radius").value;
        lengthReductionFactor = (document.getElementById("lengthReductionFactor").value) / 100;
        radiusReductionFactor = (document.getElementById("radiusReductionFactor").value) / 100;

        // Geometria composta dell'albero
        var totalGeometry = new THREE.Geometry();

        // Punto iniziale in questo caso
        let topPoint = new THREE.Vector3(0, branchLength/2 - 45, 0);

        let j = 0;
        let rightX = 0;
        let rightY = 0;
        let rightZ = 0;

        let preXAngle = 0;
        let preYAngle = 0;
        let preZAngle = 0;

        // Funzione che sbriga l'assioma
        for (let i = 0; i < axiom.length; i++) {

            if (axiom.charAt(i) === "+") {
                rightX += 1;
                continue;
            }

            if (axiom.charAt(i) === "-") {
                rightX -= 1;
                continue;
            }

            if (axiom.charAt(i) === "^") {
                rightY += 1;
                continue;
            }

            if (axiom.charAt(i) === "v") {
                rightY -= 1;
                continue;
            }

            if (axiom.charAt(i) === ">") {
                rightZ += 1;
                continue;
            }

            if (axiom.charAt(i) === "<") {
                rightZ -= 1;
                continue;
            }

            if (axiom.charAt(i) === "f") {
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

            if (axiom.charAt(i) === "A") {
                ruleOne(totalGeometry, topPoint, iterations, preXAngle, preYAngle, preZAngle, rightX, rightY, rightZ, j);
                continue;
            }

            if (axiom.charAt(i) === "B") {
                ruleTwo(totalGeometry, topPoint, iterations, preXAngle, preYAngle, preZAngle, rightX, rightY, rightZ, j);
            }

        }

        /*
        var sphere = new THREE.SphereGeometry( 0.2, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var sphereMesh = new THREE.Mesh(sphere, material);

        sphereMesh.position.set(vector.x, vector.y, vector.z);

        scene.add( sphereMesh );
        */

        var texture = new THREE.TextureLoader().load('images/bark-texture-pine-cone.jpg');

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        const timesToRepeatHorizontally = 1;
        const timesToRepeatVertically = 4;
        texture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);

        texture.center.set(.5, .5);
        texture.rotation = toRadians(15);

        //var material = new THREE.MeshPhongMaterial({color: 0xfbf2e0});

        var material = new THREE.MeshBasicMaterial({
            map: texture,
        });

        var mesh = new THREE.Mesh(totalGeometry, material);

        mesh.name = 'lastTree';
        lastTreeId = 'lastTree';

        scene.add(mesh);


        var loader = new THREE.OBJLoader();

        // load a resource
        loader.load(
            // resource URL
            'models/leaf.obj',
            // called when resource is loaded
            function ( object ) {

            },
            // called when loading is in progresses
            function ( xhr ) {

                console.log( ( xhr.loaded / xhr.total * 100 ) + '% loaded' );

            },
            // called when loading has errors
            function ( error ) {

                console.log( 'An error happened' );

            }
        );

        console.log(loader.geometry);

        function loadObj( path, name ){

            var progress = console.log;

            return new Promise(function( resolve, reject ){

                var obj;
                var mtlLoader = new THREE.MTLLoader();

                mtlLoader.setPath( path );
                mtlLoader.load( name + ".mtl", function( materials ){

                    materials.preload();

                    var objLoader = new THREE.OBJLoader();

                    objLoader.setMaterials( materials );
                    objLoader.setPath( path );
                    objLoader.load( name + ".obj", resolve, progress, reject );

                }, progress, reject );

            });

        }

        // This way you can use as many .then as you want

        var myObjPromise = loadObj( "models/", "leaf" );

        myObjPromise.then(myObj => {

            scene.add( myObj );

            myObj.position.y = 20;

        });

    });

});