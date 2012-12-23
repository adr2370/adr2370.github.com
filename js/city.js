function makeCity(numbers) {
	var buildingArray,buildingSpace,currX,currZ;
	initializeCity();
	return buildingArray;
	function initializeCity() {
		buildingSpace=15;
		currX=0;
		currZ=0;
		buildingArray=new Array();
		for(var i=0;i<numbers.length;i++) {
			makeBuilding(currX,0,currZ,5,numbers[buildings.length],1);
			var step=buildingArray.length+1;
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
		buildingArray.push(object);
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
		buildingArray.push(object);
	}
}