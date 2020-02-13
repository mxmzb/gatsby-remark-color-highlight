const visit = require("unist-util-visit");
const jsdom = require("jsdom");
const Color = require("color");

const { JSDOM } = jsdom;

module.exports = (
  { markdownAST },
  {
    wrapperElement = "code",
    className = "color-highlight",
    searchNodeTypes = ["text", "paragraph", "inlineCode", "html"],
  },
) => {
  // can't allow empty class, because `traverseHtml` will then become infinite due
  // to newly inserted html nodes, which will have replacable content again and again
  if (!className) {
    throw Error(
      "A (preferrably) unique CSS class must be set for `gatsby-remark-color-highlight`.",
    );
  }

  // thanks to https://stackoverflow.com/a/1636354/744230
  const hexCodeRegex = /#(?:[0-9a-fA-F]{3}){1,2}/gim;
  const checkForReplacableHtmlHexCodeRegex = /<[\w]+[^>]*>.*?(?:#(?:[0-9a-fA-F]{3}){1,2})<\/[\w]+>/gim;

  // test must be either string or `unist-util-is` compatible function
  //  https://github.com/syntax-tree/unist-util-is
  const test = (node, n) => {
    if (searchNodeTypes.indexOf(node.type) > -1) {
      if (node.type === "html") {
        const nodeFragment = JSDOM.fragment(node.value);
        return checkForReplacableHtmlHexCodeRegex.test(nodeFragment.children[0].innerHTML);
      }

      return hexCodeRegex.test(node.value);
    }

    return false;
  };

  const buildNodeHtml = color =>
    `<${wrapperElement} class="${className}" style="background-color: ${color}; color: ${
      Color(color).isLight() ? "#000" : "#fff"
    }">${color}</${wrapperElement}>`;

  const buildColorNode = color => ({
    type: "html",
    children: [],
    value: buildNodeHtml(color),
  });

  const traverseHtml = htmlNode => {
    // thanks to https://stackoverflow.com/a/18622606/744230

    const replaceColorHexOutsideTags = /(#(?:[0-9a-fA-F]{3}){1,2})(?![^<]*>|[^<>]*<\/)/gim;
    const newHtml = htmlNode.innerHTML.replace(replaceColorHexOutsideTags, buildNodeHtml);
    htmlNode.innerHTML = newHtml;

    const htmlChildNodes = htmlNode.childNodes;
    for (let i = 0; i < htmlChildNodes.length; i++) {
      if (!htmlChildNodes[i]) continue;

      if (htmlChildNodes[i].childNodes.length > 0) {
        // this is our current way to prevent an infinite loop and skip newly added html code
        if (htmlChildNodes[i].classList.contains(className)) continue;

        traverseHtml(htmlChildNodes[i]);
      }
    }
  };

  visit(markdownAST, test, (node, index, parent) => {
    let text = node.value;
    let parts = [],
      matches = [];

    if (node.type === "html") {
      // add surrounding `div` because we will then easily access
      // and transform the child node
      const nodeFragment = JSDOM.fragment(`<div>${node.value}</div>`);
      const nodeFragmentElement = nodeFragment.children[0];

      traverseHtml(nodeFragmentElement);
      node.value = nodeFragmentElement.innerHTML;
    } else {
      // for everything else but html nodes
      parts = text.split(hexCodeRegex);
      matches = text.match(hexCodeRegex);

      const replacementChilds = [];
      for (let i = 0; i < parts.length; i++) {
        const nodeCopy = JSON.parse(JSON.stringify(node));
        nodeCopy.value = parts[i];
        delete nodeCopy.position;
        delete nodeCopy.indent;

        if (nodeCopy.value !== "") {
          replacementChilds.push(nodeCopy);
        }

        // make sure matches[i] exists
        if (i < matches.length) {
          replacementChilds.push(buildColorNode(matches[i]));
        }
      }

      parent.children.splice(index, 1, ...replacementChilds);
      return index + replacementChilds.length - 1;
    }
  });

  return markdownAST;
};
