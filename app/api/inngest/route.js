import { createUserOrder, syncUserCration, syncUserDeletion, syncUserUpdation } from "@/config/inngest";
import { serve } from "inngest/next";


// Create an API that serves zero functions
export const { GET, POST, PUT } = serve({
  client: inngest,
  functions: [
    syncUserCration,
    syncUserUpdation,
    syncUserDeletion,
    createUserOrder
    
    
  ],
});