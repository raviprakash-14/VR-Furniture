import React, { createContext, useState, useEffect } from 'react';
import { NavigationContainer, createNavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { StyleSheet, View, ActivityIndicator, Alert, Platform } from 'react-native';
import { SafeAreaProvider } from "react-native-safe-area-context"
import { Toaster } from 'sonner-native';
import { Ionicons } from '@expo/vector-icons';

// Import Supabase functions
import { supabaseClient, getUserProfile, upsertUserProfile } from './supabase';

// Import screens
import HomeScreen from "./screens/HomeScreen";
import ProductListScreen from "./screens/ProductListScreen";
import ProductDetailScreen from "./screens/ProductDetailScreen";
import VRViewScreen from "./screens/VRViewScreen";
import CartScreen from "./screens/CartScreen";
import CheckoutScreen from "./screens/CheckoutScreen";
import OrderSuccessScreen from "./screens/OrderSuccessScreen";
import ProfileScreen from "./screens/ProfileScreen";
import SellFurnitureScreen from "./screens/SellFurnitureScreen";
import LoginScreen from "./screens/LoginScreen";
import ResetPasswordScreen from "./screens/ResetPasswordScreen";
import AdminDashboardScreen from "./screens/AdminDashboardScreen";
import AdminOrderManagementScreen from "./screens/AdminOrderManagementScreen";
import AdminListingsManagementScreen from "./screens/AdminListingsManagementScreen";

// Create auth context
export const AuthContext = createContext<any>(null);

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// Navigation ref to allow navigation outside components (e.g., auth events)
export const navigationRef = createNavigationContainerRef();

// Allow window globals for web-only chat widget
declare global {
  interface Window {
    Tawk_API?: any;
    Tawk_LoadStart?: Date;
  }
}

// Main tab navigator
function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: any;

          if (route.name === 'HomeStack') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'CartStack') {
            iconName = focused ? 'cart' : 'cart-outline';
          } else if (route.name === 'SellStack') {
            iconName = focused ? 'cube' : 'cube-outline';
          } else if (route.name === 'ProfileStack') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#2E7D32',
        tabBarInactiveTintColor: 'gray',
        headerShown: false,
      })}
    >
      <Tab.Screen name="HomeStack" component={HomeStack} options={{ title: 'Home' }} />
      <Tab.Screen name="CartStack" component={CartStack} options={{ title: 'Cart' }} />
      <Tab.Screen name="SellStack" component={SellStack} options={{ title: 'Sell' }} />
      <Tab.Screen name="ProfileStack" component={ProfileStack} options={{ title: 'Profile' }} />
    </Tab.Navigator>
  );
}

// Admin stack navigator
function AdminStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminOrderManagement" component={AdminOrderManagementScreen} />
      <Stack.Screen name="AdminListingsManagement" component={AdminListingsManagementScreen} />
    </Stack.Navigator>
  );
}

// Home stack
function HomeStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Home" component={HomeScreen} />
      <Stack.Screen name="ProductList" component={ProductListScreen} />
      <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
      <Stack.Screen name="VRView" component={VRViewScreen} />
      <Stack.Screen name="AdminDashboard" component={AdminDashboardScreen} />
      <Stack.Screen name="AdminOrderManagement" component={AdminOrderManagementScreen} />
      <Stack.Screen name="AdminListingsManagement" component={AdminListingsManagementScreen} />
    </Stack.Navigator>
  );
}

// Cart stack
function CartStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Cart" component={CartScreen} />
      <Stack.Screen name="Checkout" component={CheckoutScreen} />
      <Stack.Screen name="OrderSuccess" component={OrderSuccessScreen} />
    </Stack.Navigator>
  );
}

// Profile stack
function ProfileStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Profile" component={ProfileScreen} />
      <Stack.Screen name="SellFurniture" component={SellFurnitureScreen} />
    </Stack.Navigator>
  );
}

// Sell stack
function SellStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SellFurnitureRoot" component={SellFurnitureScreen} />
    </Stack.Navigator>
  );
}

