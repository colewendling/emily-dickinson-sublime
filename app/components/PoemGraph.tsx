'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Poem, poems } from '../data/poems';
import PoemModal from './PoemModal';
import { FontLoader } from 'three-stdlib';
import { TextGeometry } from 'three-stdlib';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import { positions } from '../data/positions';
import { poemColors } from '../data/colors';
import { poemConnections } from '../data/connections';

// ==========================
// 🚀 Control Properties
// ==========================

// Multipliers for positioning and node sizing
const POSITION_MULTIPLIER = 30000; // Adjust this value as needed
const NODE_SIZE_MULTIPLIER = 200; // Adjust this value as needed

// Text size for poem labels
const TEXT_SIZE = 10; // Adjust this value as needed

// Initial camera position and zoom level
const CAMERA_POSITION = {
  x: -140,
  y: 731,
  z: 1682, // Adjust z for zoom level
};

// Axis colors and opacity
const AXIS_COLORS = {
  X: '#FF0000', // Red
  Y: '#00FF00', // Green
  Z: '#0000FF', // Blue
};
const AXIS_OPACITY = 0.2; // Adjust this value as needed

// Light intensity settings
const AMBIENT_LIGHT_INTENSITY = 0.5; // Ambient light brightness
const DIRECTIONAL_LIGHT_INTENSITY = 0.7; // Directional light brightness

// ==========================
// 🎨 PoemGraph2 Component
// ==========================

