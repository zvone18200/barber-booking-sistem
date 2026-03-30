 const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "e29f274454a821",
        pass: "b970e7b22432eb"
    }
});

const sendBookingPending = async (to, data) => {
    await transporter.sendMail({
        from: `"Salon Prestige" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Rezervacija primljena — Salon Prestige',
        html: `
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; background: #111110; color: #e8e6e0; border-radius: 12px; overflow: hidden;">
            <div style="background: #1a1a18; padding: 32px; text-align: center; border-bottom: 1px solid #C9A84C33;">
                <h1 style="color: #C9A84C; font-size: 22px; font-weight: 500; margin: 0;">Salon Prestige</h1>
            </div>
            <div style="padding: 32px;">
                <h2 style="color: #e8e6e0; font-size: 18px; font-weight: 500; margin: 0 0 8px;">Rezervacija primljena!</h2>
                <p style="color: #888780; font-size: 14px; margin: 0 0 24px;">Vaša rezervacija je na čekanju. Kontaktirat ćemo vas uskoro.</p>
                <div style="background: #1a1a18; border: 0.5px solid #C9A84C44; border-radius: 10px; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #888780; font-size: 13px;">Usluga</span>
                        <span style="color: #C9A84C; font-size: 13px; font-weight: 500;">${data.service}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #888780; font-size: 13px;">Datum</span>
                        <span style="color: #e8e6e0; font-size: 13px;">${data.date}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #888780; font-size: 13px;">Vrijeme</span>
                        <span style="color: #e8e6e0; font-size: 13px;">${data.time}</span>
                    </div>
                </div>
                <p style="color: #5F5E5A; font-size: 12px; margin: 24px 0 0; text-align: center;">Salon Prestige · Hvala na povjerenju</p>
            </div>
        </div>`
    });
};

const sendBookingConfirmed = async (to, data) => {
    await transporter.sendMail({
        from: `"Salon Prestige" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Rezervacija potvrđena ✓ — Salon Prestige',
        html: `
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; background: #111110; color: #e8e6e0; border-radius: 12px; overflow: hidden;">
            <div style="background: #1a1a18; padding: 32px; text-align: center; border-bottom: 1px solid #C9A84C33;">
                <h1 style="color: #C9A84C; font-size: 22px; font-weight: 500; margin: 0;">Salon Prestige</h1>
            </div>
            <div style="padding: 32px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="width: 52px; height: 52px; border-radius: 50%; background: #1D9E7522; border: 1px solid #5DCAA5; display: inline-flex; align-items: center; justify-content: center; font-size: 22px; color: #5DCAA5; margin-bottom: 12px;">✓</div>
                    <h2 style="color: #5DCAA5; font-size: 18px; font-weight: 500; margin: 0;">Rezervacija potvrđena!</h2>
                </div>
                <p style="color: #888780; font-size: 14px; margin: 0 0 24px; text-align: center;">Vaš termin je potvrđen. Vidimo se!</p>
                <div style="background: #1a1a18; border: 0.5px solid #C9A84C44; border-radius: 10px; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #888780; font-size: 13px;">Usluga</span>
                        <span style="color: #C9A84C; font-size: 13px; font-weight: 500;">${data.service}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #888780; font-size: 13px;">Datum</span>
                        <span style="color: #e8e6e0; font-size: 13px;">${data.date}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #888780; font-size: 13px;">Vrijeme</span>
                        <span style="color: #e8e6e0; font-size: 13px;">${data.time}</span>
                    </div>
                </div>
                <p style="color: #5F5E5A; font-size: 12px; margin: 24px 0 0; text-align: center;">Salon Prestige · Hvala na povjerenju</p>
            </div>
        </div>`
    });
};

const sendBookingCancelled = async (to, data) => {
    await transporter.sendMail({
        from: `"Salon Prestige" <${process.env.EMAIL_USER}>`,
        to,
        subject: 'Rezervacija otkazana — Salon Prestige',
        html: `
        <div style="font-family: system-ui, sans-serif; max-width: 500px; margin: 0 auto; background: #111110; color: #e8e6e0; border-radius: 12px; overflow: hidden;">
            <div style="background: #1a1a18; padding: 32px; text-align: center; border-bottom: 1px solid #C9A84C33;">
                <h1 style="color: #C9A84C; font-size: 22px; font-weight: 500; margin: 0;">Salon Prestige</h1>
            </div>
            <div style="padding: 32px;">
                <div style="text-align: center; margin-bottom: 24px;">
                    <div style="width: 52px; height: 52px; border-radius: 50%; background: #E24B4A22; border: 1px solid #F09595; display: inline-flex; align-items: center; justify-content: center; font-size: 22px; color: #F09595; margin-bottom: 12px;">✕</div>
                    <h2 style="color: #F09595; font-size: 18px; font-weight: 500; margin: 0;">Rezervacija otkazana</h2>
                </div>
                <p style="color: #888780; font-size: 14px; margin: 0 0 24px; text-align: center;">Nažalost, vaš termin je otkazan. Slobodno rezervišite novi termin.</p>
                <div style="background: #1a1a18; border: 0.5px solid #C9A84C44; border-radius: 10px; padding: 20px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #888780; font-size: 13px;">Usluga</span>
                        <span style="color: #C9A84C; font-size: 13px; font-weight: 500;">${data.service}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 12px;">
                        <span style="color: #888780; font-size: 13px;">Datum</span>
                        <span style="color: #e8e6e0; font-size: 13px;">${data.date}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between;">
                        <span style="color: #888780; font-size: 13px;">Vrijeme</span>
                        <span style="color: #e8e6e0; font-size: 13px;">${data.time}</span>
                    </div>
                </div>
                <p style="color: #5F5E5A; font-size: 12px; margin: 24px 0 0; text-align: center;">Salon Prestige · Hvala na povjerenju</p>
            </div>
        </div>`
    });
};

module.exports = { sendBookingPending, sendBookingConfirmed, sendBookingCancelled };
