import * as THREE from 'three';

export function initWebGLBackground() {
    const canvas = document.createElement('canvas');
    canvas.id = 'webgl-canvas';
    canvas.style.position = 'fixed';
    canvas.style.top = '0';
    canvas.style.left = '0';
    canvas.style.width = '100vw';
    canvas.style.height = '100vh';
    canvas.style.zIndex = '-1'; // Behind everything
    canvas.style.pointerEvents = 'none'; // Don't block interactions
    
    // Opacité faible pour garantir une lisibilité parfaite du texte
    canvas.style.opacity = '0.35'; 
    document.body.prepend(canvas);

    const scene = new THREE.Scene();
    
    // Fog helps to blend distant particles into the background nicely
    scene.fog = new THREE.FogExp2(0x020617, 0.0015);

    const camera = new THREE.PerspectiveCamera(65, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 800;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Colors matching your tech/portfolio theme
    const colorPrimary = new THREE.Color(0x6d28d9); // Electric Purple
    const colorAccent = new THREE.Color(0x0ea5e9); // Cyan

    // Generate Particles (Nodes)
    const particleCount = 200;
    const particles = new THREE.BufferGeometry();
    const particlePositions = new Float32Array(particleCount * 3);
    const particleVelocities = [];

    // Bounding box for particles to float inside
    const bounds = 800;

    for (let i = 0; i < particleCount; i++) {
        // Random positions inside bounding box
        particlePositions[i * 3] = (Math.random() - 0.5) * bounds * 2;
        particlePositions[i * 3 + 1] = (Math.random() - 0.5) * bounds * 2;
        particlePositions[i * 3 + 2] = (Math.random() - 0.5) * bounds * 2;

        // Random velocities (slow drift)
        particleVelocities.push({
            x: (Math.random() - 0.5) * 1.5,
            y: (Math.random() - 0.5) * 1.5,
            z: (Math.random() - 0.5) * 1.5
        });
    }

    particles.setAttribute('position', new THREE.BufferAttribute(particlePositions, 3));

    // Particle Material
    const pMaterial = new THREE.PointsMaterial({
        color: colorAccent,
        size: 8, // Taille doublée pour être plus visible
        transparent: true,
        opacity: 0.8,
        blending: THREE.AdditiveBlending
    });

    const particleSystem = new THREE.Points(particles, pMaterial);
    scene.add(particleSystem);

    // Setup Lines (Connections / Network)
    const linesMaterial = new THREE.LineBasicMaterial({
        color: colorPrimary,
        transparent: true,
        opacity: 0.15, // Keep it very subtle
        blending: THREE.AdditiveBlending
    });
    
    // We will update lines geometry every frame
    let linesMesh = new THREE.LineSegments(new THREE.BufferGeometry(), linesMaterial);
    scene.add(linesMesh);

    // Mouse Interaction
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX) * 0.4;
        mouseY = (event.clientY - windowHalfY) * 0.4;
    });

    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    function animate() {
        requestAnimationFrame(animate);

        // Smoothly move camera based on mouse position
        targetX = mouseX;
        targetY = mouseY;
        camera.position.x += (targetX - camera.position.x) * 0.03;
        camera.position.y += (-targetY - camera.position.y) * 0.03;
        camera.lookAt(scene.position);

        // Update particle positions
        const positions = particleSystem.geometry.attributes.position.array;
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] += particleVelocities[i].x;
            positions[i * 3 + 1] += particleVelocities[i].y;
            positions[i * 3 + 2] += particleVelocities[i].z;

            // Bounce off edges smoothly
            if (positions[i * 3] < -bounds || positions[i * 3] > bounds) particleVelocities[i].x *= -1;
            if (positions[i * 3 + 1] < -bounds || positions[i * 3 + 1] > bounds) particleVelocities[i].y *= -1;
            if (positions[i * 3 + 2] < -bounds || positions[i * 3 + 2] > bounds) particleVelocities[i].z *= -1;
        }
        
        particleSystem.geometry.attributes.position.needsUpdate = true;
        
        // Very slow constant rotation
        particleSystem.rotation.y += 0.001;
        linesMesh.rotation.y = particleSystem.rotation.y;

        // Calculate Network Connections
        const linePositions = [];
        const connectDistance = 160; // Max distance to form a link

        for (let i = 0; i < particleCount; i++) {
            for (let j = i + 1; j < particleCount; j++) {
                const dx = positions[i * 3] - positions[j * 3];
                const dy = positions[i * 3 + 1] - positions[j * 3 + 1];
                const dz = positions[i * 3 + 2] - positions[j * 3 + 2];
                const dist = Math.sqrt(dx * dx + dy * dy + dz * dz);

                // If particles are close enough, draw a line between them
                if (dist < connectDistance) {
                    linePositions.push(
                        positions[i * 3], positions[i * 3 + 1], positions[i * 3 + 2],
                        positions[j * 3], positions[j * 3 + 1], positions[j * 3 + 2]
                    );
                }
            }
        }
        
        // Update lines geometry with new connections
        linesMesh.geometry.dispose(); // Free up memory
        linesMesh.geometry = new THREE.BufferGeometry();
        linesMesh.geometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));

        renderer.render(scene, camera);
    }

    animate();
}
