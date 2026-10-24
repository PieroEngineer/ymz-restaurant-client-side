# What is Yummizi (ymz)?
Yummizi was a foodtech startup project that allowed restaurants to prepare diners' food while they were on their way to the establishment. Although I didn't continue with the project due to validation issues, it taught me a lot about marketing, sales, and full-stack development.

I think that the best way to be grateful for what I have is to share it. Here, I share with you what I learned by building a stable, real-time platform that connects diners with restaurants the Yummizi way.

# Sub-systems of the platform
+ [AWS Lambda with hono](https://github.com/PieroEngineer/ymz-aws-lambda-with-hono) (TS) 
+ [AWS serverless configuration with AWS SAM](https://github.com/PieroEngineer/ymz-iac-with-aws-sam) (yaml) 
+ [Client for process observability](https://github.com/PieroEngineer/ymz-admin-client-with-python) (Python) 
+ [Landing page](https://github.com/PieroEngineer/ymz-landing-page) (HTML + JS + CSS) 
+ [Restaurant Web app](https://github.com/PieroEngineer/ymz-restaurant-client-side) (TS + Vite + React) 
+ [Diner Android app](https://github.com/PieroEngineer/ymz-diner-client-side) (Kotlin) 

# Yummizi sample videos (Spanish)

+ [Diner's side](https://youtu.be/7b_l_gql7mM?si=8SZDDcmm5-jZD5qW) 🍽️
+ [Restaurant's side](https://youtu.be/fAfyB8eCOTE?si=P1Oo85OMT-clABDw) 🏪
  
# Yummizi Restaurant Web

Yummizi Restaurant Web is the restaurant-side web dashboard for managing day-to-day restaurant operations. It is a single-page application built with React and TypeScript.


## Features

- Sign up and sign in with AWS Cognito.
- Set up and manage restaurant profile information.
- Create and edit restaurant menus, dishes, and menu images.
- Review incoming table requests and orders, and update their status.
- Synchronize restaurant and menu data with the Yummizi API.
- Receive realtime updates through Ably.

## Technology

- React 19, TypeScript, and Vite
- TanStack Router and TanStack Query
- AWS Amplify Auth (Cognito)
- Ably Realtime
- Axios, Zustand, and Tailwind CSS 4

## Requirements

- Node.js version supported by Vite 8
- npm
- Access to the Yummizi API, Cognito user pool, and Ably project configured for your environment

## Getting started

1. Install dependencies:

   ```sh
   npm install
   ```

2. Create a `.env.local` file in the project root and set the variables used by the app:

   ```dotenv
   VITE_API_BASE_URL=
   VITE_COGNITO_USER_POOL_ID=
   VITE_COGNITO_CLIENT_ID=
   VITE_ABLY_API_KEY=
   ```

   Use the API base URL expected by the API routes in `src/features`. The Cognito values identify the user pool and app client for the environment. The Ably value is currently passed directly to the browser client.

3. Start the development server:

   ```sh
   npm run dev
   ```

   Vite prints the local URL when the server is ready.

## Available scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Start the Vite development server. |
| `npm run build` | Type-check the project and create a production build in `dist`. |
| `npm run preview` | Serve the production build locally. |
| `npm run lint` | Run ESLint. |
| `npm test` | Run the Vitest test suite once. |
| `npm run test:watch` | Run Vitest in watch mode. |
| `npm run test:ui` | Open Vitest's UI mode. |

## Project structure

- `src/app` — application composition, providers, and route configuration.
- `src/features` — authentication, restaurant hub, menu management, restaurant profile, and table-request workflows.
- `src/layouts` — shared page layouts.
- `src/shared` — reusable API client, components, hooks, constants, and utilities.
- `public` and `src/assets` — static and bundled images, icons, and fonts.

Distributor is configured to rewrite application routes to `index.html` for client-side routing.

## Configuration and security

All `VITE_*` variables are included in client-side code and must be considered public. Never put passwords, private keys, backend credentials, or other server-side secrets in these variables or in this repository.

The current Ably integration uses direct API-key authentication in the browser and is marked in the source as suitable for development/prototyping, not production. Before production deployment, replace it with server-issued Ably tokens (for example, through an authenticated token endpoint) and rotate any key that may already have been exposed in a client build. Keep local environment files out of Git; `.env*` files are ignored, except for an optional `.env.example` template.

# Author

Made with 💙 by **Piero Olivas Tuesta**
