import { OrbitControls, useGLTF, useTexture, useAnimations } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useEffect, useLayoutEffect } from "react";

const Wolf = () => {
  const model = useGLTF("/models/wolf.drc.glb");
  const { actions } = useAnimations(model.animations, model.scene);
//texture files getting loaded
  let texture = useTexture({
    normalMap: "/normals/wolf_normals.jpg",
    sampleMatCap: "/matcap/mat-2.png",
    branchMap:"/normals/branches_normals.jpg",
    branchMatCap: "/matcap/mat-19.png",
  });
//playing animation of wolf
  useEffect(() => {
    if (actions && actions["Take 001"]) {
      actions["Take 001"].play();
    }
  }, [actions]);

  //loading textures of the model 
  useLayoutEffect(() => {
    const normalMap = texture.normalMap.clone();
    normalMap.flipY = false;
    const sampleMatCap = texture.sampleMatCap.clone();
    sampleMatCap.colorSpace = THREE.SRGBColorSpace;

    const wolfMaterial = new THREE.MeshMatcapMaterial({
      normalMap: normalMap,
      matcap: sampleMatCap
    });

    const branchMap = texture.branchMap.clone();
    const branchMatCap = texture.branchMatCap.clone();
     const branchMaterial = new THREE.MeshMatcapMaterial({
      normalMap: branchMap,
      matcap: branchMatCap
    });

    model.scene.traverse((child) => {
      if (child.isMesh && child.name.includes("DOG")) {
        child.material = wolfMaterial;
      }else if(child.isMesh && child.name.includes("BRANCH")){
        child.material = branchMaterial
      }
    });

    
    
  }, [model, texture]);

  //hook to access the camera and other stuffs
  useThree(({ camera, gl }) => {
    camera.position.z = 0.6;
    gl.toneMapping = THREE.ReinhardToneMapping;
    gl.outputColorSpace = THREE.SRGBColorSpace;
  });

  return (
    <>
      <primitive object={model.scene} 
      position={[0.25, -0.6, 0]} rotation={[0, Math.PI / 3.9, 0]} />
      <directionalLight intensity={10} color={0xffffff} position={[0, 5, 5]} />
      {/* used to rotate and pan the model in canvas */}
      <OrbitControls /> 
    </>
  );
};

export default Wolf;
