import { SecretManagerServiceClient } from '@google-cloud/secret-manager';
import { Message } from '@google-cloud/pubsub';
import * as nodemailer from 'nodemailer';
import * as Mail from 'nodemailer/lib/mailer';

async function accessSecretVersion(secretName: string) {
  const client = new SecretManagerServiceClient();
  const [version] = await client.accessSecretVersion({
    name: secretName,
  });
  const payload = version.payload?.data?.toString() || '';
  return payload;
}

export const buildNotification = async (message: Message): Promise<void> => {
  const projectId = process.env.PROJECT_ID;

  // Get secrets
  const smtpServer = await accessSecretVersion(`projects/${projectId}/secrets/SMTP_SERVER/versions/latest`);
  const smtpPort = Number(await accessSecretVersion(`projects/${projectId}/secrets/SMTP_PORT/versions/latest`));
  const smtpUser = await accessSecretVersion(`projects/${projectId}/secrets/SMTP_USER/versions/latest`);
  const smtpPassword = await accessSecretVersion(`projects/${projectId}/secrets/SMTP_PASSWORD/versions/latest`);
  const yourEmail = await accessSecretVersion(`projects/${projectId}/secrets/EMAIL_ADDRESS/versions/latest`);

  const dataString = message.data.toString('utf-8');
  const data = JSON.parse(dataString);
  const buildStatus = data.status;
  const buildId = data.id;

  const transporter = nodemailer.createTransport({
    host: smtpServer,
    port: smtpPort,
    secure: false,
    auth: {
      user: smtpUser,
      pass: smtpPassword,
    },
  });

  const mailOptions: Mail.Options = {
    from: yourEmail,
    to: yourEmail,
    subject: `Build ${buildStatus}: ${buildId}`,
    text: `Your build has finished with status: ${buildStatus}\nBuild ID: ${buildId}`,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Email sent:', mailOptions);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
