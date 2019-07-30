/*
  Author: Heidi Cho, Megan Shum
  Date: December 2018
  Purpose: CS 307 Contribution Library

  This file creates a human being.
  Person DIMENSIONS:
      Height: 12.7,
      Width: 5,
      Depth: 4,
      Origin: the center of the torso
*/

/************************************************************************************
MASTER FUNCTION: Creates and returns an Person object
Takes 7 parameters:
1) scene to add the person to
2-4) x, y, z coordinates
5) image for shirt
6) image for sleeves
7) color for shoes
8) hair color
************************************************************************************/
function createPerson (scene, x, y, z, rot, shirt, sleeves, hairColor) {
  TW.loadTextures([shirt, sleeves, "img/person_face.jpg"],
  function (textures) {
    createPersonHelper(scene, x, y, z, rot, hairColor, textures);
  } );
}

function createPersonHelper(scene, x, y, z, rot, hairColor, textures) {
  /*-------------------- Person Parameters -------------------------*/
  var params = {
    sphereDetail: 50, cylinderDetail: 20,
    footRadius: 0.45, earRadius: 0.4,
    hairRadius: 0.35, hairLength: 1.8, bunRadius: 0.8,
    headRadius: 1.9, headDepth: 0.95, // how much the head should sink into the body
    rightShoulderAngle: Math.PI/8, leftShoulderAngle: Math.PI/8,
    shoulderDepth: 0.85, // how far the shoulders sink into the body
    handRadius: 0.45, forearmLength: 0.9, armRadius: 0.30,
    armZRotation: -Math.PI/8, armYRotation:Math.PI/2, armXRotation:0,
    legLength: 1.7, legRadiusTop: 0.45, legRadiusBottom: 0.3, legDistance: 0.7, // how far apart the legs are
    torsoScaleX: 0.9, torsoScaleY: 1, torsoScaleZ: 0.8, torsoLength: 3.5, torsoRadius: 1.2,
    blackMaterial: new THREE.MeshPhongMaterial({color: 0x000000, shading: THREE.SmoothShading, shininess: 20}),
    skinMaterial: new THREE.MeshPhongMaterial({color: 0xfcba92, shading: THREE.SmoothShading, shininess: 20, side: THREE.DoubleSide}),
    hairMaterial: new THREE.MeshPhongMaterial({color: hairColor, shading: THREE.SmoothShading, shininess: 20, side: THREE.DoubleSide})
  };
  
  var bodyFrame = new THREE.Object3D();
  var bodySpline = createBodySpline();
  var bodyGeometry = new THREE.LatheGeometry(bodySpline.geometry.vertices, 50);
  // updateGeom(bodyGeometry); //add texture coordinates
  
  var mat = new THREE.MeshPhongMaterial({color: 0xFFFFFF, shading: THREE.SmoothShading, shininess: 20, side: THREE.DoubleSide, map: textures[0]});
  var bodyMesh = new THREE.Mesh(bodyGeometry, mat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  
  bodyMesh.scale.z = params.torsoScaleZ; //flatten her torso
  bodyMesh.rotation.y = Math.PI; // spline object is backwards, so need to flip
  bodyFrame.add(bodyMesh);
  
  addHead(bodyFrame, params, textures);
  addShoulder(bodyFrame, params, 1, textures);
  addShoulder(bodyFrame, params, -1, textures);
  addLeg (bodyFrame, params, 1);
  addLeg (bodyFrame, params, -1);
  
  //position it in the scene
  bodyFrame.position.set(x, y + params.legLength, z);
  bodyFrame.rotation.y = rot;
  scene.add(bodyFrame);

  /*-----------------------------------------------------------------------------------
  CREATES BODY: Creates and returns a single spline object for the person's body. 
  Constructed by combining two bezier curves.
  -----------------------------------------------------------------------------------*/
  function createBodySpline() {
    var upper_seg = [ [0.0, 3.5, 0.0],
    [(0.8), 3.5, 0.0],
    [(0.8), 3.5, 0.0],
    [1, 1.6, 0.0] ];
    
    var lower_seg = [ [1, 1.6, 0.0],
    [(1.4), 0, 0.0],
    [(1.6), 0, 0.0],
    [1.7, 0, 0.0]];
    
    var curve1 = new THREE.CubicBezierCurve3(makeVertex(upper_seg[0]),
    makeVertex(upper_seg[1]),
    makeVertex(upper_seg[2]),
    makeVertex(upper_seg[3]));
    
    var curve2 = new THREE.CubicBezierCurve3(makeVertex(lower_seg[0]),
    makeVertex(lower_seg[1]),
    makeVertex(lower_seg[2]),
    makeVertex(lower_seg[3]));
    
    var geo = new THREE.Geometry();
    geo.vertices = Array.prototype.concat( curve1.getPoints(50),
    curve2.getPoints(50));
    
    var headSpline = new THREE.Line(geo, new THREE.LineBasicMaterial()); //Creates Spline
    return headSpline;
  }
  
  /*-----------------------------------------------------------------------------------
  BELOW ARE FUNCTIONS FOR THE HEAD AND FACIAL FEATURES
  -----------------------------------------------------------------------------------*/
  /* Returns an object that is the head of the Nook which has all of its facial
  * features added to it*/
  function createHead(textures) {
    var headGeometry = new THREE.SphereGeometry(params.headRadius, 50, 50);
    updateGeom(headGeometry, 1);
    var mat = new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.SmoothShading, shininess: 20, map: textures[2]});
    var headMesh = new THREE.Mesh(headGeometry, mat);
    headMesh.castShadow = true;
    headMesh.receiveShadow = true;
    headMesh.position.y = (params.torsoLength + params.headRadius) * params.headDepth;
    headMesh.scale.z = 0.9;
    
    
    addBang(headMesh);
    addBun(headMesh);
    addEar(headMesh, params, 1);
    addEar(headMesh, params, -1);
    return headMesh;
  }
  
  /*----------- Adds Person's Head to Body -----------------*/
  function addHead(body, params, textures) {
    var headFrame = new THREE.Object3D();
    var head = createHead(textures);
    
    headFrame.add(head);
    body.add(headFrame);
  }
  
  /*----------- Adds Person's Front Bangs to her face -----------------*/
  function addBang(head) {
    var bang = createBang();
    head.add(bang);
  }
  
  /*------------------ Create Person's Bangs + hair ------------------------*/
  function createBang() {
    var bangGeometry1 = new THREE.SphereGeometry(params.headRadius + 0.1, 50,50, 0, TW.degrees2radians(50), 0, 0.43 * Math.PI);
    var bangGeometry2 = new THREE.SphereGeometry(params.headRadius + 0.1, 50,50, 0, TW.degrees2radians(50), 0, 0.43 * Math.PI);
    var bangGeometry3 = new THREE.SphereGeometry(params.headRadius + 0.01, 50,50, 0, TW.degrees2radians(190), 0, 0.5 * Math.PI);
    var bangGeometry4 = new THREE.SphereGeometry(params.headRadius + 0.1, 50,50, 0, TW.degrees2radians(50), 0, 0.43 * Math.PI);
    
    var bangMesh1 = new THREE.Mesh(bangGeometry1, params.hairMaterial);
    bangMesh1.castShadow = true;
    bangMesh1.receiveShadow = true;
    
    var bangMesh2 = new THREE.Mesh(bangGeometry2, params.hairMaterial);
    bangMesh2.castShadow = true;
    bangMesh2.receiveShadow = true;
    
    var bangMesh3 = new THREE.Mesh(bangGeometry3, params.hairMaterial);
    bangMesh3.castShadow = true;
    bangMesh3.receiveShadow = true;
    
    var bangMesh4 = new THREE.Mesh(bangGeometry4, params.hairMaterial);
    bangMesh4.castShadow = true;
    bangMesh4.receiveShadow = true;
    
    bangMesh1.rotation.y = TW.degrees2radians(120); // right side bang
    bangMesh2.rotation.y = TW.degrees2radians(10); //left side bang
    bangMesh3.rotation.y = TW.degrees2radians(175); //hair
    bangMesh4.rotation.y = TW.degrees2radians(65); //middle side bang
    
    var bang = new THREE.Object3D();
    bang.add(bangMesh1);
    bang.add(bangMesh2);
    bang.add(bangMesh3);
    bang.add(bangMesh4);
    return bang;
  }
  
  /*------------------ Adds Person's Bun to Head ------------------------*/
  function addBun(head) {
    var bun = createBun();
    //set on the top of her head
    bun.position.set(0, params.headRadius, -params.headRadius/4);
    
    addHairTie(bun);
    head.add(bun);
  }
  
  /*------------------ Create Person's Bun ------------------------*/
  function createBun() {
    var bunGeometry = new THREE.SphereGeometry(params.bunRadius, params.sphereDetail, params.sphereDetail);
    var bunMesh = new THREE.Mesh(bunGeometry, params.hairMaterial);
    bunMesh.castShadow = true;
    bunMesh.receiveShadow = true;
    return bunMesh;
  }
  
  /*------------------ Adds Person's Hair Tie to Bun ------------------------*/
  function addHairTie(bun) {
    var hairTie = createHairTie();
    hairTie.rotation.x = Math.PI/2.3;
    hairTie.position.y = -params.bunRadius/4;
    bun.add(hairTie);
  }
  
  /*------------------ Create Person's Hair Tie ------------------------*/
  function createHairTie() {
    var geometry = new THREE.TorusGeometry(params.bunRadius, 0.08, 16, 100 );
    var torus = new THREE.Mesh( geometry, params.blackMaterial);
    return torus;
  }
  
  /*---------------Creates a scaled sphere for person's ear ------------------*/
  function createEar(params) {
    var earGeometry = new THREE.SphereGeometry(params.earRadius, params.sphereDetail, params.sphereDetail);
    var earMesh = new THREE.Mesh(earGeometry, params.skinMaterial);
    earMesh.castShadow = true;
    earMesh.receiveShadow = true;
    earMesh.position.z = params.headRadius;
    earMesh.scale.x = 0.5;
    return earMesh;
  }
    
  /* Adds an ear to the head on the right (side=1) or left
  * (side=-1), and rotates it on the z axis*/
  function addEar(head,params,side) {
      var earframe = new THREE.Object3D();
      var ear = createEar(params);
      
      earframe.add(ear);
      earframe.rotation.y = Math.PI/2 * side;
      head.add(earframe);
  }
    
  /*-----------------------------------------------------------------------------------
  BELOW ARE FUNCTIONS FOR THE LIMBS
  -----------------------------------------------------------------------------------*/
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
    var legMesh = new THREE.Mesh(legGeom, params.skinMaterial);
    legMesh.castShadow = true;
    legMesh.receiveShadow = true;
    
    // positions the legs so that they overlap with the body (why I multiplied by 0.5)
    legMesh.position.y = -length/2 * 0.7;
    leg.add(legMesh);
    addFoot(leg, params, side);
    return leg;
  }
  
  /* Adds an arm to the left (side = -1) or right (side = 1) shoulder*/
  function addArm (shoulder, params, side, mat) {
    var arm = createArm(params, side, false, mat);
    var forearm = createArm(params, side, true, mat);
    forearm.position.y = -params.forearmLength;
    forearm.rotation.z = side * Math.PI/4;
    forearm.rotation.y = side * Math.PI;
    forearm.rotation.x = -Math.PI/3;
    arm.add(forearm);
    shoulder.add(arm);
  }
  
  /* returns an object that is an arm for the Nook */
  function createArm (params, side, isHand, mat) {
    var arm = new THREE.Object3D();
    var radius = params.armRadius;
    var len = params.forearmLength;
    var cd  = params.cylinderDetail;
    
    var armGeom = new THREE.CylinderGeometry(radius, radius,len,cd);
    if (isHand) {
      var armMesh = new THREE.Mesh(armGeom, mat);
    } else {
      var armMesh = new THREE.Mesh(armGeom, mat);
    }
    armMesh.castShadow = true;
    armMesh.receiveShadow = true;
    
    // We need to lower the arm, so that the top of the cylinder is at the
    // shoulder of the arm
    armMesh.position.y = -len/2;
    arm.add(armMesh);
    
    addHand(arm, params, side, isHand, mat); // add a hand or elbow
    return arm;
  }
  
  /* Adds a hand to the left (side = -1) or right (side = 1) arm*/
  function addHand (arm, params, side, isHand, mat) {
    var handFrame= new THREE.Object3D();
    var hand = createHand(params, side, isHand);
    if (isHand) {
      hand.position.y = -params.forearmLength - params.handRadius/2; 
    } else {
      hand.position.y = -params.forearmLength; // add elbow
    }
    handFrame.add(hand);
    arm.add(handFrame);
  }
  
  /* Crerates a hand (or elbow joint; see comments in function)
  depending on whether isHand is true or false */
  function createHand (params, side, isHand) {
    // creates and returns a mesh for an eye
    var hand = new THREE.Object3D();
    if (isHand) {
      var radius = params.handRadius;
    } else {
      var radius = params.armRadius;
    }
    var sd = params.sphereDetail;
    
    // the upper arm and lower arm are made using the same createArm and
    // createHand functions. However, for the upper arm, we want the "hand"
    // to be an elbow instead, and so we have the following logic using the
    // parameter "isHand" to select the appropriate color
    var handGeometry = new THREE.SphereGeometry(radius, sd, sd);
    if (isHand) {
      var handMesh = new THREE.Mesh(handGeometry, params.skinMaterial);
    } else {
      var handMesh = new THREE.Mesh(handGeometry, mat);
    }
    handMesh.castShadow = true;
    handMesh.receiveShadow = true;
    
    hand.add(handMesh);
    return hand;
  }
  
  /* Adds a shoulder to the left (side = -1) or right (side =1) side of the body.
  * Rotates the whole arm around the z axis*/
  function addShoulder (body, params, side, textures) {
    var shoulder = createShoulder(params, side, textures);
    var scaleX = params.torsoScaleX;
    var scaleY = params.torsoScaleY;
    var depth = params.shoulderDepth;
    
    // the depth specifies how much the shoulder should overlap with the body
    var x = scaleX * params.torsoRadius * depth;
    var y = scaleY * params.torsoLength * depth;
    
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
    var radius = params.armRadius;
    var sd = params.sphereDetail;
    
    var shoulderGeometry = new THREE.SphereGeometry(radius, sd, sd);
    var mat = new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.SmoothShading, shininess: 20, map: textures[1]});
    var shoulderMesh = new THREE.Mesh(shoulderGeometry, mat);
    
    shoulder.add(shoulderMesh);
    addArm(shoulder, params, side, mat); // add an arm
    return shoulder;
  }
  
  /* adds a foot to the left (side = -1) or right (side = 1) leg */
  function addFoot (leg, params, side) {
      var footFrame= new THREE.Object3D();
      var foot = createFoot(params, side);
      foot.position.x = foot.position.x * side;
      footFrame.add(foot);
      leg.add(footFrame);
  }
  
  /* returns an object that is a foot for the clown */
  function createFoot (params, side) {
      var foot = new THREE.Object3D();
      var radius = params.footRadius;
      var sd = params.sphereDetail;
      
      // phiStart, phiLength, thetaStart, thetaLength are appropriately set so that
      /// the foot is a half sphere
      var footGeometry = new THREE.SphereGeometry(radius, sd, sd, 0, 2*Math.PI, 0, 0.5 * Math.PI);
      var footMesh = new THREE.Mesh(footGeometry, params.blackMaterial);
      footMesh.castShadow = true;
      footMesh.receiveShadow = true;
      footMesh.position.y = -(params.legLength);
      footMesh.position.z = 0.2;
      
      foot.add(footMesh);
      return foot;
  }
}