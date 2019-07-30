/*
  Author: Megan Shum, Heidi Cho
  Date: November 2018
  Purpose: CS 307 Contribution Library

  This file creates Tom Nook, a fictional character from the Nintendo game Animal Crossing.
  TOM NOOK DIMENSIONS:
      Height: 12.7,
      Width: 5,
      Depth: 8.5,
      Origin: Center of his torso
*/
    
/************************************************************************************
  MASTER FUNCTION: Creates and adds a Tom Nook object to the scene
  Takes 4 parameter:
  1) the scene the object will be added to
  2-4) the coordinates that nook will be positioned at
************************************************************************************/
function createNook (scene, x, y, z) {
    TW.loadTextures(["img/sweater_vest.jpg", "img/left_eye.png", "img/right_eye.png", "img/mask.jpg"],
            function (textures) {
                createNookHelper(scene, x, y, z, textures);
            } );
}

function createNookHelper(scene, x, y, z, textures) {
    /*-------------------- Tom Nook Parameters -------------------------*/
    var params = {
        sphereDetail: 50, cylinderDetail: 20,
        noseRadius: 0.4, noseLength: 0.7, noseRotation: TW.degrees2radians(25),
        earRadius: 0.7, earAngle: Math.PI/3.5, earScale: 0.5, innerEarRadius: 0.4,
        eyeRadius: 0.8, eyeAngleX: 0, eyeAngleY: Math.PI/5,
        headRadius: 1.9, headScale: 1.25, headDepth: 0.8, // how much the head should sink into the body
        shoulderRadius: 0.4, rightShoulderAngle: Math.PI/3, leftShoulderAngle: Math.PI/3,
        shoulderDepth: 0.6, // how far the shoulders sink into the body
        handRadius: 0.45, forearmLength: 1, armRadius: 0.45,
        leftArmZRotation: -Math.PI/8, leftArmYRotation:Math.PI/2, leftArmXRotation:-Math.PI/2, rightArmZRotation:Math.PI/4,
        legLength: 1.5, legRadiusTop: 0.45, legRadiusBottom: 0.3, legDistance: 0.8, // how far apart the legs are
        tailLength: 2, tailRadius: 0.8, tailRotation: -Math.PI/8,
        torsoScaleX: 1, torsoScaleY: 1, torsoScaleZ: 1, torsoRadius: 2.0,
        blackMaterial: new THREE.MeshPhongMaterial({color: 0x000000, shading: THREE.SmoothShading, shininess: 20}),
        brownMaterial: new THREE.MeshPhongMaterial({color: 0x854a16, shading: THREE.SmoothShading, shininess: 20}),
        whiteMaterial: new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.SmoothShading, shininess: 20}),
        grayMaterial: new THREE.MeshPhongMaterial({color: 0x777777, shading: THREE.SmoothShading, shininess: 20}),
        pinkMaterial: new THREE.MeshPhongMaterial({color: 0xFFB6C1, shading: THREE.SmoothShading, shininess: 20}),
        darkBrownMaterial: new THREE.MeshPhongMaterial({color: 0x3b0a03, shading: THREE.SmoothShading, shininess: 20})
    };
    
    var body = new THREE.Object3D();
    var bodyGeometry = new THREE.SphereGeometry(params.torsoRadius, params.sphereDetail, params.sphereDetail);
    
    // Create texture coordinates and make mesh for torso
    updateGeom(bodyGeometry, 1);
    var bodyMat = new THREE.MeshPhongMaterial( {color: 0xffffff,
                                                 map: textures[0], shininess: 20} );
    var bodyMesh = new THREE.Mesh(bodyGeometry, bodyMat);
    bodyMesh.castShadow = true;
    bodyMesh.receiveShadow = true;
    
    // scale the torso so it is an ellipsoid
    bodyMesh.scale.x = params.torsoScaleX;
    bodyMesh.scale.y = params.torsoScaleY;
    bodyMesh.scale.z = params.torsoScaleZ;
    body.add(bodyMesh);
    
    // add limbs and head
    addTail(body, params);
    addLeg(body, params, 1);
    addLeg(body, params, -1);
    addShoulder(body, params, 1);
    addShoulder(body, params, -1);
    addHead(body, params, textures);
    
    //position it in the scene
    body.position.set(x, y + (params.torsoRadius * params.torsoScaleY) + params.legLength - (params.legLength/2)*0.5, z);
    scene.add(body);
   
    /*------------------ Create Tom Nook's Nose (cone) ------------------------*/
    function createNose(params) {
        var noseGeometry = new THREE.ConeGeometry(params.noseRadius, params.noseLength, 32);
        var noseMesh = new THREE.Mesh(noseGeometry, params.darkBrownMaterial);
        noseMesh.castShadow = true;
        noseMesh.receiveShadow = true;
        noseMesh.rotation.x = Math.PI/2;
        return noseMesh;
    }
    
    /* Adds a nose to the head. The nose is flush with the surface of the
    * head by moving it out along the z axis by the radius of the head,
    * and rotating it around the x axis to move it up/down. */
    function addNose(head,params) {
        var noseframe = new THREE.Object3D();
        var nose = createNose(params);
        nose.position.z = params.headRadius + params.noseLength/2; // within the noseframe
        noseframe.add(nose);
        
        noseframe.rotation.x = params.noseRotation; // moves nose up/down
        head.add(noseframe);
    }
    /*------------------ Create Tom Nook's Ear (sphere) ------------------------*/
    function createEar(params, side) {
        var earGeometry = new THREE.SphereGeometry(params.earRadius,params.sphereDetail, params.sphereDetail);
        var ear = new THREE.Mesh(earGeometry, params.brownMaterial);
        ear.castShadow = true;
        ear.receiveShadow = true;
        
         // Flattens the sphere to make it look more like a flat disk
        ear.scale.z = params.earScale;
        addInnerEar(ear, params, side)
        return ear;
    }
    
    /* Adds an ear to the head on the right (side=1) or left
    * (side=-1), and rotates it on the z axis*/
    function addEar(head,params,side) {
        var earframe = new THREE.Object3D();
        var ear = createEar(params, side);
        ear.position.x = side * (params.headRadius + params.earRadius); // within the earframe
        
        //rotates the ear towards the top of the head or towards the chin
        earframe.rotation.z = side * params.earAngle;
        
        earframe.add(ear);
        head.add(earframe);
    }
    
    /*------------------ Create Tom Nook's Inner Ear (circle) ------------------------*/
    function createInnerEar(params) {
        var earGeometry = new THREE.CircleGeometry(params.innerEarRadius, 50);
        var ear = new THREE.Mesh(earGeometry, params.pinkMaterial);
        return ear;
    }
    
    /* Adds an inner ear to the head on the right (side=1) or left
    * (side=-1), and rotates it on the z axis*/
    function addInnerEar(outerEar,params,side) {
        var earframe = new THREE.Object3D();
        var ear = createInnerEar(params);
        earframe.add(ear);
        earframe.position.z = params.earRadius;
        outerEar.add(earframe);
    }
    
    /*------------------ Create Tom Nook's Eye (sphere) ------------------------*/
    function createEye(params, texture) {
        var eye = new THREE.SphereGeometry(params.eyeRadius,params.sphereDetail,params.sphereDetail);
        
        updateGeom(eye, 1);
        var eyeMat = new THREE.MeshPhongMaterial( {color: 0xffffff,
                                                 map: texture} );
                                                 
        var eyeMesh = new THREE.Mesh(eye, eyeMat);
        eyeMesh.position.z = 0.8*params.headRadius;
        return eyeMesh;
    }
    
    /* adds an eye to the head. The eye is flush to the surface of the head
    * and is rotated on the x and y axes. */
    function addEye(head, params, side, texture) {
        var eyeFrame= new THREE.Object3D();
        
        var eye = createEye(params, texture);
        eyeFrame.add(eye);
        
        eyeFrame.rotation.x = params.eyeAngleX; //moves eyes "up/down" on face
        eyeFrame.rotation.y = side * params.eyeAngleY; //moves eyes "right/left" on face
        
        head.add(eyeFrame);
    }
    
    /* Returns an object that is the head of the Nook which has all of its facial
    * features added to it*/
    function createHead(params, textures) {
        var head = new THREE.Object3D();
        var headGeometry = new THREE.SphereGeometry(params.headRadius, params.sphereDetail, params.sphereDetail);
        
        updateGeom(headGeometry, 1);
        var headMat = new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.SmoothShading, shininess: 20, map: textures[3]})                                         
        var headMesh = new THREE.Mesh(headGeometry,headMat);
        headMesh.castShadow = true;
        headMesh.receiveShadow = true;
        headMesh.scale.x = params.headScale;
        head.add(headMesh);
        
        // add facial features
        addEye(head, params, 1, textures[2]);
        addEye(head, params, -1, textures[1]);
        addEar(head,params,1);
        addEar(head,params,-1);
        addNose(head, params);
        return head;
    }
    
    /* Adds the head to the body, with the head partially overlapping with the body */
    function addHead(body, params, textures) {
        var headFrame= new THREE.Object3D();
        var head = createHead(params, textures);
        var headDepth = params.headDepth;
        
        // Positions the head so that it overlaps with the body
        head.position.y = (params.torsoRadius * params.torsoScaleY) + params.headRadius * headDepth;
        
        headFrame.add(head);
        body.add(headFrame);
    }
    
    /* adds a leg onto the left (side = -1) or right (side = 1) of the body */
    function addLeg (body, params, side) {
        var legFrame= new THREE.Object3D();
        var leg = createLeg(params, side);
        
        // add the leg to the appropriate side
        leg.position.x = params.legDistance * side;
        legFrame.add(leg);
        body.add(legFrame);
    }
    
    /* Returns an object that is a leg for the Nook, and has a foot added to it*/
    function createLeg (params, side) {
        var leg = new THREE.Object3D();
        var top = params.legRadiusTop;
        var bottom = params.legRadiusBottom;
        var length = params.legLength;
        var cd  = params.cylinderDetail;
        
        var legGeom = new THREE.CylinderGeometry(top,bottom,length,cd);
        var legMesh = new THREE.Mesh(legGeom, params.grayMaterial);
        legMesh.castShadow = true;
        legMesh.receiveShadow = true;
        
        // positions the legs so that they overlap with the body (why I multiplied by 0.5)
        legMesh.position.y = -(params.torsoRadius * params.torsoScaleY + length/2 * 0.5);
        leg.add(legMesh);
        
        return leg;
    }
    
    /* adds a tail to the body*/
    function addTail (body, params) {
        var tailFrame= new THREE.Object3D();
        var tail = createTail(params);
        tail.position.z = -(params.torsoRadius * params.torsoScaleZ + params.tailLength/4);
        tail.rotation.x = Math.PI/2; // rotate the tail so it sits on the body
        tailFrame.add(tail);
        tailFrame.rotation.x = params.tailRotation; // rotate the tail lower relative to the body
        body.add(tailFrame);
    }
    
    /* Returns an object that is a leg for the Nook, and has a foot added to it*/
    function createTail (params) {
        var tail = new THREE.Object3D();
        
        // the cone part of the tail
        var tailGeom = new THREE.ConeGeometry(params.tailRadius, params.tailLength, 50);
        var tailMesh = new THREE.Mesh(tailGeom, params.brownMaterial);
        tailMesh.castShadow = true;
        tailMesh.receiveShadow = true;
        var sd = params.sphereDetail;
        
        // half sphere at the end of the tail
        var tailBlobGeom = new THREE.SphereGeometry(params.tailRadius, sd, sd, 0, 2*Math.PI, 0, 0.5 * Math.PI);
        tailBlobMesh = new THREE.Mesh(tailBlobGeom, params.brownMaterial);
        tailBlobMesh.castShadow = true;
        tailBlobMesh.receiveShadow = true;
        tailBlobMesh.position.y = -(params.tailLength/2);
        tailBlobMesh.rotation.x = Math.PI; // make the circle sit on top of cone
        tail.add(tailMesh);
        tail.add(tailBlobMesh);
        return tail;
    }
    
    /* Adds an arm to the left (side = -1) or right (side = 1) shoulder*/
    function addArm (shoulder, params, side) {
        var arm = createArm(params, side, false);
        var forearm = createArm(params, side, true);
        forearm.position.y = -params.forearmLength;
        if (side == -1) {
            forearm.rotation.z = params.leftArmZRotation;
            forearm.rotation.y = params.leftArmYRotation;
            forearm.rotation.x = params.leftArmXRotation;
        } else {
            forearm.rotation.z = params.rightArmZRotation;
        }
        arm.add(forearm);
        shoulder.add(arm);
    }
    
    /* returns an object that is an arm for the Nook */
    function createArm (params, side, isHand) {
        var arm = new THREE.Object3D();
        var radius = params.armRadius;
        var len = params.forearmLength;
        var cd  = params.cylinderDetail;
        
        var armGeom = new THREE.CylinderGeometry(radius, radius,len,cd);
        var armMesh = new THREE.Mesh(armGeom, params.whiteMaterial);
        armMesh.castShadow = true;
        armMesh.receiveShadow = true;
        
        // We need to lower the arm, so that the top of the cylinder is at the
        // shoulder of the arm
        armMesh.position.y = -len/2;
        arm.add(armMesh);
        
        addHand(arm, params, side, isHand); // add a hand or elbow
        return arm;
    }
    
    /* Adds a hand to the left (side = -1) or right (side = 1) arm*/
    function addHand (arm, params, side, isHand) {
        var handFrame= new THREE.Object3D();
        var hand = createHand(params, side, isHand);
        hand.position.y = -params.forearmLength; // add the hand to the bottom of the arm
        handFrame.add(hand);
        arm.add(handFrame);
    }
    
    /* Crerates a hand (or elbow joint; see comments in function)
    depending on whether isHand is true or false */
    function createHand (params, side, isHand) {
        // creates and returns a mesh for an eye
        var hand = new THREE.Object3D();
        var radius = params.handRadius;
        var sd = params.sphereDetail;
        
        // the upper arm and lower arm are made using the same createArm and  
        // createHand functions. However, for the upper arm, we want the "hand"
        // to be an elbow instead, and so we have the following logic using the 
        // parameter "isHand" to select the appropriate color
        var handGeometry = new THREE.SphereGeometry(radius, sd, sd);
        if (isHand) {
            var handMesh = new THREE.Mesh(handGeometry, params.brownMaterial);
        } else {
            var handMesh = new THREE.Mesh(handGeometry, params.whiteMaterial);
        }
        handMesh.castShadow = true;
        handMesh.receiveShadow = true;
        hand.add(handMesh);
        return hand;
    }
    
    /* Adds a shoulder to the left (side = -1) or right (side =1) side of the body. 
    * Rotates the whole arm around the z axis*/
    function addShoulder (body, params, side) {
        var shoulder = createShoulder(params, side);
        var torsoRadius = params.torsoRadius;
        var scaleX = params.torsoScaleX; 
        var scaleY = params.torsoScaleY; 
        var depth = params.shoulderDepth;
        
        // the depth specifies how much the shoulder should overlap with the body
        var x = scaleY * torsoRadius * depth;
        var y = scaleY * torsoRadius * depth;
        
        shoulder.position.set(side * x, y, 0);
        if (side == -1) {
            shoulder.rotation.z = side * params.leftShoulderAngle; // rotate arms out
        } else {
            shoulder.rotation.z = side * params.rightShoulderAngle; // rotate arms out
        }
        
        body.add(shoulder);
    }
    
    // creates a shoulder
    function createShoulder (params, side) {
        var shoulder = new THREE.Object3D();
        var radius = params.shoulderRadius;
        var sd = params.sphereDetail;
        
        var shoulderGeometry = new THREE.SphereGeometry(radius, sd, sd);
        var shoulderMesh = new THREE.Mesh(shoulderGeometry, params.whiteMaterial);
    
        shoulder.add(shoulderMesh);
        addArm(shoulder, params, side); // add an arm
        return shoulder;
    }
}