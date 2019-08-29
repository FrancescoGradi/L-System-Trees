lastTreeId = null;

$(document).ready(function() {

    $('#rendering').on('click', function (e) {

        e.preventDefault();

        if (lastTreeId != null)
            scene.remove(scene.getObjectByName('lastTree'));

        var axiom = document.getElementById("axiom").value;
        var iterations = document.getElementById("iterations").value;
        var angle = document.getElementById("degrees").value;
        var branchLength = document.getElementById("length").value;
        var branchRadius = document.getElementById("radius").value;

        var rootHeight = branchLength;

        var root = new THREE.CylinderGeometry(branchRadius * 0.9, branchRadius, rootHeight, 9);
        var totalGeometry = new THREE.Geometry();

        var rootMesh = new THREE.Mesh(root);
        rootMesh.position.set(0, 0, 0);

        rootMesh.updateMatrix();
        totalGeometry.merge(rootMesh.geometry, rootMesh.matrix);

        var topPoint = new THREE.Vector3(0, rootHeight/2, 0);
        console.log(topPoint.x);

        topPoint = arrangeTree(totalGeometry, iterations, branchLength, branchRadius, topPoint, 0, 0, angle, angle * 3 / 2);

        console.log(topPoint.x);
        console.log(topPoint.y);
        console.log(topPoint.z);


        arrangeTree(totalGeometry, 1, branchLength, branchRadius, topPoint, angle, angle * 3 / 2, angle * 3 / 2, -angle);

        var material = new THREE.MeshPhongMaterial({color: 0xfbf2e0});
        var mesh = new THREE.Mesh(totalGeometry, material);

        mesh.name = 'lastTree';
        lastTreeId = 'lastTree';
        scene.add(mesh);

    });

});