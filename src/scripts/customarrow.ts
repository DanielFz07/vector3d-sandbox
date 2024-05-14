import * as THREE from 'three'
import * as BufferGeometryUtils from 'three/addons/utils/BufferGeometryUtils.js';


// Example
// const geometry = new CustomArrowBufferGeometry(dir, origin, length, optionalParams)
// const material = new THREE.MeshPhysicalMaterial({ color: new THREE.Color("rgb(44,187,206)") });
// const arrow = new THREE.Mesh(geometry, material);

class CustomArrowBufferGeometry extends THREE.BufferGeometry 
{
    private direction: THREE.Vector3;
    private origin: THREE.Vector3;
    private length: number;

    private coneLength: number;
    private coneRadius: number;
    private lineLength: number;
    private cylLineRadius: number;
    private cylLineRadialSegment: number;
    private cylLineHeightSegment: number;
    private coneRadialSegment: number;
    private coneHeightSegment: number;

    constructor(direction: THREE.Vector3, origin: THREE.Vector3, length: number, params?: any) 
    {
        super();
        this.direction = direction;
        this.origin = origin;
        this.length = length;

        //default cone length is 15%
        this.coneLength = (Math.min(params.coneLength, 0.5) || 0.15) * this.length

        //default cone radius is 5%
        this.coneRadius = (Math.min(params.coneRadius, 0.4) || 0.05) * this.length

        this.lineLength = this.length - this.coneLength

        //default line radius is 5%
        this.cylLineRadius = (Math.min(params.cylLineRadius, 0.04) || 0.01) * this.length

        this.cylLineRadialSegment = 16
        this.cylLineHeightSegment = 2
        this.coneRadialSegment = 16
        this.coneHeightSegment = 2
        this.updateGeo()

    }

    setLength(length: number, params?: any)
    {
        this.length = length;

        //default cone length is 15%
        this.coneLength = (Math.min(params.coneLength, 0.5) || 0.15) * this.length

        //default cone radius is 5%
        this.coneRadius = (Math.min(params.coneRadius, 0.4) || 0.05) * this.length

        this.lineLength = this.length - this.coneLength

        //default line radius is 5%
        this.cylLineRadius = (Math.min(params.cylLineRadius, 0.04) || 0.01) * this.length
    
        this.updateGeo();
    }

    updateGeo() 
    {
        //using cylinder geometry to create line
        let geometry = new THREE.CylinderGeometry(this.cylLineRadius, this.cylLineRadius, this.lineLength, this.cylLineRadialSegment, this.cylLineHeightSegment);
        geometry.rotateZ(Math.PI / 2)
        geometry.translate(this.lineLength / 2, 0, 0)

        let geometryCone = new THREE.ConeGeometry(this.coneRadius, this.coneLength, this.coneRadialSegment, this.coneHeightSegment);
        geometryCone.rotateZ(-Math.PI / 2)
        geometryCone.translate(this.length - (this.coneLength / 2), 0, 0)

        let geometries = [geometry, geometryCone]

        let mergedGeometry = BufferGeometryUtils.mergeGeometries(geometries, false);

        this.attributes = mergedGeometry.attributes
        this.index = mergedGeometry.index

        let xDir = new THREE.Vector3(1, 0, 0).normalize()

        const quaternion = new THREE.Quaternion();
        quaternion.setFromUnitVectors(xDir, this.direction);
        this.applyQuaternion(quaternion)

        this.translate(this.origin.x, this.origin.y, this.origin.z)

        this.computeBoundingBox()
    }
    getDirection()
    {
        return this.direction;
    }
    getOrigin()
    {
        return this.origin;
    }

}

export { CustomArrowBufferGeometry }