//透視投影
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
    const camera = new THREE.PerspectiveCamera( 45, 1, 1, 1000 );
    camera.position.set(0, 20, -40); 
    camera.lookAt(new THREE.Vector3(0,0,0));


    //boxを作成
    const boxGeometry = new THREE.BoxGeometry(10,10,10);
    const boxMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xffffff
    }); 
    const box = new THREE.Mesh(boxGeometry, boxMaterial); 

    scene.add(box); 


    const planeGeometry = new THREE.PlaneGeometry(50,50);
    const planeMaterial = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa
    }); 
    const plane = new THREE.Mesh(planeGeometry,planeMaterial);
    plane.position.set(0,-5,0);
    plane.rotateX(-Math.PI/2,0,0);

    scene.add(plane);

    //変更箇所
    box.rotateY(7 * Math.PI/18);
    box.position.x += 10


    //光源設定
    const spotLight = new THREE.SpotLight(0xffffff,1,100,30);
    spotLight.position.set( 0, 20, 0 );
    scene.add( spotLight );

    
    const light = new THREE.AmbientLight( 0x404040 , 0.5); // soft white light
    scene.add( light );

    // 平行光源 
    const directionalLight = new THREE.DirectionalLight(0xffffff,1); 
    directionalLight.position.set(1, 1, 1); 
    
    // シーンに追加 
    scene.add(directionalLight);
 
    // 初回実行 
    renderer.render(scene, camera); 

} 