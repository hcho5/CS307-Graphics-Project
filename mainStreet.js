/*
  Author: Megan Shum, Heidi Cho
  Date: December 2018 
  
  This program creates the the shopping district of the town that Tom Nook 
  (owner of the Nook N Go), Isabelle (the mayor's assistant), and the co-mayors 
  (Heidi and Megan) live in. 
*/

/************************************************************************************
  MASTER FUNCTION: Creates and adds the town to the scene
  Takes 1 parameter:
  1.) the scene the town should be added to
************************************************************************************/
function createTown (scene){
    TW.loadTextures(["img/grass.png", "img/Nook-N-Go.png", "img/Nook-N-Go-Sign.png", 
                        "img/Nook-N-Go-Pole.png", "img/post_office.png", 
                        "img/post_office_roof.jpg", "img/nook_homes.png", 
                        "img/arch.png", "img/welcome_sign_wood.png"],
            function (textures) {
                createTownHelper(scene, textures);
            } );
}

/************************************************************************************
 Helper function that creates all the components of the town
  Takes 1 parameter:
  1.) the scene the town should be added to
  2.) the textures required for the town
************************************************************************************/
function createTownHelper(scene, textures){
    
    /*-------------------- Add trees to the scene -------------------------*/
    // trunkRadius, trunkHeight, coneRadius, coneHeight
    var tree1 = createTree(0.5,1.5,4,15);
    tree1.position.set(-5,0,-25);
    scene.add(tree1);
    
    var tree2 = createTree(0.5,1.5,3,12);
    tree2.position.set(6,0,-28);
    scene.add(tree2);
    
    var tree3 = createTree(0.5,1.5,4,16);
    tree3.position.set(33,0,5);
    scene.add(tree3);
    
    var tree4 = createTree(0.5,1.5,4,13);
    tree4.position.set(-20,0,-20);
    scene.add(tree4);
    
    var tree5 = createTree(0.5,1.5,3,12);
    tree5.position.set(-24,0,-15);
    scene.add(tree5);
    
    var tree6 = createTree(0.5,1.5,4,15);
    tree6.position.set(24,0,-20);
    scene.add(tree6);
    
    /*-------------------- Add oaktrees to the scene -------------------------*/
    var oakTree1 = createOakTree(0.5, 0.4, 5, 5);
    oakTree1.position.set(-10,0,-15);
    scene.add(oakTree1);
    
    var oakTree2 = createOakTree(0.5, 0.4, 4, 4);
    oakTree2.position.set(-48,0,-5);
    scene.add(oakTree2);
    
    /*------------------- Add apple trees to the scene -----------------------*/
    var appleTree = createAppleTree(0.5, 0.4, 5, 5, 3);
    appleTree.position.set(-25, 0, 15);
    scene.add(appleTree);
    
    var appleTree2 = createAppleTree(0.5, 0.4, 5, 5, 3);
    appleTree2.position.set(30, 0, -20);
    scene.add(appleTree2);
    
    var appleTree3 = createAppleTree(0.5, 0.4, 5, 5, 3);
    appleTree3.position.set(4, 0, -20);
    scene.add(appleTree3);
    
    var appleTree4 = createAppleTree(0.5, 0.4, 5, 5, 3);
    appleTree4.position.set(35, 0, 20);
    scene.add(appleTree4);
    
    /*------------------- Create the grass -----------------------*/
    createTerrain(textures, 140, 1, 140, 0.1);
    
    
    /*---------------- Adds Nook N Go to the scene -----------*/
    var store = createNooknGo(textures, 18, 3, 11, 16, 10, 8);
    store.position.set(20, 0, 0);
    scene.add(store);
    
    /*---------------- Adds Nook Homes to the scene -----------*/
    var store2 = createNookHomes(textures, 16, 12, 8);
    store2.position.set(-36, 0, 0);
    scene.add(store2);
    
    /*---------------- Adds Nook N Go signpost to the scene -----------*/
    var sign = createSignPost(textures, 5, 5, 1, 10, 0.5, false);
    sign.position.set(27, 0, 10);
    scene.add(sign);
    
    /*---------------- Adds Welcome sign to the scene -----------*/
    var sign = createSignPost(textures, 5.5, 4, 0.5, 1, 0.5, true);
    sign.position.set(-3, 0, -8);
    scene.add(sign);
    
    /*---------------- Adds the arch to the scene -----------*/
    var arch = createArch(textures, 1, 12, 9, 2.8);
    scene.add(arch);
    
    /*---------------- Adds the Post Office to the scene -----------*/
    var postOffice = createPostOffice(textures, 14, 10, 10);
    postOffice.position.set(-20,0,0);
    scene.add(postOffice);
    
    /******************************************************************************************
        This function creates and returns a THREE.Object3D that is an instance of a tree, 
        with its origin at the center of the base of the trunk, and adds it to the scene
        individual cone and trunk meshes can cast shadow.
    ******************************************************************************************/
    function createTree (trunkRadius, trunkHeight, coneRadius, coneHeight) {
        var tree = new THREE.Object3D();
        var cone = new THREE.Mesh(new THREE.ConeGeometry(coneRadius,coneHeight),
                                  new THREE.MeshPhongMaterial({color: 0x1a4717}));
        cone.position.y = coneHeight/2+trunkHeight;
        cone.castShadow = true;
        tree.add(cone);
        
        var brownMat = new THREE.MeshPhongMaterial({color: 0x472d17});
        var trunk = new THREE.Mesh(new THREE.CylinderGeometry(trunkRadius,trunkRadius,trunkHeight),
                                   brownMat); 
        trunk.position.y = trunkHeight/2;
        trunk.castShadow = true;
        tree.add(trunk);
        return tree;
    }
    
     /******************************************************************************************
      This function creates a simple oaktree using a cylinder geometry for the trunk
      and a dodecahedron geometry for the leaves
    ******************************************************************************************/
    function createOakTree(trunkRadius, bottomTrunkRadius, trunkHeight, bushSize){
        params = {leafColor: 0x5da600, trunkColor: 0x983734, factor: 0.9, trunkPosition: trunkHeight/2}
        var tree = new THREE.Object3D();
        var leavesMaterial = new THREE.MeshLambertMaterial({color: params.leafColor});
			                                       
		var leavesGeom = new THREE.DodecahedronGeometry(bushSize);
		var leaves = new THREE.Mesh(leavesGeom, leavesMaterial);
		
		var trunkMaterial = new THREE.MeshLambertMaterial({color: params.trunkColor});
			                                        
	    var trunkGeom = new THREE.CylinderGeometry(trunkRadius, bottomTrunkRadius, trunkHeight);
		var trunk = new THREE.Mesh(trunkGeom, trunkMaterial);
		
		leaves.castShadow = true;
		leaves.position.y = bushSize*params.factor+trunkHeight;
		tree.add(leaves);
		
		trunk.castShadow = true;
		trunk.position.y = params.trunkPosition;
		tree.add(trunk);
		return tree;
    }
    
     /******************************************************************************************
      This function creates an apple given an appleRadius. It is used to 
      create the apples on the apple tree.
    ******************************************************************************************/
    function createApple(appleRadius){
        params = {angle: Math.PI/4, scale: 5, stemColor: 0x654321, 
                    baseColor: 0xff0000, shine: 100, 
                    stemX: -1, stemY: 0, stemZ: 0, tubeSeg: 2, tubeRadius: 0.5, 
                    tubeRadialSeg: 8, tubeClosed: false, baseWidthSeg: 32, 
                    baseHeightSeg: 32}
                    
        function CustomSinCurve( scale ) {
        	THREE.Curve.call( this );
        	this.scale = ( scale === undefined ) ? 1 : scale;
        
        }
        CustomSinCurve.prototype = Object.create( THREE.Curve.prototype );
        CustomSinCurve.prototype.constructor = CustomSinCurve;
        
        CustomSinCurve.prototype.getPoint = function ( t ) {
        	var tx = t;
        	var ty = Math.sin(params.angle* t );
        	var tz = 0;
        	return new THREE.Vector3( tx, ty, tz ).multiplyScalar( this.scale );
        };
        
        var path = new CustomSinCurve(params.scale);
        var stemGeom = new THREE.TubeGeometry( path, params.tubeSeg, 
                    params.tubeRadius, params.tubeRadialSeg, params.tubeClosed);
        var stemMat = new THREE.MeshPhongMaterial({ color: params.stemColor });
        var stem= new THREE.Mesh( stemGeom, stemMat);
        
        var apple = new THREE.Object3D();
        var baseGeom = new THREE.SphereGeometry(appleRadius, 
                                params.baseWidthSeg, params.baseHeightSeg);
        var baseMat = new THREE.MeshPhongMaterial( {color: params.baseColor, 
                                                    shininess: params.shine} );
        var base = new THREE.Mesh( baseGeom, baseMat);
        
        apple.add(base);
        stem.position.set(params.stemX,params.stemY,params.stemZ);
        apple.add(stem);
        return apple;
    };
    
    /******************************************************************************************
      This function creates a basic apple tree, which is essentially an oaktree with 3 apples
      It takes in the same parameters to build an oaktree with an additional parameter
      to specify the size of the apples
    ******************************************************************************************/
    function createAppleTree(trunkRadius, bottomTrunkRadius, trunkHeight, bushSize, appleSize){
        var apple = createApple(appleSize);
        apple.scale.set(0.2,0.2,0.2);
        apple.position.set(-2, 8, 4);
        
        var apple2 = createApple(appleSize);
        apple2.scale.set(0.2,0.2,0.2);
        apple2.position.set(3, 10, 3);
        
        var apple3 = createApple(appleSize);
        apple3.scale.set(0.2,0.2,0.2);
        apple3.position.set(0, 12, 4);
        
        var oakTree = createOakTree(trunkRadius, bottomTrunkRadius, trunkHeight, bushSize);
        var appleTree = new THREE.Object3D();
        appleTree.add(oakTree);
        appleTree.add(apple);
        appleTree.add(apple2);
        appleTree.add(apple3);
        return appleTree;
    };
    
    /******************************************************************************************
      This function creates the main shape/structure of the terrain
      and texture maps grass onto the terrain
    ******************************************************************************************/
    function createTerrain(textures, width, height, depth, grassHeight){
        var grassTexture = textures[0];
        grassTexture.wrapT = THREE.RepeatWrapping;
        grassTexture.wrapS= THREE.RepeatWrapping;
        grassTexture.repeat.set(20,20);
        var terrainGeom = new THREE.BoxGeometry(width, grassHeight, depth);
        var terrainMat = new THREE.MeshPhongMaterial({color: 0x61B329, side: THREE.DoubleSide, map: grassTexture, shininess: 10});
        var terrain = new THREE.Mesh(terrainGeom, terrainMat);
        terrain.receiveShadow = true;
        
        var groundGeom = new THREE.BoxGeometry(width, height, depth);
        var groundMat = new THREE.MeshPhongMaterial({color: 0x452823, roughness: 1});
        var ground = new THREE.Mesh(groundGeom, groundMat);
        terrain.position.set(0,-grassHeight/2,0);
        scene.add(terrain);
        ground.position.set(0, -(height/2 + grassHeight/2), 0);
        scene.add(ground);
    }
    
    /******************************************************************************************
      This function creates the store that Tom Nook owns using two box geometries
      Texture mapping is also used to create the windows and doors
    ******************************************************************************************/
    function createNooknGo(textures, topWidth, topHeight, topDepth, botWidth, botHeight, botDepth){
        var store = new THREE.Object3D();
        
        // create the top box
        var topGeom = createBox(topWidth, topHeight, topDepth);
        addBoxTextureCoords(topGeom); //add texture coords
        var topMaterials = new THREE.MeshFaceMaterial (
            [ new THREE.MeshPhongMaterial( {color: 0xffffff,
                                                        specular: 0X0,
                                                        map: textures[2],
                                                        shininess: 20
                                            }),
              new THREE.MeshPhongMaterial( {color: 0xffffff,
                                            specular: 0X0,
                                            shininess: 10
                                            } )                      
            ]);
        TW.setMaterialForFaces(topGeom, 0, 0, 1);  //front 
        TW.setMaterialForFaces(topGeom, 0, 2, 3);   // back
        TW.setMaterialForFaces(topGeom, 1, 4, 5);   //top
        TW.setMaterialForFaces(topGeom, 1, 6, 7, 8, 9); //sides
        TW.setMaterialForFaces(topGeom, 1, 10, 11); //floor
        var top = new THREE.Mesh(topGeom, topMaterials);
        top.castShadow = true;
        top.receiveShadow = true;
        
        // create the bottom box
        var botGeom = createBox(botWidth, botHeight, botDepth);
        addBoxTextureCoords(botGeom); //add texture coords
        var botMaterials = new THREE.MeshFaceMaterial (
            [ new THREE.MeshPhongMaterial( {color: 0xffffff,
                                                        specular: 0X0,
                                                        map: textures[1],
                                                        shininess: 20
                                            }),
              new THREE.MeshPhongMaterial( {color: 0x7d85b3,
                                            specular: 0X0,
                                            shininess: 10
                                            } )                      
            ]);
        TW.setMaterialForFaces(botGeom, 0, 0, 1);  //front 
        TW.setMaterialForFaces(botGeom, 1, 2, 3);   // back
        TW.setMaterialForFaces(botGeom, 1, 4, 5);   //top
        TW.setMaterialForFaces(botGeom, 1, 6, 7, 8, 9); //sides
        TW.setMaterialForFaces(botGeom, 1, 10, 11); //floor
        var bot = new THREE.Mesh(botGeom, botMaterials); 
        bot.castShadow = true;
        bot.receiveShadow = true;
        
        top.position.set(0, botHeight, 0);
        store.add(top);
        store.add(bot);
        return store;
    }
    
    /******************************************************************************************
      This function creates the sign post of Tom Nook's store
    ******************************************************************************************/
    function createSignPost(textures, signWidth, signHeight, signDepth, poleHeight, poleRadius, welcome){
        var signRotation, frontTexture, backTexture;
        var signPost = new THREE.Object3D();
        
        var signGeom = createBox(signWidth, signHeight, signDepth);
        addBoxTextureCoords(signGeom); //add texture coords
        
        // We need to map different textures depending on whether we're making
        // the welcome sign or the Nook N Go sign
        if (welcome) {
            signRotation = 0;
            frontTexture = textures[8];
            backTexture = textures[5];
        } else {
            signRotation = -Math.PI/4;
            frontTexture = textures[3];
        }
        
        var signMaterials = new THREE.MeshFaceMaterial (
                [ new THREE.MeshPhongMaterial( {color: 0xffffff,
                                                            specular: 0X0,
                                                            map: frontTexture,
                                                            shininess: 20
                                                }),
                  new THREE.MeshPhongMaterial( {color: 0xffffff,
                                                specular: 0X0,
                                                map: backTexture,
                                                shininess: 10
                                                } )                      
                ]);
                
        TW.setMaterialForFaces(signGeom, 0, 0, 1);  //front 
        TW.setMaterialForFaces(signGeom, 1, 2, 3);   // back
        TW.setMaterialForFaces(signGeom, 1, 4, 5);   //roof
        TW.setMaterialForFaces(signGeom, 1, 6, 7, 8, 9); //sides
        TW.setMaterialForFaces(signGeom, 1, 10, 11); //floor
        var sign = new THREE.Mesh(signGeom, signMaterials);
        sign.castShadow = true;
        
        var poleGeom = new THREE.CylinderGeometry(poleRadius, poleRadius, poleHeight, 32);
        var poleMat = new THREE.MeshPhongMaterial({color: 0xffffff, shininess: 20 });
        var pole = new THREE.Mesh(poleGeom, poleMat);
        pole.castShadow = true;
        
        sign.position.y = poleHeight;
        signPost.add(sign);
        pole.position.y = poleHeight/2
        signPost.add(pole);
        signPost.rotation.y = signRotation;
        return signPost;
    }
    
    /******************************************************************************************
      This function creates Nook Homes by taking in its width, height, and length, and
      returning the object
    ******************************************************************************************/
    function createNookHomes (textures, w, h, l) {
        // make texture materials
        var textureMaterials = new THREE.MeshFaceMaterial (
            [ new THREE.MeshPhongMaterial( {color: 0xffffff,
                                                        specular: 0X0,
                                                        map: textures[6],
                                                        shininess: 10,
                                                        shading: THREE.SmoothShading
                                            }),
              new THREE.MeshPhongMaterial( {color: 0x286f9b,
                                            specular: 0X0,
                                            shininess: 10,
                                            shading: THREE.SmoothShading
                                            } )                      
            ]);
        
        // barn object
        var postOfficeGeom = createBox(w, h, l);
        addBoxTextureCoords(postOfficeGeom); //add texture coords
        
        TW.setMaterialForFaces(postOfficeGeom, 0, 0, 1);  //front 
        TW.setMaterialForFaces(postOfficeGeom, 1, 2, 3);   // back
        TW.setMaterialForFaces(postOfficeGeom, 1, 4, 5);   //roof
        TW.setMaterialForFaces(postOfficeGeom, 1, 6, 7, 8, 9); //sides
        TW.setMaterialForFaces(postOfficeGeom, 1, 10, 11); //floor
        
        // create mesh
        var nookHomes = new THREE.Mesh(postOfficeGeom, textureMaterials);
        nookHomes.castShadow = true;
        nookHomes.receiveShadow = true;
        return nookHomes;
    }
    
    /******************************************************************************************
      This function creates the post office, by taking in the dimensions of the post office,
      and returning the object.
    ******************************************************************************************/
    function createPostOffice (textures, w, h, l) {
        //make texture materials
        var textureMaterials = new THREE.MeshFaceMaterial (
            [ new THREE.MeshPhongMaterial( {color: 0xffffff,
                                                        map: textures[5],
                                                        specular: 0X0,
                                                        shininess: 10,
                                                        shading: THREE.SmoothShading
                                            }),
              new THREE.MeshPhongMaterial( {color: 0xffffff,
                                            map: textures[4],
                                            specular: 0X0,
                                            shininess: 10,
                                            shading: THREE.SmoothShading
                                            } )                      
            ]);
        
        // repeat the wood panel texture
        textures[5].wrapS = THREE.RepeatWrapping;
        textures[5].wrapT = THREE.RepeatWrapping;
        textures[5].repeat.set(1,2);
        textures[5].needsUpdate = true;
        
        // barn object
        var postOfficeGeom = createPostOfficeGeom(w, h, l);
        addPostOfficeTextureCoords(postOfficeGeom); //add texture coords
        
        TW.setMaterialForFaces(postOfficeGeom, 1, 0, 1, 2);  //front 
        TW.setMaterialForFaces(postOfficeGeom, 0, 3, 4, 5);   // back
        TW.setMaterialForFaces(postOfficeGeom, 0, 6, 7, 8, 9);   //roof
        TW.setMaterialForFaces(postOfficeGeom, 0, 10, 11, 12, 13); //sides
        TW.setMaterialForFaces(postOfficeGeom, 0, 14, 15); //floor
        
        // create mesh
        var postOffice = new THREE.Mesh(postOfficeGeom, textureMaterials);
        postOffice.castShadow = true;
        postOffice.receiveShadow = true;
        return postOffice;
    }
    
    /******************************************************************************************
      This function creates the arch to the park behind the shopping district and returns it.
      It takes in the radius and height of the poles supporting the arch, as well as the radius
      and thickness of the arch itself.
    ******************************************************************************************/
    function createArch(textures, poleRadius, poleHeight, torusRadius, torusTube) {
      var arch = new THREE.Object3D();
      
      // create the left support pole
      var leftPole = new THREE.CylinderGeometry(poleRadius * 1.5, poleRadius, poleHeight, 32);
      var poleMat = new THREE.MeshPhongMaterial({color: 0x1b3890, shininess: 20 });
      var leftPoleMesh = new THREE.Mesh(leftPole, poleMat);
      leftPoleMesh.scale.z = 0.29; // flatten the poles
      leftPoleMesh.castShadow = true;
      leftPoleMesh.receiveShadow = true;
      
      // create right pole
      var rightPole = new THREE.CylinderGeometry(poleRadius * 1.5, poleRadius, poleHeight, 32);
      var rightPoleMesh = new THREE.Mesh(rightPole, poleMat);
      rightPoleMesh.scale.z = 0.29;
      rightPoleMesh.castShadow = true;
      rightPoleMesh.receiveShadow = true;
      
      leftPoleMesh.position.set(-torusRadius,0,-10); //spread the poles apart
      rightPoleMesh.position.set(torusRadius,0,-10);
      arch.add(leftPoleMesh);
      arch.add(rightPoleMesh);
      
      // create the arch
      var archSign = new THREE.TorusGeometry( torusRadius, torusTube, 16, 100, TW.degrees2radians(160));
      var archMat = new THREE.MeshPhongMaterial({color: 0xffffff, shininess: 20, map: textures[7]});
      var archSignMesh = new THREE.Mesh(archSign, archMat);
      archSignMesh.castShadow = true;
      archSignMesh.receiveShadow = true;
      
      archSignMesh.position.set(0,0.75*poleHeight/2,-10);
      archSignMesh.scale.z = 0.3;
      archSignMesh.rotation.y = TW.degrees2radians(180);
      archSignMesh.rotation.z = TW.degrees2radians(10);
      arch.add(archSignMesh);
      
      return arch;
    }
    
    /******************************************************************************************
      This function creates and returns a geometry for the post office. It is the same geometry we
      used for our barn assignment, i.e. a box with a roof on it. It takes in a width,
      height, and length
    ******************************************************************************************/
    function createPostOfficeGeom(w, h, len) {
        var postOfficeGeom = new THREE.Geometry();
        
        // front vertices (bottom left, bottom right, top left, top right, top of roof)
        postOfficeGeom.vertices.push(new THREE.Vector3(-w/2,0,len/2));
        postOfficeGeom.vertices.push(new THREE.Vector3(w/2, 0, len/2));
        postOfficeGeom.vertices.push(new THREE.Vector3(w/2,h,len/2));
        postOfficeGeom.vertices.push(new THREE.Vector3(-w/2,h,len/2));
        postOfficeGeom.vertices.push(new THREE.Vector3(0, h + 0.25 * h, len/2));
    
        // back vertices
        postOfficeGeom.vertices.push(new THREE.Vector3(-w/2, 0, -len/2));
        postOfficeGeom.vertices.push(new THREE.Vector3(w/2, 0, -len/2));
        postOfficeGeom.vertices.push(new THREE.Vector3(w/2, h, -len/2));
        postOfficeGeom.vertices.push(new THREE.Vector3(-w/2, h, -len/2));
        postOfficeGeom.vertices.push(new THREE.Vector3(0, h + 0.25 * h, -len/2));
        
        // front faces
        postOfficeGeom.faces.push(new THREE.Face3(0, 1, 2)); //right bottom front
        postOfficeGeom.faces.push(new THREE.Face3(0, 2, 3)); //left top front
        postOfficeGeom.faces.push(new THREE.Face3(3, 2, 4)); //special triangle
    
        // back faces
        postOfficeGeom.faces.push(new THREE.Face3(5, 7, 6)); //3
        postOfficeGeom.faces.push(new THREE.Face3(5, 8, 7)); //4
        postOfficeGeom.faces.push(new THREE.Face3(7, 8, 9)); //special triangle
    
        // roof faces.
        postOfficeGeom.faces.push(new THREE.Face3(3, 4, 8)); //6
        postOfficeGeom.faces.push(new THREE.Face3(4, 9, 8)); //7
        postOfficeGeom.faces.push(new THREE.Face3(2, 7, 9)); //8
        postOfficeGeom.faces.push(new THREE.Face3(4, 2, 9)); //9
    
        // side faces
        postOfficeGeom.faces.push(new THREE.Face3(6, 2, 1)); //10
        postOfficeGeom.faces.push(new THREE.Face3(7, 2, 6)); //11 
        postOfficeGeom.faces.push(new THREE.Face3(0, 3, 5)); //12
        postOfficeGeom.faces.push(new THREE.Face3(3, 8, 5)); //13
    
        // floor faces
        postOfficeGeom.faces.push(new THREE.Face3(0, 5, 1)); //14
        postOfficeGeom.faces.push(new THREE.Face3(5, 6, 1)); //15
    
        // calculate the normals for shading
        postOfficeGeom.computeFaceNormals();
        
        return postOfficeGeom;
    }
    
    /******************************************************************************************
      This function adds texture coordinates to the geometry returned by createPostOffice
    ******************************************************************************************/
    function addPostOfficeTextureCoords(postOfficeGeom) {
        if( ! postOfficeGeom instanceof THREE.Geometry ) {
            throw "not a THREE.Geometry: "+postOfficeGeom;
        }
        // array of face descriptors
        var UVs = [];
        function faceCoords(as,at, bs,bt, cs,ct) {
            UVs.push( [ new THREE.Vector2(as,at),
                        new THREE.Vector2(bs,bt),
                        new THREE.Vector2(cs,ct)] );
        }
        // front
        faceCoords(0,0, 1,0, 1,1);
        faceCoords(0,0, 1,1, 0,1);
        faceCoords(0,1, 1,1, 0.5,2);  // special for the upper triangle
        
        // back
        faceCoords(1,0, 0,1, 0,0);
        faceCoords(1,0, 1,1, 0,1);
        faceCoords(0,1, 1,1, 0.5,2);  // special for upper triangle
        
        //roof
        faceCoords(1,0, 1,1, 0,0);
        faceCoords(1,1, 0,1, 0,0);
        faceCoords(0,0, 1,0, 1,1);
        faceCoords(0,1, 0,0, 1,1);
        
        // sides
        faceCoords(2,0, 0,1, 0,0); // repeat horizontally twice
        faceCoords(2,1, 0,1, 2,0);
        faceCoords(2,0, 2,1, 0,0);
        faceCoords(2,1, 0,1, 0,0);
        
        // floor
        faceCoords(0,0, 2,0, 0,2); // repeat horizontally twice
        faceCoords(2,0, 2,2, 0,2);
        
        // Finally, attach this to the geometry
        postOfficeGeom.faceVertexUvs = [ UVs ];
    }
    
    /******************************************************************************************
      This function creates and returns a geometry that is essentially just a box
      geometry. We created this function, so that we could custom texture map the faces.
      It takes in a width, height, and length.
    ******************************************************************************************/
    function createBox(w, h, len) {
        var postOfficeGeom = new THREE.Geometry();
        
        // front vertices (bottom left, bottom right, top left, top right, top of roof)
        postOfficeGeom.vertices.push(new THREE.Vector3(-w/2,0,len/2)); //0
        postOfficeGeom.vertices.push(new THREE.Vector3(w/2, 0, len/2)); //1
        postOfficeGeom.vertices.push(new THREE.Vector3(w/2,h,len/2)); //2
        postOfficeGeom.vertices.push(new THREE.Vector3(-w/2,h,len/2)); //3
    
        // back vertices
        postOfficeGeom.vertices.push(new THREE.Vector3(-w/2, 0, -len/2)); //4
        postOfficeGeom.vertices.push(new THREE.Vector3(w/2, 0, -len/2)); //5
        postOfficeGeom.vertices.push(new THREE.Vector3(w/2, h, -len/2));//6
        postOfficeGeom.vertices.push(new THREE.Vector3(-w/2, h, -len/2));//7
        
        // front faces
        postOfficeGeom.faces.push(new THREE.Face3(0, 1, 2)); //0
        postOfficeGeom.faces.push(new THREE.Face3(0, 2, 3)); //1
    
        // back faces
        postOfficeGeom.faces.push(new THREE.Face3(5, 4, 6)); //2
        postOfficeGeom.faces.push(new THREE.Face3(4, 7, 6)); //3
    
        // roof faces.
        postOfficeGeom.faces.push(new THREE.Face3(2, 6, 3)); //4
        postOfficeGeom.faces.push(new THREE.Face3(3, 6, 7)); //5
    
        // side faces
        postOfficeGeom.faces.push(new THREE.Face3(1, 5, 6)); //8
        postOfficeGeom.faces.push(new THREE.Face3(1, 6, 2)); //9 
        postOfficeGeom.faces.push(new THREE.Face3(7, 4, 0)); //10
        postOfficeGeom.faces.push(new THREE.Face3(3, 7, 0)); //11
    
        // floor faces
        postOfficeGeom.faces.push(new THREE.Face3(0, 5, 1)); //12
        postOfficeGeom.faces.push(new THREE.Face3(0, 4, 5)); //13
    
        // calculate the normals for shading
        postOfficeGeom.computeFaceNormals();
        
        return postOfficeGeom;
    }
    
    /******************************************************************************************
      This function adds texture coordinates to the geometry created by the function
      createBox
    ******************************************************************************************/
    function addBoxTextureCoords(boxGeom) {
        if( ! boxGeom instanceof THREE.Geometry ) {
            throw "not a THREE.Geometry: "+boxGeom;
        }
        
        // array of face descriptors
        var UVs = [];
        function faceCoords(as,at, bs,bt, cs,ct) {
            UVs.push( [ new THREE.Vector2(as,at),
                        new THREE.Vector2(bs,bt),
                        new THREE.Vector2(cs,ct)] );
        }
        // front
        faceCoords(0,0, 1,0, 1,1);
        faceCoords(0,0, 1,1, 0,1);
        
        // back
        faceCoords(0,0, 1,0, 0,1);
        faceCoords(1,0, 1,1, 0,1);
        
        //roof
        faceCoords(1,0, 1,1, 0,0);
        faceCoords(0,0, 1,1, 0,1);
        
        // sides
        faceCoords(0,0, 1,0, 1,1);
        faceCoords(0,0, 1,1, 0,1); //right
        
        faceCoords(0,1, 0,0, 1,0);
        faceCoords(1,1, 0,1, 1,0); //left
        
        // floor
        faceCoords(1,0, 1,1, 0,0);
        faceCoords(0,0, 1,1, 0,1);
        
        // Finally, attach this to the geometry
        boxGeom.faceVertexUvs = [ UVs ];
    }
}


