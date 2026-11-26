// Byte identity baseline: npm/CDN comparator run 45831919149, job 139950605883.
// These are observed bytes, not a vulnerability assessment or rights approval.
import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
const pins=Object.freeze({
  "three/build/three.module.js": {
    "bytes": 1272972,
    "sha256": "76dea8151bc9352aef3528b4262e249b2604f62543828328db978d060d61a495"
  },
  "three/examples/jsm/loaders/GLTFLoader.js": {
    "bytes": 108522,
    "sha256": "d073b438e6a07e1359741dd5d6c76c953420cc0d4fd84eb1bdde94315540e6a3"
  },
  "three/examples/jsm/utils/BufferGeometryUtils.js": {
    "bytes": 31906,
    "sha256": "9be041e96308775d00e2695cc607645b9a9b64fd7c0e759dd8f7c00a8d92becb"
  },
  "three/examples/jsm/utils/SkeletonUtils.js": {
    "bytes": 8007,
    "sha256": "83748c5072a5ce96e9d68d8efda908a1f1a06c0b5fd2618edc3e54a361a8fd5b"
  },
  "leaflet/dist/leaflet.js": {
    "bytes": 147552,
    "sha256": "db49d009c841f5ca34a888c96511ae936fd9f5533e90d8b2c4d57596f4e5641a"
  },
  "leaflet/dist/leaflet.css": {
    "bytes": 14806,
    "sha256": "a7837102824184820dfa198d1ebcd109ff6d0ff9a2672a074b9a1b4d147d04c6"
  },
  "leaflet/dist/images/layers.png": {
    "bytes": 696,
    "sha256": "1dbbe9d028e292f36fcba8f8b3a28d5e8932754fc2215b9ac69e4cdecf5107c6"
  },
  "leaflet/dist/images/layers-2x.png": {
    "bytes": 1259,
    "sha256": "066daca850d8ffbef007af00b06eac0015728dee279c51f3cb6c716df7c42edf"
  },
  "leaflet/dist/images/marker-icon.png": {
    "bytes": 1466,
    "sha256": "574c3a5cca85f4114085b6841596d62f00d7c892c7b03f28cbfa301deb1dc437"
  },
  "leaflet/dist/images/marker-icon-2x.png": {
    "bytes": 2464,
    "sha256": "00179c4c1ee830d3a108412ae0d294f55776cfeb085c60129a39aa6fc4ae2528"
  },
  "leaflet/dist/images/marker-shadow.png": {
    "bytes": 618,
    "sha256": "264f5c640339f042dd729062cfc04c17f8ea0f29882b538e3848ed8f10edb4da"
  }
});
export function verifyVendorBytes(path,bytes){
 const pin=pins[path];
 assert.ok(Object.hasOwn(pins,path),'No reviewed byte baseline: '+path);
 assert.equal(bytes.length,pin.bytes,'Vendor size mismatch: '+path);
 assert.equal(createHash('sha256').update(bytes).digest('hex'),pin.sha256,'Vendor SHA-256 mismatch: '+path);
}
export function verifyVendorInventory(paths){
 assert.deepEqual([...paths].sort(),Object.keys(pins).sort(),'Vendor byte baseline coverage mismatch');
}
export function selfTestVendorPins(){
 verifyVendorInventory(Object.keys(pins));
 assert.throws(()=>verifyVendorInventory(Object.keys(pins).slice(1)),/coverage mismatch/);
 assert.throws(()=>verifyVendorInventory([...Object.keys(pins),'unreviewed.js']),/coverage mismatch/);
 const path='leaflet/dist/images/layers.png';
 assert.throws(()=>verifyVendorBytes(path,Buffer.alloc(1)),/size mismatch/);
 assert.throws(()=>verifyVendorBytes(path,Buffer.alloc(pins[path].bytes)),/SHA-256 mismatch/);
 assert.throws(()=>verifyVendorBytes('unknown',Buffer.alloc(0)),/No reviewed byte baseline/);
 console.log('PASS vendor byte pin negative fixtures');
}
