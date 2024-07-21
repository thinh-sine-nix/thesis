![Build status](https://img.shields.io/github/actions/workflow/status/thuongtruong109/shakemate/build.yml?logo=GitHub&label=build)
![Image status](https://img.shields.io/docker/automated/thuongtruong1009/shakemate?logo=Docker&label=shakemate)
[![Donate](https://img.shields.io/badge/Donate-PayPal-ff3f59.svg)](https://paypal.me/thuongtruong1009)
![License](https://img.shields.io/github/license/thuongtruong1009/short1url)

# shakemate

> 🖇️ Connect to temp peers via internal network without authentication

## Preview

![Preview](/public/preview.png)

## Motivation

I wanted to create a simple way to connect to peers via internal network without any authentication. This is useful for temporary connections where you don't want to go through the hassle of creating an account or sharing a link. Just connect to the server and start sharing. Usecases include sharing files, camera, chat, etc.

## Features

- 📦 **Zero-config**: No need to configure anything, just run the server and connect to it
- 🌐 **Internal network**: Connect to the server via internal network
- 🚀 **Fast**: No authentication required, just connect and start sharing
- 📱 **Responsive**: Works on all devices
- 📡 **Real-time**: Uses WebRTC for real-time communication
- 📁 **File sharing**: Share files with peers
- 📹 **Camera sharing**: Share your camera with peers
- 💬 **Chat**: Chat with peers
- 🎧 **Audio sharing**: Share audio with peers

## Tech Stack

- **Fastify x ejs**: Web framework for Node.js with EJS template engine
- **Socket.io**: Real-time communication library
- **Peerjs**: Simple peer-to-peer with WebRTC
- **Docker**: Containerization platform
- **FontAwesome**: Icon library
- **JavaScript/Typescript**: Programming language
- **HTML/CSS**: Markup and styling language

## How to use

with npm/yarn/...
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

## License

[MIT](LICENSE) © Thuong Truong, 2024