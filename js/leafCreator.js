// Funzione per caricare un modello 3D Obj e mtl

function loadObj( path, name ){

    var progress = console.log;

    return new Promise(function( resolve, reject ){

        var mtlLoader = new THREE.MTLLoader();

        mtlLoader.setPath( path );
        mtlLoader.load( name + ".obj.mtl", function( materials ){

            materials.preload();

            var objLoader = new THREE.OBJLoader();

            objLoader.setMaterials( materials );
            objLoader.setPath( path );
            objLoader.load( name + ".obj", resolve, progress, reject );

        }, progress, reject );

    });

}

function leafCreator() {
    var myObjPromise = loadObj( "models/", "leaf" );

    myObjPromise.then(myObj => {

        let textureLeaf = new THREE.TextureLoader().load('images/leaf_texture.jpg');
        textureLeaf.repeat.set(0.7, 0.7);
        textureLeaf.center.set(0.5, 0.5);
        textureLeaf.repeat.set(0.55, 0.55);

        myObj.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = textureLeaf;
                child.castShadow = true;
            }
        });

        myObj.scale.x = 0.01;
        myObj.scale.y = 0.01;
        myObj.scale.z = 0.01;

        myObj.position.set(0, 0, 0);

        let bottomPoint = new THREE.Vector3(myObj.position.x + 1.65, myObj.position.y - 1.15, myObj.position.z);

        myObj.rotateY(toRadians(180));
        myObj.rotateZ(toRadians(-90));

        myObj.updateMatrix();

        //scene.add(myObj);

        bottomPoint.applyEuler(myObj.rotation);

        for (let i = 0; i < leafsPositions.length; i++) {
            let newLeaf = myObj.clone();
            let newBottomPoint = bottomPoint.clone();

            newLeaf.rotateX(toRadians(leafsPositions[i][3]));
            newLeaf.rotateY(toRadians(leafsPositions[i][4]));
            newLeaf.rotateZ(toRadians(leafsPositions[i][5]));

            newLeaf.updateMatrix();
            newBottomPoint.applyEuler(newLeaf.rotation);

            newLeaf.position.set(leafsPositions[i][0] - newBottomPoint.x, leafsPositions[i][1] - newBottomPoint.y,
                leafsPositions[i][2] - newBottomPoint.z);

            scene.add(newLeaf);
        }

        leafsPositions = [[]];
    });
}


function liteLeafCreator() {

    let x = 0, y = 0;

    let leafShape = new THREE.Shape();

    leafShape.bezierCurveTo(x, y, x + 4, y, x, y);
    leafShape.bezierCurveTo(x - 3, y, x - 3, y + 7, x - 3, y + 7);
    leafShape.bezierCurveTo(x - 3, y + 11, x - 3, y + 15.4, x + 5, y + 25);
    leafShape.bezierCurveTo(x + 12, y + 15.4, x + 10, y + 11, x + 10, y + 7);
    leafShape.bezierCurveTo(x + 10, y + 7, x + 10, y, x + 4, y);
    leafShape.bezierCurveTo(x + 7, y, x + 5, y + 5, x, y);

    let geometry = new THREE.ShapeGeometry(leafShape);

    let material = new THREE.MeshPhongMaterial({color:leafColor});

    let leaf = new THREE.Geometry();
    leaf.merge(geometry);

    leaf.matrixAutoUpdate  = false;

    var mesh_arr = new Array();
    for(i = 0.05; i < 0.55 ; i += 0.01) {
        mesh_arr[i] = geometry.clone();
        mesh_arr[i].translate(0, 0, i);
        leaf.merge( mesh_arr[i] );
    }
    leaf.rotateY(toRadians(-90));
    leaf.rotateX(toRadians(-3.5));
    leaf.translate(0.25, -8.5, -3.5);

    let stemGeometry = new THREE.CylinderGeometry(0.2, 0.6, 32, 10);
    let stemMesh = new THREE.Mesh(stemGeometry);

    let leafTotalGeometry = new THREE.Geometry();
    leafTotalGeometry.merge(stemMesh.geometry, stemMesh.matrix);
    leafTotalGeometry.merge(leaf);

    let leafTotal = new THREE.Mesh(leafTotalGeometry, material);

    leafTotal.material.side = THREE.DoubleSide;
    leafTotal.castShadow = true;
    leafTotal.receiveShadow = true;

    leafTotal.scale.x = 0.05;
    leafTotal.scale.y = 0.05;
    leafTotal.scale.z = 0.05;

    let bottomPoint = new THREE.Vector3(leafTotal.position.x, leafTotal.position.y - 0.75, leafTotal.position.z);

    for (let i = 0; i < leafsPositions.length; i++) {
        let newLeaf = leafTotal.clone();
        newLeaf.autoUpdate = false;
        let newBottomPoint = bottomPoint.clone();

        newLeaf.rotateX(toRadians(leafsPositions[i][3]));
        newLeaf.rotateY(toRadians(leafsPositions[i][4]));
        newLeaf.rotateZ(toRadians(leafsPositions[i][5]));

        newLeaf.updateMatrix();
        newBottomPoint.applyEuler(newLeaf.rotation);

        newLeaf.position.set(leafsPositions[i][0] - newBottomPoint.x, leafsPositions[i][1] - newBottomPoint.y,
            leafsPositions[i][2] - newBottomPoint.z);

        scene.add(newLeaf);
    }

}

