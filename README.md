# Cesium Satellite Visualization in Next.js 14

A Next.js application that demonstrates satellite orbit visualization using CesiumJS, featuring:
- Orbital path visualization
- 3D terrain visualization

## Prerequisites

- Node.js (v18 or newer recommended)
- npm (comes with Node.js)
- A Cesium ion access token (get one for free at [https://cesium.com/ion/signup](https://cesium.com/ion/signup))

## Setup Instructions

1. Clone the repository:
   ```bash
   git clone git@github.com:jmckenney/ces.git
   cd ces
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the root directory and add your Cesium ion access token:
   ```env
   NEXT_PUBLIC_CESIUM_TOKEN=your-token-here
   ```

## Running the Application

### Development Mode
Run the application in development mode with hot-reload:
```bash
npm run dev
```
The application will be available at [http://localhost:3000](http://localhost:3000)

### Production Build
1. Build the application:
   ```bash
   npm run build
   ```

2. Start the production server:
   ```bash
   npm start
   ```

## Project Structure

- `/public` - Static assets including satellite models and orbit data
  - `AcrimSAT.glb` - 3D satellite model
  - `SatellitesOrbits.kml` - Orbital path and event definitions
  - `SatellitesOverTime.czml` - Time-dynamic satellite positioning data

- `/src/app` - Next.js application code
  - `Components/` - React components including CesiumJS integration
  - `types/` - TypeScript type definitions

## Features

- **Event Timeline**: Shows scheduled and captured photo events along the orbital path
- **3D Terrain**: Realistic Earth terrain visualization using Cesium World Terrain
- **Time Controls**: Animation controls for satellite movement and event timing

## Development Notes

- The application uses Next.js with TypeScript for type safety
- CesiumJS is integrated as a client-side component
- Turbopack is enabled for faster development builds
- KML and CZML formats are used for orbit and event data

### Credits
Thank you to [nextjs-ts-cesium-example](https://github.com/hyundotio/nextjs-ts-cesium-example/tree/main) for providing inspiration for the foundational boilerplate of this project.