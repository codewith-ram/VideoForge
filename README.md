# VideoForge

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/react-19.0-61dafb.svg?style=flat&logo=react)
![Vite](https://img.shields.io/badge/vite-6.0-646cff.svg?style=flat&logo=vite)
![FFmpeg.wasm](https://img.shields.io/badge/FFmpeg.wasm-0.12-00a651.svg?style=flat&logo=ffmpeg)

**VideoForge** is a professional, browser-based video transcoding application that leverages WebAssembly to process media files entirely on the client side. No servers, no uploads, no latency.

<div align="center">
  <h3>✨ Experience the Studio-Grade UI Design</h3>
  
  [![Live Demo](https://img.shields.io/badge/�_Launch_App-Live_Demo-000000?style=for-the-badge&logo=vercel&logoColor=white)](https://video-forge-psi.vercel.app/)
  
  <p><i>Featuring Glassmorphism, Aurora Gradients, and Fluid Animations</i></p>
</div>

![Project Screenshot](https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=2564&auto=format&fit=crop)
*(Note: Replace the above link with an actual screenshot of your application)*

## 🚀 Features

- **Local Execution**: Uses `ffmpeg.wasm` to run the full FFmpeg CLI inside your browser's V8 engine.
- **Privacy Focused**: Your files never leave your device. Zero data transfer means maximum security.
- **Studio-Grade UI**: A "Pro-Tool" aesthetic featuring glassmorphism, Aurora gradients, and smooth animations.
- **Format Support**: Seamlessly convert `.mov`, `.mkv`, `.avi`, and other formats to standardized `.mp4`.
- **Drag & Drop**: Intuitive interface for quick file processing.

## 🛠️ Tech Stack

- **Frontend**: React 19 (Hooks, Functional Components)
- **Build Tool**: Vite (configured for COOP/COEP headers)
- **Core Engine**: FFmpeg.wasm (multithreaded)
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Language**: TypeScript

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/video-forge.git
   cd video-forge
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```
   
   The app will run at `http://localhost:5173`.

   > **Note**: This application requires `SharedArrayBuffer` support, which means the server must serve specific headers (`Cross-Origin-Opener-Policy: same-origin` and `Cross-Origin-Embedder-Policy: require-corp`). The included `vite.config.ts` handles this automatically.

## 🏗️ Architecture

VideoForge loads the FFmpeg core asynchronously. When you drop a file:
1. The file is written to an in-memory file system (MEMFS).
2. React triggers the FFmpeg exec command (e.g., `-i input.mov output.mp4`).
3. The WASM binary processes the frames using web workers.
4. The output file is read back from MEMFS and converted to a Blob URL for download.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
