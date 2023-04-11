import nodemailer from 'nodemailer';

export const registrationEmail = async(data) => {
    const transport = nodemailer.createTransport({
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
    });

    const { name, email, token } = data;

    await transport.sendMail({
      from: 'Realestate.com',
      to: email,
      subject: 'Confirm your account in Real Estate',
      text: 'Confirm your account in Real Estate',
      html: `
        <p>Hello ${name}, confirm your account in Real Estate</p>
        <p>Your account is ready, just click on the next link: 
          <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/confirm/${token}">Confirm account</a>
        </p>
        <p>If you did not create this account ignore this message.</p>
      `
    })
};


export const restorePasswordEmail = async(data) => {
  const transport = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
      }
  });

  const { name, email, token } = data;

  await transport.sendMail({
    from: 'Realestate.com',
    to: email,
    subject: 'Restore your password in Real Estate',
    text: 'Restore your password in Real Estate',
    html: `
      <p>Hello ${name}, Restore your password in Real Estate</p>
      <p>Restore your password, just click on the next link: 
        <a href="${process.env.BACKEND_URL}:${process.env.PORT ?? 3000}/auth/forgot-password/${token}">Confirm account</a>
      </p>
      <p>If you did not request this change ignore this message.</p>
    `
  })
};