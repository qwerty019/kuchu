import {
  pgTable,
  foreignKey,
  serial,
  integer,
  text,
  boolean,
  timestamp,
  doublePrecision,
  date,
  uniqueIndex,
  customType,
  index,
  vector,
} from "drizzle-orm/pg-core";
import { SQL, sql } from "drizzle-orm";

export const tsvector = customType<{
  data: string;
}>({
  dataType() {
    return `tsvector`;
  },
});

export const content = pgTable(
  "Content",
  {
    id: serial().primaryKey().notNull(),
    goodId: integer().notNull(),
    title: text().notNull(),
    content: text().notNull(),
    text: text().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.goodId],
      foreignColumns: [good.id],
      name: "Content_goodId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_content_goodId").on(table.goodId),
  ]
);

export const deliveryZone = pgTable(
  "DeliveryZone",
  {
    id: serial().primaryKey().notNull(),
    cityId: integer().notNull(),
    title: text().notNull(),
    price: doublePrecision().notNull(),
    threshold: doublePrecision().notNull(),
    freeDelivery: doublePrecision().notNull(),
    polygon: text().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    color: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.cityId],
      foreignColumns: [city.id],
      name: "DeliveryZone_cityId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_deliveryzone_cityId").on(table.cityId),
  ]
);

export const call = pgTable("Call", {
  id: serial().primaryKey().notNull(),
  phone: text().notNull(),
  callId: text().notNull(),
  code: text().notNull(),
  isDeleted: boolean().default(false).notNull(),
  createdAt: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
});

export const user = pgTable(
  "User",
  {
    id: serial().primaryKey().notNull(),
    name: text(),
    surname: text(),
    patronymic: text(),
    avatar: text(),
    dob: date(),
    phone: text(),
    email: text(),
    password: text(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
    roles: text().array(),
    branchId: integer(),
    method: text(),
    applied: boolean().default(false).notNull(),
    promo: boolean().default(false).notNull(),
    share: boolean().default(false).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.branchId],
      foreignColumns: [branch.id],
      name: "User_branchId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    index("idx_user_branchId").on(table.branchId),
  ]
);

export const city = pgTable("City", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  isDeleted: boolean().default(false).notNull(),
  createdAt: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  route: text().notNull(),
});

export const order = pgTable(
  "Order",
  {
    id: serial().primaryKey().notNull(),
    userId: integer().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
    addressId: integer(),
    deliveryFee: doublePrecision(),
    branchId: integer(),
    sum: doublePrecision().notNull(),
    allSum: doublePrecision().notNull(),
    deliveryTime: text(),
    paymentType: text().notNull(),
    status: text().notNull(),
    fbId: integer(),
    body: text(),
    version: integer().notNull().default(1),
    error: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.addressId],
      foreignColumns: [address.id],
      name: "Order_addressId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    foreignKey({
      columns: [table.branchId],
      foreignColumns: [branch.id],
      name: "Order_branchId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "Order_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_order_addressId").on(table.addressId),
    index("idx_order_branchId").on(table.branchId),
    index("idx_order_userId").on(table.userId),
  ]
);

export const payment = pgTable(
  "Payment",
  {
    id: serial().primaryKey().notNull(),
    orderId: integer().notNull(),
    amount: doublePrecision().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
    userId: integer().notNull(),
    status: text(),
    ykId: text(),
    url: text(),
    token: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.orderId],
      foreignColumns: [order.id],
      name: "Payment_orderId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "Payment_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_payment_orderId").on(table.orderId),
    index("idx_payment_userId").on(table.userId),
  ]
);

export const category = pgTable(
  "Category",
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    route: text().notNull(),
    parentId: integer(),
    position: integer(),
    url: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.parentId],
      foreignColumns: [table.id],
      name: "Category_parentId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    index("idx_category_parentId").on(table.parentId),
  ]
);

