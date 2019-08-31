// Funzione per caricare un modello 3D Obj e mtl

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

function leafCreator() {
    var myObjPromise = loadObj( "models/", "leaf" );

    var leaf = null;

    myObjPromise.then(myObj => {

        let textureLeaf = new THREE.TextureLoader().load('images/high_res_leaf_texture_by_hhh316.jpg');
        textureLeaf.repeat.set(0.7, 0.7);
        textureLeaf.center.set(0.5, 0.5);
        textureLeaf.repeat.set(0.55, 0.55);

        myObj.traverse(function (child) {
            if (child instanceof THREE.Mesh) {
                child.material.map = textureLeaf;
            }
        });

        scene.add( myObj );

        myObj.rotateY(toRadians(180));
        myObj.rotateZ(toRadians(-90));
        myObj.scale.x = 0.01;
        myObj.scale.y = 0.01;
        myObj.scale.z = 0.01;

        for (let i = 0; i < leafsPositions.length; i++) {
            let newLeaf = myObj.clone();

            newLeaf.rotateX(toRadians(leafsPositions[i][3]));
            newLeaf.rotateY(toRadians(leafsPositions[i][4]));
            newLeaf.rotateZ(toRadians(leafsPositions[i][5]));

            newLeaf.position.set(leafsPositions[i][0], leafsPositions[i][1], leafsPositions[i][2]);

            //newLeaf.castShadow = true;
            //newLeaf.receiveShadow = true;

            scene.add(newLeaf);
        }

        leafsPositions = [[]];
    });
}
