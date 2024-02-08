import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
	host: "mail.crossfox.online",
	port: 465,
	secure: true,
	auth: {
		user: 'system@crossfox.online',
		pass: 'PMjUM$2r2V',
	},
})
export default function sendMail (to, subject, text, from='system@crossfox.online') {
	transporter.sendMail({
		from,
		to,
		subject,
		text,
	}, function (error, info) {
		if (error) {
			console.log(error)
		}

		return !error

	})

}
