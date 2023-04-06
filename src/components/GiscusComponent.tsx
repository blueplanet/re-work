import React from 'react';
import Giscus from "@giscus/react";
import { useColorMode } from '@docusaurus/theme-common';

export default function GiscusComponent () {
  const { colorMode } = useColorMode();

  return (
    <Giscus
      repo="blueplanet/re-work"
      repoId="re-work"
      category="General"
      categoryId="DIC_kwDOJPfPAs4CVlNg"
      mapping="url"                        // Important! To map comments to URL
      term="Welcome to re-work!"
      strict="0"
      reactionsEnabled="1"
      emitMetadata="1"
      inputPosition="top"
      theme={colorMode}
      lang="en"
      loading="lazy"
      crossorigin="anonymous"
      async
    />
  );
}
