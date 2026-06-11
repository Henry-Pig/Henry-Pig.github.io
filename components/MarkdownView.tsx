import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownView({ content }: { content: string }) {
  return (
    <div className="markdown-body">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          a: ({ node: _node, ...props }) => <a {...props} target="_blank" rel="noopener noreferrer" />,
          img: ({ node: _node, ...props }) => <img {...props} className="markdown-image" alt={props.alt || "博客图片"} />
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}
