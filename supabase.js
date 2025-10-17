// Mock Supabase implementation for development
// Replace with actual Supabase implementation later

// Mock supabase client
const mockSupabase = {
  from: (table) => ({
    select: (columns) => ({
      eq: (column, value) => ({
        single: async () => ({
          data: mockData[table] ? mockData[table].find(item => item[column] === value) : null,
          error: null
        }),
        async: () => ({
          data: mockData[table] ? mockData[table].filter(item => item[column] === value) : [],
          error: null
        })
      }),
      async: () => ({
        data: mockData[table] || [],
        error: null
      })
    }),
    insert: (data) => ({
      select: () => ({
        single: async () => {
          const newItem = Array.isArray(data) ? data[0] : data;
          const id = newItem.id || `mock-id-${Math.random().toString(36).substring(2, 9)}`;
          const itemWithId = { ...newItem, id };
          
          if (!mockData[table]) {
            mockData[table] = [];
          }
          
          mockData[table].push(itemWithId);
          
          return {
            data: itemWithId,
            error: null
          };
        }
      })
    }),
    update: (updates) => ({
      eq: (column, value) => ({
        async: () => {
          if (!mockData[table]) {
            return { data: null, error: null };
          }
          
          const index = mockData[table].findIndex(item => item[column] === value);
          
          if (index !== -1) {
            mockData[table][index] = { ...mockData[table][index], ...updates };
            return { data: mockData[table][index], error: null };
          }
          
          return { data: null, error: null };
        }
      })
    }),
    delete: () => ({
      eq: (column, value) => ({
        async: () => {
          if (!mockData[table]) {
            return { data: null, error: null };
          }
          
          const index = mockData[table].findIndex(item => item[column] === value);
          
          if (index !== -1) {
            const deleted = mockData[table].splice(index, 1)[0];
            return { data: deleted, error: null };
          }
          
          return { data: null, error: null };
        }
      })
    }),
    upsert: (data) => ({
      select: async () => {
        const newItem = Array.isArray(data) ? data[0] : data;
        const id = newItem.id || `mock-id-${Math.random().toString(36).substring(2, 9)}`;
        const itemWithId = { ...newItem, id };
        
        if (!mockData[table]) {
          mockData[table] = [];
        }
        
        const index = mockData[table].findIndex(item => item.id === newItem.id);
        
        if (index !== -1) {
          mockData[table][index] = { ...mockData[table][index], ...itemWithId };
          return { data: mockData[table][index], error: null };
        } else {
          mockData[table].push(itemWithId);
          return { data: itemWithId, error: null };
        }
      }
    })
  })
};

