# gatsby-remark-color-highlight

Adds color highlighting to hexcodes in your markdown content.

This is a sub-plugin for `gatsby-transformer-remark`. As demoed below, add this plugin to the options of `gatsby-transformer-remark`.

## Install

`npm install --save gatsby-remark-color-highlight`

## How to use

```javascript
// In your gatsby-config.js
module.exports = {
  plugins: [
    {
      resolve: `gatsby-transformer-remark`,
      options: {
        plugins: [`gatsby-remark-color-highlight`],
      },
    },
  ],
};
```

Note: If you are using `gatsby-remark-vscode` and want to highlight color hexcodes in your code examples, make sure that it’s listed before this plugin.

## Options

- `wrapperElement`: The tag that you want to wrap your color hexcodes with. Defaults to `"code"`
- `className`: The class you want to add to your wrapping element. This can not be set to an empty value. Defaults to `"color-highlight"`
- `searchNodeTypes`: The AST node types that you want to search for color hexcodes. Will search all child nodes deeply. Defaults to `["text", "paragraph", "inlineCode", "html"]`
