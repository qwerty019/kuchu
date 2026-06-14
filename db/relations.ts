import { relations } from "drizzle-orm/relations";
import {
  good,
  content,
  city,
  deliveryZone,
  branch,
  user,
  address,
  order,
  payment,
  category,
  orderGood,
  ost,
  filter,
  filterOption,
  goodFilter,
  discountCard,
  session,
  certBranch,
  cert,
  certPayment,
  userGood,
  orderPromo,
  promo,
  saleBranch,
  sale,
  slide,
  story,
  storyBranch,
  saleGood,
  collection,
  collGood,
  classifier,
  classGood,
  search,
  bannerBranch,
  banner,
  aiProject,
  apChat,
  apChatMessage,
  apKnowledge,
  userApChat,
  userApChatMessage,
} from "./schema";

export const contentRelations = relations(content, ({ one }) => ({
  good: one(good, {
    fields: [content.goodId],
    references: [good.id],
  }),
}));

export const goodRelations = relations(good, ({ one, many }) => ({
  contents: many(content),
  orderGoods: many(orderGood),
  osts: many(ost),
  goodFilters: many(goodFilter),
  category: one(category, {
    fields: [good.categoryId],
    references: [category.id],
  }),
  userGoods: many(userGood),
  saleGoods: many(saleGood),
  collGoods: many(collGood),
  classGoods: many(classGood),
}));

export const deliveryZoneRelations = relations(
  deliveryZone,
  ({ one, many }) => ({
    city: one(city, {
      fields: [deliveryZone.cityId],
      references: [city.id],
    }),
    addresses: many(address),
  })
);

export const cityRelations = relations(city, ({ many }) => ({
  deliveryZones: many(deliveryZone),
  branches: many(branch),
}));

export const userRelations = relations(user, ({ one, many }) => ({
  branch: one(branch, {
    fields: [user.branchId],
    references: [branch.id],
  }),
  orders: many(order),
  payments: many(payment),
  addresses: many(address),
  discountCards: many(discountCard),
  sessions: many(session),
  certs: many(cert),
  userGoods: many(userGood),
  searches: many(search),
  userApChats: many(userApChat),
}));

export const branchRelations = relations(branch, ({ one, many }) => ({
  users: many(user),
  orders: many(order),
  city: one(city, {
    fields: [branch.cityId],
    references: [city.id],
  }),
  osts: many(ost),
  certBranches: many(certBranch),
  saleBranches: many(saleBranch),
  storyBranches: many(storyBranch),
  bannerBranches: many(bannerBranch),
}));

export const orderRelations = relations(order, ({ one, many }) => ({
  address: one(address, {
    fields: [order.addressId],
    references: [address.id],
  }),
  branch: one(branch, {
    fields: [order.branchId],
    references: [branch.id],
  }),
  user: one(user, {
    fields: [order.userId],
    references: [user.id],
  }),
  payments: many(payment),
  orderGoods: many(orderGood),
  orderPromos: many(orderPromo),
}));

export const addressRelations = relations(address, ({ one, many }) => ({
  orders: many(order),
  user: one(user, {
    fields: [address.userId],
    references: [user.id],
  }),
  deliveryZone: one(deliveryZone, {
    fields: [address.zoneId],
    references: [deliveryZone.id],
  }),
}));

export const paymentRelations = relations(payment, ({ one }) => ({
  order: one(order, {
    fields: [payment.orderId],
    references: [order.id],
  }),
  user: one(user, {
    fields: [payment.userId],
    references: [user.id],
  }),
}));

export const categoryRelations = relations(category, ({ one, many }) => ({
  parent: one(category, {
    fields: [category.parentId],
    references: [category.id],
    relationName: "category_parentId_category_id",
  }),
  children: many(category, {
    relationName: "category_parentId_category_id",
  }),
  goods: many(good),
  slides: many(slide),
  sales: many(sale),
}));

export const orderGoodRelations = relations(orderGood, ({ one }) => ({
  good: one(good, {
    fields: [orderGood.goodId],
    references: [good.id],
  }),
  order: one(order, {
    fields: [orderGood.orderId],
    references: [order.id],
  }),
}));

export const ostRelations = relations(ost, ({ one }) => ({
  branch: one(branch, {
    fields: [ost.branchId],
    references: [branch.id],
  }),
  good: one(good, {
    fields: [ost.goodId],
    references: [good.id],
  }),
}));

export const filterOptionRelations = relations(
  filterOption,
  ({ one, many }) => ({
    filter: one(filter, {
      fields: [filterOption.filterId],
      references: [filter.id],
    }),
    goodFilters: many(goodFilter),
  })
);

export const filterRelations = relations(filter, ({ many }) => ({
  filterOptions: many(filterOption),
}));

export const goodFilterRelations = relations(goodFilter, ({ one }) => ({
  good: one(good, {
    fields: [goodFilter.goodId],
    references: [good.id],
  }),
  filterOption: one(filterOption, {
    fields: [goodFilter.optionId],
    references: [filterOption.id],
  }),
}));

export const discountCardRelations = relations(discountCard, ({ one }) => ({
  user: one(user, {
    fields: [discountCard.userId],
    references: [user.id],
  }),
}));

export const sessionRelations = relations(session, ({ one }) => ({
  user: one(user, {
    fields: [session.userId],
    references: [user.id],
  }),
}));

