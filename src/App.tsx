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
    controls.maxPolarAngle = Math.PI / 2; // Limit the orbit control angles
    controls.minPolarAngle = Math.PI / 3;

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
    const materials: THREE.MeshBasicMaterial[] = faceColors.map((color, index) => {
      const canvas = document.createElement('canvas');
      canvas.width = 256;
      canvas.height = 256;
      const ctx = canvas.getContext('2d');
      if (ctx) {
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

    // Raycaster for detecting clicks on the cube
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    // Add event listener for mouse clicks
    const onMouseClick = (event: MouseEvent) => {
      // Calculate mouse position in normalized device coordinates (-1 to +1)
      mouse.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
      mouse.y = - (event.clientY / renderer.domElement.clientHeight) * 2 + 1;

      // Update the picking ray with the camera and mouse position
      raycaster.setFromCamera(mouse, camera);

      // Calculate objects intersecting the picking ray
      const intersects = raycaster.intersectObjects(scene.children);

      if (intersects.length > 0 && intersects[0].object === cube) {
        setIsExpanded(expanded => !expanded);
      }
    };
    window.addEventListener('click', onMouseClick);

    // Animation loop
    const animate = (): void => {
      requestAnimationFrame(animate);

      if (!isExpanded) {
        // Only rotate the cube if it's not expanded
        cube.rotation.x += 0.0055;
        cube.rotation.y += 0.0055;
      }

      // Update the outline to match the cube
      outlineMesh.rotation.x = cube.rotation.x;
      outlineMesh.rotation.y = cube.rotation.y;

      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Cleanup on unmount
    return () => {
      window.removeEventListener('click', onMouseClick);
      controls.dispose();
      renderer.dispose();
      scene.remove(cube);
      scene.remove(outlineMesh);
      geometry.dispose();
      materials.forEach(material => material.dispose());
      outlineMaterial.dispose();
    };
  }, [isExpanded]); // Re-run the effect when isExpanded changes

  // useEffect to handle background color change when cube is expanded
  useEffect(() => {
    if (mountRef.current) {
      const canvas = mountRef.current.querySelector('canvas');
      if (canvas) {
        canvas.style.opacity = isExpanded ? '0' : '1';
      }
      mountRef.current.style.backgroundColor = isExpanded ? '#40A2E3' : 'transparent';
    }
  }, [isExpanded]);

  return (
    <div ref={mountRef} className={`container ${isExpanded ? 'expanded' : ''}`}>
      {/* Your canvas and any other content */}
    </div>
  );
};

export default App;

// import React, { useRef, useEffect, useState } from 'react';
// import * as THREE from 'three';
// import { OrbitControls } from 'three-stdlib';
// import './App.css';

// const App: React.FC = () => {
//   const mountRef = useRef<HTMLDivElement>(null);
//   const [isExpanded, setIsExpanded] = useState(false); // State to track cube expansion

//   useEffect(() => {
//     if (!mountRef.current) return;
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

//       if (ctx) { // Check if context is not null
//         // Set the background color
//         ctx.fillStyle = color;
//         ctx.fillRect(0, 0, canvas.width, canvas.height);

//         // Set the text style
//         ctx.font = '20px Arial';
//         ctx.fillStyle = 'white';
//         ctx.textAlign = 'left';
//         ctx.textBaseline = 'top';

//         // Split the text by line and draw each line
//         const lines = faceTexts[index].split('\n');
//         lines.forEach((line, i) => {
//           ctx.fillText(line, 10, 30 + i * 24); // Adjust text position as needed
//         });
//       }

//       const texture = new THREE.CanvasTexture(canvas);
//       return new THREE.MeshBasicMaterial({ map: texture });
//     });

//     //   // Set the background color
//     //   ctx.fillStyle = color;
//     //   ctx.fillRect(0, 0, canvas.width, canvas.height);

//     //   // Set the text style
//     //   ctx.font = '20px Arial';
//     //   ctx.fillStyle = 'white';
//     //   ctx.textAlign = 'left';
//     //   ctx.textBaseline = 'top';

//     //   // Split the text by line and draw each line
//     //   const lines = faceTexts[index].split('\n');
//     //   lines.forEach((line, i) => {
//     //     ctx.fillText(line, 10, 30 + i * 24); // Adjust text position as needed
//     //   });

//     //   const texture = new THREE.CanvasTexture(canvas);
//     //   return new THREE.MeshBasicMaterial({ map: texture });
//     // });

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
//     const animate = (): void => {
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
