import { middlewares } from '../user/[action].js';
import { createVercelHandler } from '../_lib/vercel-handler.js';

// Re-export middlewares for local server usage if needed
export { middlewares };

// Default export for Vercel serverless
export default createVercelHandler(middlewares);
