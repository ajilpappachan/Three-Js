import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r123/three.module.js";

let camera, scene, renderer;
let cube, sphere, torus, material;
let count = 0,
	cubeCamera1,
	cubeCamera2,
	cubeRenderTarget1,
	cubeRenderTarget2;
let onPointerDownPointerX,
	onPointerDownPointerY,
	onPointerDownLon,
	onPointerDownLat;

let lon = 0,
	lat = 0;
let phi = 0,
	theta = 0;

const textureLoader = new THREE.TextureLoader();

textureLoader.load("../assets/image.jpg", function (texture) {
	texture.encoding = THREE.sRGBEncoding;
	texture.mapping = THREE.EquirectangularReflectionMapping;

	init(texture);
	animate();
});

function init(texture) {
	renderer = new THREE.WebGLRenderer({ antialias: true });
	renderer.setPixelRatio(window.devicePixelRatio);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.outputEncoding = THREE.sRGBEncoding;
	document.body.appendChild(renderer.domElement);

	scene = new THREE.Scene();
	scene.background = texture;

	camera = new THREE.PerspectiveCamera(
		75,
		window.innerWidth / window.innerHeight,
		1,
		1000
	);

	cubeRenderTarget1 = new THREE.WebGLCubeRenderTarget(256, {
		format: THREE.RGBFormat,
		generateMipmaps: true,
		minFilter: THREE.LinearMipmapLinearFilter,
		encoding: THREE.sRGBEncoding,
	});

	cubeRenderTarget2 = new THREE.WebGLCubeRenderTarget(256, {
		format: THREE.RGBFormat,
		generateMipmaps: true,
		minFilter: THREE.LinearMipmapLinearFilter,
		encoding: THREE.sRGBEncoding,
	});

	material = new THREE.MeshBasicMaterial({
		envMap: cubeRenderTarget2.texture,
		combine: THREE.MultiplyOperation,
		reflectivity: 1,
	});

	document.addEventListener("pointerdown", onPointerDown, false);
	document.addEventListener("wheel", onDocumentMouseWheel, false);

	window.addEventListener("resize", onWindowResized, false);
}

function onWindowResized() {
	renderer.setSize(window.innerWidth, window.innerHeight);

	camera.aspect = window.innerWidth / window.innerHeight;
	camera.updateProjectionMatrix();
}

function onPointerDown(event) {
	event.preventDefault();

	onPointerDownPointerX = event.clientX;
	onPointerDownPointerY = event.clientY;

	onPointerDownLon = lon;
	onPointerDownLat = lat;

	document.addEventListener("pointermove", onPointerMove, false);
	document.addEventListener("pointerup", onPointerUp, false);
}

function onPointerMove(event) {
	lon = (event.clientX - onPointerDownPointerX) * 0.1 + onPointerDownLon;
	lat = (event.clientY - onPointerDownPointerY) * 0.1 + onPointerDownLat;
}

function onPointerUp() {
	document.removeEventListener("pointermove", onPointerMove, false);
	document.removeEventListener("pointerup", onPointerUp, false);
}

function onDocumentMouseWheel(event) {
	const fov = camera.fov + event.deltaY * 0.05;

	camera.fov = THREE.MathUtils.clamp(fov, 10, 75);

	camera.updateProjectionMatrix();
}

function animate() {
	requestAnimationFrame(animate);
	render();
}

function render() {
	lat = Math.max(-85, Math.min(85, lat));
	phi = THREE.MathUtils.degToRad(90 - lat);
	theta = THREE.MathUtils.degToRad(lon);

	camera.position.x = 100 * Math.sin(phi) * Math.cos(theta);
	camera.position.y = 100 * Math.cos(-1 * phi);
	camera.position.z = 100 * Math.sin(phi) * Math.sin(theta);

	camera.lookAt(scene.position);
	renderer.render(scene, camera);
}
