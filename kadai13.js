window.addEventListener("DOMContentLoaded", init); 

function init() { 
    const width = 500; 
    const height = 500;

    // レンダラーを作成 
    const renderer = new THREE.WebGLRenderer({ 
        canvas: document.querySelector("#myCanvas") 
    }); 
    renderer.setSize(width, height); /* ウィンドウサイズの設定 */ 
    // renderer.setSize( window.innerWidth, window.innerHeight );
// キャンバスをDOMツリーに追加
    renderer.setClearColor(0x000000); /* 背景色の設定 */ 

    // シーンを作成 
    const scene = new THREE.Scene(); 

    // カメラを作成 
    const camera = new THREE.PerspectiveCamera(45, width / height); 
    camera.position.set(0, 100,0); 
    camera.lookAt(new THREE.Vector3(0,0,0));
    

    const bodyMat = new THREE.MeshStandardMaterial({ 
        color: 0xaaaaaa
    });
    const highlight = new THREE.MeshStandardMaterial({ 
        color: 0x4444ff
    }); 
    const leftleg_All_light = new THREE.MeshStandardMaterial({
        //赤 
        color: 0xff0000
    }); 
    const rightleg_All_light = new THREE.MeshStandardMaterial({ 
        //赤 
        color: 0xff0000
    }); 
    const body_All_light = new THREE.MeshStandardMaterial({ 
        //緑
        color: 0x00ff00
    }); 


    

    const head = new THREE.Mesh(new THREE.BoxGeometry(20,16,16),bodyMat);
    head.position.set(0,17,0);

    const eye1 = new THREE.Mesh(new THREE.SphereGeometry(1.5,16,12),highlight);
    eye1.position.set(5,20,10);

    const eye2 = new THREE.Mesh(new THREE.SphereGeometry(1.5,16,12),highlight);
    eye2.position.set(-5,20,10);

    const mouse = new THREE.Mesh(new THREE.CylinderGeometry(2,2,1,3),highlight);
    mouse.position.set(0,14,9);
    mouse.rotation.set(Math.PI/2,Math.PI,0);


    const ear_1 = new THREE.Mesh( new THREE.ConeGeometry(3, 10, 42),highlight);
    ear_1.position.set(-15,17,0);
    ear_1.rotation.set(0,0,Math.PI / 2);

    const ear_2 = new THREE.Mesh( new THREE.ConeGeometry(3, 10, 42),highlight);
    ear_2.position.set(15,17,0);
    ear_2.rotation.set(0,0,- Math.PI / 2);

    const head_All = new THREE.Group();
    head_All.add(head,eye1,eye2,mouse,ear_1,ear_2);
    scene.add(head_All);


    const body = new THREE.Mesh(new THREE.BoxGeometry(20,17,16),body_All_light);
    body.position.set(0,0,0);

    const body_All = new THREE.Group();
    body_All.add(body);
    scene.add(body_All);




    const leftarm = new THREE.Mesh(new THREE.BoxGeometry(2,2,16),bodyMat);
    leftarm.rotation.set(Math.PI / 2,Math.PI / 6, 0);
    leftarm.position.set(15,0,0);
    const leftHand = new THREE.Mesh(new THREE.SphereGeometry(2,16,12),highlight);
    leftHand.position.set(19.7,-8,0);

    const leftarm_All = new THREE.Group();
    leftarm_All.add(leftarm,leftHand);
    scene.add(leftarm_All);



    const rightarm = new THREE.Mesh(new THREE.BoxGeometry(2,2,16),bodyMat);
    rightarm.rotation.set(Math.PI / 2, -Math.PI / 6, 0);
    rightarm.position.set(-15,0,0);
    const rightHand = new THREE.Mesh(new THREE.SphereGeometry(2,16,12),highlight);
    rightHand.position.set(-19.7,-8,0);

    const rightarm_All = new THREE.Group();
    rightarm_All.add(rightarm,rightHand);
    scene.add(rightarm_All);



    const leftleg = new THREE.Mesh(new THREE.BoxGeometry(3,3,16),bodyMat);
    leftleg.rotation.set(Math.PI / 2, 0, 0);
    leftleg.position.set(4,-15,0);


    const leftfoot = new THREE.Mesh(new THREE.BoxGeometry(3.5,4,1),leftleg_All_light);
    leftfoot.rotation.set(Math.PI / 2, 0, 0);
    leftfoot.position.set(4.2,-24,0);


    const leftleg_All = new THREE.Group();
    leftleg_All.add(leftleg,leftfoot);
    scene.add(leftleg_All);

    

    const rightleg = new THREE.Mesh(new THREE.BoxGeometry(3,3,16),bodyMat);
    rightleg.rotation.set(Math.PI / 2, 0, 0);
    rightleg.position.set(-4,-15,0);

    const rightfoot = new THREE.Mesh(new THREE.BoxGeometry(3.5,4,1),rightleg_All_light);
    rightfoot.rotation.set(Math.PI / 2, 0, 0);
    rightfoot.position.set(-4.2,-24,0);
    const rightleg_All = new THREE.Group();
    rightleg_All.add(rightleg,rightfoot);
    scene.add(rightleg_All);


    const Robot = new THREE.Group();
    Robot.add(head_All,body_All, rightarm_All,leftarm_All,rightleg_All,leftleg_All);
    scene.add(Robot);



    
    var canvas = document.querySelector("#myCanvas");
    var verticalLine_0 = (canvas.width)/3
    var verticalLine_1 = (canvas.width * 2)/3
    
    var horizontalLine_0 = (canvas.height)/3
    var horizontalLine_1 = (canvas.height * 2)/3

    var movePositiveX;
    var moveNegativeX;

    var movePositiveZ;
    var moveNegativeZ;

    //Jump周辺
    var jump;
    var initPosition = Robot.position.y;
    var currentPosition = 0;


    document.addEventListener('mousedown', onDocumentMouseDown, false);
    function onDocumentMouseDown(event_m) {
        switch (event_m.button) {
            // 左クリック
            case 0:
                const element = event_m.currentTarget;
                //canvas上のマウスのXY座標
                const x = event_m.clientX;
                const y = event_m.clientY;
                currentPosition = initPosition;
                
                if(horizontalLine_0 > x){
                    movePositiveX = false;
                    moveNegativeX = true;
                    movePositiveZ = false;
                    moveNegativeZ = false;
                }

                if(horizontalLine_1 < x){
                    movePositiveX = true;
                    moveNegativeX = false;
                    movePositiveZ = false;
                    moveNegativeZ = false;
                }

                if(verticalLine_0 > y){
                    movePositiveX = false;
                    moveNegativeX = false;
                    movePositiveZ = false;
                    moveNegativeZ = true; 
                }

                if(verticalLine_1 < y){
                    movePositiveX = false;
                    moveNegativeX = false;
                    movePositiveZ = true;
                    moveNegativeZ = false;
                }
                
                animate();
                
                break;
            // ホイール
            case 1: break;
            // 右クリック

            case 2:
                
                break;
        }
    }

    
    //canvasを４分割する
    function animate() {
        let requestId = requestAnimationFrame(animate);
        var deltaX = 0.1;
        if(moveNegativeX){
            Robot.position.x -= 0.1;
        }

        if(movePositiveX){
            // let requestId = requestAnimationFrame(animate);
            Robot.position.x += 0.1;
            // render();
        }

        if(moveNegativeZ){
            // let requestId = requestAnimationFrame(animate);
            Robot.position.z -= 0.1;
            // render();
        }

        if(movePositiveZ){
            // let requestId = requestAnimationFrame(animate);
            Robot.position.z += 0.1;
        }

        render();
        // if(jump){
        //     //ジャンプできるようにする
        //     if(currentPosition < Math.PI){
        //         let requestId = requestAnimationFrame(animate);
        //         currentPosition += 0.02; 
        //         Robot.position.y = Math.sin(currentPosition) * 10;
        //         //以下のON/OFFで追従するかを切り替える
        //         // camera.lookAt(Robot.position);
        //         render();
        //     }
        // }
    }

    function ResetBoolean(){
        movePositiveX = false;
        moveNegativeX = false;
        movePositiveZ = false;
        moveNegativeZ = false;
    }
    

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