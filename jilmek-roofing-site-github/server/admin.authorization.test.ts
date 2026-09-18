import { describe, expect, it } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

describe("admin catalog authorization", () => {
  it("rejects authenticated users without the admin role", async () => {
    const ctx: TrpcContext = {
      user: {
        id: 7,
        openId: "regular-user",
        email: "user@example.com",
        name: "Regular User",
        loginMethod: "manus",
        role: "user",
        createdAt: new Date(),
        updatedAt: new Date(),
        lastSignedIn: new Date(),
      },
      req: { protocol: "https", headers: {} } as TrpcContext["req"],
      res: {} as TrpcContext["res"],
    };

    const caller = appRouter.createCaller(ctx);
    await expect(caller.adminCatalog.products()).rejects.toMatchObject({
      code: "FORBIDDEN",
    });
  });
});
