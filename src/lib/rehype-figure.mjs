import { visit } from 'unist-util-visit';

/**
 * Turns a markdown image that carries a title into a captioned figure:
 *
 *   ![alt](./shot.png "Where this image comes from")
 *
 * becomes `<figure><img><figcaption>…</figcaption></figure>`.
 *
 * The caption states provenance, which matters most when the image was
 * generated rather than photographed: an article that asks people to check
 * what they are shown cannot silently pass off a generated illustration.
 *
 * An image without a title is left exactly as it was, so nothing that already
 * ships changes shape.
 */
export function rehypeFigure() {
  return (tree) => {
    visit(tree, 'element', (node) => {
      if (node.tagName !== 'p') return;

      const kids = node.children.filter(
        (c) => c.type !== 'text' || c.value.trim() !== '',
      );
      if (kids.length !== 1) return;

      const img = kids[0];
      if (img.type !== 'element' || img.tagName !== 'img') return;

      const caption = img.properties?.title;
      if (!caption) return;

      // The title would otherwise also surface as a browser tooltip, saying
      // the same thing twice.
      delete img.properties.title;

      node.tagName = 'figure';
      node.children = [
        img,
        {
          type: 'element',
          tagName: 'figcaption',
          // Classed rather than styled by tag: components render their own
          // figures, and they must keep their own caption styling.
          properties: { className: ['img-credit'] },
          children: [{ type: 'text', value: String(caption) }],
        },
      ];
    });
  };
}