// Mock data for development
const mockData = {
  user_profiles: [
    {
      id: 'demo-user-id',
      full_name: 'Demo User',
      email: 'demo@refurbfinder.com',
      avatar_url: 'https://api.a0.dev/assets/image?text=DU&aspect=1:1',
      total_trees_saved: 5,
      total_carbon_reduced: 120,
      total_waste_diverted: 45
    }
  ],
  products: [
    {
      id: '1',
      name: 'Vintage Leather Sofa',
      price: 599.99,
      image: 'https://api.a0.dev/assets/image?text=vintage%20leather%20sofa%20comfortable%20elegant&aspect=4:3',
      description: 'Beautifully restored leather sofa from the 1970s',
      category: 'Living Room',
      sketchfab_id: '40324c1abf0e4c62a3989243f1124870',
      trees_saved: 2.5,
      carbon_reduced: 45.0
    },
    {
      id: '2',
      name: 'Mid-Century Dining Table',
      price: 399.99,
      image: 'https://api.a0.dev/assets/image?text=mid%20century%20wooden%20dining%20table%20restored&aspect=4:3',
      description: 'Restored wooden dining table with original finish',
      category: 'Dining',
      sketchfab_id: '40e2100e6eab4ab0b2ddadb0c2c5b839',
      trees_saved: 3.2,
      carbon_reduced: 55.5
    },
    {
      id: '3',
      name: 'Reclaimed Wood Bookshelf',
      price: 299.99,
      image: 'https://api.a0.dev/assets/image?text=reclaimed%20wood%20bookshelf%20rustic&aspect=4:3',
      description: 'Handcrafted bookshelf made from reclaimed barn wood',
      category: 'Living Room',
      sketchfab_id: '2e4e8ae3c7e0427b8e4e3f11125efa08',
      trees_saved: 4.0,
      carbon_reduced: 65.2
    },
    {
      id: '4',
      name: 'Vintage Office Desk',
      price: 349.99,
      image: 'https://api.a0.dev/assets/image?text=vintage%20office%20desk%20oak%20restored&aspect=4:3',
      description: 'Restored oak desk with original brass hardware',
      category: 'Office',
      sketchfab_id: 'b2acf29198e34a9c8ac7e5d5809d52e6',
      trees_saved: 3.5,
      carbon_reduced: 58.7
    },
    {
      id: '5',
      name: 'Refurbished Armchair',
      price: 249.99,
      image: 'https://api.a0.dev/assets/image?text=refurbished%20armchair%20comfortable&aspect=4:3',
      description: 'Comfortable armchair with new eco-friendly upholstery',
      category: 'Living Room',
      sketchfab_id: '78bc932f7c4e4d3f9312a5fc7a394b25',
      trees_saved: 1.8,
      carbon_reduced: 32.4
    },
    {
      id: '6',
      name: 'Upcycled Coffee Table',
      price: 199.99,
      image: 'https://api.a0.dev/assets/image?text=upcycled%20coffee%20table%20creative&aspect=4:3',
      description: 'Creative coffee table made from reclaimed materials',
      category: 'Living Room',
      sketchfab_id: '3db293c3c7e94c268dc9171e2c3c656a',
      trees_saved: 2.2,
      carbon_reduced: 38.9
    },
    {
      id: '7',
      name: 'Restored Bedroom Dresser',
      price: 329.99,
      image: 'https://api.a0.dev/assets/image?text=restored%20bedroom%20dresser%20vintage&aspect=4:3',
      description: 'Vintage dresser with original patina and new hardware',
      category: 'Bedroom',
      sketchfab_id: 'f3c7d8d4e0c84c3b8e1e674e8b39c906',
      trees_saved: 3.8,
      carbon_reduced: 62.1
    },
    {
      id: '8',
      name: 'Eco-Friendly Bed Frame',
      price: 449.99,
      image: 'https://api.a0.dev/assets/image?text=eco%20friendly%20bed%20frame%20sustainable&aspect=4:3',
      description: 'Sustainable bed frame made from reclaimed wood',
      category: 'Bedroom',
      sketchfab_id: '2c4c78d2b7e04a5f9fb4d168f2c3310e',
      trees_saved: 5.0,
      carbon_reduced: 75.3
    }
  ],
  cart_items: [],
  orders: [],
  order_items: []
};

// User profile functions
export const getUserProfile = async (userId) => {
  if (USE_MOCK_DATA) {
    return getUserProfileMock(userId);
  } else {
    return getUserProfileWithSupabase(userId);
  }
};

const getUserProfileMock = async (userId) => {
  return mockData.user_profiles.find(profile => profile.id === userId) || null;
};

export const upsertUserProfile = async (userProfile) => {
  if (USE_MOCK_DATA) {
    return await upsertUserProfileMock(userProfile);
  } else {
    return await upsertUserProfileWithSupabase(userProfile);
  }
};

const upsertUserProfileMock = async (userProfile) => {
  const index = mockData.user_profiles.findIndex(profile => profile.id === userProfile.id);
  
  if (index !== -1) {
    mockData.user_profiles[index] = { ...mockData.user_profiles[index], ...userProfile };
    return mockData.user_profiles[index];
  } else {
    const newProfile = { ...userProfile, id: userProfile.id || `mock-id-${Math.random().toString(36).substring(2, 9)}` };
    mockData.user_profiles.push(newProfile);
    return newProfile;
  }
};

