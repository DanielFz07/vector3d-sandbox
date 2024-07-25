import * as THREE from 'three';
import { scene, camera } from './scene'
import { CustomArrowBufferGeometry } from './customarrow';
import selectVector from './outline';
import { getPrimarySelect, getSecundarySelect, setPrimarySelect } from './entry';

document.getElementById("cmenu_form")?.addEventListener("submit", (e) =>
{
    e.preventDefault();

    const formData = new FormData(document.getElementById("cmenu_form") as HTMLFormElement);

    const values = {
        o_x: Number(formData.get("o_xvalue")),
        o_y: Number(formData.get("o_yvalue")),
        o_z: Number(formData.get("o_zvalue")),
        d_x: Number(formData.get("d_xvalue")),
        d_y: Number(formData.get("d_yvalue")),
        d_z: Number(formData.get("d_zvalue")),
        //length: Number(formData.get("v_module"))
    }

    const dir = new THREE.Vector3(values.d_x,values.d_y,values.d_z);
    const origin = new THREE.Vector3(values.o_x,values.o_y,values.o_z);
    //const length = values.length;

    let sub = new THREE.Vector3;
    sub.subVectors(dir, origin);

    const optionalParams = {
    coneLength: 0.2,
    coneRadius: 0.1,
    cylLineRadius: 0.1,
    }

    const length = Math.sqrt((Math.pow(sub.x, 2)+Math.pow(sub.y, 2)+Math.pow(sub.z, 2)));

    const geometry = new CustomArrowBufferGeometry(dir, origin, length, optionalParams);
    const material = new THREE.MeshPhongMaterial( { color: 0xffaaff } )
    const arrow = new THREE.Mesh(geometry, material);
    scene.add(arrow);
    arrow.material.color.setHex(0xFF00FF);
    arrow.userData.type = "VECTOR3";

    arrow.userData.vectorValue = sub;

    document.getElementById("cmenu_form")?.setAttribute(`style`, `display: none;`);

});

document.getElementById("vmenu_form")?.addEventListener("submit", (e) =>
{
    e.preventDefault();

    const formData = new FormData(document.getElementById("vmenu_form") as HTMLFormElement);

    const values = {
        o_x: Number(formData.get("vo_xvalue")),
        o_y: Number(formData.get("vo_yvalue")),
        o_z: Number(formData.get("vo_zvalue")),
        d_x: Number(formData.get("vd_xvalue")),
        d_y: Number(formData.get("vd_yvalue")),
        d_z: Number(formData.get("vd_zvalue"))
    }

    let sub = new THREE.Vector3;
    sub.subVectors(new THREE.Vector3(values.d_x, values.d_y, values.d_z), new THREE.Vector3(values.o_x, values.o_y, values.o_z));
    const length = Math.sqrt((Math.pow(sub.x, 2)+Math.pow(sub.y, 2)+Math.pow(sub.z, 2)))

    const optionalParams = {
        coneLength: 0.2,
        coneRadius: 0.1,
        cylLineRadius: 0.1,
    }

    getPrimarySelect().geometry.origin.set(values.o_x,values.o_y,values.o_z);
    getPrimarySelect().geometry.direction.set(values.d_x,values.d_y,values.d_z);
    getPrimarySelect().geometry.setLength(values.length, optionalParams);
    
    getPrimarySelect().geometry.updateGeo()
    getPrimarySelect().userData.box.update();

    getPrimarySelect().userData.vectorValue = sub;

    document.getElementById("vmenu_form")?.setAttribute(`style`, `display: none;`);

});

document.getElementById("color_menu_form")?.addEventListener("submit", (e) =>
{
    e.preventDefault();

    const formData = new FormData(document.getElementById("color_menu_form") as HTMLFormElement);

    let color_value = formData.get("color_value");
    //const color = new THREE.Color(color_value);
    getPrimarySelect().material.color.setHex(color_value);

    document.getElementById("color_menu_form")?.setAttribute(`style`, `display: none;`);
});

