function success(data=null){
  return [200, data];
}
function error(data, status=500){
  return [status, __(data)];
}

export default {
  success,
  error
}
