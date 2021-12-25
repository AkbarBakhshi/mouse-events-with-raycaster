import * as THREE from 'three'
import gsap from 'gsap'

// import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js'

export default class {
    constructor() {
        this.threejsCanvas = document.querySelector('.threejs__canvas__container')
        this.width = this.threejsCanvas.offsetWidth
        this.height = this.threejsCanvas.offsetHeight

        this.scene = new THREE.Scene()
        this.camera = new THREE.PerspectiveCamera(75, this.width / this.height, 0.1, 1000)
        this.camera.position.set(0, 0, 4)
        this.camera.lookAt(0, 0, 0)

        this.renderer = new THREE.WebGLRenderer({
            antialias: true,
            alpha: true,
        })
        // this.renderer.setClearAlpha(0)
        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
        this.threejsCanvas.appendChild(this.renderer.domElement)

        this.texture1 = new THREE.TextureLoader().load('textures/city.jpeg');
        this.texture2 = new THREE.TextureLoader().load('textures/tw.jpeg');

        this.geometry = new THREE.BoxGeometry(1, 1, 1)

        this.material1 = new THREE.MeshBasicMaterial({
            map: this.texture1,
            // transparent: true,
            side: THREE.DoubleSide,
        })

        this.material2 = new THREE.MeshBasicMaterial({
            map: this.texture2,
            transparent: true,
            side: THREE.DoubleSide
        })


        this.cube = new THREE.Mesh(this.geometry, [this.material1, this.material2, this.material1, this.material2, this.material1, this.material2])
        this.cube.position.set(2, 2, 2)

        // this.scene.add(this.cube)

        const earthGeometry = new THREE.SphereBufferGeometry(1, 50, 50)
        const earthMaterial = new THREE.MeshBasicMaterial({
            map: this.texture1,
            side: THREE.DoubleSide
        })

        this.earth = new THREE.Mesh(earthGeometry, earthMaterial)

        // this.scene.add(this.earth)

        const planeGeometry = new THREE.PlaneBufferGeometry(3, 3)
        const planeMaterial = new THREE.MeshBasicMaterial({
            map: this.texture1,
            side: THREE.DoubleSide,
        })

        this.plane = new THREE.Mesh(planeGeometry, planeMaterial)

        this.scene.add(this.plane)


        const axesHelper = new THREE.AxesHelper(5)
        // this.scene.add(axesHelper)

        this.raycaster = new THREE.Raycaster()

        this.mouse = new THREE.Vector2()

        // this.controls = new OrbitControls(this.camera, this.renderer.domElement)
        // this.controls.enableDamping = true

    }

    onMouseDown(event) {

        this.mouse.x = (event.clientX / this.width) * 2 - 1
        this.mouse.y = - (event.clientY / this.height) * 2 + 1

        this.raycaster.setFromCamera(this.mouse, this.camera)

        const objects = [this.plane]
        this.intersects = this.raycaster.intersectObjects(objects)

        if (this.intersects.length > 0) {
            console.log('clicked on object')
            gsap.timeline()
                .to('.threejs__canvas__container', { scale: 0, duration: 2 })
                .to('.threejs', { x: '100%', duration: 2 }, 0)
        }
    }

    onMouseUp(event) {
        if (this.intersects.length > 0) {
            console.log('released')
            gsap.timeline()
                .to('.threejs__canvas__container', { scale: 2, duration: 3 })
                .to('.threejs', { x: 0, duration: 3 }, 0)
        }
    }

    update() {
        // console.log('three update')
        this.renderer.render(this.scene, this.camera)
        // this.controls.update()
        // this.cube.rotation.x += 0.01;
        // this.cube.rotation.y += 0.01;
    }


    onResize() {
        this.width = this.threejsCanvas.offsetWidth
        this.height = this.threejsCanvas.offsetHeight
        // console.log('resize', this.height)


        this.renderer.setSize(this.width, this.height)
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

        this.camera.aspect = this.width / this.height
        this.camera.updateProjectionMatrix()

    }



    /**
     * Destroy.
     */
    destroy() {
        this.destroyThreejs(this.scene)
    }

    destroyThreejs(obj) {
        while (obj.children.length > 0) {
            this.destroyThreejs(obj.children[0]);
            obj.remove(obj.children[0]);
        }
        if (obj.geometry) obj.geometry.dispose();

        if (obj.material) {
            //in case of map, bumpMap, normalMap, envMap ...
            Object.keys(obj.material).forEach(prop => {
                if (!obj.material[prop])
                    return;
                if (obj.material[prop] !== null && typeof obj.material[prop].dispose === 'function')
                    obj.material[prop].dispose();
            })
            // obj.material.dispose();
        }
    }
}