window.addEventListener('contextmenu', (event) => 
{
    event.preventDefault();

    let mousePointer = new THREE.Vector2();

    mousePointer.x = (event.clientX / window.innerWidth) * 2 - 1;
	mousePointer.y = -(event.clientY / window.innerHeight) * 2 + 1;
	
	let raycaster = new THREE.Raycaster();
	raycaster.setFromCamera(mousePointer, camera);

    let intersections = raycaster.intersectObjects(scene.children);

	//Add outline on intersections
    let vector = false;

    if(intersections.length > 0)
	{
		for(let i = 0; i < intersections.length; i ++)
		{
			if(intersections[ i ].object.userData.type)
			{
                vector = true;
            }
        }
    }

    if(vector)
    {
        document.getElementById("create")?.setAttribute(`style`, `display: none;`);
        document.getElementById("position")?.setAttribute(`style`, `display: block;`);
        document.getElementById("color")?.setAttribute(`style`, `display: block;`);
        document.getElementById("delete")?.setAttribute(`style`, `display: block;`);
        document.getElementById("sum")?.setAttribute(`style`, `display: none;`);
        document.getElementById("sub")?.setAttribute(`style`, `display: none;`);
        document.getElementById("scale")?.setAttribute(`style`, `display: none;`);
        document.getElementById("vectorial")?.setAttribute(`style`, `display: none;`);
    
        selectVector(event);
    }
    else if(getPrimarySelect() && getSecundarySelect())
    {
        document.getElementById("create")?.setAttribute(`style`, `display: block;`);
        document.getElementById("position")?.setAttribute(`style`, `display: none;`);
        document.getElementById("color")?.setAttribute(`style`, `display: none;`);
        document.getElementById("delete")?.setAttribute(`style`, `display: none;`);
        document.getElementById("add")?.setAttribute(`style`, `display: block;`);
        document.getElementById("sub")?.setAttribute(`style`, `display: block;`);
    
    }
    else 
    {
        document.getElementById("create")?.setAttribute(`style`, `display: block;`);
        document.getElementById("position")?.setAttribute(`style`, `display: none;`);
        document.getElementById("color")?.setAttribute(`style`, `display: none;`);
        document.getElementById("delete")?.setAttribute(`style`, `display: none;`);
        document.getElementById("add")?.setAttribute(`style`, `display: none;`);
        document.getElementById("sub")?.setAttribute(`style`, `display: none;`);
    }
    
    document.getElementById("rmenu")?.setAttribute(`style`, `position: absolute; display: block; top: ${event.clientY}px; left: ${( event.clientX - 20)}px;`);
});

document.getElementById("canvas-container")?.addEventListener('click', () => 
{
    document.getElementById("rmenu")?.setAttribute(`style`, `display: none;`);
    document.getElementById("cmenu_form")?.setAttribute(`style`, `display: none;`);
    document.getElementById("vmenu_form")?.setAttribute(`style`, `display: none;`);
    document.getElementById("color_menu_form")?.setAttribute(`style`, `display: none;`);
});

window.addEventListener('ondrag', () => 
    {
        document.getElementById("rmenu")?.setAttribute(`style`, `display: none;`);
        document.getElementById("cmenu_form")?.setAttribute(`style`, `display: none;`);
    });

document.getElementById("create")?.addEventListener("click", (event) => 
{
    document.getElementById("rmenu")?.setAttribute(`style`, `display: none;`);
    document.getElementById("cmenu_form")?.setAttribute(`style`, `position: absolute; display:flex; justify-content:space-between; flex-direction:row; flex-wrap:wrap; top: ${(event.clientY) - 100}px; left: ${( event.clientX) - 200}px;`);
});

document.getElementById("position")?.addEventListener("click", (event) => 
{
    event.preventDefault();

    const formData = new FormData(document.getElementById("vmenu_form") as HTMLFormElement);


    document.getElementById("vo_xvalue")?.setAttribute('value', `${getPrimarySelect().geometry.origin.x}`);
    document.getElementById("vo_yvalue")?.setAttribute('value', `${getPrimarySelect().geometry.origin.y}`);
    document.getElementById("vo_zvalue")?.setAttribute('value', `${getPrimarySelect().geometry.origin.z}`);
    document.getElementById("vd_xvalue")?.setAttribute('value', `${getPrimarySelect().geometry.direction.x}`);
    document.getElementById("vd_yvalue")?.setAttribute('value', `${getPrimarySelect().geometry.direction.y}`);
    document.getElementById("vd_zvalue")?.setAttribute('value', `${getPrimarySelect().geometry.direction.z}`);
    document.getElementById("vv_module")?.setAttribute('value', `${getPrimarySelect().geometry.length}`);


    document.getElementById("rmenu")?.setAttribute(`style`, `display: none;`);
    document.getElementById("vmenu_form")?.setAttribute(`style`, `position: absolute; display:flex; justify-content:space-between; flex-direction:row; flex-wrap:wrap; top: ${(event.clientY) - 100}px; left: ${( event.clientX) - 200}px;`)
});

