# Cesium Satellite Visualization in Next.js 15

A Next.js application that demonstrates satellite orbit visualization using CesiumJS, featuring:
- Orbital path visualization
- Event Listing and Timeline

| Mobile | Desktop |
|--------|--------|
| ![localhost_3000_(iPhone 14 Pro Max) (1)](https://github.com/user-attachments/assets/b3df2cac-1649-41ea-af18-ef3ffbd51e2c) | <img width="1129" alt="Screenshot 2025-04-23 at 7 11 21 PM" src="https://github.com/user-attachments/assets/f84dacd2-0398-40f2-b239-9611710d8170" />
 |


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
- KML and CZML formats are used for orbit and event data

## Cesium Integration Strategy
- Do no harm. In other words, ensure easy future upgrades and only customize
where heavily documented and supported by the Cesium team. Example, official
timeline editing is [not supported](https://groups.google.com/g/cesium-dev/c/WF065mEMqCI/m/6RL2_ygTAgAJ?pli=1).

## Credits
Thank you to [nextjs-ts-cesium-example](https://github.com/hyundotio/nextjs-ts-cesium-example/tree/main) for providing inspiration for the foundational boilerplate of this project.

## Deployment
Automatically deploying on each push to main branch via Vercel Github integration. Available at https://ces-tan.vercel.app/

## Next Steps
- Fetch the orbit and paths along with the Satellite movement data.
- Enhance timeline to handle tens of events. Possibly allow a drawer or menu toggle for visibility.
Have a max-height and vertical scroll.
- Choose UI library, initial color scheme, and styling.
- Choose form components, validation approach and overall admin experience for CRUD of events.
- As soon as foundational structure solidifies, bolster with unit tests. Followed shortly by some cypress e2e tests triggered in CI pipeline.
- Add Grafana RUM for monitoring.
