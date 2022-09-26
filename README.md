# ChatBase

A minimal web chat application built upon Typescript with [Supabase](https://supabase.com) and [Vercel](https://vercel.com).

[![Watch the video](https://img.youtube.com/vi/Hglg9viFiOY/default.jpg)](https://youtu.be/Hglg9viFiOY)

## Features

- [x] User authentication
- [x] User profile
- [x] Search users and rooms
- [x] Create personal message room
- [x] Realtime chat
- [x] Send text messages
- [x] Send attachment messages
- [x] WebAuthn as 2FA
- [ ] Edit messages
- [ ] Delete messages
- [ ] Delete conversation rooms


## Setup Guide

### **Prerequisites**

- [Node.js](https://nodejs.org/en/download/) (v16.15.0 or higher)

- [Yarn](https://classic.yarnpkg.com/en/docs/install) (v1.22.10 or higher)

- [Vercel CLI](https://vercel.com/download) (v28.1.3 or higher)

- Clone the repository:

  ```bash
  git clone https://github.com/mgilangjanuar/chatbase.git
  ```

- Install dependencies:

  ```bash
  yarn install
  ```

### **Supabase Project Setup**

Login and create a project at [supabase.com](https://app.supabase.com/)

### **Supabase Auth (with Google)**

Go to the Settings page and select Authentication

- Allow new users to sign up

- Fill in the site URL, eg (http://localhost:3000, etc)

- Add your site URL to the redirect URLs, eg (http://localhost:3000, https://chatbase.vercel.app, etc)

- Enable Google as an auth provider:

  - Create OAuth client ID in [Google Cloud Console](https://console.cloud.google.com/apis/credentials)

    Add your redirect URL from Supabase to the redirect URL of Google auth console, look like: `https://{your_project_id}.supabase.co/auth/v1/callback`

  - Save client ID and secret in the Supabase auth settings

  - Click save

### **Supabase Database**

- Go to the SQL editor and create the New query

- Run the scripts from:
  - [`sql/schema.sql`](./sql/schema.sql)
  - [`sql/storage.sql`](./sql/storage.sql)


### **Deployment on Vercel**

Install [Vercel CLI](https://vercel.com/docs/cli) and login with command: `vercel login`

- Local

  - Fill in the environment variables in `.env` file _(see [`.env.example`](./.env.example) for reference)_
  - Run: `vercel dev` or `yarn start`

- Production

  - Fill in the environment variables in the Vercel settings page
  - Run: `vercel --prod` or `yarn run deploy`


## License

ChatBase is licensed under the [MIT License](./LICENSE.md)