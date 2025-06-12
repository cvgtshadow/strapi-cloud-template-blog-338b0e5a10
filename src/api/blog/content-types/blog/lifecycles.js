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
    const locale = result.locale;

    if (result.blocks) {
      const updatedToc = generateTableOfContents(result.blocks);
      await strapi.entityService.update("api::blog.blog", result.id, {
        data: {
          tableOfContents: updatedToc,
        },
        locale
      });
    }
  },
  async beforeUpdate(event) {
    const { data, where } = event.params;
    const locale = data.locale;
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
          locale,
        }
      );
      data.tableOfContents = generateTableOfContents(blog.blocks);
    }
  },
};
