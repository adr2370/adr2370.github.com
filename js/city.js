function makeCity(numbers) {
	var clock,buildings,renderer,scene,camera,lights,controls;
	var buildingSpace=15;
	init();
	var currX=0;
	var currZ=0;
	for(var i=0;i<numbers.length;i++) {
		if(i==0) {
			makeCoolBuilding(currX,0,currZ,5,numbers[buildings.length],1);
		} else {
			makeBuilding(currX,0,currZ,5,numbers[buildings.length],1);
		}
		var step=buildings.length+1;
		var s=Math.floor(Math.sqrt(step));
		if(s%2==0) s--;
		var diff=step-s*s;
		if(diff<=1) {
			currZ+=15;
		} else if(diff<=s+1) {
			currX+=buildingSpace;
		} else if(diff<=s*2+2) {
			currZ-=buildingSpace;
		} else if(diff<=s*3+3) {
			currX-=buildingSpace;
		} else {
			currZ+=buildingSpace;
		}
	}
	animate();
	var ray = new THREE.Ray(camera.position,null);
	document.addEventListener( 'mousedown', onDocumentMouseDown, false );
	function onDocumentMouseDown( event ) {
		if(event.button==2) {
			event.preventDefault();
			ray.direction=mouse3D.subSelf(camera.position).normalize();
			var intersects=ray.intersectScene(scene);
			console.log(intersects);
			if ( intersects.length > 0 ) {
			}
		}
	}
	return buildings;
	function init() {
		clock = new THREE.Clock(true);
		buildings=new Array();
		renderer = new THREE.WebGLRenderer();
		scene = new THREE.Scene();
		camera = new THREE.PerspectiveCamera(35,800/600,0.1,10000);
		lights=new Array();
		controls = new THREE.FirstPersonControls( camera );
		renderer.setSize( window.innerWidth, window.innerHeight );
		document.body.appendChild( renderer.domElement );
		camera.position.set( -100, 20, 0 );
		camera.lookAt( scene.position );
		scene.add( camera );
		for(var i=0;i<6;i++) {
			lights.push(new THREE.PointLight( 0xFFFFFF ));
		}
		lights[0].position.set( 1000000, 0, 0 );
		lights[1].position.set( -1000000, 0, 0 );
		lights[2].position.set( 0, 1000000, 0 );
		lights[3].position.set( 0, -1000000, 0 );
		lights[4].position.set( 0, 0, 1000000 );
		lights[5].position.set( 0, 0, -1000000 );
		for(var i=0;i<6;i++) {
			scene.add( lights[i] );
		}
		controls.movementSpeed=50;
		controls.lookSpeed=0.05;
	}
	function animate() {
		requestAnimationFrame( animate );
		render();
	}
	function render() {
		controls.update( clock.getDelta() );
		renderer.render( scene, camera );
	}
	function makeBuilding(x,y,z,windows,floors,squareSize) {
		var buildingColor=Math.floor(Math.random()*0xEEEEEE);
		var currX=x;
		var currY=y;
		var currZ=z;
		var cube;
		var height=squareSize*(floors*3);
		var length=windows*2+1;
		var side=length*squareSize;
		var buildingGeometry = new THREE.CubeGeometry( 0, 0, 0 );
		var windowGeometry = new THREE.CubeGeometry( 0, 0, 0 );
		cube = new THREE.Mesh(
		                        new THREE.CubeGeometry( side, height, side ),
		                        new THREE.MeshLambertMaterial( { color: buildingColor } )
		                    );
		cube.position.x=currX+side/2;
		cube.position.y=currY+height/2;
		cube.position.z=currZ+side/2;
		var object=new THREE.Object3D();
		object.add(cube);
		buildings.push(object);
		scene.add(object);
		//console.log("building "+buildings.length+" made with height "+floors);
	}
	function makeCoolBuilding(x,y,z,windows,floors,squareSize) {
		var buildingColor=Math.floor(Math.random()*0xEEEEEE);
		var currX=x;
		var currY=y;
		var currZ=z;
		var cube;
		var height=squareSize*(floors*3);
		var length=windows*2+1;
		var side=length*squareSize;
		var buildingGeometry = new THREE.CubeGeometry( 0, 0, 0 );
		var windowGeometry = new THREE.CubeGeometry( 0, 0, 0 );
		for(currY=y;currY<=height+y;currY+=squareSize) {
			var currLevel=currY-y;
			currLevel/=squareSize;
			for(currX=x;currX<x+side;currX+=squareSize) {
				for(currZ=z;currZ<z+side;currZ+=squareSize) {
					if(currY==y||currY==height+y||currX==x||currX==x+side-squareSize||currZ==z||currZ==z+side-squareSize) {
						var color1=buildingColor;
						var shouldChange=false;
						if((currX==x||currX==x+side-squareSize)&&((currZ-z)/squareSize)%2==1) shouldChange=true;
						if((currZ==z||currZ==z+side-squareSize)&&((currX-x)/squareSize)%2==1) shouldChange=true;
						if(shouldChange&&(currLevel%3==1||currLevel%3==2)) {
							color1=0x000000;
						}	
						cube = new THREE.Mesh(
						                        new THREE.CubeGeometry( squareSize, squareSize, squareSize ),
						                        new THREE.MeshLambertMaterial( { color: color1 } )
						                    );
						cube.position.x=currX;
						cube.position.y=currY;
						cube.position.z=currZ;
						if(color1==0x000000) {
							THREE.GeometryUtils.merge(windowGeometry, cube);
						} else {
							THREE.GeometryUtils.merge(buildingGeometry, cube);
						}
					}
				}
			}
		}
		for(currY=height+y;currY<height+y+side;currY+=squareSize) {
			var diff=(currY-height-y)/2;
			for(currX=x+diff;currX<x+side-diff;currX+=squareSize) {
				for(currZ=z+diff;currZ<z+side-diff;currZ+=squareSize) {
					var color1=buildingColor;
					cube = new THREE.Mesh(
					                        new THREE.CubeGeometry( squareSize, squareSize, squareSize ),
					                        new THREE.MeshLambertMaterial( { color: color1 } )
					                    );
					cube.position.x=currX;
					cube.position.y=currY;
					cube.position.z=currZ;
					if(color1==0x000000) {
						THREE.GeometryUtils.merge(windowGeometry, cube);
					} else {
						THREE.GeometryUtils.merge(buildingGeometry, cube);
					}
				}
			}
		}
		var object=new THREE.Object3D();
		object.add(new THREE.Mesh( buildingGeometry, new THREE.MeshLambertMaterial( { color: buildingColor } ) ));
		object.add(new THREE.Mesh( windowGeometry, new THREE.MeshLambertMaterial( { color: 0x000000 } ) ));
		buildings.push(object);
		scene.add(object);
		//console.log("building "+buildings.length+" made with height "+floors);
	}
}