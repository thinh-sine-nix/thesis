![Build status](https://img.shields.io/github/actions/workflow/status/thuongtruong109/shakemate/build.yml?logo=GitHub&label=build)
[![Image status](https://img.shields.io/docker/automated/thuongtruong1009/shakemate?logo=Docker&label=shakemate)](https://hub.docker.com/r/thuongtruong1009/shakemate)
[![Website](https://img.shields.io/website?url=https%3A%2F%2Fshakemate.onrender.com&up_color=blue&logo=webrtc)](https://shakemate.onrender.com)
[![Donate](https://img.shields.io/badge/Donate-PayPal-ff3f59.svg)](https://paypal.me/thuongtruong1009)
![License](https://img.shields.io/github/license/thuongtruong109/shakemate)

# shakemate

> 🖇️ Connect to temp peers via internal network without authentication

## 🎫 Preview

![Preview](/public/demo_1.png)

![Preview 2](/public/demo_2.png)

## 🔥 Motivation

I wanted to create a simple way to connect to peers via internal network without any authentication. This is useful for temporary connections where you don't want to go through the hassle of creating an account or sharing a link. Just connect to the server and start sharing. Usecases include sharing files, camera, chat, etc.

## 🪶 Features

- 📦 **Zero-config**: No need to configure anything, just run the server and connect to it
- 🌐 **Internal network**: Connect to the server via internal network
- 🚀 **Fast**: No authentication required, just connect and start sharing
- 📱 **Responsive**: Works on all devices
- 📡 **Real-time**: Uses WebRTC for real-time communication
- 📁 **File sharing**: Share files with peers
- 📹 **Camera sharing**: Share your camera with peers
- 💬 **Chat**: Chat with peers
- 🎧 **Audio sharing**: Share audio with peers
- 📝 **Rich text editor**: Write notes with rich text editor
- 📲 **PWA**: Progressive Web App for offline usage
- 📈 **Insight**: SEO friendly

## 🏗️ Tech Stack

- 🧊 [**Fastify**](https://fastify.dev/) x [**EJS**](https://ejs.co/): Web framework for Node.js with EJS template engine
- 💻 [**WebRTC**](https://webrtc.org/): Real-time communication library
- ⌚ [**Socket.io**](https://socket.io/): Real-time communication library
- 🕸️ [**Peerjs**](https://peerjs.com/): Simple peer-to-peer with WebRTC
- 🐳 [**Docker**](https://www.docker.com/): Containerization platform for easy deployment
- 🍧 [**FontAwesome**](https://fontawesome.com/): Icon library for web
- 💥 [**JavaScript**](https://developer.mozilla.org/en-US/docs/Web/JavaScript)/[**Typescript**](https://www.typescriptlang.org/): Programming language for main logic
- 🚩 [**HTML**](https://developer.mozilla.org/en-US/docs/Web/HTML)/[**CSS**](https://developer.mozilla.org/en-US/docs/Web/CSS): HyperText-Markup and Cascading-Style-Sheet language
- ✍️ [**Tinymce**](https://www.tiny.cloud/tinymce/): Rich text embeded editor
- ☁️ [**Cloudinary**](https://cloudinary.com/): Image hosting service

## 🔨 How to use

with npm/yarn/pnpm...

```bash
npm install
```

```bash
npm run dev
```

or with Docker

```bash
docker-compose up
```

-> Then open `http://localhost:3000` in your browser

## 🪪 License

[MIT](LICENSE) © Thuong Truong, 2024

<!-- https://github.com/miqrc/fastify-typescript-docker-rest-api/blob/master/src/controllers/main.service.ts -->