export const certBranchRelations = relations(certBranch, ({ one }) => ({
  branch: one(branch, {
    fields: [certBranch.branchId],
    references: [branch.id],
  }),
  cert: one(cert, {
    fields: [certBranch.certId],
    references: [cert.id],
  }),
}));

export const certRelations = relations(cert, ({ one, many }) => ({
  certBranches: many(certBranch),
  certPayments: many(certPayment),
  user: one(user, {
    fields: [cert.userId],
    references: [user.id],
  }),
}));

export const certPaymentRelations = relations(certPayment, ({ one }) => ({
  cert: one(cert, {
    fields: [certPayment.certId],
    references: [cert.id],
  }),
}));

export const userGoodRelations = relations(userGood, ({ one }) => ({
  good: one(good, {
    fields: [userGood.goodId],
    references: [good.id],
  }),
  user: one(user, {
    fields: [userGood.userId],
    references: [user.id],
  }),
}));

export const orderPromoRelations = relations(orderPromo, ({ one }) => ({
  order: one(order, {
    fields: [orderPromo.orderId],
    references: [order.id],
  }),
  promo: one(promo, {
    fields: [orderPromo.promoId],
    references: [promo.id],
  }),
}));

export const promoRelations = relations(promo, ({ many }) => ({
  orderPromos: many(orderPromo),
}));

export const saleBranchRelations = relations(saleBranch, ({ one }) => ({
  branch: one(branch, {
    fields: [saleBranch.branchId],
    references: [branch.id],
  }),
  sale: one(sale, {
    fields: [saleBranch.saleId],
    references: [sale.id],
  }),
}));

export const saleRelations = relations(sale, ({ one, many }) => ({
  saleBranches: many(saleBranch),
  category: one(category, {
    fields: [sale.categoryId],
    references: [category.id],
  }),
  saleGoods: many(saleGood),
}));

export const slideRelations = relations(slide, ({ one }) => ({
  category: one(category, {
    fields: [slide.categoryId],
    references: [category.id],
  }),
  story: one(story, {
    fields: [slide.storyId],
    references: [story.id],
  }),
}));

export const storyRelations = relations(story, ({ many }) => ({
  slides: many(slide),
  storyBranches: many(storyBranch),
}));

export const storyBranchRelations = relations(storyBranch, ({ one }) => ({
  branch: one(branch, {
    fields: [storyBranch.branchId],
    references: [branch.id],
  }),
  story: one(story, {
    fields: [storyBranch.storyId],
    references: [story.id],
  }),
}));

export const saleGoodRelations = relations(saleGood, ({ one }) => ({
  good: one(good, {
    fields: [saleGood.goodId],
    references: [good.id],
  }),
  sale: one(sale, {
    fields: [saleGood.saleId],
    references: [sale.id],
  }),
}));

export const collGoodRelations = relations(collGood, ({ one }) => ({
  collection: one(collection, {
    fields: [collGood.collectionId],
    references: [collection.id],
  }),
  good: one(good, {
    fields: [collGood.goodId],
    references: [good.id],
  }),
}));

export const collectionRelations = relations(collection, ({ many }) => ({
  collGoods: many(collGood),
}));

export const classGoodRelations = relations(classGood, ({ one }) => ({
  classifier: one(classifier, {
    fields: [classGood.classId],
    references: [classifier.id],
  }),
  good: one(good, {
    fields: [classGood.goodId],
    references: [good.id],
  }),
}));

export const classifierRelations = relations(classifier, ({ many }) => ({
  classGoods: many(classGood),
}));

export const searchRelations = relations(search, ({ one }) => ({
  user: one(user, {
    fields: [search.userId],
    references: [user.id],
  }),
}));

export const bannerRelations = relations(banner, ({ many }) => ({
  bannerBranches: many(bannerBranch),
}));

export const bannerBranchRelations = relations(bannerBranch, ({ one }) => ({
  banner: one(banner, {
    fields: [bannerBranch.bannerId],
    references: [banner.id],
  }),
  branch: one(branch, {
    fields: [bannerBranch.branchId],
    references: [branch.id],
  }),
}));

export const aiProjectRelations = relations(aiProject, ({ many }) => ({
  apChats: many(apChat),
  apKnowledges: many(apKnowledge),
  userApChats: many(userApChat),
}));

export const apChatRelations = relations(apChat, ({ one, many }) => ({
  project: one(aiProject, {
    fields: [apChat.projectId],
    references: [aiProject.id],
  }),
  apChatMessages: many(apChatMessage),
}));

export const apChatMessageRelations = relations(apChatMessage, ({ one }) => ({
  chat: one(apChat, {
    fields: [apChatMessage.chatId],
    references: [apChat.id],
  }),
}));

export const apKnowledgeRelations = relations(apKnowledge, ({ one }) => ({
  project: one(aiProject, {
    fields: [apKnowledge.projectId],
    references: [aiProject.id],
  }),
}));

export const userApChatRelations = relations(userApChat, ({ one, many }) => ({
  user: one(user, {
    fields: [userApChat.userId],
    references: [user.id],
  }),
  project: one(aiProject, {
    fields: [userApChat.projectId],
    references: [aiProject.id],
  }),
  userApChatMessages: many(userApChatMessage),
}));

export const userApChatMessageRelations = relations(
  userApChatMessage,
  ({ one }) => ({
    userChat: one(userApChat, {
      fields: [userApChatMessage.userChatId],
      references: [userApChat.id],
    }),
  })
);
