'use client';

import React, { useRef, useEffect, useState } from 'react';
import * as THREE from 'three';
import { Poem, poems, getRelatedPairs } from '../data/poems';
import PoemModal from './PoemModal';
import { FontLoader } from 'three-stdlib';
import { TextGeometry } from 'three-stdlib';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

const PoemGraph: React.FC = () => {
  const mountRef = useRef<HTMLDivElement>(null);
  const [selectedPoem, setSelectedPoem] = useState<Poem | null>(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // Initialize scene, camera, and renderer
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      75,
      mountRef.current.clientWidth / mountRef.current.clientHeight,
      0.1,
      1000
    );

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(
      mountRef.current.clientWidth,
      mountRef.current.clientHeight
    );
    renderer.setClearColor(0x000000, 0); // Transparent background
    mountRef.current.appendChild(renderer.domElement);

    // Add lighting for shading
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
    directionalLight.position.set(10, 10, 10);
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
      const positions = poems.map(
        (poem) =>
          new THREE.Vector3(poem.position.x, poem.position.y, poem.position.z)
      );
      const boundingBox = new THREE.Box3().setFromPoints(positions);
      const center = boundingBox.getCenter(new THREE.Vector3());
      scene.position.sub(center); // Center the scene

      // Add nodes with dynamic sizing
      const relatedPairs = getRelatedPairs();

      poems.forEach((poem) => {
        const nodeMaterial = new THREE.MeshStandardMaterial({
          color: poem.color,
        });

        // Dynamic node size based on connections
        const connectionCount = connectionsCount[poem.number] || 1;
        const nodeSize = 0.01 + connectionCount * 0.01; // Adjust scaling as needed

        const nodeGeometry = new THREE.SphereGeometry(nodeSize, 32, 32);
        const node = new THREE.Mesh(nodeGeometry, nodeMaterial);
        node.position.set(poem.position.x, poem.position.y, poem.position.z);
        node.userData = { poem };
        scene.add(node);

        // Add text above each node
        const textGeometry = new TextGeometry(poem.content[0], {
          font: font,
          size: 0.1, // Smaller title font size
          height: 0.005,
        });
        const textMaterial = new THREE.MeshBasicMaterial({
          color: poem.color, // Title text matches node color
          transparent: true,
          opacity: 0.8,
        });
        const text = new THREE.Mesh(textGeometry, textMaterial);
        text.position.set(
          poem.position.x,
          poem.position.y + nodeSize + 0.1,
          poem.position.z
        );
        text.userData = { isText: true };
        scene.add(text);
      });

      // Add connections with more transparent lines
      relatedPairs.forEach(([source, target]) => {
        const sourceNode = poems.find((poem) => poem.number === source);
        const targetNode = poems.find((poem) => poem.number === target);

        if (sourceNode && targetNode) {
          const mixedColor = new THREE.Color(sourceNode.color)
            .lerp(new THREE.Color(targetNode.color), 0.5)
            .getHex();

          const lineMaterial = new THREE.LineBasicMaterial({
            color: mixedColor,
            transparent: true,
            opacity: 0.3, // More transparent
          });
          const points = [
            new THREE.Vector3(
              sourceNode.position.x,
              sourceNode.position.y,
              sourceNode.position.z
            ),
            new THREE.Vector3(
              targetNode.position.x,
              targetNode.position.y,
              targetNode.position.z
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
        color: number,
        label: string,
        position: THREE.Vector3
      ) => {
        const material = new THREE.LineBasicMaterial({ color: 0xffffff/50 }); // White axes
        const points = [
          new THREE.Vector3(0, 0, 0),
          position.clone().setLength(length),
        ];
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        const axis = new THREE.Line(geometry, material);
        scene.add(axis);

        // Add label
        const labelGeometry = new TextGeometry(label, {
          font: font,
          size: 0.1, // Smaller axis label font size
          height: 0.005,
        });
        const labelMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff }); // White label color
        const labelMesh = new THREE.Mesh(labelGeometry, labelMaterial);
        labelMesh.position.copy(position.clone().setLength(length + 0.3));
        labelMesh.lookAt(camera.position); // Initially face the camera
        labelMesh.userData = { isLabel: true };
        scene.add(labelMesh);
      };

      // X-axis
      addAxis(10, 0xffffff, 'X', new THREE.Vector3(1, 0, 0));
      // Y-axis
      addAxis(10, 0xffffff, 'Y', new THREE.Vector3(0, 1, 0));
      // Z-axis
      addAxis(10, 0xffffff, 'Z', new THREE.Vector3(0, 0, 1));
    });

    // Rotation, zoom, and pan controls using OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true; // Enable panning

    camera.position.set(0, 0, 30); // Adjusted for better initial view
    controls.update();

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
      {selectedPoem && (
        <PoemModal poem={selectedPoem} onClose={() => setSelectedPoem(null)} />
      )}
    </div>
  );
};

export default PoemGraph;
