import vine from "@vinejs/vine";

export const createNewsValdiator = vine.object({
  title: vine.string().minLength(5).maxLength(200),
  content: vine.string().minLength(5).maxLength(200),
});
