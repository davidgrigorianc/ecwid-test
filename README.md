
# Ecwid Store Test

This is the frontend application for Ecwid Store test, built with Vue.js and Vuetify.

## Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (Version: 23.9.0)
- [npm](https://www.npmjs.com/) (Version: 10.9.2)

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/davidgrigorianc/ecwid-test.git
   cd ecwid-test
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file in the root of the project with the following variables:

   ```env
    VITE_BASE_URL="https://app.ecwid.com/api/v3"
    VITE_STORE_ID=108362264
    VITE_TOKEN=public_RiNvjTVVzKLhFNWyzR5fNY68u1GMHLEs
   ```

   ## Development

   To run the application in development mode:

   ```bash
   npm run dev
   ```

   This will start the development server, and you can open the app in your browser at `http://localhost:3000`.

   ## Build

   To build the application for production:

   ```bash
   npm run build
   ```

   To preview the built application locally:

   ```bash
   npm run preview
   ```