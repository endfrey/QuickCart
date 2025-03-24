import { serve } from "inngest/next";
import { inngest } from "../../../inngest/client";
import { syncUserCration, syncUserDeletion, syncUserUpdation } from "@/config/inngest";

// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCration,
    syncUserUpdation,
    syncUserDeletion
  ],
});
