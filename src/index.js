import * as dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import { transporter } from './nodemailer/nodemailer.js';

const app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(
  cors({
    methods: ['GET', 'POST', 'DELETE', 'UPDATE', 'PUT', 'PATCH'],
    origin: '*',
  })
);

app.post('/book', async (req, res) => {
  try {
    const body = req.body;
    const { email, name, message, date } = body;

    if (email) {
      const mailForUser = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Restaurant Nique. Book a table.',
        text: 'Thank you for book a table. We will connecting with you in 30 minutes. Have a good day. ',
      };

      const mailForRestaurant = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'Client want to book a table.',
        text: `Client ${name} - ${email} want to book a table. Date of book a table:${date}. Dont forget to connect with him. Client additional message: ${message}`,
      };
      transporter.sendMail(mailForUser);
      transporter.sendMail(mailForRestaurant);
      return res.status(200).send({ msg: 'Thank you for booking a table.' });
    }
  } catch (err) {
    return res
      .status(500)
      .send({ msg: 'Server error. Wait a minute and try again.' });
  }
});

app.get('/', async (req, res) => {
  return res.status(200).send({ msg: 'Work' });
});

const start = async () => {
  try {
    app.listen(process.env.PORT || 5005, () => {
      console.log(`Server on port ${process.env.PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
