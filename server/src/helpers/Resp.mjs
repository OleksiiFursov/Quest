function success(data){
  return [200, data];
}
function error(data, status=500){
  return [status, data];
}

export default {
  success,
  error
}
