import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
const sendEmail = async (req:NextApiRequest, res:NextApiResponse) => {
    
    const user_email = req.body.email;

    const transporter = nodemailer.createTransport({
        service:"gmail",
        port:587,
        secure:false,
        requireTLS:false,
        auth:{
            user:"my444455@gmail.com",
            pass:"neeneenon1550@@"
        }
    })
    const code = String(Math.floor(Math.random()*1000000)).padStart(6, '0');
    const info = await transporter.sendMail({
        from:"my444455@gmail.com",
        to:user_email,
        subject:"엄청난서비스 이메일 인증",
        text:`<p>저희 서비스를 이용해주셔서 감사합니다!</p><br/><p>인증 코드 : ${code}`
    })


    res.status(200);
};

export default sendEmail;