
$(document).ready(function() {

    $('#rendering').on('click', function (e) {

        e.preventDefault();

        var axiom = document.getElementById("axiom").value;
        var iterations = document.getElementById("iterations").value;
        var angle = document.getElementById("degrees").value;

        var rootHeight = 11;

        var root = new THREE.CylinderGeometry(0.5, 0.8, rootHeight, 9);
        var singleGeometry = new THREE.Geometry();

        var rootMesh = new THREE.Mesh(root);
        rootMesh.position.set(0, 0, 0);

        rootMesh.updateMatrix();
        singleGeometry.merge(rootMesh.geometry, rootMesh.matrix);

        var topPoint = THREE.Vector3(0, 0, rootHeight/2);

        var newHeight = 5;
        x = 0;
        y = rootHeight/2 + Math.cos(toRadians(angle)) * (newHeight / 2);
        z = Math.sin(toRadians(angle)) * (newHeight / 2);

        branchInsert(singleGeometry, x, y, z, angle, 0.4, 0.5, newHeight);

        x = 0;
        y = rootHeight/2 + Math.cos(toRadians(-angle)) * (newHeight / 2);
        z = Math.sin(toRadians(-angle)) * (newHeight / 2);

        branchInsert(singleGeometry, x, y, z, -angle, 0.4, 0.5, newHeight);

        var material = new THREE.MeshPhongMaterial({color: 0x43231C});
        var mesh = new THREE.Mesh(singleGeometry, material);

        scene.add(mesh);

    });

});