document.getElementById("color")?.addEventListener("click", (event) => 
{
    const formData = new FormData(document.getElementById("vmenu_form") as HTMLFormElement);

    document.getElementById("color_value")?.setAttribute('value', `0x${toHex(getPrimarySelect().material.color.getHex())}`);
    
    document.getElementById("rmenu")?.setAttribute(`style`, `display: none;`);
    document.getElementById("color_menu_form")?.setAttribute(`style`, `position: absolute; display:flex; justify-content:space-between; flex-direction:row; flex-wrap:wrap; top: ${(event.clientY) - 100}px; left: ${( event.clientX) - 200}px;`)
});


document.getElementById("delete")?.addEventListener("click", (event) => 
{
    scene.remove(getPrimarySelect().userData.box);
    scene.remove(getPrimarySelect());
    setPrimarySelect(undefined);

    document.getElementById("rmenu")?.setAttribute(`style`, `display: none;`);

});

document.getElementById("add")?.addEventListener("click", (event) => 
{
    let a = getPrimarySelect();
    let b = getSecundarySelect();
    let add = new THREE.Vector3;
    add.addVectors(a.userData.vectorValue, b.userData.vectorValue);

    const dir = add;
    const origin = new THREE.Vector3(0,0,0);
    const length = Math.sqrt((Math.pow(dir.x, 2)+Math.pow(dir.y, 2)+Math.pow(dir.z, 2)));

    const optionalParams = {
    coneLength: 0.2,
    coneRadius: 0.1,
    cylLineRadius: 0.1,
    }

    const geometry = new CustomArrowBufferGeometry(dir, origin, length, optionalParams);
    const material = new THREE.MeshPhongMaterial( { color: 0xffaaff } )
    const arrow = new THREE.Mesh(geometry, material);
    scene.add(arrow);
    arrow.material.color.setHex(0xFF00FF);
    arrow.userData.type = "VECTOR3";
    
    let sub = new THREE.Vector3;
    sub.subVectors(arrow.geometry.getDirection(), arrow.geometry.getOrigin());
    arrow.userData.vectorValue = sub;

    document.getElementById("rmenu")?.setAttribute(`style`, `display: none;`);

});

document.getElementById("sub")?.addEventListener("click", (event) => 
    {
        let a = getPrimarySelect();
        let b = getSecundarySelect();
        let subv = new THREE.Vector3;
        subv.subVectors(a.userData.vectorValue, b.userData.vectorValue);
    
        const dir = subv;
        const origin = new THREE.Vector3(0,0,0);
        const length = Math.sqrt((Math.pow(dir.x, 2)+Math.pow(dir.y, 2)+Math.pow(dir.z, 2)));
    
        const optionalParams = {
        coneLength: 0.2,
        coneRadius: 0.1,
        cylLineRadius: 0.1,
        }
    
        const geometry = new CustomArrowBufferGeometry(dir, origin, length, optionalParams);
        const material = new THREE.MeshPhongMaterial( { color: 0xffaaff } )
        const arrow = new THREE.Mesh(geometry, material);
        scene.add(arrow);
        arrow.material.color.setHex(0xFF00FF);
        arrow.userData.type = "VECTOR3";
        
        let sub = new THREE.Vector3;
        sub.subVectors(arrow.geometry.getDirection(), arrow.geometry.getOrigin());
        arrow.userData.vectorValue = sub;
    
        document.getElementById("rmenu")?.setAttribute(`style`, `display: none;`);
    
});

function toHex(num: number): string 
{
    const map = "0123456789ABCDEF";
    let hex = num === 0 ? "0" : "";
    while (num !== 0) {
        hex = map[num & 15] + hex;
        num = num >>> 4;
    }
    return hex;
}