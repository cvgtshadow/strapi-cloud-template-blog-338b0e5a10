const { generateTableOfContents } = require("../../../../utils/script");

module.exports = {
  async beforeCreate(event) {
    const { data } = event.params;

    if (data.publishedAt && !data.publishedDate) {
      data.publishedDate = new Date().toISOString();
    }

    if (data.isHighlight) {
      await strapi.db.query("api::blog.blog").updateMany({
        where: { isHighlight: true },
        data: { isHighlight: false },
      });
    }
  },
  async afterCreate(event) {
    const { result } = event;
    if (result.blocks) {
      const updatedToc = generateTableOfContents(result.blocks);
      await strapi.entityService.update("api::blog.blog", result.id, {
        data: {
          tableOfContents: updatedToc,
        },
      });
    }
  },
  async beforeUpdate(event) {
    const { data, where } = event.params;
    console.log({ data });
    if (data.publishedAt && !data.publishedDate) {
      data.publishedDate = new Date().toISOString();
    }

    if (data.isHighlight) {
      await strapi.db.query("api::blog.blog").updateMany({
        where: { isHighlight: true },
        data: { isHighlight: false },
      });
    }

    if (data.blocks) {
      const blog = await strapi.entityService.findOne(
        "api::blog.blog",
        where.id,
        {
          populate: {
            blocks: true,
          },
        }
      );
      data.tableOfContents = generateTableOfContents(blog.blocks);
    }
  },
};
