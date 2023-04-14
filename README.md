Google Cloud Build Notification

This script sends an email notification when a Google Cloud Build completes. It utilizes Google Cloud Pub/Sub, Google Secret Manager, and Nodemailer to securely and efficiently send email notifications.
Prerequisites

    Node.js installed (version 14 or higher)
    A Google Cloud Platform (GCP) account
    A valid SMTP email account and credentials for sending email notifications

Setup

    Clone this repository:

bash

git clone https://github.com/your-github-username/google-cloud-build-notification.git
cd google-cloud-build-notification

    Install the dependencies:

bash

npm install

    Set up your GCP project, enable the necessary APIs, and authenticate:

    Follow the official Google Cloud SDK installation guide to install and initialize the gcloud CLI.
    Enable the necessary APIs: Google Cloud Build, Google Secret Manager, and Google Pub/Sub.
    Set the GOOGLE_APPLICATION_CREDENTIALS environment variable to the path of your GCP service account JSON key file.

    Create secrets in Google Secret Manager to store your SMTP credentials and email address:

bash

gcloud secrets create SMTP_SERVER --replication-policy="automatic" --data-file="path/to/smtp_server.txt"
gcloud secrets create SMTP_PORT --replication-policy="automatic" --data-file="path/to/smtp_port.txt"
gcloud secrets create SMTP_USER --replication-policy="automatic" --data-file="path/to/smtp_user.txt"
gcloud secrets create SMTP_PASSWORD --replication-policy="automatic" --data-file="path/to/smtp_password.txt"
gcloud secrets create EMAIL_ADDRESS --replication-policy="automatic" --data-file="path/to/email_address.txt"

Replace path/to/ with the actual paths to the corresponding files containing your SMTP credentials and email address.

    Deploy the Cloud Function:

bash

gcloud functions deploy buildNotification \
  --runtime nodejs14 \
  --trigger-topic YOUR_PUBSUB_TOPIC \
  --allow-unauthenticated

Replace YOUR_PUBSUB_TOPIC with the actual Pub/Sub topic to which Google Cloud Build publishes messages.
Usage

Once deployed, the Cloud Function will listen for messages published to the specified Pub/Sub topic. When a Google Cloud Build finishes, it will publish a message to the topic, and the Cloud Function will automatically send an email notification with the build status.
License

This project is licensed under the terms of the MIT License.