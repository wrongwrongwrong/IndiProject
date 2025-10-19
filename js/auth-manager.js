/**
 * Authentication State Manager
 * Centralized authentication state management for cross-page synchronization
 */

class AuthManager {
    constructor() {
        this.currentUser = null;
        this.isLoggedIn = false;
        this.init();
    }

    init() {
        // Load auth state from localStorage
        this.loadAuthState();
        
        // Set up storage event listener for cross-tab synchronization
        window.addEventListener('storage', this.handleStorageEvent.bind(this));
        
        // Initialize auth state on page load
        this.updateUI();
    }

    loadAuthState() {
        const savedUser = localStorage.getItem('auth_user');
        const savedToken = localStorage.getItem('auth_token');
        
        if (savedUser && savedToken) {
            try {
                this.currentUser = JSON.parse(savedUser);
                this.isLoggedIn = true;
            } catch (e) {
                console.error('Error parsing saved user data:', e);
                this.clearAuthState();
            }
        }
    }

    handleStorageEvent(event) {
        if (event.key === 'auth_user' || event.key === 'auth_token') {
            this.loadAuthState();
            this.updateUI();
        }
    }

    login(userData, token) {
        this.currentUser = userData;
        this.isLoggedIn = true;
        
        // Save to localStorage
        localStorage.setItem('auth_user', JSON.stringify(userData));
        localStorage.setItem('auth_token', token);
        
        // Also save to gameserverpro format for compatibility
        localStorage.setItem('gameserverpro_user', JSON.stringify(userData));
        localStorage.setItem('gameserverpro_token', token);
        
        // Broadcast to other tabs
        this.broadcastAuthState();
        this.updateUI();
        
        // Dispatch custom event for dashboard
        this.dispatchAuthStateChange();
    }

    logout() {
        this.currentUser = null;
        this.isLoggedIn = false;
        
        // Clear localStorage
        this.clearAuthState();
        
        // Broadcast to other tabs
        this.broadcastAuthState();
        this.updateUI();
        
        // Dispatch custom event for dashboard
        this.dispatchAuthStateChange();
    }

    clearAuthState() {
        localStorage.removeItem('auth_user');
        localStorage.removeItem('auth_token');
        localStorage.removeItem('gameserverpro_user');
        localStorage.removeItem('gameserverpro_token');
    }

    broadcastAuthState() {
        // Trigger storage event to sync across tabs
        window.dispatchEvent(new Event('storage'));
    }

    dispatchAuthStateChange() {
        // Dispatch custom event for dashboard and other components
        const event = new CustomEvent('authStateChanged', {
            detail: {
                isAuthenticated: this.isLoggedIn,
                user: this.currentUser
            }
        });
        window.dispatchEvent(event);
    }

    updateUI() {
        this.updateAuthButtons();
        this.updateUserProfile();
    }

    updateAuthButtons() {
        const loginButtons = document.querySelectorAll('.login-btn, .nav-login, [onclick*="openLogin"]');
        const logoutButtons = document.querySelectorAll('.logout-btn, .nav-logout, [onclick*="logout"]');
        const signupButtons = document.querySelectorAll('.signup-btn, .nav-signup, [onclick*="openSignup"]');
        const profileElements = document.querySelectorAll('.user-profile, .nav-profile, .user-menu');

        if (this.isLoggedIn) {
            // Show logout and profile, hide login/signup
            loginButtons.forEach(btn => {
                if (btn) btn.style.display = 'none';
            });
            signupButtons.forEach(btn => {
                if (btn) btn.style.display = 'none';
            });
            logoutButtons.forEach(btn => {
                if (btn) btn.style.display = 'block';
            });
            profileElements.forEach(el => {
                if (el) el.style.display = 'block';
            });
        } else {
            // Show login/signup, hide logout and profile
            loginButtons.forEach(btn => {
                if (btn) btn.style.display = 'block';
            });
            signupButtons.forEach(btn => {
                if (btn) btn.style.display = 'block';
            });
            logoutButtons.forEach(btn => {
                if (btn) btn.style.display = 'none';
            });
            profileElements.forEach(el => {
                if (el) el.style.display = 'none';
            });
        }
    }

    updateUserProfile() {
        // Removed .user-name references since welcome message moved to dashboard hero
        const profileNames = document.querySelectorAll('.profile-name');
        const profileEmails = document.querySelectorAll('.user-email, .profile-email');

        if (this.isLoggedIn && this.currentUser) {
            profileNames.forEach(el => {
                if (el) el.textContent = this.currentUser.name || 'User';
            });
            profileEmails.forEach(el => {
                if (el) el.textContent = this.currentUser.email || '';
            });
        } else {
            profileNames.forEach(el => {
                if (el) el.textContent = '';
            });
            profileEmails.forEach(el => {
                if (el) el.textContent = '';
            });
        }
    }

    getCurrentUser() {
        return this.currentUser;
    }

    isAuthenticated() {
        return this.isLoggedIn;
    }

    getAuthToken() {
        return localStorage.getItem('auth_token');
    }
}

// Global auth manager instance
window.authManager = new AuthManager();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AuthManager;
}
