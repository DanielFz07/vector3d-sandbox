import * as THREE from 'three'
import {camera, renderer, scene} from './scene'
import { getPrimarySelect, getSecundarySelect, setPrimarySelect, setSecundarySelect } from './entry';

let selectVector = (e: Event) =>
{
	let mousePointer = new THREE.Vector2();

	mousePointer.x = (e.clientX / window.innerWidth) * 2 - 1;
	mousePointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
	
	let raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mousePointer, camera);

	let intersections = raycaster.intersectObjects(scene.children);

	//Add outline on intersections

	if(intersections.length > 0)
	{
		for(let i = 0; i < intersections.length; i ++)
		{
			if(intersections[ i ].object.userData.type)
			{
				if(getPrimarySelect() == intersections[ i ].object)
				{
					return 1;	
				}
				else if(getSecundarySelect() == intersections[ i ].object)
				{
					const secundary = getSecundarySelect();
					setSecundarySelect(getPrimarySelect());
					setPrimarySelect(secundary);	

					getPrimarySelect().userData.box.material.color.setHex(0xff0000);
					getPrimarySelect().userData.box.update();
					getSecundarySelect().userData.box.material.color.setHex(0xffff00);
					getSecundarySelect().userData.box.update();

					return 1;
				}
				let color;
				if(getPrimarySelect() == undefined) 
				{
					color = 0xff0000;
					setPrimarySelect(intersections[ i ].object);
				}
				else if(getSecundarySelect() == undefined) 
				{
					color = 0xffff00;
					setSecundarySelect(intersections[ i ].object);
				}
				else if(getSecundarySelect() != undefined)
				{
					scene.remove(getSecundarySelect().userData.box);
					color = 0xffff00;
					setSecundarySelect(intersections[ i ].object);
				}

				intersections[ i ].object.userData.box = new THREE.BoxHelper( intersections[ i ].object, color );
				scene.add( intersections[ i ].object.userData.box );
				intersections[ i ].object.userData.box.matrixAutoUpdate = true;

				return 1;

			}
		}
	}
	return 0;
}	

document.addEventListener('click', selectVector);

export default selectVector



