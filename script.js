    import * as THREE from 'https://cdn.skypack.dev/three@0.140.2';
    // import * as THREE from'https://unpkg.com/three@0.126.1/build/three.module.js';
    import { OrbitControls } from 'https://unpkg.com/three@0.126.1/examples/jsm/controls/OrbitControls.js';
    import { FBXLoader } from 'https://unpkg.com/three@0.126.1/examples/jsm/loaders/FBXLoader.js';


    //ロボットの色の設定
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


    let camera, scene, renderer, player;
    const boxSideLength = 0.5;
    let speed = 0.08;

    const enemy = null;

    const geometry = new THREE.BoxGeometry(
        boxSideLength,
        boxSideLength,
        boxSideLength
        );

    const courseLength = 150;
    const gridHelperSize = courseLength * 2;

    //x 軸と y 軸でロボットの動きを制限する
    const xBoundary = 4 - (boxSideLength / 2);
    const yBoundary = xBoundary / 4;

    //衝突を検知するための変数
    let gameOver = false;
    const numOfObstacles = 100;
    var obstaclesBoundingBoxes = [];

    //ゲーム開始時に動作するようにボタンを制御する
    const playBtnScreen = document.getElementById("play-btn-screen");
    const playBtn = playBtnScreen.querySelector("#play-btn");
    var allObjs = [];

    //ボタンでロボットが制御できるように変更する
    const keyBtns = document.querySelectorAll(".keys-container button");

    init();

    function init() {
        scene = new THREE.Scene();
        camera = new THREE.PerspectiveCamera(
        70,
        window.innerWidth / window.innerHeight,
        0.1,
        200
        );

        camera.position.set(-2, 1, -4);
        camera.lookAt(0, 0, 2);

        player = new THREE.Mesh();

        const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
        directionalLight.position.set(10, 20, 0);
        scene.add(ambientLight, directionalLight);

        initializeBoxes();
            
        //x-y平面を作成
        const gridHelper = new THREE.GridHelper(gridHelperSize, gridHelperSize,0xffffff,0xffffff);
        scene.add(gridHelper);

        renderer = new THREE.WebGLRenderer({ antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setClearColor(0x6496ED); /* 背景色の設定 */ 
        renderer.render(scene, camera);
        //animate()はクリック時に呼ぶためここではコメントアウトして削除する
        //   animate();
        document.body.appendChild(renderer.domElement);
    }


        //障害物の設定
        function createBox(x, y, z, color,geometry) {
            
            const material = new THREE.MeshLambertMaterial({ color: color });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(x, y, z);
            allObjs.push(mesh);
            scene.add(mesh);

            return {
                mesh,
            };
        }


        //障害物を生成する関数
        function createObstacle() {
            //ランダムなx,y,z座標を計算
            const x = THREE.MathUtils.randFloatSpread(xBoundary * 2);
            const y = THREE.MathUtils.randInt (0,yBoundary * 2 );
            const z = THREE.MathUtils.randFloat(10, courseLength - boxSideLength);
            if(y <= 0){
                // y = 0;
                console.log(y);
            }

            const fbxLoader = new FBXLoader()
            fbxLoader.load(
                'bird.fbx',
                (object) => {
                    enemy = object;
                },
                (xhr) => {
                console.log((xhr.loaded / xhr.total) * 100 + '% loaded')
            },
                (error) => {
                    console.log(error)
                }
            )
            
            const obstacle = createBox(x, y, z, 0x6B8E23,geometry);
            const boundingBox = new THREE.Box3().setFromObject(obstacle.mesh);
            obstaclesBoundingBoxes.push(boundingBox);
        }


        function detectCollisions() {
            const playerBox = new THREE.Box3().setFromObject(player.mesh);
            // Check each object to detect if there is a collision
            for (let i = 0; i < numOfObstacles + 1; i++) {
            // an object was hit
                if (obstaclesBoundingBoxes[i].intersectsBox(playerBox)) {
                    gameOver = true;
                    //ゲーム終了時にプレイボタンが表示されるようにする
                    playBtnScreen.style.visibility = "visible";
                    playBtn.focus();
                    if (i !== numOfObstacles) {
                    alert("ゲームオーバー");
                    } else {
                    // 最後の緑の障害物に衝突した時
                    alert("ゲームクリア");
                    }
                    return;
                }
            }

        
        }


        function initializeBoxes() {

            
            // make empty at start of a game
            allObjs = [];
            obstaclesBoundingBoxes = [];
            
            const playerGeometry = new THREE.BoxGeometry(
                0.5,
                1,
                0.5
                );
            
            player = createBox(0, 0, 0,0xffffff,playerGeometry);
            // player = createBox(0,0,0,0xffffff);
            
            for (let i = 0; i < numOfObstacles; i++) {
                createObstacle();
            }

            // create finish line box
            const geometry = new THREE.BoxGeometry(
            xBoundary * 2,
            yBoundary * 2,
            boxSideLength
            );
            const material = new THREE.MeshLambertMaterial({ color: "green" });
            const mesh = new THREE.Mesh(geometry, material);
            mesh.position.set(0, 0, courseLength);
            allObjs.push(mesh);
            scene.add(mesh);
            
            //実際には見えないボックスを作成(Box3)
            const boundingBox = new THREE.Box3().setFromObject(mesh);
            //配列に作成したboundingBoxをpushする
            obstaclesBoundingBoxes.push(boundingBox);
        }
        

        function animate() {
            if (gameOver) return;
            player.mesh.position.z += speed;
            camera.position.z += speed;

            detectCollisions();

            renderer.render(scene, camera);
            requestAnimationFrame(animate);
            
        }


        var currentPosition = 0;
        window.addEventListener("keydown", (e) => {
            const key = e.key;
            const currXPos = player.mesh.position.x;
            const currYPos = player.mesh.position.y;
            if (key === "ArrowLeft") {
                //ゴールの大きさ以上にできないように制限をかける
                if (currXPos > xBoundary) return;
                    player.mesh.position.x += speed;
            }
            if (key === "ArrowRight") {
                if (currXPos < -xBoundary) return;
                    player.mesh.position.x -= speed;
            }
            if (key === "ArrowDown") {
            //y<=0以上は移動できないようにする
                if (currYPos <= 0) return;
                player.mesh.position.y -= speed;
            }
            if (key === "Enter") {
                Jump();
                currentPosition = 0;
            }
        });

        playBtn.addEventListener("click", () => {
            allObjs.forEach((obj) => scene.remove(obj));
            camera.position.set(-2, 1, -4);
            camera.lookAt(0, 0, 2);
            initializeBoxes();
            gameOver = false;
            animate();
            playBtnScreen.style.visibility = "hidden";
        });

        let timeoutID = 0;
    
        //キーボタンによるロボットの制御
    function moveLeft() {
        const currXPos = player.mesh.position.x;
        if (currXPos > xBoundary) return;
        player.mesh.position.x += speed;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(moveLeft, 50);
    }

    function moveRight() {
        const currXPos = player.mesh.position.x;
        if (currXPos < -xBoundary) return;
        player.mesh.position.x -= speed;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(moveRight, 50);
    }

    // function moveUp() {
    //     const currYPos = player.mesh.position.y;
    //     if (currYPos > yBoundary) return;
    //     player.mesh.position.y += speed;
    //     clearTimeout(timeoutID);
    //     timeoutID = setTimeout(moveUp, 50);
    // }

    function moveDown() {
        const currYPos = player.mesh.position.y;
        if (currYPos <= 0) return;
        player.mesh.position.y -= speed;
        clearTimeout(timeoutID);
        timeoutID = setTimeout(moveDown, 50);
    }

    function Jump() {
        //ジャンプできるようにする
        if(currentPosition < Math.PI / 2){
            let requestId = requestAnimationFrame(Jump);
            currentPosition += 0.02; 
            player.mesh.position.y = Math.sin(2 * currentPosition) * 2;
            render();
        }
    }


    function handleKeyDown(e) {
        if (gameOver) return;
        const { id } = e.currentTarget;

        if (id === "left") {
            moveLeft();
        }
        if (id === "right") {
            moveRight();
        }
        
    }

    // moving box - mobile - using screen btns
    keyBtns.forEach((keyBtn) => {
    keyBtn.addEventListener("mousedown", handleKeyDown);
    keyBtn.addEventListener("touchstart", handleKeyDown);
    keyBtn.addEventListener("mouseup", () => {
        clearTimeout(timeoutID);
        timeoutID = 0;
    });

    keyBtn.addEventListener("mouseleave", () => {
        clearTimeout(timeoutID);
        timeoutID = 0;
    });
    keyBtn.addEventListener("touchend", () => {
        clearTimeout(timeoutID);
        timeoutID = 0;
    });
    keyBtn.addEventListener("touchcancel", () => {
        clearTimeout(timeoutID);
        timeoutID = 0;
    });
    });