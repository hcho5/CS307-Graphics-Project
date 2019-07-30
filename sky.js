/*
  Author: Megan Shum, Heidi Cho
  Date: December 2018
  Purpose: CS 307 Contribution Library

  This file contains a function to create a large sphere that acts as a sky dome.
*/

/* Takes in a scene to add the sky to, a radius for how large the sky
dome should be, and an image for the sky. */
function createSky(scene, rad, skyImage) {
	TW.loadTextures([skyImage],
	function (textures) {
		createSkyHelper(scene, rad, textures);
	} );
}

function createSkyHelper(scene, rad, textures) {
	var skyGeometry = new THREE.SphereGeometry(rad,30,30);
    var sky = new THREE.Mesh(skyGeometry, new THREE.MeshPhongMaterial({
    									color: 0xffffff, 
    									map: textures[0], 
    									side: THREE.DoubleSide, 
    									shading: THREE.SmoothShading, 
    									shininess: 20}));
    sky.name = "sky";
    scene.add(sky);
}