function createFlowers() {

    let x = 0, y = 0;

    let flower = new THREE.Geometry();
    let partialFlower= new THREE.Geometry();

    let heartShape = new THREE.Shape();

    heartShape.moveTo( x + 5, y + 5 );
    heartShape.bezierCurveTo( x + 5, y + 5, x + 4, y, x, y );
    heartShape.bezierCurveTo( x - 6, y, x - 6, y + 7,x - 6, y + 7 );
    heartShape.bezierCurveTo( x - 6, y + 11, x - 3, y + 12.4, x + 5, y + 19 );
    heartShape.bezierCurveTo( x + 12, y + 12.4, x + 16, y + 11, x + 16, y + 7 );
    heartShape.bezierCurveTo( x + 16, y + 7, x + 16, y, x + 10, y );
    heartShape.bezierCurveTo( x + 7, y, x + 5, y + 5, x + 5, y + 5 );

    let geometry = new THREE.ShapeGeometry( heartShape );
    geometry.rotateY(toRadians(-90));
    partialFlower.merge(geometry);

    let geometry2 = geometry.clone();
    geometry2.rotateX(toRadians(90));
    geometry2.translate(0, 24, -13.5);
    partialFlower.merge(geometry2);

    let geometry3 = geometry.clone();
    geometry3.rotateX(toRadians(180));
    geometry3.translate(0, 38, 10);
    partialFlower.merge(geometry3);

    let geometry4 = geometry.clone();
    geometry4.rotateX(toRadians(270));
    geometry4.translate(0, 13.5, 24);
    partialFlower.merge(geometry4);

    flower.merge(partialFlower);

    let material = new THREE.MeshPhongMaterial( { color: 0xF99584 } );
    let mesh = new THREE.Mesh(flower, material) ;

    let circleGeometry = new THREE.CircleGeometry(5, 32);
    let materialSphere = new THREE.MeshPhongMaterial( {color: 0xffffff} );
    let circle = new THREE.Mesh(circleGeometry, materialSphere);

    circle.rotateY(toRadians(-90));
    circle.position.set(-0.1, 18.5, 5);
    circle.material.side = THREE.DoubleSide;

    mesh.add(circle);

    mesh.rotateZ(toRadians(-90));

    let stemGeometry = new THREE.CylinderGeometry(0.3, 0.6, 16, 10);
    let stemMaterial = new THREE.MeshPhongMaterial( {color:  0xbfdc09});
    let stemMesh = new THREE.Mesh(stemGeometry, stemMaterial);
    stemMesh.rotateZ(toRadians(90));
    stemMesh.position.set(8, 18, 5);

    mesh.add(stemMesh);

    mesh.scale.x = 0.04;
    mesh.scale.y = 0.04;
    mesh.scale.z = 0.04;

    mesh.material.side = THREE.DoubleSide;
    mesh.castShadow = true;
    mesh.receiveShadow = true;

    let bottomPoint = new THREE.Vector3(mesh.position.x + 0.72, mesh.position.y - 0.65, mesh.position.z + 0.2);

    for (let i = 0; i < leafsPositions.length; i++) {
        let newFlower = mesh.clone();
        newFlower.autoUpdate = false;
        let newBottomPoint = bottomPoint.clone();

        newFlower.rotateX(toRadians(leafsPositions[i][3]));
        newFlower.rotateY(toRadians(leafsPositions[i][4]));
        newFlower.rotateZ(toRadians(leafsPositions[i][5]));

        newFlower.updateMatrix();
        newBottomPoint.applyEuler(newFlower.rotation);

        newFlower.position.set(leafsPositions[i][0] - newBottomPoint.x, leafsPositions[i][1] - newBottomPoint.y,
            leafsPositions[i][2] - newBottomPoint.z);

        scene.add(newFlower);
    }

}




