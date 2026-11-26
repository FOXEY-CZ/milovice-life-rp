// A stable loopback origin is part of the local preview's storage identity.
export const DEFAULT_PREVIEW_PORT=47835;
export function previewPort(value=process.env.CROSSVEX_PREVIEW_PORT){
 if(value===undefined)return DEFAULT_PREVIEW_PORT;
 if(typeof value!=='string'||!/^[1-9]\d{3,4}$/.test(value))throw Error('CROSSVEX_PREVIEW_PORT must be an integer from 1024 to 65535');
 const port=Number(value);
 if(port<1024||port>65535)throw Error('CROSSVEX_PREVIEW_PORT must be an integer from 1024 to 65535');
 return port;
}
export function previewOrigin(port){
 if(!Number.isInteger(port)||port<1024||port>65535)throw Error('Invalid fixed preview port');
 return 'http://127.0.0.1:'+port;
}
