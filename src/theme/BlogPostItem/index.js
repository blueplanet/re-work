import React from 'react';
import BlogPostItem from '@theme-original/BlogPostItem';

import { useBlogPost } from '@docusaurus/theme-common/internal'
import GiscusComponent from '@site/src/components/GiscusComponent';
import useIsBrowser from '@docusaurus/useIsBrowser';

export default function BlogPostItemWrapper(props) {
  const { metadata, isBlogPostPage } = useBlogPost()
  const { frontMatter } = metadata
  const { disableComments } = frontMatter

  return (
    <>
      <BlogPostItem {...props} />
      {(!disableComments && isBlogPostPage) && (
        <GiscusComponent />
      )}
    </>
  );
}
