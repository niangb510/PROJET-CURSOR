import * as THREE from 'three';

/**
 * Champ de points discret derrière le hero.
 * Reprend le motif pointillé de la maquette et l'anime très légèrement.
 */
export function initHeroDots(container) {
    let renderer;

    try {
        renderer = new THREE.WebGLRenderer({
            alpha: true,
            antialias: false,
            powerPreference: 'low-power',
        });
    } catch (error) {
        container.classList.add('is-static');
        return;
    }

    const canvas = renderer.domElement;
    canvas.setAttribute('aria-hidden', 'true');
    container.appendChild(canvas);

    const scene = new THREE.Scene();
    const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
    camera.position.z = 5;

    const material = new THREE.PointsMaterial({
        color: 0x2a2a2a,
        size: 1.6,
        sizeAttenuation: false,
        transparent: true,
        opacity: 0.9,
        depthWrite: false,
    });

    let points = null;

    const build = () => {
        const rect = container.getBoundingClientRect();
        const width = Math.max(1, Math.round(rect.width));
        const height = Math.max(1, Math.round(rect.height));

        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        renderer.setSize(width, height, false);

        camera.left = -width / 2;
        camera.right = width / 2;
        camera.top = height / 2;
        camera.bottom = -height / 2;
        camera.updateProjectionMatrix();

        if (points) {
            scene.remove(points);
            points.geometry.dispose();
        }

        const gap = 28;
        const cols = Math.ceil(width / gap) + 2;
        const rows = Math.ceil(height / gap) + 2;
        const positions = new Float32Array(cols * rows * 3);
        let index = 0;

        for (let x = 0; x < cols; x += 1) {
            for (let y = 0; y < rows; y += 1) {
                positions[index] = x * gap - width / 2;
                positions[index + 1] = y * gap - height / 2;
                positions[index + 2] = 0;
                index += 3;
            }
        }

        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        points = new THREE.Points(geometry, material);
        scene.add(points);
    };

    build();

    if ('ResizeObserver' in window) {
        const observer = new ResizeObserver(build);
        observer.observe(container);
    } else {
        window.addEventListener('resize', build);
    }

    const pointer = { x: 0, y: 0 };
    const offset = { x: 0, y: 0 };
    let visible = true;

    window.addEventListener('pointermove', (event) => {
        pointer.x = event.clientX / window.innerWidth - 0.5;
        pointer.y = event.clientY / window.innerHeight - 0.5;
    }, { passive: true });

    if ('IntersectionObserver' in window) {
        const observer = new IntersectionObserver(([entry]) => {
            visible = entry.isIntersecting;
        });
        observer.observe(container);
    }

    const clock = new THREE.Clock();

    const animate = () => {
        const time = clock.getElapsedTime();

        offset.x += (pointer.x * 16 - offset.x) * 0.04;
        offset.y += (pointer.y * 16 - offset.y) * 0.04;

        if (points) {
            points.position.x = offset.x + Math.sin(time * 0.12) * 3;
            points.position.y = -offset.y + Math.cos(time * 0.1) * 3;
        }

        if (visible) {
            renderer.render(scene, camera);
        }

        requestAnimationFrame(animate);
    };

    animate();
}
