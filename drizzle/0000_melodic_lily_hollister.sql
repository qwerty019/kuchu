CREATE SCHEMA IF NOT EXISTS extensions;
CREATE EXTENSION IF NOT EXISTS vector;

CREATE EXTENSION IF NOT EXISTS vector WITH SCHEMA extensions;

CREATE TABLE "Address" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"address" text NOT NULL,
	"entrance" text,
	"floor" text,
	"apartment" text,
	"comment" text,
	"selected" boolean DEFAULT false NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"lat" double precision,
	"long" double precision,
	"price" double precision,
	"zoneId" integer
);
--> statement-breakpoint
CREATE TABLE "AiProject" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"instructions" text NOT NULL,
	"selected" boolean DEFAULT false NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ApChat" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"title" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ApChatMessage" (
	"id" serial PRIMARY KEY NOT NULL,
	"chatId" integer NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"inputTokens" integer,
	"outputTokens" integer,
	"price" double precision,
	"usedContext" text,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ApKnowledge" (
	"id" serial PRIMARY KEY NOT NULL,
	"projectId" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"embedding" vector(256),
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Banner" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"img" text NOT NULL,
	"subtitle" text,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"position" integer,
	"show" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "BannerBranch" (
	"id" serial PRIMARY KEY NOT NULL,
	"bannerId" integer NOT NULL,
	"branchId" integer NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Branch" (
	"id" serial PRIMARY KEY NOT NULL,
	"cityId" integer NOT NULL,
	"title" text NOT NULL,
	"address" text,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"main" boolean DEFAULT false NOT NULL,
	"fbId" integer,
	"lat" double precision,
	"long" double precision
);
--> statement-breakpoint
CREATE TABLE "Call" (
	"id" serial PRIMARY KEY NOT NULL,
	"phone" text NOT NULL,
	"callId" text NOT NULL,
	"code" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Category" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"route" text NOT NULL,
	"parentId" integer,
	"position" integer,
	"url" text
);
--> statement-breakpoint
CREATE TABLE "Cert" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"status" integer NOT NULL,
	"nominal" integer NOT NULL,
	"number" text NOT NULL,
	"expDate" date NOT NULL,
	"email" text NOT NULL,
	"isPaid" boolean DEFAULT false NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"userId" integer NOT NULL,
	"code" text
);
--> statement-breakpoint
CREATE TABLE "CertBranch" (
	"id" serial PRIMARY KEY NOT NULL,
	"certId" integer NOT NULL,
	"branchId" integer NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "CertOption" (
	"id" serial PRIMARY KEY NOT NULL,
	"nominal" integer NOT NULL,
	"url" text,
	"title" text,
	"show" boolean DEFAULT false NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "CertPayment" (
	"id" serial PRIMARY KEY NOT NULL,
	"certId" integer NOT NULL,
	"amount" double precision NOT NULL,
	"status" text,
	"ykId" text,
	"url" text,
	"token" text,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "City" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"route" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "ClassGood" (
	"id" serial PRIMARY KEY NOT NULL,
	"goodId" integer NOT NULL,
	"classId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Classifier" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "CollGood" (
	"id" serial PRIMARY KEY NOT NULL,
	"goodId" integer NOT NULL,
	"collectionId" integer NOT NULL,
	"position" integer,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Collection" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"img" text,
	"position" integer,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"show" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Content" (
	"id" serial PRIMARY KEY NOT NULL,
	"goodId" integer NOT NULL,
	"title" text NOT NULL,
	"content" text NOT NULL,
	"text" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "DeliveryZone" (
	"id" serial PRIMARY KEY NOT NULL,
	"cityId" integer NOT NULL,
	"title" text NOT NULL,
	"price" double precision NOT NULL,
	"threshold" double precision NOT NULL,
	"freeDelivery" double precision NOT NULL,
	"polygon" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"color" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "DiscountCard" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"accumulation" double precision NOT NULL,
	"barcode" text NOT NULL,
	"discount" double precision NOT NULL,
	"discountJ" double precision NOT NULL,
	"rateAccumulation" double precision NOT NULL,
	"rateAccumulationJ" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Filter" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"type" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "FilterOption" (
	"id" serial PRIMARY KEY NOT NULL,
	"filterId" integer NOT NULL,
	"value" text NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Good" (
	"id" serial PRIMARY KEY NOT NULL,
	"regId" integer NOT NULL,
	"drugId" integer NOT NULL,
	"formId" integer NOT NULL,
	"fabrId" integer NOT NULL,
	"mnnId" integer NOT NULL,
	"drug" text NOT NULL,
	"form" text NOT NULL,
	"fabr" text NOT NULL,
	"mnn" text NOT NULL,
	"flag" integer NOT NULL,
	"ean" text NOT NULL,
	"isVital" boolean NOT NULL,
	"isService" boolean NOT NULL,
	"rSum" double precision NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"categoryId" integer,
	"formoutput" text,
	"imported" boolean DEFAULT false NOT NULL,
	"torgname" text,
	"img" text,
	"full_name" text NOT NULL,
	"desc_id" integer,
	"content_text" text,
	"search_vector" "tsvector" GENERATED ALWAYS AS (to_tsvector('russian', "Good"."content_text")) STORED NOT NULL,
	"isHidden" boolean DEFAULT false NOT NULL,
	"title" text,
	"subtitle" text
);
--> statement-breakpoint
CREATE TABLE "GoodFilter" (
	"id" serial PRIMARY KEY NOT NULL,
	"goodId" integer NOT NULL,
	"optionId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "NavText" (
	"id" serial PRIMARY KEY NOT NULL,
	"text" text NOT NULL,
	"show" boolean DEFAULT false NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Order" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"addressId" integer,
	"deliveryFee" double precision,
	"branchId" integer,
	"sum" double precision NOT NULL,
	"allSum" double precision NOT NULL,
	"deliveryTime" text,
	"paymentType" text NOT NULL,
	"status" text NOT NULL,
	"fbId" integer,
	"body" text,
	"version" integer DEFAULT 1 NOT NULL,
	"error" text
);
--> statement-breakpoint
CREATE TABLE "OrderGood" (
	"id" serial PRIMARY KEY NOT NULL,
	"orderId" integer NOT NULL,
	"goodId" integer NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"price" double precision NOT NULL,
	"qnt" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "OrderPromo" (
	"id" serial PRIMARY KEY NOT NULL,
	"promoId" integer NOT NULL,
	"orderId" integer NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Ost" (
	"id" serial PRIMARY KEY NOT NULL,
	"goodId" integer NOT NULL,
	"branchId" integer NOT NULL,
	"naklDataId" integer NOT NULL,
	"uQntOst" double precision NOT NULL,
	"priceRoznWNDS" double precision NOT NULL,
	"jv" boolean NOT NULL,
	"brakLS" boolean NOT NULL,
	"isAptekaRu" boolean NOT NULL,
	"isPersonalOrder" boolean NOT NULL,
	"recipe" boolean NOT NULL,
	"uQntRez" double precision NOT NULL,
	"nds" integer NOT NULL,
	"srokG" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"fixPriceValue" double precision NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Payment" (
	"id" serial PRIMARY KEY NOT NULL,
	"orderId" integer NOT NULL,
	"amount" double precision NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"userId" integer NOT NULL,
	"status" text,
	"ykId" text,
	"url" text,
	"token" text
);
--> statement-breakpoint
CREATE TABLE "Promo" (
	"id" serial PRIMARY KEY NOT NULL,
	"code" text NOT NULL,
	"percent" double precision,
	"amount" double precision,
	"forFirstOrder" boolean DEFAULT false NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Sale" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"img" text NOT NULL,
	"images" text[],
	"subtitle" text,
	"text" text,
	"categoryId" integer,
	"startDate" date NOT NULL,
	"endDate" date NOT NULL,
	"selected" boolean DEFAULT false NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"position" integer,
	"show" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SaleBranch" (
	"id" serial PRIMARY KEY NOT NULL,
	"saleId" integer NOT NULL,
	"branchId" integer NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SaleGood" (
	"id" serial PRIMARY KEY NOT NULL,
	"saleId" integer NOT NULL,
	"goodId" integer NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Search" (
	"id" serial PRIMARY KEY NOT NULL,
	"query" text NOT NULL,
	"userId" integer,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "SearchExclusion" (
	"id" serial PRIMARY KEY NOT NULL,
	"query" text NOT NULL,
	"list" text[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Session" (
	"id" text PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"expiresAt" timestamp (3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Slide" (
	"id" serial PRIMARY KEY NOT NULL,
	"storyId" integer NOT NULL,
	"title" text NOT NULL,
	"subtitle" text,
	"text" text NOT NULL,
	"img" text NOT NULL,
	"categoryId" integer,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"button" text,
	"link" text
);
--> statement-breakpoint
CREATE TABLE "Story" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"img" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"position" integer,
	"show" boolean DEFAULT true NOT NULL
);
--> statement-breakpoint
CREATE TABLE "StoryBranch" (
	"id" serial PRIMARY KEY NOT NULL,
	"storyId" integer NOT NULL,
	"branchId" integer NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "Suggestion" (
	"id" serial PRIMARY KEY NOT NULL,
	"title" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "User" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" text,
	"surname" text,
	"patronymic" text,
	"avatar" text,
	"dob" date,
	"phone" text,
	"email" text,
	"password" text,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp (3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp (3) NOT NULL,
	"roles" text[],
	"branchId" integer,
	"method" text,
	"applied" boolean DEFAULT false NOT NULL,
	"promo" boolean DEFAULT false NOT NULL,
	"share" boolean DEFAULT false NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserApChat" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"projectId" integer NOT NULL,
	"title" text NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserApChatMessage" (
	"id" serial PRIMARY KEY NOT NULL,
	"userChatId" integer NOT NULL,
	"role" text NOT NULL,
	"content" text NOT NULL,
	"inputTokens" integer,
	"outputTokens" integer,
	"price" double precision,
	"usedContext" text,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "UserGood" (
	"id" serial PRIMARY KEY NOT NULL,
	"userId" integer NOT NULL,
	"goodId" integer NOT NULL,
	"isDeleted" boolean DEFAULT false NOT NULL,
	"createdAt" timestamp(3) DEFAULT CURRENT_TIMESTAMP NOT NULL,
	"updatedAt" timestamp(3) NOT NULL
);
--> statement-breakpoint
ALTER TABLE "Address" ADD CONSTRAINT "Address_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Address" ADD CONSTRAINT "Address_zoneId_fkey" FOREIGN KEY ("zoneId") REFERENCES "public"."DeliveryZone"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ApChat" ADD CONSTRAINT "ApChat_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."AiProject"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ApChatMessage" ADD CONSTRAINT "ApChatMessage_chatId_fkey" FOREIGN KEY ("chatId") REFERENCES "public"."ApChat"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ApKnowledge" ADD CONSTRAINT "ApKnowledge_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."AiProject"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "BannerBranch" ADD CONSTRAINT "BannerBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "BannerBranch" ADD CONSTRAINT "BannerBranch_bannerId_fkey" FOREIGN KEY ("bannerId") REFERENCES "public"."Banner"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Branch" ADD CONSTRAINT "Branch_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Category" ADD CONSTRAINT "Category_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Category"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Cert" ADD CONSTRAINT "Cert_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "CertBranch" ADD CONSTRAINT "CertBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "CertBranch" ADD CONSTRAINT "CertBranch_certId_fkey" FOREIGN KEY ("certId") REFERENCES "public"."Cert"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "CertPayment" ADD CONSTRAINT "CertPayment_certId_fkey" FOREIGN KEY ("certId") REFERENCES "public"."Cert"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ClassGood" ADD CONSTRAINT "ClassGood_classId_fkey" FOREIGN KEY ("classId") REFERENCES "public"."Classifier"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "ClassGood" ADD CONSTRAINT "ClassGood_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "public"."Good"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "CollGood" ADD CONSTRAINT "CollGood_collectionId_fkey" FOREIGN KEY ("collectionId") REFERENCES "public"."Collection"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "CollGood" ADD CONSTRAINT "CollGood_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "public"."Good"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Content" ADD CONSTRAINT "Content_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "public"."Good"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "DeliveryZone" ADD CONSTRAINT "DeliveryZone_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "public"."City"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "DiscountCard" ADD CONSTRAINT "DiscountCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "FilterOption" ADD CONSTRAINT "FilterOption_filterId_fkey" FOREIGN KEY ("filterId") REFERENCES "public"."Filter"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Good" ADD CONSTRAINT "Good_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GoodFilter" ADD CONSTRAINT "GoodFilter_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "public"."Good"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "GoodFilter" ADD CONSTRAINT "GoodFilter_optionId_fkey" FOREIGN KEY ("optionId") REFERENCES "public"."FilterOption"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "public"."Address"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Order" ADD CONSTRAINT "Order_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "OrderGood" ADD CONSTRAINT "OrderGood_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "public"."Good"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "OrderGood" ADD CONSTRAINT "OrderGood_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "OrderPromo" ADD CONSTRAINT "OrderPromo_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "OrderPromo" ADD CONSTRAINT "OrderPromo_promoId_fkey" FOREIGN KEY ("promoId") REFERENCES "public"."Promo"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Ost" ADD CONSTRAINT "Ost_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Ost" ADD CONSTRAINT "Ost_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "public"."Good"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "public"."Order"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Sale" ADD CONSTRAINT "Sale_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SaleBranch" ADD CONSTRAINT "SaleBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SaleBranch" ADD CONSTRAINT "SaleBranch_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."Sale"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SaleGood" ADD CONSTRAINT "SaleGood_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "public"."Good"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "SaleGood" ADD CONSTRAINT "SaleGood_saleId_fkey" FOREIGN KEY ("saleId") REFERENCES "public"."Sale"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Search" ADD CONSTRAINT "Search_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE cascade ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Slide" ADD CONSTRAINT "Slide_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "public"."Category"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "Slide" ADD CONSTRAINT "Slide_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "public"."Story"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "StoryBranch" ADD CONSTRAINT "StoryBranch_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "StoryBranch" ADD CONSTRAINT "StoryBranch_storyId_fkey" FOREIGN KEY ("storyId") REFERENCES "public"."Story"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "User" ADD CONSTRAINT "User_branchId_fkey" FOREIGN KEY ("branchId") REFERENCES "public"."Branch"("id") ON DELETE set null ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserApChat" ADD CONSTRAINT "UserApChat_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "public"."AiProject"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserApChat" ADD CONSTRAINT "UserApChat_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserApChatMessage" ADD CONSTRAINT "UserApChatMessage_userChatId_fkey" FOREIGN KEY ("userChatId") REFERENCES "public"."UserApChat"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserGood" ADD CONSTRAINT "UserGood_goodId_fkey" FOREIGN KEY ("goodId") REFERENCES "public"."Good"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
ALTER TABLE "UserGood" ADD CONSTRAINT "UserGood_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE restrict ON UPDATE cascade;--> statement-breakpoint
CREATE INDEX "idx_address_userId" ON "Address" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_address_zoneId" ON "Address" USING btree ("zoneId");--> statement-breakpoint
CREATE INDEX "idx_apchat_projectId" ON "ApChat" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "idx_apchatmessage_chatId" ON "ApChatMessage" USING btree ("chatId");--> statement-breakpoint
CREATE INDEX "idx_apknowledge_projectId" ON "ApKnowledge" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "idx_bannerbranch_bannerId" ON "BannerBranch" USING btree ("bannerId");--> statement-breakpoint
CREATE INDEX "idx_bannerbranch_branchId" ON "BannerBranch" USING btree ("branchId");--> statement-breakpoint
CREATE INDEX "idx_branch_cityId" ON "Branch" USING btree ("cityId");--> statement-breakpoint
CREATE INDEX "idx_category_parentId" ON "Category" USING btree ("parentId");--> statement-breakpoint
CREATE INDEX "idx_cert_userId" ON "Cert" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_certbranch_branchId" ON "CertBranch" USING btree ("branchId");--> statement-breakpoint
CREATE INDEX "idx_certbranch_certId" ON "CertBranch" USING btree ("certId");--> statement-breakpoint
CREATE INDEX "idx_certpayment_certId" ON "CertPayment" USING btree ("certId");--> statement-breakpoint
CREATE INDEX "idx_classgood_classId" ON "ClassGood" USING btree ("classId");--> statement-breakpoint
CREATE INDEX "idx_classgood_goodId" ON "ClassGood" USING btree ("goodId");--> statement-breakpoint
CREATE INDEX "idx_collgood_collectionId" ON "CollGood" USING btree ("collectionId");--> statement-breakpoint
CREATE INDEX "idx_collgood_goodId" ON "CollGood" USING btree ("goodId");--> statement-breakpoint
CREATE INDEX "idx_content_goodId" ON "Content" USING btree ("goodId");--> statement-breakpoint
CREATE INDEX "idx_deliveryzone_cityId" ON "DeliveryZone" USING btree ("cityId");--> statement-breakpoint
CREATE INDEX "idx_discountcard_userId" ON "DiscountCard" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_filteroption_filterId" ON "FilterOption" USING btree ("filterId");--> statement-breakpoint
CREATE INDEX "idx_good_search_vector" ON "Good" USING gin ("search_vector");--> statement-breakpoint
CREATE INDEX "idx_good_categoryId" ON "Good" USING btree ("categoryId");--> statement-breakpoint
CREATE UNIQUE INDEX "GoodFilter_goodId_optionId_key" ON "GoodFilter" USING btree ("goodId" int4_ops,"optionId" int4_ops);--> statement-breakpoint
CREATE INDEX "idx_goodfilter_optionId" ON "GoodFilter" USING btree ("optionId");--> statement-breakpoint
CREATE INDEX "idx_order_addressId" ON "Order" USING btree ("addressId");--> statement-breakpoint
CREATE INDEX "idx_order_branchId" ON "Order" USING btree ("branchId");--> statement-breakpoint
CREATE INDEX "idx_order_userId" ON "Order" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_ordergood_goodId" ON "OrderGood" USING btree ("goodId");--> statement-breakpoint
CREATE INDEX "idx_ordergood_orderId" ON "OrderGood" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX "idx_orderpromo_orderId" ON "OrderPromo" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX "idx_orderpromo_promoId" ON "OrderPromo" USING btree ("promoId");--> statement-breakpoint
CREATE INDEX "idx_ost_branchId" ON "Ost" USING btree ("branchId");--> statement-breakpoint
CREATE INDEX "idx_ost_goodId" ON "Ost" USING btree ("goodId");--> statement-breakpoint
CREATE INDEX "idx_payment_orderId" ON "Payment" USING btree ("orderId");--> statement-breakpoint
CREATE INDEX "idx_payment_userId" ON "Payment" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_sale_categoryId" ON "Sale" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX "idx_salebranch_branchId" ON "SaleBranch" USING btree ("branchId");--> statement-breakpoint
CREATE INDEX "idx_salebranch_saleId" ON "SaleBranch" USING btree ("saleId");--> statement-breakpoint
CREATE INDEX "idx_salegood_goodId" ON "SaleGood" USING btree ("goodId");--> statement-breakpoint
CREATE INDEX "idx_salegood_saleId" ON "SaleGood" USING btree ("saleId");--> statement-breakpoint
CREATE INDEX "idx_search_userId" ON "Search" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_session_userId" ON "Session" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_slide_categoryId" ON "Slide" USING btree ("categoryId");--> statement-breakpoint
CREATE INDEX "idx_slide_storyId" ON "Slide" USING btree ("storyId");--> statement-breakpoint
CREATE INDEX "idx_storybranch_branchId" ON "StoryBranch" USING btree ("branchId");--> statement-breakpoint
CREATE INDEX "idx_storybranch_storyId" ON "StoryBranch" USING btree ("storyId");--> statement-breakpoint
CREATE INDEX "idx_user_branchId" ON "User" USING btree ("branchId");--> statement-breakpoint
CREATE INDEX "idx_userapchat_projectId" ON "UserApChat" USING btree ("projectId");--> statement-breakpoint
CREATE INDEX "idx_userapchat_userId" ON "UserApChat" USING btree ("userId");--> statement-breakpoint
CREATE INDEX "idx_userapchatmessage_userChatId" ON "UserApChatMessage" USING btree ("userChatId");--> statement-breakpoint
CREATE INDEX "idx_usergood_goodId" ON "UserGood" USING btree ("goodId");--> statement-breakpoint
CREATE INDEX "idx_usergood_userId" ON "UserGood" USING btree ("userId");