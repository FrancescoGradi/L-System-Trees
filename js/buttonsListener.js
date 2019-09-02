lastTreeId = null;
let axiom = "";
let rule1 = "";
let rule2 = "";
var angle = 0;
var branchLength = 5;
var branchRadius = 0.4;
var initialBranchRadius = 0.4;
var lengthReductionFactor = 0.05;
var radiusReductionFactor = 0.05;
var leafsPositions = [[]];


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
        initialBranchRadius = document.getElementById("radius").value;
        lengthReductionFactor = (document.getElementById("lengthReductionFactor").value) / 100;
        radiusReductionFactor = (document.getElementById("radiusReductionFactor").value) / 100;

        // Geometria composta dell'albero
        var totalGeometry = new THREE.Geometry();

        // Punto iniziale in questo caso
        let topPoint = new THREE.Vector3(0, - 45, 0);

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

        var texture = new THREE.TextureLoader().load('images/bark-2.jpg');

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        const timesToRepeatHorizontally = 1;
        const timesToRepeatVertically = 4;
        texture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);

        texture.center.set(.5, .5);
        texture.rotation = toRadians(15);

        //var material = new THREE.MeshPhongMaterial({color: 0xfbf2e0});

        var material = new THREE.MeshPhongMaterial({
            map: texture,
        });

        var mesh = new THREE.Mesh(totalGeometry, material);

        mesh.name = 'lastTree';
        lastTreeId = 'lastTree';

        leafCreator();

        mesh.receiveShadow = true;
        mesh.castShadow = true;

        scene.add(mesh);

    });

});