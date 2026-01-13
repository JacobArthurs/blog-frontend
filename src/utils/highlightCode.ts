import hljs from 'highlight.js/lib/common'

export function highlightCodeBlocks(htmlString: string): string {
  const parser = new DOMParser()
  const doc = parser.parseFromString(htmlString, 'text/html')
  const element = doc.body

  element.querySelectorAll('pre code').forEach((block) => {
    hljs.highlightElement(block as HTMLElement)
  })
  return element.innerHTML
}
