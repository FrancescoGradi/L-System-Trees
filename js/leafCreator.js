// Funzione per caricare un modello 3D Obj e mtl

function loadObj( path, name ){

    var progress = console.log;

    return new Promise(function( resolve, reject ){

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