<p align="center">
  <br />
  <img src="https://raw.githubusercontent.com/mxmzb/gatsby-remark-color-highlight/master/media/logo-emoji.png" height="150" />
</p>

<h2 align="center">gatsby-remark-color-highlight</h2>
<h3 align="center">Adds color highlighting to hex codes in your markdown content.</h3>

<p align="center">
  <a href="https://npmjs.org/package/gatsby-remark-color-highlight">
    <img src="https://img.shields.io/npm/v/gatsby-remark-color-highlight" />
  </a>
  <a href="https://github.com/mxmzb/gatsby-remark-color-highlight/blob/master/LICENSE">
    <img src="https://img.shields.io/npm/l/gatsby-remark-color-highlight" />
  </a>
  <a href="https://npmjs.org/package/gatsby-remark-color-highlight">
    <img src="https://img.shields.io/bundlephobia/min/gatsby-remark-color-highlight" />
  </a>
  <img src="https://img.shields.io/badge/PRs-welcome-brightgreen.svg" />
</p>

<br />

<img src="https://raw.githubusercontent.com/mxmzb/gatsby-remark-color-highlight/master/media/example.png" />

Alongside this plugin I've written a [tutorial on creating Gatsby.js plugins](https://maximzubarev.com/how-to-create-a-gatsby-js-transformer-plugin).

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
