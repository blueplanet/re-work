import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import Layout from '@theme/Layout';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

import { useCallback } from "react";
import Particles from "react-particles";
import { loadFull } from "tsparticles";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { solid, regular, brands, icon } from '@fortawesome/fontawesome-svg-core/import.macro' // <-- import styles to be used


import styles from './index.module.css';

export default function Home (): JSX.Element {
  const { siteConfig } = useDocusaurusContext();
  const particlesInit = useCallback(async engine => {
    console.log(engine);
    // you can initiate the tsParticles instance (engine) here, adding custom shapes or presets
    // this loads the tsparticles package bundle, it's the easiest method for getting everything ready
    // starting from v2 you can add only the features you need reducing the bundle size
    await loadFull(engine);
  }, []);

  const particlesLoaded = useCallback(async container => {
    await console.log(container);
  }, []);

  return (
    <main>
      <Particles
        id="tsparticles"
        init={particlesInit}
        loaded={particlesLoaded}
        options={{
          background: {
            color: {
              value: "#000080",
              // value: "#1A1A1A",
            },
          },
          fpsLimit: 240,
          interactivity: {
            events: {
              onClick: {
                enable: true,
                mode: "push",
              },
              onHover: {
                enable: true,
                mode: "grab",
              },
              resize: true,
            },
            modes: {
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
              grab: {
                parallax: {
                  enable: true,
                  force: 600,
                  smooth: 100
                }
              }
            },
          },
          particles: {
            color: {
              value: "#ffffff",
            },
            links: {
              color: "#ffffff",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 2,
            },
            collisions: {
              enable: true,
            },
            move: {
              direction: "none",
              enable: true,
              outModes: {
                default: "bounce",
              },
              random: true,
              speed: 3,
              straight: true,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "edge",
            },
            size: {
              value: { min: 5, max: 10 },
            },
          },
          detectRetina: true,
        }}
      />
      <div className={styles.titleContainer}>
        <div className={styles.title}>blueplanet</div>
        <div className={styles.links}>
          <a href="/blog">
            <FontAwesomeIcon icon={solid("square-rss")} />
          </a>
          <a href="https://github.com/blueplanet">
            <FontAwesomeIcon icon={brands("github")} />
          </a>
          <a href="https://qiita.com/blueplanet">
            <FontAwesomeIcon icon={solid("pen-to-square")} />
          </a>
          <a href="https://twitter.com/blueplanet42">
            <FontAwesomeIcon icon={brands("twitter")} />
          </a>
        </div>
      </div>
    </main>
  );
}
