import { Resend } from 'resend'

const resend = new Resend('re_aSxE24wB_DdtSqrcBjThDscC6BWzW6JqF')

const userRegisterEmail = async (name: string, email: string, link: string) => {
	return await resend.emails.send({
		from: 'onboarding@resend.dev',
		to: email,
		subject: 'Welcome to Syncboard',
		html: `
    <!DOCTYPE html>
    <html>
    <head>
    <title>Verify your email address</title>
    <style>
      body { font-family: Arial, sans-serif; background-color: #f4f4f4; color: #333; }
      .container { width: 80%; margin: 0 auto; background: #fff; padding: 20px; }
      .header { background-color: #004d99; color: #fff; padding: 10px; text-align: center; }
      .content { margin-top: 20px; }
      .footer { margin-top: 20px; font-size: 0.8em; text-align: center; color: #888; }
    </style>
    </head>
    <body>
    <div class="container">
      <div class="header">
        <h1>Welcome to Syncboard!</h1>
      </div>
      <div class="content">
        <p>Hi, ${name}</p>
        <p>Thank you for register on syncboard, please verify your email by clicking link below</p>
        <a href="${link}">${link}</a>
        <p>Best regards,<br>
        Jung Rama
      </div>
      <div class="footer">
        © ${new Date().getFullYear()} Syncboard. All rights reserved.
      </div>
    </div>
    </body>
    </html>`,
	})
}

export default {
	userRegisterEmail,
}
