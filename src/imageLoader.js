function imageLoader({ src }) {
  return `/img/${src}`; // REPLACE WITH YOUR IMAGE DIRECTORY
}

export function externalImage({ src }) {
  return src;
}

module.exports = imageLoader;


