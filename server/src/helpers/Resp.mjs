import { encodeAdv } from '../tools.js'

function success(data=null, advanced=false){
  return [200, encodeAdv(data), advanced?'a':''];
}
function error(data, status=500){
  return [status, __(data)];
}

export default {
  success,
  error
}