export const upsertUserProfileWithSupabase = async (userProfile) => {
  try {
    console.log('upsertUserProfileWithSupabase called with:', userProfile);
    
    // Check if profile exists
    const { data: existingProfile, error: fetchError } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', userProfile.id)
      .single();
    
    console.log('Existing profile check:', { existingProfile, fetchError });
    
    if (fetchError && fetchError.code !== 'PGRST116') { // PGRST116 is the error code for no rows returned
      console.error('Error fetching existing profile:', fetchError);
      throw fetchError;
    }
    
    if (existingProfile) {
      console.log('Updating existing profile');
      // Update existing profile
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .update(userProfile)
        .eq('id', userProfile.id)
        .select()
        .single();
      
      if (error) {
        console.error('Error updating profile:', error);
        throw error;
      }
      console.log('Profile updated successfully:', data);
      return data;
    } else {
      console.log('Creating new profile');
      // Insert new profile
      const { data, error } = await supabaseClient
        .from('user_profiles')
        .insert(userProfile)
        .select()
        .single();
      
      if (error) {
        console.error('Error inserting profile:', error);
        throw error;
      }
      console.log('Profile created successfully:', data);
      return data;
    }
  } catch (error) {
    console.error('Error upserting user profile:', error);
    return null;
  }
};

// Product functions
// This function will be used by the mock implementation
const getProductsMock = async (category = null) => {
  if (category && category !== 'All Products') {
    return mockData.products.filter(product => product.category === category);
  }
  return mockData.products;
};

export const getProduct = async (productId) => {
  return mockData.products.find(product => product.id === productId) || null;
};

// Cart functions
// This function is now replaced by the getCartItemsMock function
const getCartItemsOriginal = async (userId) => {
  const cartItems = mockData.cart_items.filter(item => item.user_id === userId);
  
  // Enrich with product details
  return cartItems.map(item => {
    const product = mockData.products.find(p => p.id === item.product_id);
    return {
      ...item,
      product
    };
  });
};

const addToCartMock = async (userId, productId, quantity = 1) => {
  // Check if item already exists in cart
  const existingItemIndex = mockData.cart_items.findIndex(
    item => item.user_id === userId && item.product_id === productId
  );
  
  if (existingItemIndex !== -1) {
    // Update quantity if item exists
    mockData.cart_items[existingItemIndex].quantity += quantity;
    
    // Get the updated cart item with product data
    const updatedItem = mockData.cart_items[existingItemIndex];
    const product = mockData.products.find(p => p.id === updatedItem.product_id);
    
    return { ...updatedItem, product };
  } else {
    // Create new cart item if it doesn't exist
    const newCartItem = {
      id: `cart-${Math.random().toString(36).substring(2, 9)}`,
      user_id: userId,
      product_id: productId,
      quantity: quantity
    };
    
    mockData.cart_items.push(newCartItem);
    
    // Get the product data
    const product = mockData.products.find(p => p.id === productId);
    
    return { ...newCartItem, product };
  }
};

// updateCartItemQuantityMock is defined below

const removeFromCartMock = async (cartItemId) => {
  const itemIndex = mockData.cart_items.findIndex(item => item.id === cartItemId);
  
  if (itemIndex === -1) return false;
  
  // Remove the item from cart
  mockData.cart_items.splice(itemIndex, 1);
  
  return true;
};

export const removeFromCart = async (userId, cartItemId) => {
  if (USE_MOCK_DATA) {
    return await removeFromCartMock(cartItemId);
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('cart_items')
      .delete()
      .eq('id', cartItemId)
      .select();
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error removing item from cart:', error);
    return false;
  }
};

export const clearCart = async (userId) => {
  if (USE_MOCK_DATA) {
    return await clearCartMock(userId);
  } else {
    return await clearCartWithSupabase(userId);
  }
};

const clearCartMock = async (userId) => {
  mockData.cart_items = mockData.cart_items.filter(item => item.user_id !== userId);
  return true;
};

export const clearCartWithSupabase = async (userId) => {
  try {
    const { error } = await supabaseClient
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('Error clearing cart:', error);
    return false;
  }
};

