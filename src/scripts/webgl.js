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
    canvas.style.opacity = '0.8';
    document.body.prepend(canvas);

    const scene = new THREE.Scene();
    // Add subtle fog to blend into background
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.001);
    
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 10000);
    camera.position.z = 1000;
    camera.position.y = 400;

    const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    const SEPARATION = 60, AMOUNTX = 100, AMOUNTY = 100;
    const numParticles = AMOUNTX * AMOUNTY;

    const positions = new Float32Array(numParticles * 3);
    const scales = new Float32Array(numParticles);

    let i = 0, j = 0;
    for (let ix = 0; ix < AMOUNTX; ix++) {
        for (let iy = 0; iy < AMOUNTY; iy++) {
            positions[i] = ix * SEPARATION - ((AMOUNTX * SEPARATION) / 2); // x
            positions[i + 1] = 0; // y
            positions[i + 2] = iy * SEPARATION - ((AMOUNTY * SEPARATION) / 2); // z
            scales[j] = 1;
            i += 3;
            j++;
        }
    }

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    geometry.setAttribute('scale', new THREE.BufferAttribute(scales, 1));

    // Material with custom shader for beautiful particles
    const material = new THREE.ShaderMaterial({
        uniforms: {
            // Indigo / purple color theme matching the tech/portfolio vibe
            color: { value: new THREE.Color(0x4f46e5) },
            time: { value: 0 }
        },
        vertexShader: `
            attribute float scale;
            varying vec2 vUv;
            varying float vElevation;
            
            void main() {
                vUv = uv;
                vec4 mvPosition = modelViewMatrix * vec4(position, 1.0);
                gl_PointSize = scale * (250.0 / - mvPosition.z);
                gl_Position = projectionMatrix * mvPosition;
                vElevation = position.y;
            }
        `,
        fragmentShader: `
            uniform vec3 color;
            uniform float time;
            varying float vElevation;
            
            void main() {
                // Determine distance from center to make it circular
                float dist = length(gl_PointCoord - vec2(0.5, 0.5));
                if (dist > 0.5) discard;
                
                // Soft edge
                float alpha = (0.5 - dist) * 2.0;
                
                // Color variation based on elevation
                vec3 mixColor = vec3(0.06, 0.73, 0.98); // Cyan
                vec3 finalColor = mix(color, mixColor, (vElevation + 100.0) / 200.0);
                
                // Opacity is reduced so it doesn't distract too much
                gl_FragColor = vec4(finalColor, alpha * 0.7);
            }
        `,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse interaction variables
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        // Normalize mouse coordinates for the effect
        mouseX = event.clientX - windowHalfX;
        mouseY = event.clientY - windowHalfY;
    });

    // Handle resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    let count = 0;
    const clock = new THREE.Clock();

    function animate() {
        requestAnimationFrame(animate);
        
        targetX = mouseX * 0.8;
        targetY = mouseY * 0.8;
        
        // Smooth camera movement based on mouse
        camera.position.x += (targetX - camera.position.x) * 0.05;
        camera.position.y += (-targetY - camera.position.y) * 0.05 + 2;
        camera.lookAt(scene.position);

        const positions = particles.geometry.attributes.position.array;
        const scales = particles.geometry.attributes.scale.array;

        let i = 0, j = 0;
        for (let ix = 0; ix < AMOUNTX; ix++) {
            for (let iy = 0; iy < AMOUNTY; iy++) {
                // Wave logic
                positions[i + 1] = (Math.sin((ix + count) * 0.3) * 50) +
                                 (Math.sin((iy + count) * 0.5) * 50);
                
                // Pulse scale
                scales[j] = (Math.sin((ix + count) * 0.3) + 1) * 2 +
                            (Math.sin((iy + count) * 0.5) + 1) * 2;
                i += 3;
                j++;
            }
        }

        particles.geometry.attributes.position.needsUpdate = true;
        particles.geometry.attributes.scale.needsUpdate = true;
        
        // Slowly rotate scene for dynamic feel
        particles.rotation.y = count * 0.02;

        count += 0.04;

        renderer.render(scene, camera);
    }
    
    animate();
}