// Auth stack
function AuthStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
    </Stack.Navigator>
  );
}

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [showAuthStack, setShowAuthStack] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    console.log('App useEffect: Starting authentication check');
    
    // Check for password reset tokens in URL on startup (web only)
    const checkForResetToken = async () => {
      if (typeof window !== 'undefined') {
        const url = window.location.href;
        const hash = window.location.hash || '';
        
        // Check if we're on the reset password route with tokens
        if (url.includes('/#/ResetPassword') && (hash.includes('access_token') || hash.includes('refresh_token'))) {
          console.log('Detected reset password URL with tokens');
          // Show auth stack to allow navigation to ResetPassword
          setShowAuthStack(true);
          setIsLoading(false);
          return;
        }
        
        // Also check for reset tokens in the main URL (not just ResetPassword route)
        if (hash.includes('access_token') || hash.includes('refresh_token') || hash.includes('type=recovery')) {
          console.log('Detected reset tokens in URL hash, redirecting to ResetPassword');
          setShowAuthStack(true);
          setIsLoading(false);
          // Navigate to ResetPassword after a short delay to ensure auth stack is ready
          setTimeout(() => {
            // @ts-ignore
            navigationRef?.navigate?.('ResetPassword');
          }, 100);
          return;
        }
        
        // Check for error URLs (expired/invalid reset links)
        if (hash.includes('error=') && (hash.includes('otp_expired') || hash.includes('access_denied'))) {
          console.log('Detected expired/invalid reset link error');
          setShowAuthStack(true);
          setIsLoading(false);
          // Navigate to Login with error message
          setTimeout(() => {
            // @ts-ignore
            navigationRef?.navigate?.('Login');
          }, 100);
          return;
        }
      }
    };

    checkForResetToken();

    // Get initial session to check if user is already authenticated
    const getInitialSession = async () => {
      try {
        console.log('Getting initial session...');
        
        // Check if we're coming from a logout (check for a logout flag in sessionStorage)
        if (typeof window !== 'undefined') {
          const wasLoggedOut = sessionStorage.getItem('wasLoggedOut');
          if (wasLoggedOut === 'true') {
            console.log('Detected previous logout, clearing session and showing login screen');
            sessionStorage.removeItem('wasLoggedOut');
            
            // Force clear any existing session
            try {
              await supabaseClient.auth.signOut();
            } catch (e) {
              console.log('Error during forced signOut:', e);
            }
            
            setUser(null);
            setIsAuthenticated(false);
            setIsLoading(false);
            return;
          }
        }
        
        const { data: { session }, error } = await supabaseClient.auth.getSession();
        console.log('Initial session result:', { 
          hasSession: !!session, 
          hasUser: !!session?.user, 
          userEmail: session?.user?.email,
          error 
        });
        
        if (session && session.user) {
          console.log('User is authenticated:', session.user.email);
          setUser(session.user);
          setIsAuthenticated(true);
          
          // Check if user profile exists in Supabase
          getUserProfile(session.user.id).then(profile => {
            if (!profile) {
              upsertUserProfile({
                id: session.user.id,
                full_name: session.user.user_metadata.full_name || '',
                email: session.user.email || '',
                avatar_url: session.user.user_metadata.avatar_url || '',
                total_trees_saved: 0,
                total_carbon_reduced: 0,
                total_waste_diverted: 0
              });
            }
          }).catch(error => {
            console.error("Error with user profile:", error);
          });
        } else {
          console.log('No authenticated session found - showing login screen');
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error getting initial session:', error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    getInitialSession();

    // Listen for Supabase auth changes including password recovery
    const { data: authListener } = supabaseClient.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      // Route password recovery event to Reset screen on web
      if (event === 'PASSWORD_RECOVERY') {
        console.log('Password recovery event detected');
        // @ts-ignore
        return navigationRef?.navigate?.('ResetPassword');
      }
      
      // Handle sign out event specifically
      if (event === 'SIGNED_OUT') {
        console.log('User signed out, clearing state');
        setUser(null);
        setIsAuthenticated(false);
        setShowAuthStack(false);
        setIsLoading(false);
        return;
      }
      
      if (session && session.user) {
        console.log('Setting authenticated user:', session.user.email);
        setUser(session.user);
        setIsAuthenticated(true);
        
        // Check if user is admin
        const adminEmails = ['thammikt@gmail.com'];
        const isAdminUser = adminEmails.includes(session.user.email || '');
        setIsAdmin(isAdminUser);
        console.log('Admin status:', isAdminUser);
        
        // Check if user profile exists in Supabase
        getUserProfile(session.user.id).then(profile => {
          if (!profile) {
            upsertUserProfile({
              id: session.user.id,
              full_name: session.user.user_metadata.full_name || '',
              email: session.user.email || '',
              avatar_url: session.user.user_metadata.avatar_url || '',
              total_trees_saved: 0,
              total_carbon_reduced: 0,
              total_waste_diverted: 0
            });
          }
        }).catch(error => {
          console.error("Error with user profile:", error);
        });
      } else {
        console.log('Clearing authenticated user');
        setUser(null);
        setIsAuthenticated(false);
        setIsAdmin(false);
      }
      
      setIsLoading(false);
    });
    
    return () => {
      // authListener is an object with subscription
      authListener?.subscription?.unsubscribe?.();
    };
  }, []);

  // Inject Tawk.to chat widget on web only
  useEffect(() => {
    if (Platform.OS !== 'web') return;
    try {
      if (document.getElementById('tawk-script')) return;
      window.Tawk_API = window.Tawk_API || {};
      window.Tawk_LoadStart = new Date();
      const s1 = document.createElement('script');
      s1.id = 'tawk-script';
      s1.async = true;
      s1.src = 'https://embed.tawk.to/68f0acfed36e66194e3c324c/1j7m27hq9';
      s1.charset = 'UTF-8';
      s1.setAttribute('crossorigin', '*');
      const s0 = document.getElementsByTagName('script')[0];
      s0?.parentNode?.insertBefore(s1, s0);
    } catch (e) {
      console.log('Tawk widget inject error:', e);
    }
  }, []);

  const authContext = {
    user,
    isLoading,
    isAuthenticated,
    isAdmin,
    // Temporary function to force clear session for debugging
    forceLogout: async () => {
      try {
        console.log('Force logging out...');
        
        // Method 1: Try Supabase signOut
        try {
          await supabaseClient.auth.signOut();
        } catch (e) {
          console.error('Error during Supabase signOut:', e);
        }
        
        // Set logout flag before clearing everything
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('wasLoggedOut', 'true');
        }
        
        // Method 2: Clear all browser storage
        if (typeof window !== 'undefined') {
          // Clear all localStorage
          localStorage.clear();
          console.log('Cleared all localStorage');
          
          // Clear all sessionStorage
          sessionStorage.clear();
          console.log('Cleared all sessionStorage');
          
          // Clear cookies
          document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
          });
          console.log('Cleared all cookies');
        }
        
        // Method 3: Reset all app state
        setUser(null);
        setIsAuthenticated(false);
        setShowAuthStack(false);
        
        // Method 4: Force page reload with cache clearing
        if (typeof window !== 'undefined') {
          console.log('Forcing page reload with cache clearing...');
          setTimeout(() => {
            // Clear cache and reload
            if ('caches' in window) {
              caches.keys().then(names => {
                names.forEach(name => {
                  caches.delete(name);
                });
              });
            }
            window.location.href = window.location.origin + window.location.pathname;
          }, 200);
        }
        
        console.log('Force logout completed');
      } catch (error) {
        console.error('Force logout error:', error);
      }
    },
    login: async (email: string, password: string) => {
      try {
        setIsLoading(true);
        const { data, error } = await supabaseClient.auth.signInWithPassword({ email, password });
        setIsLoading(false);
        if (error) {
          return { success: false, error: error.message };
        }
        setUser(data.user);
        setIsAuthenticated(true);
        setShowAuthStack(false); // Reset auth stack state on successful login
        return { success: true };
      } catch (error: any) {
        setIsLoading(false);
        return { success: false, error: error.message || 'Failed to login' };
      }
    },
    signup: async (email: string, password: string, name: string) => {
      try {
        setIsLoading(true);
        console.log('Starting signup process for:', email);
        
        const { data, error } = await supabaseClient.auth.signUp({
          email,
          password,
          options: { data: { full_name: name } }
        });
        
        if (error) {
          console.error('Signup error:', error);
          setIsLoading(false);
          return { success: false, error: error.message };
        }
        
        console.log('User created successfully:', data.user?.id);
        
        // Create user profile in Supabase
        const profileData = {
          id: (data.user as any)?.id,
          full_name: name,
          email: email,
          total_trees_saved: 0,
          total_carbon_reduced: 0,
          total_waste_diverted: 0
        };
        
        console.log('Attempting to create profile:', profileData);
        
        const profileResult = await upsertUserProfile(profileData);
        console.log('Profile creation result:', profileResult);
        
        setUser(data.user);
        setIsAuthenticated(true);
        setShowAuthStack(false); // Reset auth stack state on successful signup
        setIsLoading(false);
        return { success: true };
      } catch (error: any) {
        console.error('Signup process error:', error);
        setIsLoading(false);
        return { success: false, error: error.message || 'Failed to create account' };
      }
    },
    googleLogin: async () => {
      try {
        setIsLoading(true);
        // This is a mock implementation
        // In a real app, you would use the proper Google Sign-In flow
        // For Supabase, you would use supabaseClient.auth.signInWithOAuth
        // This example assumes a placeholder for Google Sign-In
        const { data, error } = await supabaseClient.auth.signInWithPassword({
          email: 'google@example.com', // Placeholder email
          password: 'googlepassword' // Placeholder password
        });
        
        if (error) {
          setIsLoading(false);
          return { success: false, error: error.message };
        }

        // Create user profile in Supabase if it doesn't exist
        await upsertUserProfile({
          id: data.user.id,
          full_name: data.user.user_metadata.full_name || '',
          email: data.user.email || '',
          avatar_url: data.user.user_metadata.avatar_url || '',
          total_trees_saved: 0,
          total_carbon_reduced: 0,
          total_waste_diverted: 0
        });
        
        setUser(data.user);
        setIsAuthenticated(true);
        setShowAuthStack(false); // Reset auth stack state on successful google login
        setIsLoading(false);
        return { success: true };
      } catch (error: any) {
        setIsLoading(false);
        console.error("Google login error:", error);
        return { 
          success: false, 
          error: error.message || "Failed to login with Google" 
        };
      }
    },
    logout: async () => {
      try {
        console.log('Starting logout process...');
        setIsLoading(true);
        
        // Method 1: Try Supabase signOut
        try {
          const { error } = await supabaseClient.auth.signOut();
          if (error) {
            console.error('Supabase signOut error:', error);
          }
        } catch (e) {
          console.error('Error during Supabase signOut:', e);
        }
        
        // Set logout flag before clearing everything
        if (typeof window !== 'undefined') {
          sessionStorage.setItem('wasLoggedOut', 'true');
        }
        
        // Method 2: Clear all browser storage
        if (typeof window !== 'undefined') {
          // Clear all localStorage
          localStorage.clear();
          console.log('Cleared all localStorage');
          
          // Clear all sessionStorage
          sessionStorage.clear();
          console.log('Cleared all sessionStorage');
          
          // Clear cookies
          document.cookie.split(";").forEach(function(c) { 
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/"); 
          });
          console.log('Cleared all cookies');
        }
        
        // Method 3: Reset all app state
        setUser(null);
        setIsAuthenticated(false);
        setShowAuthStack(false);
        
        // Method 4: Force page reload with cache clearing
        if (typeof window !== 'undefined') {
          console.log('Forcing page reload with cache clearing...');
          setTimeout(() => {
            // Clear cache and reload
            if ('caches' in window) {
              caches.keys().then(names => {
                names.forEach(name => {
                  caches.delete(name);
                });
              });
            }
            window.location.href = window.location.origin + window.location.pathname;
          }, 200);
        }
        
        console.log('Logout completed successfully');
        setIsLoading(false);
        return { success: true };
      } catch (error: any) {
        console.error("Logout error:", error);
        setIsLoading(false);
        
        // Force reset state even if there's an error
        setUser(null);
        setIsAuthenticated(false);
        setShowAuthStack(false);
        
        return { 
          success: false, 
          error: error.message || "Failed to logout" 
        };
      }
    },
    resetPassword: async (email: string) => {
      try {
        // Use the current origin for the reset URL (should match Supabase Site URL)
        const resetUrl = typeof window !== 'undefined' ? `${window.location.origin}/#/ResetPassword` : undefined;
        console.log('Sending reset email with URL:', resetUrl);
        
        const { error } = await supabaseClient.auth.resetPasswordForEmail(email, resetUrl ? { 
          redirectTo: resetUrl
        } : undefined);
        if (error) {
          return { success: false, error: error.message };
        }
        Alert.alert(
          "Password Reset Email Sent", 
          "Check your email for instructions to reset your password."
        );
        return { success: true };
      } catch (error: any) {
        console.error("Password reset error:", error);
        return { 
          success: false, 
          error: error.message || "Failed to send password reset email" 
        };
      }
    }
  };

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#2E7D32" />
      </View>
    );
  }

  return (
    <SafeAreaProvider style={styles.container}>
      <AuthContext.Provider value={authContext}>
        <Toaster />
        <NavigationContainer ref={navigationRef}>
          {isAuthenticated && !showAuthStack ? <MainTabs /> : <AuthStack />}
        </NavigationContainer>
      </AuthContext.Provider>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    userSelect: "none"
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center'
  }
});