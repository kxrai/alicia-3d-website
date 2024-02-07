import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three-stdlib';
import './App.css';

const App: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [isExpanded, setIsExpanded] = useState(false); // State to track cube expansion

  useEffect(() => {
    if (!mountRef.current) return;
    // Scene and camera setup
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    mountRef.current.appendChild(renderer.domElement);

    // OrbitControls for camera interaction
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.25;

    // Colors and text for each face
    const faceColors = ['#40A2E3', '#7FC7D9', '#365486', '#86B6F6', '#3081D0', '#6DB9EF'];
    const faceTexts = [
      'Digital Technologies\nStudent',
      'First Year\nStudent',
      'York\nUniversity',
      'Student\nWeb Developer',
      'Alicia\nLoi',
      '😊', // Smiley face
    ];

    // Create materials for each face with colors and texts
    const materials = faceColors.map((color, index) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      canvas.width = 256;
      canvas.height = 256;

      if (ctx) { // Check if context is not null
        // Set the background color
        ctx.fillStyle = color;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Set the text style
        ctx.font = '20px Arial';
        ctx.fillStyle = 'white';
        ctx.textAlign = 'left';
        ctx.textBaseline = 'top';

        // Split the text by line and draw each line
        const lines = faceTexts[index].split('\n');
        lines.forEach((line, i) => {
          ctx.fillText(line, 10, 30 + i * 24); // Adjust text position as needed
        });
      }

      const texture = new THREE.CanvasTexture(canvas);
      return new THREE.MeshBasicMaterial({ map: texture });
    });

    //   // Set the background color
    //   ctx.fillStyle = color;
    //   ctx.fillRect(0, 0, canvas.width, canvas.height);

    //   // Set the text style
    //   ctx.font = '20px Arial';
    //   ctx.fillStyle = 'white';
    //   ctx.textAlign = 'left';
    //   ctx.textBaseline = 'top';

    //   // Split the text by line and draw each line
    //   const lines = faceTexts[index].split('\n');
    //   lines.forEach((line, i) => {
    //     ctx.fillText(line, 10, 30 + i * 24); // Adjust text position as needed
    //   });

    //   const texture = new THREE.CanvasTexture(canvas);
    //   return new THREE.MeshBasicMaterial({ map: texture });
    // });

    // Create the cube geometry and mesh
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const cube = new THREE.Mesh(geometry, materials);
    scene.add(cube);

    // Outline material and mesh
    const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
    const outlineMesh = new THREE.Mesh(geometry, outlineMaterial);
    outlineMesh.scale.multiplyScalar(1.05);
    scene.add(outlineMesh);

    // Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(5, 3, 5);
    scene.add(pointLight);

    // Position the camera
    camera.position.set(0, 0, 5);
    

    // Animation loop
    const animate = (): void => {
      requestAnimationFrame(animate);

      // Add cube rotation
      cube.rotation.x += 0.0055;
      cube.rotation.y += 0.0055;
      
      // Add outline rotation to match the cube
      outlineMesh.rotation.x = cube.rotation.x;
      outlineMesh.rotation.y = cube.rotation.y;

      // Update controls
      controls.update();

      // Render the scene
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      controls.dispose();
      renderer.dispose();
      scene.remove(cube);
      scene.remove(outlineMesh);
      geometry.dispose();
      materials.forEach(material => material.dispose());
      outlineMaterial.dispose();
    };
  }, []);

  return <div ref={mountRef} className="w-full h-screen"></div>;
}

export default App;


// import React, { useRef, useEffect } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three-stdlib';

// function App() {
//   const mountRef = useRef(null);

//   useEffect(() => {
//     // Scene and camera setup
//     const scene = new THREE.Scene();
//     const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
//     const renderer = new THREE.WebGLRenderer({ antialias: true });
//     renderer.setSize(window.innerWidth, window.innerHeight);
//     mountRef.current.appendChild(renderer.domElement);

//     // OrbitControls for camera interaction
//     const controls = new OrbitControls(camera, renderer.domElement);
//     controls.enableDamping = true;
//     controls.dampingFactor = 0.25;

//     // Colors and text for each face
//     const faceColors = ['#40A2E3', '#7FC7D9', '#365486', '#86B6F6', '#3081D0', '#6DB9EF'];
//     const faceTexts = [
//       'Digital Technologies\nStudent',
//       'First Year\nStudent',
//       'York\nUniversity',
//       'Student\nWeb Developer',
//       'Alicia\nLoi',
//       '😊', // Smiley face
//     ];

//     // Create materials for each face with colors and texts
//     const materials = faceColors.map((color, index) => {
//       const canvas = document.createElement('canvas');
//       const ctx = canvas.getContext('2d');
//       canvas.width = 256;
//       canvas.height = 256;

//       // Set the background color
//       ctx.fillStyle = color;
//       ctx.fillRect(0, 0, canvas.width, canvas.height);

//       // Set the text style
//       ctx.font = '20px Arial';
//       ctx.fillStyle = 'white';
//       ctx.textAlign = 'left';
//       ctx.textBaseline = 'top';

//       // Split the text by line and draw each line
//       const lines = faceTexts[index].split('\n');
//       lines.forEach((line, i) => {
//         ctx.fillText(line, 10, 30 + i * 24); // Adjust text position as needed
//       });

//       const texture = new THREE.CanvasTexture(canvas);
//       return new THREE.MeshBasicMaterial({ map: texture });
//     });

//     // Create the cube geometry and mesh
//     const geometry = new THREE.BoxGeometry(2, 2, 2);
//     const cube = new THREE.Mesh(geometry, materials);
//     scene.add(cube);

//     // Outline material and mesh
//     const outlineMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, side: THREE.BackSide });
//     const outlineMesh = new THREE.Mesh(geometry, outlineMaterial);
//     outlineMesh.scale.multiplyScalar(1.05);
//     scene.add(outlineMesh);

//     // Lighting
//     const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
//     scene.add(ambientLight);

//     const pointLight = new THREE.PointLight(0xffffff, 0.5);
//     pointLight.position.set(5, 3, 5);
//     scene.add(pointLight);

//     // Position the camera
//     camera.position.set(0, 0, 5);

//     // Animation loop
//     const animate = () => {
//       requestAnimationFrame(animate);

//       // Add cube rotation
//       cube.rotation.x += 0.0055;
//       cube.rotation.y += 0.0055;
      
//       // Add outline rotation to match the cube
//       outlineMesh.rotation.x = cube.rotation.x;
//       outlineMesh.rotation.y = cube.rotation.y;

//       // Update controls
//       controls.update();

//       // Render the scene
//       renderer.render(scene, camera);
//     };
//     animate();

//     // Cleanup on unmount
//     return () => {
//       controls.dispose();
//       renderer.dispose();
//       scene.remove(cube);
//       scene.remove(outlineMesh);
//       geometry.dispose();
//       materials.forEach(material => material.dispose());
//       outlineMaterial.dispose();
//     };
//   }, []);

//   return <div ref={mountRef} className="w-full h-screen"></div>;
// }

// export default App;
