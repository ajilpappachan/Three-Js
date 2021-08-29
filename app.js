import * as THREE from "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.module.js";
import { OrbitControls } from "https://cdn.jsdelivr.net/npm/@workswithweb/threejs-orbit-controls@0.0.3/dist/orbit-controls.esm.js";

class App {
	constructor() {
		const container = document.createElement("div");
		document.body.appendChild(container);

		this.camera = new THREE.PerspectiveCamera(
			60,
			window.innerWidth / window.innerHeight,
			0.1,
			1000
		);
		this.camera.position.set(0, 0, 4);

		this.scene = new THREE.Scene();
		this.scene.background = new THREE.Color(0xaaaaaa);

		const ambient = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 0.3);
		this.scene.add(ambient);

		const light = new THREE.DirectionalLight();
		light.position.set(2, 1, 1);
		this.scene.add(light);

		this.renderer = new THREE.WebGLRenderer({ antialias: true });
		this.renderer.setPixelRatio(window.devicePixelRatio);
		this.renderer.setSize(window.innerWidth, window.innerHeight);
		container.appendChild(this.renderer.domElement);

		this.renderer.setAnimationLoop(this.render.bind(this));

		const skyGeometry = new THREE.SphereGeometry(500, 60, 40);
		// invert the geometry on the x-axis so that all of the faces point inward
		skyGeometry.scale(-1, 1, 1);

		const skyTexture = new THREE.TextureLoader().load("https://res.cloudinary.com/ajilp/image/upload/v1630238094/Three%20Js/image_ergcna.jpg");
		const skyMaterial = new THREE.MeshBasicMaterial({ map: skyTexture });

		const skybox = new THREE.Mesh(skyGeometry, skyMaterial);

		this.scene.add(skybox);

		const particleGeometry = new THREE.BufferGeometry();
		const particleVerices = [];

		const textureLoader = new THREE.TextureLoader();

		const sprite1 = textureLoader.load("https://res.cloudinary.com/ajilp/image/upload/v1630238092/Three%20Js/snowflake2_nyi7ip.png");
		const sprite2 = textureLoader.load("https://res.cloudinary.com/ajilp/image/upload/v1630238092/Three%20Js/snowflake5_izf3lz.png");
		const sprite3 = textureLoader.load("https://res.cloudinary.com/ajilp/image/upload/v1630238092/Three%20Js/snowflake1_jzvbk4.png");
		const sprite4 = textureLoader.load("https://res.cloudinary.com/ajilp/image/upload/v1630238092/Three%20Js/snowflake3_s7zrzx.png");
		const sprite5 = textureLoader.load("https://res.cloudinary.com/ajilp/image/upload/v1630238092/Three%20Js/snowflake4_egus3p.png");

		for (let i = 0; i < 10000; i++) {
			const x = Math.random() * 2000 - 1000;
			const y = Math.random() * 2000 - 1000;
			const z = Math.random() * 2000 - 1000;

			particleVerices.push(x, y, z);
		}

		particleGeometry.setAttribute(
			"position",
			new THREE.Float32BufferAttribute(particleVerices, 3)
		);

		this.materials = [];
		this.parameters = [
			[[1.0, 0.2, 0.5], sprite2, 20],
			[[0.95, 0.1, 0.5], sprite3, 15],
			[[0.9, 0.05, 0.5], sprite1, 10],
			[[0.85, 0, 0.5], sprite5, 8],
			[[0.8, 0, 0.5], sprite4, 5],
		];

		for (let i = 0; i < this.parameters.length; i++) {
			const color = this.parameters[i][0];
			const sprite = this.parameters[i][1];
			const size = this.parameters[i][2];

			this.materials[i] = new THREE.PointsMaterial({
				size: size,
				map: sprite,
				blending: THREE.AdditiveBlending,
				depthTest: false,
				transparent: true,
			});
			this.materials[i].color.setHSL(color[0], color[1], color[2]);

			const particles = new THREE.Points(particleGeometry, this.materials[i]);

			particles.rotation.x = Math.random() * 6;
			particles.rotation.y = Math.random() * 6;
			particles.rotation.z = Math.random() * 6;

			this.scene.add(particles);
		}

		const controls = new OrbitControls(this.camera, this.renderer.domElement);

		window.addEventListener("resize", this.resize.bind(this));
	}

	resize() {
		this.camera.aspect = window.innerWidth / window.innerHeight;
		this.camera.updateProjectionMatrix();
		this.renderer.setSize(window.innerWidth, window.innerHeight);
	}

	render() {
		this.renderer.render(this.scene, this.camera);

		const time = Date.now() * 0.00005;

		for (let i = 0; i < this.scene.children.length; i++) {
			const object = this.scene.children[i];

			if (object instanceof THREE.Points) {
				object.rotation.y = time * (i < 4 ? i + 1 : -(i + 1));
			}
		}

		for (let i = 0; i < this.materials.length; i++) {
			const color = this.parameters[i][0];

			const h = ((360 * (color[0] + time)) % 360) / 360;
			this.materials[i].color.setHSL(h, color[1], color[2]);
		}
	}
}

export { App };