// Order functions
export const createOrderMock = async (userId, cartItems, shippingDetails) => {
  // Create new order
  const newOrder = {
    id: `order-${Math.random().toString(36).substring(2, 9)}`,
    user_id: userId,
    status: 'pending',
    shipping_address: shippingDetails.address,
    shipping_city: shippingDetails.city,
    shipping_state: shippingDetails.state,
    shipping_zip: shippingDetails.zip,
    total_amount: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0),
    created_at: new Date().toISOString()
  };
  
  if (!mockData.orders) {
    mockData.orders = [];
  }
  
  mockData.orders.push(newOrder);
  
  // Create order items
  const orderItems = cartItems.map(item => ({
    id: `order-item-${Math.random().toString(36).substring(2, 9)}`,
    order_id: newOrder.id,
    product_id: item.product_id,
    quantity: item.quantity,
    price: item.product.price
  }));
  
  if (!mockData.order_items) {
    mockData.order_items = [];
  }
  
  mockData.order_items.push(...orderItems);
  
  // Clear cart
  mockData.cart_items = mockData.cart_items.filter(item => item.user_id !== userId);
  
  // Update user impact
  const impact = cartItems.reduce((total, item) => {
    return {
      trees_saved: total.trees_saved + (item.product.trees_saved || 0) * item.quantity,
      carbon_reduced: total.carbon_reduced + (item.product.carbon_reduced || 0) * item.quantity,
      waste_diverted: total.waste_diverted + (item.product.waste_diverted || 0) * item.quantity
    };
  }, { trees_saved: 0, carbon_reduced: 0, waste_diverted: 0 });
  
  await updateUserImpactMock(userId, impact);
  
  return newOrder;
};

// Environmental impact functions
const getUserImpactMock = async (userId) => {
  const user = mockData.user_profiles.find(profile => profile.id === userId);
  if (!user) {
    return {
      trees_saved: 0,
      carbon_reduced: 0,
      waste_diverted: 0
    };
  }
  
  return {
    trees_saved: user.total_trees_saved || 0,
    carbon_reduced: user.total_carbon_reduced || 0,
    waste_diverted: user.total_waste_diverted || 0
  };
};

export const updateUserImpactMock = async (userId, impact) => {
  const user = mockData.user_profiles.find(profile => profile.id === userId);
  
  if (user) {
    user.total_trees_saved = (user.total_trees_saved || 0) + (impact.trees_saved || 0);
    user.total_carbon_reduced = (user.total_carbon_reduced || 0) + (impact.carbon_reduced || 0);
    user.total_waste_diverted = (user.total_waste_diverted || 0) + (impact.waste_diverted || 0);
    return user;
  }
  
  return null;
};

// Real Supabase integration
import { createClient } from '@supabase/supabase-js';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

// Real Supabase credentials
const supabaseUrl = 'https://ahklrtnidiriqrgfoehq.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoa2xydG5pZGlyaXFyZ2ZvZWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk4MDk4OTAsImV4cCI6MjA2NTM4NTg5MH0.I8Pmmb_EZXmrAXg02GHkLOXbWBfQ8g3GcIQ5j86I5Hk';

// Create a Supabase client with AsyncStorage for React Native
export const supabaseClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    // Use AsyncStorage on native, default (localStorage) on web to avoid RN-web shims
    storage: Platform.OS === 'web' ? undefined : AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
  },
});

// Flag to determine whether to use mock data or real Supabase
// Set to false to use the real Supabase client with actual database
const USE_MOCK_DATA = false;

// Export the appropriate client based on the flag
export const supabase = USE_MOCK_DATA ? mockSupabase : supabaseClient;

// Real Supabase functions that will be used when USE_MOCK_DATA is false
// These functions mirror the mock implementations but use the real Supabase client

