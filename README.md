# Project Setup

## Prerequisites

- [Node.js](https://nodejs.org/) installed on your system.

## Installation

1. Install the dependencies:

   ```bash
   npm install
   ```

2. Create a `.env.local` file in the root directory and add your Gemini API key:

   ```env
   GEMINI_API_KEY=your_gemini_api_key
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open the local URL displayed in your terminal to access the application.

## Environment Variables

| Variable | Description |
|---|---|
| `GEMINI_API_KEY` | API key required for Gemini API access |

Keep your API key private. Do not commit `.env.local` or expose your API key in a public repository.
