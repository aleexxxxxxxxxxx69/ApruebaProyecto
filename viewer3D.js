const viewers = [];
const modeloPorViewer = {
    "viewer-anillo1": "anillo1plata.glb",
    "viewer-anillo2": "anillo2plata.glb",
    "viewer-pulsera1": "pulsera1.glb",
    "viewer-pulsera2": "pulsera2.glb",
    "viewer-pendiente1": "pendiente1.glb",
    "viewer-pendiente2": "pendiente2.glb"
};

// Inicializa todos los viewers de la página automáticamente
window.addEventListener("DOMContentLoaded", () => {
    Object.entries(modeloPorViewer).forEach(([idDiv, glbFile]) => {
        const div = document.getElementById(idDiv);
        if (div) {
            initViewer(div, `/models/${glbFile}`, false);
        }
    });
    // Para la vista detalle en producto.html si existe el div
    const detailDiv = document.getElementById("detailViewer");
    if (detailDiv) {
        // Usa el archivo correspondiente. Aquí ejemplo por defecto:
        initViewer(detailDiv, "/models/anillo1plata.glb", true);
    }
});

function initViewer(container, modelPath, isDetailView) {
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xF5F0E8);

    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, isDetailView ? 5 : 3);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const directionalLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    directionalLight1.position.set(5, 5, 5);
    directionalLight1.castShadow = true;
    scene.add(directionalLight1);
    const directionalLight2 = new THREE.DirectionalLight(0xD4AF37, 0.4);
    directionalLight2.position.set(-5, 3, -5);
    scene.add(directionalLight2);
    const pointLight = new THREE.PointLight(0xffffff, 0.5);
    pointLight.position.set(0, 3, 0);
    scene.add(pointLight);

    let controls = null;
    if (isDetailView && typeof THREE.OrbitControls !== 'undefined') {
        controls = new THREE.OrbitControls(camera, renderer.domElement);
        controls.enableDamping = true;
        controls.dampingFactor = 0.05;
        controls.minDistance = 2;
        controls.maxDistance = 10;
        controls.autoRotate = true; // Activa rotación de cámara en detalle
        controls.autoRotateSpeed = 1.0;
    }

    const loader = new THREE.GLTFLoader();
    let model = null;

    loader.load(
        modelPath,
        function (gltf) {
            model = gltf.scene;
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 2 / maxDim;
            model.scale.multiplyScalar(scale);
            model.position.sub(center.multiplyScalar(scale));
            model.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                    if (child.material) {
                        child.material.metalness = 0.9;
                        child.material.roughness = 0.1;
                        child.material.envMapIntensity = 1.0;
                    }
                }
            });
            scene.add(model);
        },
        undefined,
        function (error) {
            const geometry = new THREE.TorusKnotGeometry(0.5, 0.2, 100, 16);
            const material = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 0.9, roughness: 0.1 });
            model = new THREE.Mesh(geometry, material);
            scene.add(model);
        }
    );

    const clock = new THREE.Clock();
    function animate() {
        requestAnimationFrame(animate);
        if (model && (!isDetailView || !controls)) {
            model.rotation.y += 0.01;
        }
        if (controls) controls.update();
        renderer.render(scene, camera);
    }
    animate();

    const handleResize = () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);
    viewers.push({ scene, camera, renderer, model, controls, container, handleResize });
    return { scene, camera, renderer, model };
}

window.addEventListener('beforeunload', () => {
    viewers.forEach(viewer => {
        if (viewer.renderer) viewer.renderer.dispose();
        window.removeEventListener('resize', viewer.handleResize);
    });
});
