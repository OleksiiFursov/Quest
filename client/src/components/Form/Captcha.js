import { useEffect } from 'preact/compat'
import config from '../../../config.js'
let isCaptchaEnabled = false

export default function Captcha(){
	useEffect(() => {
		if(!isCaptchaEnabled) {
			const script = document.createElement('script');
			script.src = `https://www.google.com/recaptcha/enterprise.js?render=6LeogkwpAAAAAGvvlliEp-AoiEJTvtGBFonDu-Jk`;
			script.async = true;
			document.body.appendChild(script);
			isCaptchaEnabled = true;
		}
	}, []);

	return '';
}

export const getCaptchaToken = () => {
	return new Promise((resolve, reject) => {
		try {
			grecaptcha.enterprise.ready(async () => {
				resolve(await grecaptcha.enterprise.execute(config.captcha.key, { action: 'LOGIN' }));
			});
		}catch(e){
			reject(e)
		}
	})
}
