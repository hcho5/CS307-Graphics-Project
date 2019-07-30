/*
  Author: Heidi Cho, Megan Shum
  Date: December 2018
  Purpose: CS 307 Contribution Library

  This file creates Isabelle, a fictional character from the Nintendo game Animal Crossing.
  ISABELLE DIMENSIONS:
      Height: 12.7,
      Width: 5,
      Depth: 8.5,
      Origin: Center of her torso
*/

/************************************************************************************
MASTER FUNCTION: Creates and adds an Isabelle object to the scene
Takes 4 parameters:
1) the scene the object will be added to
2-4) the coordinates that nook will be positioned at
************************************************************************************/
function createIsabelle (scene, x, y, z) {
  TW.loadTextures(["img/isabelle_outfit.png", "img/isabelle_face.png"],
  function (textures) {
    createIsabelleHelper(scene, x, y, z, textures);
  } );
}

function createIsabelleHelper(scene, x, y, z, textures) {
  /*-------------------- Isabelle Parameters -------------------------*/
  var params = {
    sphereDetail: 50, cylinderDetail: 20,
    hairRadius: 0.35, hairLength: 1.8, bunRadius: 0.8,
    headRadius: 1.8, headDepth: 0.9, // how much the head should sink into the body
    shoulderRadius: 0.4, rightShoulderAngle: Math.PI/3, leftShoulderAngle: Math.PI/3,
    shoulderDepth: 0.85, // how far the shoulders sink into the body
    handRadius: 0.40, forearmLength: 1, armRadius: 0.40,
    leftArmZRotation: -Math.PI/8, leftArmYRotation:Math.PI/2, leftArmXRotation:0, rightArmZRotation:Math.PI/4,
    legLength: 1.5, legRadiusTop: 0.45, legRadiusBottom: 0.3, legDistance: 0.7, // how far apart the legs are
    tailLength: 2.5, tailRadius: 0.6, tailRotation: -Math.PI/8,
    torsoScaleX: 0.9, torsoScaleY: 1, torsoScaleZ: 0.8, torsoLength: 3.7, torsoRadius: 1.2,
    blackMaterial: new THREE.MeshPhongMaterial({color: 0x000000, shading: THREE.SmoothShading, shininess: 20}),
    yellowMaterial: new THREE.MeshPhongMaterial({color: 0xfce99f, shading: THREE.SmoothShading, shininess: 20, side: THREE.DoubleSide}),
    whiteMaterial: new THREE.MeshPhongMaterial({color: 0xffffff, shading: THREE.SmoothShading, shininess: 20}),
    pinkMaterial: new THREE.MeshPhongMaterial({color: 0xb2003e, shading: THREE.SmoothShading, shininess: 20}),
    orangeMaterial: new THREE.MeshPhongMaterial({color: 0xf4bc42, shading: THREE.SmoothShading, shininess: 20, side: THREE.DoubleSide}),
  };
  
  var bodyFrame = new THREE.Object3D();
  var bodySpline = createBodySpline();
  var bodyGeometry = new THREE.LatheGeometry(bodySpline.geometry.vertices, 50);
  updateGeom(bodyGeometry, -1); //add texture coordinates
  
  var mat = new THREE.MeshPhongMaterial({color: 0xFFFFFF, shading: THREE.SmoothShading, shininess: 20, side: THREE.DoubleSide, map: textures[0]});
  var bodyMesh = new THREE.Mesh(bodyGeometry, mat);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  
  bodyMesh.scale.z = params.torsoScaleZ; //flatten her torso
  bodyMesh.rotation.y = Math.PI; // spline object is backwards, so need to flip
  bodyFrame.add(bodyMesh);
  
  addTail(bodyFrame, params);
  addHead(bodyFrame, params, textures);
  addShoulder(bodyFrame, params, 1);
  addShoulder(bodyFrame, params, -1);
  addLeg (bodyFrame, params, 1);
  addLeg (bodyFrame, params, -1);
  
  //position it in the scene
  bodyFrame.position.set(x, y + params.legLength, z);
  scene.add(bodyFrame);
  
  /*-----------------------------------------------------------------------------------
  CREATES BODY: Creates and returns a single spline object for isabelle's body. 
  Constructed by combining two bezier curves.
  -----------------------------------------------------------------------------------*/
  function createBodySpline() {
    var upper_seg = [ [0.0, params.torsoLength, 0.0],      //p.torosLength = 3.7
    [(1), params.torsoLength, 0.0],
    [(1.4), params.torsoLength, 0.0],
    [1.5, 1.6, 0.0] ];
    
    var lower_seg = [ [1.5, 1.6, 0.0],
    [(1.4), 0.1, 0.0],
    [(1), 0, 0.0],
    [0, 0, 0.0]];
    
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
  /* Create and returns curved spline object for Isabelle's head */
  function createHeadSpline() {
    var rad = params.headRadius; //1.8
    var height = params.headRadius;
    
    var upper_seg = [ [0.0, rad*2-0.2, 0.0],
    [0.4, rad*2-0.2, 0.0],
    [1.0, rad*2-0.2, 0.0],
    [1.4, rad*2-0.8, 0.0] ];
    
    var mid_upper_seg = [ [1.4, rad*2-0.8, 0.0],
    [1.6, rad*2-1.2,  0.0],
    [1.8, rad, 0.0],
    [1.9, rad-0.2, 0.0] ];
    
    var mid_lower_seg = [ [1.9, rad-0.2, 0.0],
    [2.1, rad-0.6, 0.0],
    [2.1, rad-1.4, 0.0],
    [1.5, rad-1.6, 0.0] ];
    
    var lower_seg = [ [1.5, 0.2, 0.0],
    [1.2, 0.0, 0.0],
    [1.1, 0.0, 0.0],
    [0.7, rad-1.6, 0.0] ];
    
    var curve1 = new THREE.CubicBezierCurve3(makeVertex(upper_seg[0]),
    makeVertex(upper_seg[1]),
    makeVertex(upper_seg[2]),
    makeVertex(upper_seg[3]));
    
    var curve2 = new THREE.CubicBezierCurve3(makeVertex(mid_upper_seg[0]),
    makeVertex(mid_upper_seg[1]),
    makeVertex(mid_upper_seg[2]),
    makeVertex(mid_upper_seg[3]));
    
    var curve3 = new THREE.CubicBezierCurve3(makeVertex(mid_lower_seg[0]),
    makeVertex(mid_lower_seg[1]),
    makeVertex(mid_lower_seg[2]),
    makeVertex(mid_lower_seg[3]));
    
    var curve4 = new THREE.CubicBezierCurve3(makeVertex(lower_seg[0]),
    makeVertex(lower_seg[1]),
    makeVertex(lower_seg[2]),
    makeVertex(lower_seg[3]));
    
    var geo = new THREE.Geometry();
    geo.vertices = Array.prototype.concat( curve1.getPoints(50),
    curve2.getPoints(50),
    curve3.getPoints(50),
    curve4.getPoints(50) );       //Combines curves
    
    var headSpline = new THREE.Line(geo, new THREE.LineBasicMaterial()); //Creates Spline
    return headSpline;
  }
  
  /* Adds the head to the body, with the head partially overlapping with the body */
  function addHead(body, params, textures) {
    var headFrame= new THREE.Object3D();
    var headSpline = createHeadSpline();  //Creates Curved Spline Object
    var geo = new THREE.LatheGeometry(headSpline.geometry.vertices, 50);
    updateGeom(geo, -1);
    var mat = new THREE.MeshPhongMaterial({color: 0xFFFFFF, shading: THREE.SmoothShading, shininess: 20, side: THREE.DoubleSide, map: textures[1]});
    var headMesh = new THREE.Mesh(geo, mat);
    headMesh.castShadow = true;
    
    headFrame.add(headMesh);
    
    // Positions the head so that it overlaps with the body
    headFrame.position.y = params.torsoLength * params.headDepth;
    headFrame.rotation.y = Math.PI; // spline object is backwards, so need to flip
    
    // add facial features
    addEye(headFrame, -1);
    addEye(headFrame, 1);
    addBang(headFrame, -1);
    addBang(headFrame, 1);
    addHairStrand(headFrame, params, 1, true);
    addHairStrand(headFrame, params, -1, true);
    addHairStrand(headFrame, params, 1, false);
    addHairStrand(headFrame, params, -1, false);
    addBun(headFrame);
    body.add(headFrame);
  }
  
  /*----------- Adds Isabelle's Front Bangs to her face -----------------*/
  function addBang(head, side) {
    var bang = createBang();
    //set the bangs on the side of her face on her forehead
    bang.position.set(side * 0.55, params.headRadius * 1.5, -params.headRadius);
    
    //rotate the bangs
    bang.rotation.z = TW.degrees2radians(side * 60);
    head.add(bang);
  }
  
  /*------------------ Create Isabelle's Front Bangs ------------------------*/
  function createBang() {
    var bangGeometry = new THREE.SphereGeometry(0.70, params.sphereDetail, params.sphereDetail);
    var bangMesh = new THREE.Mesh(bangGeometry, params.yellowMaterial);
    bangMesh.castShadow = true;
    bangMesh.scale.z = 0.4; //flatten sphere
    bangMesh.scale.x = 0.7;
    return bangMesh;
  }
  
  /*------------------ Adds Isabelle's Bun to Head ------------------------*/
  function addBun(head) {
    var bun = createBun();
    //set on the top of her head
    bun.position.set(0, params.headRadius * 2, -params.headRadius/4);
    
    addHairTie(bun);
    head.add(bun);
  }
  
  /*------------------ Create Isabelle's Bun ------------------------*/
  function createBun() {
    var bunGeometry = new THREE.SphereGeometry(params.bunRadius, params.sphereDetail, params.sphereDetail);
    var bunMesh = new THREE.Mesh(bunGeometry, params.orangeMaterial);
    bunMesh.castShadow = true;
    bunMesh.scale.y = 1.2; // scale into oval shape
    return bunMesh;
  }
  
  /*------------------ Adds Isabelle's Hair Tie to Bun ------------------------*/
  function addHairTie(bun) {
    var hairTie = createHairTie();
    hairTie.rotation.x = Math.PI/2.3;
    hairTie.position.y = -params.bunRadius/4;
    bun.add(hairTie);
  }
  
  /*------------------ Create Isabelle's Hair Tie ------------------------*/
  function createHairTie() {
    var geometry = new THREE.TorusGeometry(params.bunRadius, 0.08, 16, 100 );
    var torus = new THREE.Mesh( geometry, params.pinkMaterial);
    return torus;
  }
  
  /* Adds an arm to the left (side = -1) or right (side = 1) shoulder*/
  function addHairStrand (head, params, side, isFront) {
    var hair = createHairStrand(params, side);
    var r = params.headRadius;
    if (isFront) {
      hair.position.set(side * r, r, -r/2);
      hair.rotation.z = TW.degrees2radians(side * 30);
    } else {
      hair.position.set(side * r, r, -r/4);
      hair.rotation.z = TW.degrees2radians(side * 40);
    }
    head.add(hair);
  }
  
  /* returns an object that is an arm for the Nook */
  function createHairStrand (params, side, isHand) {
    var arm = new THREE.Object3D();
    var radius = params.hairRadius;
    var len = params.hairLength;
    var cd  = params.cylinderDetail;
    
    var armGeom = new THREE.CylinderGeometry(radius, radius,len,cd);
    var armMesh = new THREE.Mesh(armGeom, params.orangeMaterial);
    armMesh.castShadow = true;
    
    arm.add(armMesh);
    addHairTip(arm, params, side); // add circle to end of hair
    return arm;
  }
  
  /* Adds a hand to the left (side = -1) or right (side = 1) arm*/
  function addHairTip (arm, params, side) {
    var handFrame= new THREE.Object3D();
    var bottom = createHairTip(params, side);
    var top = createHairTip(params, side);
    
    bottom.position.y = -params.hairLength/2; // add circle to bottom of hair
    top.position.y = params.hairLength/2;
    
    handFrame.add(bottom);
    handFrame.add(top);
    arm.add(handFrame);
  }
  
  /* Crerates circles for the ends of isabelle's hair */
  function createHairTip (params, side, isHand) {
    var hand = new THREE.Object3D();
    var radius = params.hairRadius;
    var handGeometry = new THREE.SphereGeometry(radius, params.sphereDetail, params.sphereDetail);
    var handMesh = new THREE.Mesh(handGeometry, params.orangeMaterial);
    handMesh.castShadow = true;
    
    hand.add(handMesh);
    return hand;
  }
  
  /*-----------------------------------------------------------------------------------
  Adds an eye object to Isabelle's head
  -----------------------------------------------------------------------------------*/
  function addEye(head, side) {
    var eyeFrame = new THREE.Object3D();
    var eye = createEye();
    var eyebrow = createEyebrow(side);
    eyeFrame.add(eye);
    eyeFrame.add(eyebrow);
    eyeFrame.position.set(side * (params.headRadius/2.3), params.headRadius, -params.headRadius);
    head.add(eyeFrame);
  }
  
  /*----------------- Creates an Oval extrude for the eyebrow ----------------*/
  function createEyebrow(side) {
    var eyebrow = createOvalExtrude(0.2, 0.05, 0.3, 0x000000);
    eyebrow.position.y = 0.2;
    eyebrow.rotation.z= TW.degrees2radians(side * 5 * -1);
    return eyebrow;
  }
  
  /*-----------------------------------------------------------------------------------
  Creates and returns an eye object. Its origin is located at its center. The pupil
  object is an extruded oval and includes two colored objects that make the pupil
  look like it is shining.
  -----------------------------------------------------------------------------------*/
  function createEye() {
    var pupil = createOvalExtrude(0.15, 0.1, 1.3, 0x000000);
    
    //Dull Shining Object (Oval)
    var dullShine = createOvalExtrude(0.08, 0.1, 1.0, 0x333333);
    dullShine.position.z = -0.01;   //Protrudes from pupil
    pupil.add(dullShine);
    
    //Bright Shining Object (Circle)
    var brightShine = createOvalExtrude(0.08, 0.1, (5.0/9.0), 0xffffff);
    brightShine.position.z = -0.02;  //Protrudes from dullShine
    brightShine.position.y = 0.08/1.8;
    pupil.add(brightShine);
    
    return pupil;
  }
  
  /*-----------------------------------------------------------------------------------
  HELPER FUNCTION: Creates and returns an oval extrude object made out of phong material.
  Its origin is located at its center. This function takes four parameters: the radius
  of the oval, the thickness of the extrude, the scaleY factor for oval's vertical length,
  and the material color.
  -----------------------------------------------------------------------------------*/
  function createOvalExtrude(radius, thickness, scaleY, color) {
    if( ! (color instanceof THREE.Color) )
    color = new THREE.Color(color);
    
    //Draw 2D Shape
    var shape = new THREE.Shape();
    shape.arc(0, 0, radius, 0, 2*Math.PI); //Initially Draws Circle
    
    //Specify Geometry Parameters
    var data = { steps: 10,
      amount: thickness,
      bevelEnabled: false,
    };
    
    //Create Extrude
    var geo = new THREE.ExtrudeGeometry(shape, data);
    var mat = new THREE.MeshPhongMaterial({color: color, emissive: 0x000000, shininess: 10, specular: 0x000000});
    var oval = new THREE.Mesh(geo, mat);
    oval.scale.y = scaleY;  //Increases Vertical Length; Makes Shapes Oval
    return oval;
  }
  
  /*-----------------------------------------------------------------------------------
  BELOW ARE FUNCTIONS FOR THE LIMBS AND TAIL
  -----------------------------------------------------------------------------------*/
  /* adds a tail to the body*/
  function addTail (body, params) {
    var tailFrame= new THREE.Object3D();
    var tailSpline = createTailSpline();
    var geo = new THREE.LatheGeometry(tailSpline.geometry.vertices, 50);
    var mat = params.yellowMaterial;
    var tail = new THREE.Mesh(geo, mat);
    tail.castShadow = true;
    
    
    // tail.position.z = -(params.torsoRadius * params.torsoScaleZ + params.tailLength/3);
    tail.position.y += 1.2;
    tail.rotation.x = -Math.PI/2;  // rotate the tail so it sits on the body
    tailFrame.add(tail);
    tailFrame.rotation.x = params.tailRotation; // rotate the tail lower relative to the body
    body.add(tailFrame);
  }
  
  /*-----------------------------------------------------------------------------------
  CREATES TAIL: Creates and returns a single spline object for Isabelle's tail. 
  Constructed by combining 3 bezier curves.
  -----------------------------------------------------------------------------------*/
  function createTailSpline() {
    var upper_seg = [ [0.0, 2.2, 0.0],      //p.headRadius = 1.8
    [0.2, 2, 0.0],
    [0.4, 1.8, 0.0],
    [0.5, 1.6, 0.0] ];
    
    var mid_lower_seg = [ [0.5, 1.6, 0.0],
    [0.8, 1.2, 0.0],
    [0.8, 1.0, 0.0],
    [0.4, 0.6, 0.0] ];
    
    var lower_seg = [ [0.4, 0.6, 0.0],
    [0.5, 0.0, 0.0],
    [0.4, 0.0, 0.0],
    [0.3, 0.6, 0.0] ];
    
    var curve1 = new THREE.CubicBezierCurve3(makeVertex(upper_seg[0]),
    makeVertex(upper_seg[1]),
    makeVertex(upper_seg[2]),
    makeVertex(upper_seg[3]));
    
    var curve3 = new THREE.CubicBezierCurve3(makeVertex(mid_lower_seg[0]),
    makeVertex(mid_lower_seg[1]),
    makeVertex(mid_lower_seg[2]),
    makeVertex(mid_lower_seg[3]));
    
    var curve4 = new THREE.CubicBezierCurve3(makeVertex(lower_seg[0]),
    makeVertex(lower_seg[1]),
    makeVertex(lower_seg[2]),
    makeVertex(lower_seg[3]));
    
    var geo = new THREE.Geometry();
    geo.vertices = Array.prototype.concat( curve1.getPoints(50),
    curve3.getPoints(50),
    curve4.getPoints(50) );       //Combines curves
    
    var headSpline = new THREE.Line(geo, new THREE.LineBasicMaterial()); //Creates Spline
    return headSpline;
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
    var legMesh = new THREE.Mesh(legGeom, params.yellowMaterial);
    legMesh.castShadow = true;
    
    
    // positions the legs so that they overlap with the body (why I multiplied by 0.5)
    legMesh.position.y = -length/2 * 0.7;
    leg.add(legMesh);
    
    return leg;
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
    if (isHand) {
      var armMesh = new THREE.Mesh(armGeom, params.yellowMaterial);
    } else {
      var armMesh = new THREE.Mesh(armGeom, params.whiteMaterial);
    }
    armMesh.castShadow = true;
    
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
    var hand = new THREE.Object3D();
    var radius = params.handRadius;
    var sd = params.sphereDetail;
    
    // the upper arm and lower arm are made using the same createArm and
    // createHand functions. However, for the upper arm, we want the "hand"
    // to be an elbow instead, and so we have the following logic using the
    // parameter "isHand" to select the appropriate color
    var handGeometry = new THREE.SphereGeometry(radius, sd, sd);
    if (isHand) {
      var handMesh = new THREE.Mesh(handGeometry, params.yellowMaterial);
    } else {
      var handMesh = new THREE.Mesh(handGeometry, params.whiteMaterial);
    }
    handMesh.castShadow = true;
    
    hand.add(handMesh);
    return hand;
  }
  
  /* Adds a shoulder to the left (side = -1) or right (side =1) side of the body.
  * Rotates the whole arm around the z axis*/
  function addShoulder (body, params, side) {
    var shoulder = createShoulder(params, side);
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
    var radius = params.shoulderRadius;
    var sd = params.sphereDetail;
    
    var shoulderGeometry = new THREE.SphereGeometry(radius, sd, sd);
    var shoulderMesh = new THREE.Mesh(shoulderGeometry, params.whiteMaterial);
    
    shoulder.add(shoulderMesh);
    addArm(shoulder, params, side); // add an arm
    return shoulder;
  }
}