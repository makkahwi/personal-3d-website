import * as THREE from "three";

export type Vec3 = [number, number, number];

type MaterialParams = THREE.MeshStandardMaterialParameters;

export type Materials = {
  grass: MaterialParams;
  wall: MaterialParams;
  trunk: MaterialParams;
  leaves: MaterialParams;
  path: MaterialParams;
  water: MaterialParams;
  wood: MaterialParams;
  dark: MaterialParams;
  red: MaterialParams;
};
