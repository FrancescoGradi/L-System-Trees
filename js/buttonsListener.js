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

        var root = new THREE.CylinderGeometry(branchRadius * 0.9, branchRadius, rootHeight, 9);
        var totalGeometry = new THREE.Geometry();

        var rootMesh = new THREE.Mesh(root);
        rootMesh.position.set(0, -10, 0);

        rootMesh.updateMatrix();

        totalGeometry.merge(rootMesh.geometry, rootMesh.matrix);

        /*
        var sphere = new THREE.SphereGeometry( 0.2, 32, 32 );
        var material = new THREE.MeshBasicMaterial( {color: 0xffff00} );
        var sphereMesh = new THREE.Mesh(sphere, material);

        sphereMesh.position.set(vector.x, vector.y, vector.z);

        scene.add( sphereMesh );
        */

        var topPoint = new THREE.Vector3(0, rootHeight/2 - 10, 0);

        topPoint = branchInsert(totalGeometry, iterations, branchLength, branchRadius, topPoint, 0, 0);
        topPoint = branchInsert(totalGeometry, iterations, branchLength, branchRadius, topPoint, 0, 0);
        topPoint = branchInsert(totalGeometry, iterations, branchLength, branchRadius, topPoint, 0, 0);

        newTopPoint = branchInsert(totalGeometry, iterations, branchLength, branchRadius, topPoint, angle, 55);
        newTopPoint2 = branchInsert(totalGeometry, iterations, branchLength, branchRadius, topPoint, -angle, 35);

        branchInsert(totalGeometry, iterations, branchLength, branchRadius, newTopPoint, angle, angle / 4);
        branchInsert(totalGeometry, iterations, branchLength, branchRadius, newTopPoint2, -angle, angle / 4);
        branchInsert(totalGeometry, iterations, branchLength, branchRadius, newTopPoint2, angle, angle / 4);

        var material = new THREE.MeshPhongMaterial({color: 0xfbf2e0});
        var mesh = new THREE.Mesh(totalGeometry, material);

        mesh.name = 'lastTree';
        lastTreeId = 'lastTree';
        scene.add(mesh);

    });

});