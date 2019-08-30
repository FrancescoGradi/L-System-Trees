lastTreeId = null;
var iterations = 0;

$(document).ready(function() {

    $('#rendering').on('click', function (e) {

        e.preventDefault();

        if (lastTreeId != null)
            scene.remove(scene.getObjectByName('lastTree'));

        var axiom = document.getElementById("axiom").value;
        var rule1 = document.getElementById("rule1").value;
        var rule2 = document.getElementById("rule2").value;


        iterations = document.getElementById("iterations").value;

        var angle = document.getElementById("degrees").value;
        var branchLength = document.getElementById("length").value;
        var branchRadius = document.getElementById("radius").value;

        var rootHeight = branchLength;

        var totalGeometry = new THREE.Geometry();

        var topPoint = new THREE.Vector3(0, rootHeight/2 - 10, 0);

        var j = 0;
        var rightX = 0;
        var rightZ = 0;

        var preXAngle = 0;
        var preZAngle = 0;

        for (let i = 0; i < axiom.length; i++) {

            if (axiom.charAt(i) === "+") {
                rightX += 1;
                continue;
            }

            if (axiom.charAt(i) === "-") {
                rightX -= 1;
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
                topPoint = branchInsert(totalGeometry, iterations, branchLength, branchRadius * (1 - j * 0.05),
                    topPoint, angle * rightX + preXAngle, angle * rightZ + preZAngle);
                j += 1;

                preXAngle += angle * rightX;
                preZAngle += angle * rightZ;
                rightX = 0;
                rightZ = 0;
            }

        }

        /*
        var sphere = new THREE.SphereGeometry( 0.2, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var sphereMesh = new THREE.Mesh(sphere, material);

        sphereMesh.position.set(vector.x, vector.y, vector.z);

        scene.add( sphereMesh );

        topPoint = branchInsert(totalGeometry, iterations, branchLength, branchRadius, topPoint, 0, 0);
        topPoint = branchInsert(totalGeometry, iterations, branchLength, branchRadius, topPoint, 0, 0);
        topPoint = branchInsert(totalGeometry, iterations, branchLength, branchRadius, topPoint, 0, 0);

        newTopPoint = branchInsert(totalGeometry, iterations, branchLength, branchRadius, topPoint, angle, 55);
        newTopPoint2 = branchInsert(totalGeometry, iterations, branchLength, branchRadius, topPoint, -angle, 35);

        branchInsert(totalGeometry, iterations, branchLength, branchRadius, newTopPoint, angle, angle / 4);
        branchInsert(totalGeometry, iterations, branchLength, branchRadius, newTopPoint2, -angle, angle / 4);
        branchInsert(totalGeometry, iterations, branchLength, branchRadius, newTopPoint2, angle, angle / 4);

        */


        var material = new THREE.MeshPhongMaterial({color: 0xfbf2e0});
        var mesh = new THREE.Mesh(totalGeometry, material);

        mesh.name = 'lastTree';
        lastTreeId = 'lastTree';
        scene.add(mesh);

    });

});