function create3DPreview(productId, container) {
  container.innerHTML = '';
  const product = productos.find(p => p.id === productId);
  if (!product) return;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xFFFBF7);

  const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
  camera.position.set(0, 0, 5);

  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, preserveDrawingBuffer: true });
  renderer.setSize(container.clientWidth, container.clientHeight);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  container.appendChild(renderer.domElement);

  const light1 = new THREE.DirectionalLight(0xffffff, 1.5);
  light1.position.set(5, 5, 5);
  scene.add(light1);

  const light2 = new THREE.DirectionalLight(0xffffff, 0.8);
  light2.position.set(-5, -5, -5);
  scene.add(light2);

  const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
  scene.add(ambientLight);

  const loader = new THREE.GLTFLoader();
  loader.load(product.modelo3D, function (gltf) {
    const model = gltf.scene;
    model.scale.set(0.6, 0.6, 0.6); // Esta escala es importante
    model.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    const box = new THREE.Box3().setFromObject(model);
    const center = box.getCenter(new THREE.Vector3());
    model.position.sub(center);

    scene.add(model);
    let phase = 0;

    function animate() {
      requestAnimationFrame(animate);
      const amplitude = 0.10;
      model.rotation.y += 0.012; // Giro
      model.position.y = amplitude * Math.sin(phase);
      phase += 0.02;
      renderer.render(scene, camera);
    }
    animate();
  });
}
