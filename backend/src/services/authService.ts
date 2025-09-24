import { auth } from '@clerk/nextjs/server';

export class AuthService {
  /**
   * Get the current user from Clerk
   * This should be called in API routes
   */
  static async getCurrentUser() {
    try {
      const { userId } = await auth();
      return userId;
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  }

  /**
   * Verify if user is authenticated
   */
  static async isAuthenticated(): Promise<boolean> {
    const userId = await this.getCurrentUser();
    return !!userId;
  }

  /**
   * Get user info from Clerk API
   * This requires the Clerk Secret Key
   */
  static async getUserInfo(userId: string) {
    try {
      // This would require the Clerk Secret Key to call Clerk's API
      // For now, we'll return basic info
      return {
        id: userId,
        authenticated: true
      };
    } catch (error) {
      console.error('Error getting user info:', error);
      return null;
    }
  }
}
