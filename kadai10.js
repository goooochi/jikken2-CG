window.addEventListener("DOMContentLoaded", init); 

function init() { 
    const width = 500; 
    const height = 500;
   
    // レンダラーを作成 
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector("#myCanvas") 
    }); 
    renderer.setSize(width, height); /* ウィンドウサイズの設定 */ 
    renderer.setClearColor(0x000000); /* 背景色の設定 */ 

    // シーンを作成 
    const scene = new THREE.Scene(); 

    // カメラを作成 
    const camera = new THREE.PerspectiveCamera(45, width / height); 
    camera.position.set(0, 0, -70); 
    camera.lookAt(new THREE.Vector3(0,0,0));

    const bodyMat = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa
    });
    const highlight = new THREE.MeshStandardMaterial({ 
        color: 0x4444ff
    }); 


    

    const head = new THREE.Mesh(new THREE.BoxGeometry(20,16,16),bodyMat);

    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(1.5,16,12),highlight);
    eye1.position.set(5,3,-8);

    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(1.5,16,12),highlight);
    eye2.position.set(-5,3,-8);

    const mouse = new THREE.Mesh(new THREE.CylinderGeometry(2,2,1,3),highlight);
    mouse.position.set(0,-3,-8);
    mouse.rotation.set(Math.PI/2,Math.PI,0);

    //耳を追加し、head,eye1,eye2,mouse,ear_1,ear_2をグループとしてまとめる
    const ear_1 = new THREE.Mesh( new THREE.ConeGeometry(3, 10, 42),highlight);
    ear_1.position.set(-15,0,-8);
    ear_1.rotation.set(0,0,Math.PI / 2);

    const ear_2 = new THREE.Mesh( new THREE.ConeGeometry(3, 10, 42),highlight);
    ear_2.position.set(15,0,-8);
    ear_2.rotation.set(0,0,- Math.PI / 2);

    const group = new THREE.Group();
    group.add(head,eye1,eye2,mouse,ear_1,ear_2);

    scene.add(group);
    
    //光源設定

    // 平行光源 
    const directionalLight = new THREE.DirectionalLight(0xffffff,1); 
    directionalLight.position.set(0, 0, 1); 
    // シーンに追加 
    scene.add(directionalLight);
 
    const ambientLight = new THREE.AmbientLight(0xffffff,0.8);
    scene.add(ambientLight);

    // 初回実行 
    let render = function () { renderer.render(scene, camera); };
    render();
} 