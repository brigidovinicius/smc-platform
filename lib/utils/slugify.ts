/**
 * Slugify Utility
 * 
 * Converts a string into a URL-friendly slug.
 * 
 * @param {string} value - The string to slugify
 * @returns {string} URL-friendly slug
 * @example
 * slugify('Hello World!') // 'hello-world'
 * slugify('  Multiple   Spaces  ') // 'multiple-spaces'
 */
export const slugify = (value: string) =>
  value
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/--+/g, '-')
    .replace(/^-+/, '')
    .replace(/-+$/, '');




