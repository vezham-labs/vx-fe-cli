export const toTitleCase = (text: string) => {
  if (!text) return ''

  return text
    .trim()
    .replace(/[\s_-]+/g, ' ')
    .split(' ')
    .filter(Boolean)
    .map(word =>
      word.toLowerCase() === 'cdn'
        ? 'CDN'
        : word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
    )
    .join(' ')
}