export const branch = pgTable(
  "Branch",
  {
    id: serial().primaryKey().notNull(),
    cityId: integer().notNull(),
    title: text().notNull(),
    address: text(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    main: boolean().default(false).notNull(),
    fbId: integer(),
    lat: doublePrecision(),
    long: doublePrecision(),
  },
  (table) => [
    foreignKey({
      columns: [table.cityId],
      foreignColumns: [city.id],
      name: "Branch_cityId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_branch_cityId").on(table.cityId),
  ]
);

export const orderGood = pgTable(
  "OrderGood",
  {
    id: serial().primaryKey().notNull(),
    orderId: integer().notNull(),
    goodId: integer().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    price: doublePrecision().notNull(),
    qnt: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.goodId],
      foreignColumns: [good.id],
      name: "OrderGood_goodId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.orderId],
      foreignColumns: [order.id],
      name: "OrderGood_orderId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_ordergood_goodId").on(table.goodId),
    index("idx_ordergood_orderId").on(table.orderId),
  ]
);

export const ost = pgTable(
  "Ost",
  {
    id: serial().primaryKey().notNull(),
    goodId: integer().notNull(),
    branchId: integer().notNull(),
    naklDataId: integer().notNull(),
    uQntOst: doublePrecision().notNull(),
    priceRoznWNDS: doublePrecision().notNull(),
    jv: boolean().notNull(),
    brakLS: boolean().notNull(),
    isAptekaRu: boolean().notNull(),
    isPersonalOrder: boolean().notNull(),
    recipe: boolean().notNull(),
    uQntRez: doublePrecision().notNull(),
    nds: integer().notNull(),
    srokG: text().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    fixPriceValue: doublePrecision().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.branchId],
      foreignColumns: [branch.id],
      name: "Ost_branchId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.goodId],
      foreignColumns: [good.id],
      name: "Ost_goodId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_ost_branchId").on(table.branchId),
    index("idx_ost_goodId").on(table.goodId),
  ]
);

export const address = pgTable(
  "Address",
  {
    id: serial().primaryKey().notNull(),
    userId: integer().notNull(),
    address: text().notNull(),
    entrance: text(),
    floor: text(),
    apartment: text(),
    comment: text(),
    selected: boolean().default(false).notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    lat: doublePrecision(),
    long: doublePrecision(),
    price: doublePrecision(),
    zoneId: integer(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "Address_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.zoneId],
      foreignColumns: [deliveryZone.id],
      name: "Address_zoneId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    index("idx_address_userId").on(table.userId),
    index("idx_address_zoneId").on(table.zoneId),
  ]
);

export const filter = pgTable("Filter", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  type: text().notNull(),
});

export const filterOption = pgTable(
  "FilterOption",
  {
    id: serial().primaryKey().notNull(),
    filterId: integer().notNull(),
    value: text().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.filterId],
      foreignColumns: [filter.id],
      name: "FilterOption_filterId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_filteroption_filterId").on(table.filterId),
  ]
);

export const goodFilter = pgTable(
  "GoodFilter",
  {
    id: serial().primaryKey().notNull(),
    goodId: integer().notNull(),
    optionId: integer().notNull(),
  },
  (table) => [
    uniqueIndex("GoodFilter_goodId_optionId_key").using(
      "btree",
      table.goodId.asc().nullsLast().op("int4_ops"),
      table.optionId.asc().nullsLast().op("int4_ops")
    ),
    foreignKey({
      columns: [table.goodId],
      foreignColumns: [good.id],
      name: "GoodFilter_goodId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.optionId],
      foreignColumns: [filterOption.id],
      name: "GoodFilter_optionId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_goodfilter_optionId").on(table.optionId),
  ]
);

export const good = pgTable(
  "Good",
  {
    id: serial().primaryKey().notNull(),
    regId: integer().notNull(),
    drugId: integer().notNull(),
    formId: integer().notNull(),
    fabrId: integer().notNull(),
    mnnId: integer().notNull(),
    drug: text().notNull(),
    form: text().notNull(),
    fabr: text().notNull(),
    mnn: text().notNull(),
    flag: integer().notNull(),
    ean: text().notNull(),
    isVital: boolean().notNull(),
    isService: boolean().notNull(),
    rSum: doublePrecision().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    categoryId: integer(),
    formoutput: text(),
    imported: boolean().default(false).notNull(),
    torgname: text(),
    img: text(),
    fullName: text("full_name").notNull(),
    descId: integer("desc_id"),
    contentText: text("content_text"),
    searchVector: tsvector("search_vector")
      .notNull()
      .generatedAlwaysAs(
        (): SQL => sql`to_tsvector('russian', ${good.contentText})`
      ),
    isHidden: boolean().default(false).notNull(),
    title: text(),
    subtitle: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [category.id],
      name: "Good_categoryId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    index("idx_good_search_vector").using("gin", table.searchVector),
    index("idx_good_categoryId").on(table.categoryId),
  ]
);

export const discountCard = pgTable(
  "DiscountCard",
  {
    id: serial().primaryKey().notNull(),
    userId: integer().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    accumulation: doublePrecision().notNull(),
    barcode: text().notNull(),
    discount: doublePrecision().notNull(),
    discountJ: doublePrecision().notNull(),
    rateAccumulation: doublePrecision().notNull(),
    rateAccumulationJ: doublePrecision().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "DiscountCard_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_discountcard_userId").on(table.userId),
  ]
);

