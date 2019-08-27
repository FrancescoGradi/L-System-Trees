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
        var singleGeometry = new THREE.Geometry();

        var rootMesh = new THREE.Mesh(root);
        rootMesh.position.set(0, 0, 0);

        rootMesh.updateMatrix();
        singleGeometry.merge(rootMesh.geometry, rootMesh.matrix);

        var topPoint = THREE.Vector3(0, 0, rootHeight/2);

        var newHeight = branchLength * 0.7;
        x = 0;
        y = rootHeight/2 + Math.cos(toRadians(angle)) * (newHeight / 2);
        z = Math.sin(toRadians(angle)) * (newHeight / 2);

        branchInsert(singleGeometry, x, y, z, angle, branchRadius * 0.85, branchRadius * 0.9,
            newHeight);

        x = 0;
        y = rootHeight/2 + Math.cos(toRadians(-angle)) * (newHeight / 2);
        z = Math.sin(toRadians(-angle)) * (newHeight / 2);

        branchInsert(singleGeometry, x, y, z, -angle, branchRadius * 0.85, branchRadius * 0.9,
            newHeight);

        var material = new THREE.MeshPhongMaterial({color: 0xfbf2e0});
        var mesh = new THREE.Mesh(singleGeometry, material);

        mesh.name = 'lastTree';
        lastTreeId = 'lastTree';
        scene.add(mesh);

    });

});