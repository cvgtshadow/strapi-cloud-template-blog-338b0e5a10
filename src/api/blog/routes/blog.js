/**
 * writing router
 */

const { createCoreRouter } = require('@strapi/strapi').factories;

module.exports = createCoreRouter(
  "api::blog.blog"
);