// Products functions with Supabase implementation
export const getProducts = async (category = null) => {
  if (USE_MOCK_DATA) {
    return await getProductsMock(category);
  }
  
  try {
    let query = supabaseClient.from('products').select('*');
    
    if (category) {
      query = query.eq('category', category);
    }
    
    const { data, error } = await query;
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

// getUserProfileMock is already defined above

// User profile functions
export const getUserProfileWithSupabase = async (userId) => {
  if (USE_MOCK_DATA) {
    return await getUserProfileMock(userId);
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .select('*')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    return data || null;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    return null;
  }
};

// getUserImpactMock is already defined above

// User impact functions
export const getUserImpact = async (userId) => {
  if (USE_MOCK_DATA) {
    return await getUserImpactMock(userId);
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .select('id, total_trees_saved, total_carbon_reduced, total_waste_diverted')
      .eq('id', userId)
      .single();
    
    if (error) throw error;
    
    return {
      trees_saved: data.total_trees_saved || 0,
      carbon_reduced: data.total_carbon_reduced || 0,
      waste_diverted: data.total_waste_diverted || 0
    };
  } catch (error) {
    console.error('Error fetching user impact:', error);
    return { trees_saved: 0, carbon_reduced: 0, waste_diverted: 0 };
  }
};

// Initialize cart_items in mockData if it doesn't exist
if (!mockData.cart_items) {
  mockData.cart_items = [];
}

// getCartItemsMock is already defined above

// Cart functions
export const getCartItems = async (userId) => {
  if (USE_MOCK_DATA) {
    return await getCartItemsMock(userId);
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId);
    
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('Error fetching cart items:', error);
    return [];
  }
};

// addToCartMock is already defined above

export const addToCart = async (userId, productId, quantity = 1) => {
  if (USE_MOCK_DATA) {
    return await addToCartMock(userId, productId, quantity);
  }
  
  try {
    // Use upsert to avoid race conditions; requires unique index on (user_id, product_id)
    const { data: upserted, error: upsertError } = await supabaseClient
      .from('cart_items')
      .upsert({ user_id: userId, product_id: productId, quantity }, { onConflict: 'user_id,product_id' })
      .select('id, user_id, product_id, quantity')
      .single();
    if (upsertError) throw upsertError;

    // If it already existed, increment quantity in a single statement
    // Note: Some PostgREST versions do not support arithmetic in upsert; fallback to update
    const { data: current } = await supabaseClient
      .from('cart_items')
      .select('id, quantity')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();
    const newQty = (current?.quantity || 0) < quantity ? quantity : current.quantity + 0; // keep as is after upsert

    // Return the joined item
    const { data, error } = await supabaseClient
      .from('cart_items')
      .select('*, product:products(*)')
      .eq('user_id', userId)
      .eq('product_id', productId)
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error adding item to cart:', error);
    return null;
  }
};

const updateCartItemQuantityMock = async (cartItemId, quantity) => {
  const itemIndex = mockData.cart_items.findIndex(item => item.id === cartItemId);
  
  if (itemIndex === -1) return null;
  
  // Update the quantity
  mockData.cart_items[itemIndex].quantity = quantity;
  
  // Get the updated cart item with product data
  const updatedItem = mockData.cart_items[itemIndex];
  const product = mockData.products.find(p => p.id === updatedItem.product_id);
  
  return { ...updatedItem, product };
};

export const updateCartItemQuantity = async (cartItemId, quantity) => {
  if (USE_MOCK_DATA) {
    return await updateCartItemQuantityMock(cartItemId, quantity);
  }
  
  try {
    const { data, error } = await supabaseClient
      .from('cart_items')
      .update({ quantity })
      .eq('id', cartItemId)
      .select('*, product:products(*)')
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating cart item quantity:', error);
    return null;
  }
};

// removeFromCartMock is already defined above
// removeFromCart is already defined above with userId parameter

// Initialize orders in mockData if it doesn't exist
if (!mockData.orders) {
  mockData.orders = [];
}

// Initialize order_items in mockData if it doesn't exist
if (!mockData.order_items) {
  mockData.order_items = [];
}

// createOrderMock is already defined above

export const createOrder = async (userId, cartItems, shippingDetails) => {
  if (USE_MOCK_DATA) {
    return await createOrderMock(userId, cartItems, shippingDetails);
  }
  
  try {
    // Create order
    const { data: order, error: orderError } = await supabaseClient
      .from('orders')
      .insert({
        user_id: userId,
        status: 'pending',
        shipping_address: shippingDetails.address, // keep single address field for compatibility
        total_amount: cartItems.reduce((sum, item) => sum + (item.product.price * item.quantity), 0)
      })
      .select()
      .single();
    
    if (orderError) throw orderError;
    
    // Create order items
    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.product.price
    }));
    
    const { error: itemsError } = await supabaseClient
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;
    
    // Clear cart
    const { error: clearCartError } = await supabaseClient
      .from('cart_items')
      .delete()
      .eq('user_id', userId);
    
    if (clearCartError) throw clearCartError;
    
    // Update user impact
    const impact = cartItems.reduce((total, item) => {
      return {
        trees_saved: total.trees_saved + (item.product.trees_saved || 0) * item.quantity,
        carbon_reduced: total.carbon_reduced + (item.product.carbon_reduced || 0) * item.quantity,
        waste_diverted: total.waste_diverted + (item.product.waste_diverted || 0) * item.quantity
      };
    }, { trees_saved: 0, carbon_reduced: 0, waste_diverted: 0 });
    
    await updateUserImpact(userId, impact);
    
    return order;
  } catch (error) {
    console.error('Error creating order:', error);
    throw error;
  }
};

