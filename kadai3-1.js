window.addEventListener("DOMContentLoaded", init); 

function init() { 
    const width = 500; 
    const height = 500; 

    // レンダラーを作成 
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector("#myCanvas")
    }); 
    renderer.setSize(width, height); 
    renderer.setClearColor(new THREE.Color('red')); 

    // シーンを作成 
    const scene = new THREE.Scene(); 

    // カメラを作成 
    const camera = new THREE.PerspectiveCamera(45, width / height); 
    camera.position.set(0, 0, +50); 

    //ドーナッツを作成
    const geometry = new THREE.TorusGeometry( 10, 3, 16, 100 );
    const material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
    const box = new THREE.Mesh(geometry, material);
    scene.add(box);

    // 平行光源
    const directionalLight = new THREE.DirectionalLight(0xffffff);
    directionalLight.position.set(1, 1, 1);

    // シーンに追加
    scene.add(directionalLight);
    
    // 初回実行 
    renderer.render(scene, camera); 
} 