export const session = pgTable(
  "Session",
  {
    id: text().primaryKey().notNull(),
    userId: integer().notNull(),
    expiresAt: timestamp({ precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "Session_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("cascade"),
    index("idx_session_userId").on(table.userId),
  ]
);

export const certBranch = pgTable(
  "CertBranch",
  {
    id: serial().primaryKey().notNull(),
    certId: integer().notNull(),
    branchId: integer().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.branchId],
      foreignColumns: [branch.id],
      name: "CertBranch_branchId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.certId],
      foreignColumns: [cert.id],
      name: "CertBranch_certId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_certbranch_branchId").on(table.branchId),
    index("idx_certbranch_certId").on(table.certId),
  ]
);

export const certPayment = pgTable(
  "CertPayment",
  {
    id: serial().primaryKey().notNull(),
    certId: integer().notNull(),
    amount: doublePrecision().notNull(),
    status: text(),
    ykId: text(),
    url: text(),
    token: text(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.certId],
      foreignColumns: [cert.id],
      name: "CertPayment_certId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_certpayment_certId").on(table.certId),
  ]
);

export const certOption = pgTable("CertOption", {
  id: serial().primaryKey().notNull(),
  nominal: integer().notNull(),
  url: text(),
  title: text(),
  show: boolean().default(false).notNull(),
  isDeleted: boolean().default(false).notNull(),
  createdAt: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
});

export const cert = pgTable(
  "Cert",
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    status: integer().notNull(),
    nominal: integer().notNull(),
    number: text().notNull(),
    expDate: date().notNull(),
    email: text().notNull(),
    isPaid: boolean().default(false).notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    userId: integer().notNull(),
    code: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "Cert_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_cert_userId").on(table.userId),
  ]
);

export const userGood = pgTable(
  "UserGood",
  {
    id: serial().primaryKey().notNull(),
    userId: integer().notNull(),
    goodId: integer().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.goodId],
      foreignColumns: [good.id],
      name: "UserGood_goodId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "UserGood_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_usergood_goodId").on(table.goodId),
    index("idx_usergood_userId").on(table.userId),
  ]
);

export const orderPromo = pgTable(
  "OrderPromo",
  {
    id: serial().primaryKey().notNull(),
    promoId: integer().notNull(),
    orderId: integer().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.orderId],
      foreignColumns: [order.id],
      name: "OrderPromo_orderId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.promoId],
      foreignColumns: [promo.id],
      name: "OrderPromo_promoId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_orderpromo_orderId").on(table.orderId),
    index("idx_orderpromo_promoId").on(table.promoId),
  ]
);

export const promo = pgTable("Promo", {
  id: serial().primaryKey().notNull(),
  code: text().notNull(),
  percent: doublePrecision(),
  amount: doublePrecision(),
  forFirstOrder: boolean().default(false).notNull(),
  isDeleted: boolean().default(false).notNull(),
  createdAt: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  completed: boolean().default(false).notNull(),
});

