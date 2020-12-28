require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const path = require('path');
const compression = require('compression');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();
const PORT = process.env.PORT || 3001;
//const dev = app.get('env') !== 'production';
const adminEmail = process.env.ADMIN_EMAIL;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
/*
if (dev) {
    app.disable('x-powered-by');
    app.use(compression());
    app.use(morgan('common'));

    app.use(express.static(path.resolve(__dirname, 'build')));

    app.get('*', (req, res) => {
        res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
    })
}*/

app.post('/api/form', (req, res) => {
    console.log(req.body);
    const htmlEmail = `
        <h3>Te han contactado desde tu sitio web!</h3>
        <h4>Detalles:</h4>
        <ul>
            <li>Nombre: ${req.body.name}</li>
            <li>Email: ${req.body.email}</li>  
        </ul>
        <h4>Mensaje:</h4>
        <p>${req.body.message}</p>
    `;

    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // upgrade later with STARTTLS
        auth: {
            type: "login",
            user: adminEmail,
            pass: 'papla2010'
        },
        tls: {
            // do not fail on invalid certs
            rejectUnauthorized: false
        },
        debug: true,
        logger: true
    })

    transporter.verify(function(error, success) {
        if (error) {
          console.log(error);
        } else {
          console.log("Server is ready to take our messages");
        }
    });

    let message = {
        from: `${req.body.name} <${req.body.email}>`,
        to: 'fdsosa.35@gmail.com',
        subject: `New Message from my webpage // ${req.body.subject}`,
        text: req.body.message,
        html: htmlEmail
    };

    transporter.sendMail(message, (err, info) => {
        if(err) {
            return console.log(err);
        }

        console.log('Message sent: ', info.messageId);
        transporter.close();
    })
    
    return 'OK';
});


app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
})
