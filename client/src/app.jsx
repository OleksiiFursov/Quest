import {useEffect} from "preact/compat";
import loadFormValid from './components/Form/Valid.js'
import Storage from "./core/Storage/index.js";
import {goTo} from "./core/Router/index.jsx";
import config from "../config.js";
import api from "./core/Api/index.js";
import Loading from "./components/Loading/index.jsx";



export function App() {
  useEffect(async ()=>{
    loadFormValid();
    const token = Storage.get('token');
    if(token){
      const res = await api.send('account/checkToken', token);

    }else{
      goTo(config.router.noAuth);
    }

  }, []);
  return (
    <Loading />
  )
}
