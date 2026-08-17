interface HtmlPreviewProps {
  html: string
  title?: string
}

/**
 * Renders stored HTML (affiliate embeds, product widgets, etc.)
 * inside a sandboxed iframe for isolation.
 */
export default function HtmlPreview({ html, title = 'HTML preview' }: HtmlPreviewProps) {
  return (
    <iframe
      className="hanghoa-html-preview"
      title={title}
      sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
      srcDoc={html}
    />
  )
}