export const saleBranch = pgTable(
  "SaleBranch",
  {
    id: serial().primaryKey().notNull(),
    saleId: integer().notNull(),
    branchId: integer().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.branchId],
      foreignColumns: [branch.id],
      name: "SaleBranch_branchId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.saleId],
      foreignColumns: [sale.id],
      name: "SaleBranch_saleId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_salebranch_branchId").on(table.branchId),
    index("idx_salebranch_saleId").on(table.saleId),
  ]
);

export const slide = pgTable(
  "Slide",
  {
    id: serial().primaryKey().notNull(),
    storyId: integer().notNull(),
    title: text().notNull(),
    subtitle: text(),
    text: text().notNull(),
    img: text().notNull(),
    categoryId: integer(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    button: text(),
    link: text(),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [category.id],
      name: "Slide_categoryId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    foreignKey({
      columns: [table.storyId],
      foreignColumns: [story.id],
      name: "Slide_storyId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_slide_categoryId").on(table.categoryId),
    index("idx_slide_storyId").on(table.storyId),
  ]
);

export const storyBranch = pgTable(
  "StoryBranch",
  {
    id: serial().primaryKey().notNull(),
    storyId: integer().notNull(),
    branchId: integer().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.branchId],
      foreignColumns: [branch.id],
      name: "StoryBranch_branchId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.storyId],
      foreignColumns: [story.id],
      name: "StoryBranch_storyId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_storybranch_branchId").on(table.branchId),
    index("idx_storybranch_storyId").on(table.storyId),
  ]
);

export const sale = pgTable(
  "Sale",
  {
    id: serial().primaryKey().notNull(),
    title: text().notNull(),
    img: text().notNull(),
    images: text().array(),
    subtitle: text(),
    text: text(),
    categoryId: integer(),
    startDate: date().notNull(),
    endDate: date().notNull(),
    selected: boolean().default(false).notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
    position: integer(),
    show: boolean().default(true).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.categoryId],
      foreignColumns: [category.id],
      name: "Sale_categoryId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    index("idx_sale_categoryId").on(table.categoryId),
  ]
);

export const saleGood = pgTable(
  "SaleGood",
  {
    id: serial().primaryKey().notNull(),
    saleId: integer().notNull(),
    goodId: integer().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.goodId],
      foreignColumns: [good.id],
      name: "SaleGood_goodId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.saleId],
      foreignColumns: [sale.id],
      name: "SaleGood_saleId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_salegood_goodId").on(table.goodId),
    index("idx_salegood_saleId").on(table.saleId),
  ]
);

export const story = pgTable("Story", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  img: text().notNull(),
  isDeleted: boolean().default(false).notNull(),
  createdAt: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  completed: boolean().default(false).notNull(),
  position: integer(),
  show: boolean().default(true).notNull(),
});

export const navText = pgTable("NavText", {
  id: serial().primaryKey().notNull(),
  text: text().notNull(),
  show: boolean().default(false).notNull(),
  isDeleted: boolean().default(false).notNull(),
  createdAt: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
});

export const collGood = pgTable(
  "CollGood",
  {
    id: serial().primaryKey().notNull(),
    goodId: integer().notNull(),
    collectionId: integer().notNull(),
    position: integer(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.collectionId],
      foreignColumns: [collection.id],
      name: "CollGood_collectionId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.goodId],
      foreignColumns: [good.id],
      name: "CollGood_goodId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_collgood_collectionId").on(table.collectionId),
    index("idx_collgood_goodId").on(table.goodId),
  ]
);

export const collection = pgTable("Collection", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  img: text(),
  position: integer(),
  isDeleted: boolean().default(false).notNull(),
  createdAt: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  show: boolean().default(false).notNull(),
});

export const classGood = pgTable(
  "ClassGood",
  {
    id: serial().primaryKey().notNull(),
    goodId: integer().notNull(),
    classId: integer().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.classId],
      foreignColumns: [classifier.id],
      name: "ClassGood_classId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.goodId],
      foreignColumns: [good.id],
      name: "ClassGood_goodId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_classgood_classId").on(table.classId),
    index("idx_classgood_goodId").on(table.goodId),
  ]
);

export const classifier = pgTable("Classifier", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
});

