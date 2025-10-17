# Furni Eco-Friendly Furniture App

## Overview
This is a React Native mobile application for an eco-friendly furniture marketplace. The app allows users to browse refurbished and sustainable furniture products, add them to cart, and track their environmental impact through purchases.

## Features
- Browse eco-friendly furniture products by category
- View detailed product information
- Add products to cart
- Checkout process
- User authentication
- Environmental impact tracking (trees saved, carbon reduced, waste diverted)

## Supabase Integration
The app uses Supabase as its backend database and authentication service. The integration is set up to work in two modes:

### Development Mode (Mock Data)
By default, the app uses mock data for development purposes. This allows for quick testing without requiring a Supabase account or internet connection.

### Production Mode (Real Supabase)
To switch to using a real Supabase backend:

1. Create a Supabase project at [https://supabase.com](https://supabase.com)
2. Set up the following tables in your Supabase database:
   - `products` - Store product information
   - `user_profiles` - Store user profile data and impact metrics
   - `cart_items` - Store user cart items
   - `orders` - Store order information
   - `order_items` - Store items within orders
3. Update the Supabase credentials in `supabase.js`:
   ```javascript
   const supabaseUrl = 'YOUR_SUPABASE_URL';
   const supabaseKey = 'YOUR_SUPABASE_ANON_KEY';
   ```
4. Set the `USE_MOCK_DATA` flag to `false` in `supabase.js`:
   ```javascript
   const USE_MOCK_DATA = false;
   ```

## Getting Started

### Prerequisites
- Node.js
- npm or yarn
- Expo CLI

### Installation
1. Clone the repository
2. Install dependencies:
   ```
   npm install --legacy-peer-deps
   ```
3. Start the development server:
   ```
   npx expo start
   ```

### Running on Web
To run the app in a web browser:
```
npm install react-dom @expo/metro-runtime --legacy-peer-deps
npx expo start --web
```

## Database Schema

### Products Table
- id (primary key)
- name
- price
- image
- description
- category
- sketchfab_id (for 3D models)
- trees_saved
- carbon_reduced
- waste_diverted

### User Profiles Table
- id (primary key, linked to auth.users)
- full_name
- email
- avatar_url
- total_trees_saved
- total_carbon_reduced
- total_waste_diverted

### Cart Items Table
- id (primary key)
- user_id (foreign key to user_profiles)
- product_id (foreign key to products)
- quantity

### Orders Table
- id (primary key)
- user_id (foreign key to user_profiles)
- status
- shipping_address
- shipping_city
- shipping_state
- shipping_zip
- total_amount
- created_at

### Order Items Table
- id (primary key)
- order_id (foreign key to orders)
- product_id (foreign key to products)
- quantity
- price