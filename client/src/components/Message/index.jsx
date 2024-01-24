import config from '../../../config.js'

let messages = [];
export function loaderMessage(){
}

export default function Message(str, slug=null){
  return lang === 'en' ? str: (slug ? messages[slug]: messages[str]);
}

window.lang = config.lang;
window.__ = Message
