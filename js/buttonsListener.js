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
var leafColor = 0x22dd11;


$(document).ready(function() {

    $('#rendering').on('click', function (e) {

        e.preventDefault();

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

        let season = document.getElementById('season').value;
        seasonChanger(season);

        // Geometria composta dell'albero
        var totalGeometry = new THREE.Geometry();

        // Punto iniziale in questo caso
        let topPoint = new THREE.Vector3(0, -45, 0);

        let marker = scene.getObjectByName('marker');

        if (marker != null) {
            topPoint = marker.position;
            scene.remove(scene.getObjectByName('marker'));
            circleMesh = null;
        }

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

        var texture = new THREE.TextureLoader().load('images/bark-2.jpg');

        texture.wrapS = THREE.RepeatWrapping;
        texture.wrapT = THREE.RepeatWrapping;

        const timesToRepeatHorizontally = 1;
        const timesToRepeatVertically = 4;
        texture.repeat.set(timesToRepeatHorizontally, timesToRepeatVertically);

        texture.center.set(.5, .5);
        texture.rotation = toRadians(15);

        var material = new THREE.MeshPhongMaterial({
            map: texture,
        });

        var mesh = new THREE.Mesh(totalGeometry, material);

        if (season !== "1" && season !== "2") {
            liteLeafCreator();
        } else if (season === "2") {
            createFlowers();
        }

        mesh.receiveShadow = true;
        mesh.castShadow = true;

        leafsPositions = [[]];

        scene.add(mesh);

    });

    const presets = document.getElementById('presets');

    presets.addEventListener('change', (event) => {

        let axiomP = document.getElementById("axiom");
        let rule1P = document.getElementById("rule1");
        let rule2P = document.getElementById("rule2");
        let iterationsP = document.getElementById("iterations");

        let angleP = document.getElementById("degrees");
        let branchLengthP = document.getElementById("length");
        let branchRadiusP = document.getElementById("radius");
        let initialBranchRadiusP = document.getElementById("radius");
        let lengthReductionFactorP = document.getElementById("lengthReductionFactor");
        let radiusReductionFactorP = document.getElementById("radiusReductionFactor");

        let seasonP = document.getElementById('season');

        switch (event.target.value) {

            case "1":
                axiomP.value = "ffBAf>A";
                rule1P.value = "^fB++fB<<fvB";
                rule2P.value = "f<f>B>f--AvA";
                iterationsP.value = "5";

                angleP.value = "30";
                branchLengthP.value = "5";
                lengthReductionFactorP.value = "4.5";
                branchRadiusP.value = "0.55";
                radiusReductionFactorP.value = "5";

                seasonP.value = "4";

                break;

            case "2":
                axiomP.value = "fv<A^>A-A+A^A>A";
                rule1P.value = "f+Af>f<f-B^^A";
                rule2P.value = "f+Bf+f-f<<A-AvvB";
                iterationsP.value = "5";

                angleP.value = "20";
                branchLengthP.value = "4";
                lengthReductionFactorP.value = "2";
                branchRadiusP.value = "0.45";
                radiusReductionFactorP.value = "9";

                seasonP.value = "3";

                break;

            case "3":
                axiomP.value = "ff---A++B<<A>>++B";
                rule1P.value = "^^fvv++f--B^^fA";
                rule2P.value = "f--A++++A";
                iterationsP.value = "5";

                angleP.value = "15";
                branchLengthP.value = "5";
                lengthReductionFactorP.value = "3";
                branchRadiusP.value = "0.75";
                radiusReductionFactorP.value = "8.5";

                seasonP.value = "1";

                break;

            case "4":
                axiomP.value = "f--f++A++B----A";
                rule1P.value = "^^fv++<f-->Bf<^^f<B";
                rule2P.value = "f-->Af++++fA<A";
                iterationsP.value = "5";

                angleP.value = "15";
                branchLengthP.value = "5";
                lengthReductionFactorP.value = "3";
                branchRadiusP.value = "0.9";
                radiusReductionFactorP.value = "7";

                seasonP.value = "2";

                break;

        }
    });

});