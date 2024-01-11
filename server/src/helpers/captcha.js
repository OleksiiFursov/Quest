import { RecaptchaEnterpriseServiceClient } from '@google-cloud/recaptcha-enterprise'
import { getConfig } from '../tools.mjs'

export default async function createAssessment(token, recaptchaAction='login') {
	const conf = getConfig('login.captcha');

	// Create the reCAPTCHA client.
	// TODO: Cache the client generation code (recommended) or call client.close() before exiting the method.
	const client = new RecaptchaEnterpriseServiceClient();
	const projectPath = client.projectPath(conf.projectID);

	// Build the assessment request.
	const request = ({
		assessment: {
			event: {
				token: token,
				siteKey: conf.recaptchaKey,
			},
		},
		parent: projectPath,
	});

	const [ response ] = await client.createAssessment(request);

	// Check if the token is valid.
	if (!response.tokenProperties.valid) {
		console.log(`The CreateAssessment call failed because the token was: ${response.tokenProperties.invalidReason}`);
		return null;
	}

	// Check if the expected action was executed.
	// The `action` property is set by user client in the grecaptcha.enterprise.execute() method.
	if (response.tokenProperties.action === recaptchaAction) {
		// Get the risk score and the reason(s).
		// For more information on interpreting the assessment, see:
		// https://cloud.google.com/recaptcha-enterprise/docs/interpret-assessment
		console.log(`The reCAPTCHA score is: ${response.riskAnalysis.score}`);
		response.riskAnalysis.reasons.forEach((reason) => {
			console.log(reason);
		});

		return response.riskAnalysis.score;
	} else {
		console.log("The action attribute in your reCAPTCHA tag does not match the action you are expecting to score");
		return null;
	}
}
