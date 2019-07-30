/*
  Author: Heidi Cho, Megan Shum
  Date: December 2018
  Purpose: CS 307 Contribution Library

  This file contains helper functions widely used throughout the project.
*/

/* This function takes a single point (x, y, z) as input and
creates a 3D vector (vertex) */
function makeVertex(p) {
    return new THREE.Vector3(p[0],p[1],p[2]);
}

/* Adds texture coordinates to a sphere. The function maps the image onto the front
side of the sphere, and fills in the back of sphere with the color of
the left-most pixel of the image.*/
function updateGeom(geom, side) {
    var faceVertexUvs = geom.faceVertexUvs[0];
    
    for (var i=0; i< faceVertexUvs.length;i++) {
      var uvs = faceVertexUvs[ i ];
      var face = geom.faces[ i ];
      for ( var j = 0; j < 3; j ++ ) {
        if (face.vertexNormals[j].z > 0) {
          uvs[ j ].x = face.vertexNormals[ j ].x * 0.5 + 0.5;
          uvs[ j ].y = side * face.vertexNormals[ j ].y * 0.5 + 0.5;
        } else {
          uvs[ j ].x = 0;
          uvs[ j ].y = 0;
        }
      }
    }
}