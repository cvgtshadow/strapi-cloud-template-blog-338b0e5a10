const marked = require("marked");
const DOMPurify = require("dompurify");
const { JSDOM } = require("jsdom");
const window = new JSDOM("").window;
const DOMPurifyInstance = DOMPurify(window);

const generateTableOfContents = (blocks) => {
  const toc = [];
  const regex = /<h([1-6])>(.*?)<\/h\1>/g;

  blocks.forEach((block) => {
    if (block.__component === "shared.rich-text" && block.body) {
      const sanitizedContent = DOMPurifyInstance.sanitize(block.body);
      const htmlContent = marked.parse(sanitizedContent);
      let match;

      const stack = [{ level: 0, children: toc }];

      while ((match = regex.exec(htmlContent)) !== null) {
        const level = parseInt(match[1], 10);
        const text = match[2].replace(/&#39;/g, "'");
        const id = generateId(text);

        const item = {
          level,
          text,
          id,
          children: [],
        };

        while (stack.length > 1 && stack[stack.length - 1].level >= level) {
          stack.pop();
        }

        stack[stack.length - 1].children.push(item);
        stack.push(item);
      }
    }
  });

  return toc;
};

const generateId = (text) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "");
};

module.exports = {
  generateTableOfContents,
  generateId,
};
