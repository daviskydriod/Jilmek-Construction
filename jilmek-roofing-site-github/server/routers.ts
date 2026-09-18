import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { adminProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createPropertyListing,
  createRoofingProduct,
  deletePropertyListing,
  deleteRoofingProduct,
  listAllPropertyListings,
  listAllRoofingProducts,
  listPublishedPropertyListings,
  listPublishedRoofingProducts,
  updatePropertyListing,
  updateRoofingProduct,
} from "./db";

const roofingProductInput = z.object({
  name: z.string().min(1).max(160),
  profile: z.string().min(1).max(120),
  description: z.string().min(1),
  imageUrl: z.string().max(500).optional().nullable(),
  imageKey: z.string().max(255).optional().nullable(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
  sortOrder: z.number().int().default(0),
});

const propertyListingInput = z.object({
  title: z.string().min(1).max(220),
  listingType: z.enum(["land", "property", "development"]),
  location: z.string().min(1).max(180),
  priceLabel: z.string().max(120).optional().nullable(),
  status: z.enum(["available", "reserved", "sold", "draft"]).default("available"),
  description: z.string().min(1),
  imageUrl: z.string().max(500).optional().nullable(),
  imageKey: z.string().max(255).optional().nullable(),
  isPublished: z.boolean().default(true),
  isFeatured: z.boolean().default(false),
});

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query((opts) => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
  }),
  catalog: router({
    products: publicProcedure.query(() => listPublishedRoofingProducts()),
    listings: publicProcedure.query(() => listPublishedPropertyListings()),
  }),
  adminCatalog: router({
    products: adminProcedure.query(() => listAllRoofingProducts()),
    createProduct: adminProcedure.input(roofingProductInput).mutation(({ input }) => createRoofingProduct(input)),
    updateProduct: adminProcedure.input(roofingProductInput.extend({ id: z.number().int().positive() })).mutation(({ input }) => {
      const { id, ...values } = input;
      return updateRoofingProduct(id, values);
    }),
    deleteProduct: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deleteRoofingProduct(input.id)),
    listings: adminProcedure.query(() => listAllPropertyListings()),
    createListing: adminProcedure.input(propertyListingInput).mutation(({ input }) => createPropertyListing(input)),
    updateListing: adminProcedure.input(propertyListingInput.extend({ id: z.number().int().positive() })).mutation(({ input }) => {
      const { id, ...values } = input;
      return updatePropertyListing(id, values);
    }),
    deleteListing: adminProcedure.input(z.object({ id: z.number().int().positive() })).mutation(({ input }) => deletePropertyListing(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