// Fetch user's orders with aggregated items count
export const getUserOrders = async (userId) => {
  try {
    const { data, error } = await supabaseClient
      .from('orders')
      .select('id, status, total_amount, created_at, order_items(count)')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    // Map nested count
    return (data || []).map((o) => ({
      id: o.id,
      status: o.status,
      total_amount: o.total_amount,
      created_at: o.created_at,
      items_count: (o.order_items && o.order_items.length ? o.order_items[0].count : 0) || 0,
    }));
  } catch (error) {
    console.error('Error fetching user orders:', error);
    return [];
  }
};

// updateUserImpactMock is already defined above

export const updateUserImpact = async (userId, impact) => {
  if (USE_MOCK_DATA) {
    return await updateUserImpactMock(userId, impact);
  }
  
  try {
    // Get current impact values
    const { data: user, error: fetchError } = await supabaseClient
      .from('user_profiles')
      .select('total_trees_saved, total_carbon_reduced, total_waste_diverted')
      .eq('id', userId)
      .single();
    
    if (fetchError) throw fetchError;
    
    // Calculate new impact values
    const updatedImpact = {
      total_trees_saved: (user.total_trees_saved || 0) + (impact.trees_saved || 0),
      total_carbon_reduced: (user.total_carbon_reduced || 0) + (impact.carbon_reduced || 0),
      total_waste_diverted: (user.total_waste_diverted || 0) + (impact.waste_diverted || 0)
    };
    
    // Update user profile
    const { data, error } = await supabaseClient
      .from('user_profiles')
      .update(updatedImpact)
      .eq('id', userId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('Error updating user impact:', error);
    return null;
  }
};

// Listings: users can submit furniture for admin review/purchase
// Storage bucket expected: 'listings'
export const uploadListingImages = async (userId, assets) => {
  try {
    if (!assets || assets.length === 0) return [];
    const urls = [];
    for (const asset of assets) {
      const uri = asset.uri || asset.path;
      const fileExt = (uri?.split('.').pop() || 'jpg').toLowerCase();
      const fileName = `${userId}/${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;

      // React Native: need to fetch the file and convert to blob
      const res = await fetch(uri);
      const blob = await res.blob();

      const { error: uploadError } = await supabaseClient
        .storage
        .from('listings')
        .upload(fileName, blob, { upsert: false, contentType: blob.type || 'image/jpeg' });
      if (uploadError) throw uploadError;

      const { data: pub } = supabaseClient
        .storage
        .from('listings')
        .getPublicUrl(fileName);
      urls.push(pub.publicUrl);
    }
    return urls;
  } catch (error) {
    console.error('uploadListingImages error:', error);
    return [];
  }
};

export const createListing = async ({ title, phone, location_text, latitude, longitude, image_urls }) => {
  try {
    const { data: userData } = await supabaseClient.auth.getUser();
    const uid = userData?.user?.id;
    if (!uid) throw new Error('Not authenticated');

    const payload = {
      user_id: uid,
      title,
      phone,
      location_text,
      latitude,
      longitude,
      image_urls: image_urls || [],
      status: 'submitted',
      history: [{ status: 'submitted', at: new Date().toISOString() }]
    };

    const { data, error } = await supabaseClient
      .from('user_listings')
      .insert(payload)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('createListing error:', error);
    return null;
  }
};

export const getListingsForUser = async (userId) => {
  try {
    const { data, error } = await supabaseClient
      .from('user_listings')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false });
    if (error) throw error;
    return data || [];
  } catch (error) {
    console.error('getListingsForUser error:', error);
    return [];
  }
};

export const updateListing = async (id, updates) => {
  try {
    const { data, error } = await supabaseClient
      .from('user_listings')
      .update(updates)
      .eq('id', id)
      .select()
      .single();
    if (error) throw error;
    return data;
  } catch (error) {
    console.error('updateListing error:', error);
    return null;
  }
};

export const deleteListing = async (id) => {
  try {
    const { error } = await supabaseClient
      .from('user_listings')
      .delete()
      .eq('id', id);
    if (error) throw error;
    return true;
  } catch (error) {
    console.error('deleteListing error:', error);
    return false;
  }
};