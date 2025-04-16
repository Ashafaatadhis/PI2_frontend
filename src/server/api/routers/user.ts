import { createTRPCRouter, protectedProcedure } from "@/server/api/trpc";

import { z } from "zod";

export const userRouter = createTRPCRouter({
  updateTimezone: protectedProcedure
    .input(z.object({ timezone: z.string() }))
    .mutation(async ({ ctx, input }) => {
      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: { timezone: input.timezone },
      });
    }),
});
