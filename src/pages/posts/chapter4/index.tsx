import html from './post.html?raw';

export default function Post() {
  return (
    <div className="markdown-body" dangerouslySetInnerHTML={{ __html: html }} />
  );
}
