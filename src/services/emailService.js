require('dotenv').config();
import nodemailer from 'nodemailer';
let sendSimpleEmail = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Công Hùng 👻" <conghung294@gmail.com>', // sender address
    to: dataSend.receiverEmail, // list of receivers
    subject: 'Thông tin đặt lịch khám bệnh', // Subject line
    // text: 'Hello world?', // plain text body
    html: getBodyHTMLEmail(dataSend),
  });
};

let getBodyHTMLEmail = (dataSend) => {
  let result = '';
  if (dataSend.language === 'vi') {
    result = `<h3>Xin chào ${dataSend.patientName}</h3>
    <p>Bạn nhận được email này vì đã đặt lịch khám bệnh online trên Booking Care</p>
    <p>Thông tin đặt lịch khám bệnh:</p>
    <div><b>Thời gian: ${dataSend.time}</b></div>
    <div><b>Bác sĩ: ${dataSend.doctorName}</b></div>
    
    <p>Nếu các thông tin trên là đúng sự thật, vui lòng click vào đường link bên dưới để xác nhận và hoàn tất thủ tục đặt lịch khám bệnh</p>
    <div>
    <a href=${dataSend.redirectLink} target="_blank">Xác nhận</a>
    </div>
    <div>Xin trân thành cảm ơn</div>`; // html body
  }
  if (dataSend.language === 'en') {
    result = `<h3>Dear ${dataSend.patientName}</h3>
    <p>You received this email because you booked an online medical appointment on Booking Care</p>
    <p>Information for scheduling medical examination:</p>
    <div><b>Time: ${dataSend.time}</b></div>
    <div><b>Doctor: ${dataSend.doctorName}</b></div>
    
    <p>If the above information is true, please click on the link below to confirm and complete the medical appointment booking procedure.</p>
    <div>
    <a href=${dataSend.redirectLink} target="_blank">Confirm</a>
    </div>
    <div>Thanks so much</div>`; // html body
  }
  return result;
};

let getBodyHTMLEmailRemedy = (dataSend) => {
  let result = '';
  if (dataSend.language === 'vi') {
    result = `
    <h3>Xin chào ${dataSend.patientName}!</h3>
    <p>Bạn nhận được email này vì đã đặ lịch khám bệnh online trên Booking Care thành công</p>
    <p> Thông tin của đơn thuốc được gửi trong file đính kèm <p/>

    <div> Xin chân thành cảm ơn </div>

    `;
  }
  if (dataSend.language === 'en') {
    result = `
    <h3>Xin chào ${dataSend.patientName}!</h3>
    <p>Bạn nhận được email này vì đã đặ lịch khám bệnh online trên Booking Care thành công</p>
    <p> Thông tin của đơn thuốc được gửi trong file đính kèm <p/>

    <div> Xin chân thành cảm ơn </div>

    `;
  }
};

let sendAttachment = async (dataSend) => {
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: process.env.EMAIL_APP,
      pass: process.env.EMAIL_APP_PASSWORD,
    },
  });

  // async..await is not allowed in global scope, must use a wrapper

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Công Hùng 👻" <conghung294@gmail.com>', // sender address
    to: dataSend.email, // list of receivers
    subject: 'Kết quả đặt lịch khám bệnh', // Subject line
    // text: 'Hello world?', // plain text body
    html: getBodyHTMLEmailRemedy(dataSend),
    attachments: [
      {
        filename: `remedy-${dataSend.patientId}-${new Date().getTime()}.png`,
        content: dataSend.imgBase64.split('base64,')[1],
        encoding: 'base64',
      },
    ],
  });
};

module.exports = {
  sendSimpleEmail,
  sendAttachment,
};
