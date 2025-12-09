import type { Request, Response, NextFunction } from 'express';

/**
 * Middleware to check if user is authenticated
 * Checks for session cookie or authorization header
 */
export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // Check for session cookie
  const sessionId = req.cookies?.sessionId;
  
  // Check for authorization header
  const authHeader = req.headers.authorization;
  
  if (!sessionId && !authHeader) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Authentication required',
    });
  }
  
  next();
}

/**
 * Middleware to check if user is admin
 * Requires authentication first
 */
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  // Check for admin email in session or request
  const userEmail = req.body?.userEmail || req.query?.userEmail;
  
  // Admin email check
  const adminEmails = ['admin@bigpartner.com'];
  
  if (!userEmail || !adminEmails.includes(userEmail)) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Admin access required',
    });
  }
  
  next();
}

/**
 * Combined middleware: require authentication and admin access
 */
export function requireAdminAuth(req: Request, res: Response, next: NextFunction) {
  requireAuth(req, res, () => {
    requireAdmin(req, res, next);
  });
}

/**
 * Check if user owns a resource
 * @param userId - User ID from session
 * @param resourceUserId - User ID of resource owner
 */
export function checkOwnership(userId: number, resourceUserId: number): boolean {
  return userId === resourceUserId;
}

/**
 * Middleware to check resource ownership
 * Allows admin or owner to access
 */
export function requireOwnershipOrAdmin(getUserId: (req: Request) => number, getResourceUserId: (req: Request) => Promise<number>) {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const userId = getUserId(req);
      const resourceUserId = await getResourceUserId(req);
      
      // Check if user is admin
      const userEmail = req.body?.userEmail || req.query?.userEmail;
      const isAdmin = userEmail === 'admin@bigpartner.com';
      
      // Allow if admin or owner
      if (isAdmin || checkOwnership(userId, resourceUserId)) {
        return next();
      }
      
      return res.status(403).json({
        error: 'Forbidden',
        message: 'You do not have permission to access this resource',
      });
    } catch (error) {
      return res.status(500).json({
        error: 'Internal server error',
        message: error instanceof Error ? error.message : 'Unknown error',
      });
    }
  };
}