const PoemGraph: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);

  // State to hold camera position
  const [cameraPosition, setCameraPosition] = useState<{
    x: number;
    y: number;
    z: number;
  }>({
    x: CAMERA_POSITION.x,
    y: CAMERA_POSITION.y,
    z: CAMERA_POSITION.z,
  });

  // Helper: Convert the connections object to an array of [source, target] pairs
  function getRelatedPairs(): [number, number][] {
    const pairs: [number, number][] = [];
    for (const sourceStr in poemConnections) {
      const source = parseInt(sourceStr, 10);
      poemConnections[source].forEach((target) => {
        // Avoid duplicating pairs if connections are bidirectional
        if (source < target) {
          pairs.push([source, target]);
        }
      });
    }
    return pairs;
  }

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000000 // Increased far plane to accommodate larger scene
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting for shading
    const ambientLight = new THREE.AmbientLight(
      0xffffff,
      AMBIENT_LIGHT_INTENSITY
    );
    const directionalLight = new THREE.DirectionalLight(
      0xffffff,
      DIRECTIONAL_LIGHT_INTENSITY
    );
    directionalLight.position.set(10000, 10000, 10000); // Scaled light position
    scene.add(ambientLight, directionalLight);

    // Raycaster for interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const handleMouseClick = (event: MouseEvent) => {
      const rect = mountRef.current!.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      const intersects = raycaster.intersectObjects(scene.children, true);
      if (intersects.length > 0) {
        const intersectedObject = intersects[0].object;
        if (intersectedObject.userData && intersectedObject.userData.poem) {
          setSelectedPoem(intersectedObject.userData.poem);
        }
      }
    };

    window.addEventListener('click', handleMouseClick);

    // Load font for 3D text
    const fontLoader = new FontLoader();
    fontLoader.load('/fonts/helvetiker_regular.typeface.json', (font) => {
      // Calculate connections for each poem
      const connectionsCount: { [key: number]: number } = {};
      getRelatedPairs().forEach(([source, target]) => {
        connectionsCount[source] = (connectionsCount[source] || 0) + 1;
        connectionsCount[target] = (connectionsCount[target] || 0) + 1;
      });

      // Determine the bounding box to center the cloud
      const positionsArr = poems.map((poem) => {
        const { x, y, z } = positions[poem.id];
        return new THREE.Vector3(
          x * POSITION_MULTIPLIER,
          y * POSITION_MULTIPLIER,
          z * POSITION_MULTIPLIER
        );
      });
      const boundingBox = new THREE.Box3().setFromPoints(positionsArr);
      const center = boundingBox.getCenter(new THREE.Vector3());
      scene.position.sub(center); // Center the scene

      // Add nodes with dynamic sizing
      const relatedPairs = getRelatedPairs();

      poems.forEach((poem) => {
        const nodeColorHex = poemColors[poem.id] || '#FFFFFF'; // Default to white if undefined
        const nodeMaterial = new THREE.MeshStandardMaterial({
          color: new THREE.Color(nodeColorHex),
        });

        // Dynamic node size based on number of connections
        const connectionCount = connectionsCount[poem.id] || 1;
        const nodeSize = (0.01 + connectionCount * 0.01) * NODE_SIZE_MULTIPLIER; // Scaled node size

        const nodeGeometry = new THREE.SphereGeometry(nodeSize, 32, 32);
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);

        // Use the positions file for coordinates with multiplier
        const { x, y, z } = positions[poem.id];
        node.position.set(
          x * POSITION_MULTIPLIER,
          y * POSITION_MULTIPLIER,
          z * POSITION_MULTIPLIER
        );
        node.userData = { poem };
        scene.add(node);

        // Use the first line of the first stanza for label text
        const firstLine =
          Array.isArray(poem.stanzas[0]) && poem.stanzas[0].length > 0
            ? poem.stanzas[0][0]
            : 'Untitled Poem';

        const textGeometry = new TextGeometry(firstLine, {
          font: font,
          size: TEXT_SIZE, // Scaled text size
          height: 0.3,
        });
        const textMaterial = new THREE.MeshBasicMaterial({
          color: new THREE.Color(nodeColorHex), // Title text matches node color
          transparent: true,
          opacity: 0.8,
        });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(
          x * POSITION_MULTIPLIER,
          y * POSITION_MULTIPLIER + nodeSize + 10, // Scaled label position
          z * POSITION_MULTIPLIER
        );
        text.userData = { isText: true };
        scene.add(text);
      });

      // Add connections with more transparent lines
      relatedPairs.forEach(([source, target]) => {
        const sourceNode = poems.find((poem) => poem.id === source);
        const targetNode = poems.find((poem) => poem.id === target);

        if (sourceNode && targetNode) {
          const sourceColorHex = poemColors[sourceNode.id] || '#FFFFFF';
          const targetColorHex = poemColors[targetNode.id] || '#FFFFFF';

          const mixedColor = new THREE.Color(sourceColorHex)
            .lerp(new THREE.Color(targetColorHex), 0.5)
            .getHex();

          const lineMaterial = new THREE.LineBasicMaterial({
            color: mixedColor,
            transparent: true,
            opacity: 0.3, // More transparent
          });
          const points = [
            new THREE.Vector3(
              positions[sourceNode.id].x * POSITION_MULTIPLIER,
              positions[sourceNode.id].y * POSITION_MULTIPLIER,
              positions[sourceNode.id].z * POSITION_MULTIPLIER
            ),
            new THREE.Vector3(
              positions[targetNode.id].x * POSITION_MULTIPLIER,
              positions[targetNode.id].y * POSITION_MULTIPLIER,
              positions[targetNode.id].z * POSITION_MULTIPLIER
            ),
          ];
          const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);
          const line = new THREE.Line(lineGeometry, lineMaterial);
          scene.add(line);
        }
      });

      // Add axis labels
      const addAxis = (
        length: number,
        color: string,
        label: string,
        direction: THREE.Vector3
      ) => {
        const axisColor = new THREE.Color(color);
        const material = new THREE.LineBasicMaterial({
          color: axisColor,
          transparent: true,
          opacity: AXIS_OPACITY,
        });
        const points = [
          new THREE.Vector3(0, 0, 0),
          direction.clone().setLength(length * POSITION_MULTIPLIER),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const axis = new THREE.Line(geometry, material);
        scene.add(axis);

        // Add label
        const labelGeometry = new TextGeometry(label, {
          font: font,
          size: TEXT_SIZE * 0.5, // Scaled label size
          height: 0.2,
        });
        const labelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White label color
        const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
        labelMesh.position.copy(
          direction.clone().setLength(length * POSITION_MULTIPLIER + 100) // Scaled label position
        );
        labelMesh.lookAt(camera.position); // Face the camera
        labelMesh.userData = { isLabel: true };
        scene.add(labelMesh);
      };

      // X-axis (Red)
      addAxis(10, AXIS_COLORS.X, 'X', new THREE.Vector3(1, 0, 0));
      // Y-axis (Green)
      addAxis(10, AXIS_COLORS.Y, 'Y', new THREE.Vector3(0, 1, 0));
      // Z-axis (Blue)
      addAxis(10, AXIS_COLORS.Z, 'Z', new THREE.Vector3(0, 0, 1));
    });

    // Rotation, zoom, and pan controls using OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true; // Enable panning

    camera.position.set(
      CAMERA_POSITION.x,
      CAMERA_POSITION.y,
      CAMERA_POSITION.z
    ); // Set initial camera position
    controls.update();

    // Listen to camera movement and update state
    const updateCameraPosition = () => {
      setCameraPosition({
        x: Math.round(camera.position.x),
        y: Math.round(camera.position.y),
        z: Math.round(camera.position.z),
      });
    };

    controls.addEventListener('change', updateCameraPosition);

    // Handle window resize
    const handleResize = () => {
      if (!mountRef.current) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      renderer.setSize(width, height);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', handleResize);

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();

      // Make labels always face the camera
      scene.children.forEach((child) => {
        if (child instanceof THREE.Mesh && child.userData.isLabel) {
          child.lookAt(camera.position);
        }
        if (child instanceof THREE.Mesh && child.userData.isText) {
          child.lookAt(camera.position);
        }
      });

      renderer.render(scene, camera);
    };

    animate();

    return () => {
      window.removeEventListener('click', handleMouseClick);
      window.removeEventListener('resize', handleResize);
      controls.removeEventListener('change', updateCameraPosition);

      if (
        mountRef.current &&
        renderer.domElement.parentNode === mountRef.current
      ) {
        mountRef.current.removeChild(renderer.domElement);
      }

      controls.dispose();
    };
  }, []);

  return (
    <div ref={mountRef} className="w-full h-full relative">
      {/* Camera Position Display */}
      <div
        className="absolute top-2 right-2 bg-black bg-opacity-90 text-white text-lg p-2 rounded"
        style={{ opacity: 0.5 }}
      >
        <div>x: {cameraPosition.x}</div>
        <div>y: {cameraPosition.y}</div>
        <div>z: {cameraPosition.z}</div>
      </div>

      {selectedPoem && (
        <PoemModal poem={selectedPoem} onClose={() => setSelectedPoem(null)} />
      )}
    </div>
  );
};

export default PoemGraph;