export const search = pgTable(
  "Search",
  {
    id: serial().primaryKey().notNull(),
    query: text().notNull(),
    userId: integer(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "date" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "date" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "Search_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("set null"),
    index("idx_search_userId").on(table.userId),
  ]
);

export const suggestion = pgTable("Suggestion", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  isDeleted: boolean().default(false).notNull(),
  createdAt: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
});

export const banner = pgTable("Banner", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  img: text().notNull(),
  subtitle: text(),
  isDeleted: boolean().default(false).notNull(),
  createdAt: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  position: integer(),
  show: boolean().default(true).notNull(),
});

export const bannerBranch = pgTable(
  "BannerBranch",
  {
    id: serial().primaryKey().notNull(),
    bannerId: integer().notNull(),
    branchId: integer().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.branchId],
      foreignColumns: [branch.id],
      name: "BannerBranch_branchId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.bannerId],
      foreignColumns: [banner.id],
      name: "BannerBranch_bannerId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_bannerbranch_bannerId").on(table.bannerId),
    index("idx_bannerbranch_branchId").on(table.branchId),
  ]
);

export const searchExclusion = pgTable("SearchExclusion", {
  id: serial().primaryKey().notNull(),
  query: text().notNull(),
  list: text("list").array().notNull(),
});

export const aiProject = pgTable("AiProject", {
  id: serial().primaryKey().notNull(),
  title: text().notNull(),
  description: text(),
  instructions: text().notNull(),
  selected: boolean().default(false).notNull(),
  isDeleted: boolean().default(false).notNull(),
  createdAt: timestamp({ precision: 3, mode: "string" })
    .default(sql`CURRENT_TIMESTAMP`)
    .notNull(),
  updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
});

export const apKnowledge = pgTable(
  "ApKnowledge",
  {
    id: serial().primaryKey().notNull(),
    projectId: integer().notNull(),
    title: text().notNull(),
    content: text().notNull(),
    embeddings: vector("embedding", { dimensions: 256 }),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [aiProject.id],
      name: "ApKnowledge_projectId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_apknowledge_projectId").on(table.projectId),
  ]
);

export const apChat = pgTable(
  "ApChat",
  {
    id: serial().primaryKey().notNull(),
    projectId: integer().notNull(),
    title: text().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [aiProject.id],
      name: "ApChat_projectId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_apchat_projectId").on(table.projectId),
  ]
);

export const apChatMessage = pgTable(
  "ApChatMessage",
  {
    id: serial().primaryKey().notNull(),
    chatId: integer().notNull(),
    role: text().notNull(),
    content: text().notNull(),
    inputTokens: integer(),
    outputTokens: integer(),
    price: doublePrecision(),
    usedContext: text(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.chatId],
      foreignColumns: [apChat.id],
      name: "ApChatMessage_chatId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_apchatmessage_chatId").on(table.chatId),
  ]
);

export const userApChat = pgTable(
  "UserApChat",
  {
    id: serial().primaryKey().notNull(),
    userId: integer().notNull(),
    projectId: integer().notNull(),
    title: text().notNull(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.projectId],
      foreignColumns: [aiProject.id],
      name: "UserApChat_projectId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    foreignKey({
      columns: [table.userId],
      foreignColumns: [user.id],
      name: "UserApChat_userId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_userapchat_projectId").on(table.projectId),
    index("idx_userapchat_userId").on(table.userId),
  ]
);

export const userApChatMessage = pgTable(
  "UserApChatMessage",
  {
    id: serial().primaryKey().notNull(),
    userChatId: integer().notNull(),
    role: text().notNull(),
    content: text().notNull(),
    inputTokens: integer(),
    outputTokens: integer(),
    price: doublePrecision(),
    usedContext: text(),
    isDeleted: boolean().default(false).notNull(),
    createdAt: timestamp({ precision: 3, mode: "string" })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp({ precision: 3, mode: "string" }).notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.userChatId],
      foreignColumns: [userApChat.id],
      name: "UserApChatMessage_userChatId_fkey",
    })
      .onUpdate("cascade")
      .onDelete("restrict"),
    index("idx_userapchatmessage_userChatId").on(table.userChatId),
  ]
);
