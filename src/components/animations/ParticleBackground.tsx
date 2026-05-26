"use client";

import Particles from "react-tsparticles";

import { loadFull } from "tsparticles";

export default function ParticleBackground() {
  const particlesInit = async (
    main: any
  ) => {
    await loadFull(main);
  };

  return (
    <Particles
      id="tsparticles"
      init={particlesInit}
      className="fixed inset-0 -z-10"
      options={{
        background: {
          color: {
            value: "#020617",
          },
        },

        fpsLimit: 60,

        particles: {
          color: {
            value: "#7c3aed",
          },

          links: {
            color: "#7c3aed",
            distance: 150,
            enable: true,
            opacity: 0.2,
            width: 1,
          },

          move: {
            enable: true,
            speed: 1,
          },

          number: {
            value: 60,
          },

          opacity: {
            value: 0.3,
          },

          shape: {
            type: "circle",
          },

          size: {
            value: {
              min: 1,
              max: 4,
            },
          },
        },
      }}
    />
  );
}