import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Product from "../models/Product.js";
import Category from "../models/Category.js";

// Load env vars
dotenv.config();

// Connect to DB
const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error("Database connection error:", error.message);
    process.exit(1);
  }
};

// Sample data
const categories = [
  {
    name: "Electronics",
    description: "Electronic devices and gadgets",
    image: "/images/categories/electronics.jpg",
    sortOrder: 1,
  },
  {
    name: "Clothing",
    description: "Fashion and apparel",
    image: "/images/categories/clothing.jpg",
    sortOrder: 2,
  },
  {
    name: "Books",
    description: "Books and educational materials",
    image: "/images/categories/books.jpg",
    sortOrder: 3,
  },
  {
    name: "Home & Garden",
    description: "Home improvement and garden supplies",
    image: "/images/categories/home-garden.jpg",
    sortOrder: 4,
  },
  {
    name: "Sports & Outdoors",
    description: "Sports equipment and outdoor gear",
    image: "/images/categories/sports.jpg",
    sortOrder: 5,
  },
];

const users = [
  {
    name: "Admin User",
    email: "admin@onlineshop.com",
    password: "admin123",
    role: "admin",
  },
  {
    name: "John Doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
    phone: "+1234567890",
    address: {
      street: "123 Main St",
      city: "New York",
      state: "NY",
      zipCode: "10001",
      country: "USA",
    },
  },
  {
    name: "Jane Smith",
    email: "jane@example.com",
    password: "password123",
    role: "user",
    phone: "+0987654321",
    address: {
      street: "456 Oak Ave",
      city: "Los Angeles",
      state: "CA",
      zipCode: "90001",
      country: "USA",
    },
  },
];

const products = [
  {
    name: "iPhone 13 Pro",
    description: "Latest Apple iPhone with A15 Bionic chip",
    shortDescription: "Premium smartphone with advanced camera system",
    price: 999,
    originalPrice: 1099,
    discount: 9,
    images: [
      {
        url: "/images/products/iphone-13-pro.jpg",
        alt: "iPhone 13 Pro",
        isPrimary: true,
      },
    ],
    brand: "Apple",
    sku: "IPHONE13PRO-128",
    stock: 50,
    isFeatured: true,
    specifications: [
      { name: "Storage", value: "128GB" },
      { name: "RAM", value: "6GB" },
      { name: "Display", value: "6.1 inch Super Retina XDR" },
      { name: "Camera", value: "Triple 12MP system" },
    ],
    tags: ["smartphone", "apple", "ios", "premium"],
  },
  {
    name: "Samsung Galaxy S21",
    description: "Flagship Android smartphone with excellent camera",
    shortDescription: "Powerful Android phone with pro-grade camera",
    price: 799,
    originalPrice: 899,
    discount: 11,
    images: [
      {
        url: "/images/products/galaxy-s21.jpg",
        alt: "Samsung Galaxy S21",
        isPrimary: true,
      },
    ],
    brand: "Samsung",
    sku: "GALAXY-S21-128",
    stock: 35,
    isFeatured: true,
    specifications: [
      { name: "Storage", value: "128GB" },
      { name: "RAM", value: "8GB" },
      { name: "Display", value: "6.2 inch Dynamic AMOLED" },
      { name: "Camera", value: "Triple camera system" },
    ],
    tags: ["smartphone", "samsung", "android", "flagship"],
  },
  {
    name: "MacBook Air M1",
    description: "Apple MacBook Air with M1 chip for incredible performance",
    shortDescription: "Ultra-thin laptop with M1 chip",
    price: 999,
    images: [
      {
        url: "/images/products/macbook-air-m1.jpg",
        alt: "MacBook Air M1",
        isPrimary: true,
      },
    ],
    brand: "Apple",
    sku: "MBA-M1-256",
    stock: 25,
    isFeatured: true,
    specifications: [
      { name: "Processor", value: "Apple M1 chip" },
      { name: "Memory", value: "8GB unified memory" },
      { name: "Storage", value: "256GB SSD" },
      { name: "Display", value: "13.3-inch Retina" },
    ],
    tags: ["laptop", "apple", "macbook", "portable"],
  },
  {
    name: "Nike Air Max 270",
    description: "Comfortable running shoes with Air Max technology",
    shortDescription: "Stylish and comfortable sneakers",
    price: 150,
    originalPrice: 180,
    discount: 17,
    images: [
      {
        url: "/images/products/nike-air-max-270.jpg",
        alt: "Nike Air Max 270",
        isPrimary: true,
      },
    ],
    brand: "Nike",
    sku: "NIKE-AM270-10",
    stock: 100,
    specifications: [
      { name: "Size", value: "US 10" },
      { name: "Color", value: "Black/White" },
      { name: "Material", value: "Mesh and synthetic" },
      { name: "Technology", value: "Air Max cushioning" },
    ],
    tags: ["shoes", "nike", "running", "casual"],
  },
  {
    name: "The Great Gatsby",
    description: "Classic American novel by F. Scott Fitzgerald",
    shortDescription: "Timeless literature classic",
    price: 12.99,
    images: [
      {
        url: "/images/products/great-gatsby.jpg",
        alt: "The Great Gatsby",
        isPrimary: true,
      },
    ],
    brand: "Scribner",
    sku: "BOOK-GG-001",
    stock: 200,
    specifications: [
      { name: "Pages", value: "180" },
      { name: "Language", value: "English" },
      { name: "Format", value: "Paperback" },
      { name: "ISBN", value: "978-0743273565" },
    ],
    tags: ["book", "literature", "classic", "fiction"],
  },
];

// Import data
const importData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    console.log("Data Destroyed...");

    // Create categories first
    const createdCategories = await Category.insertMany(categories);
    console.log("Categories imported...");

    // Create users
    const createdUsers = await User.insertMany(users);
    const adminUser = createdUsers.find((user) => user.role === "admin");
    console.log("Users imported...");

    // Assign categories to products
    const productsWithCategories = products.map((product, index) => ({
      ...product,
      category: createdCategories[index % createdCategories.length]._id,
      createdBy: adminUser._id,
    }));

    // Create products
    await Product.insertMany(productsWithCategories);
    console.log("Products imported...");

    console.log("Data Imported Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error importing data:", error);
    process.exit(1);
  }
};

// Delete data
const deleteData = async () => {
  try {
    await connectDB();

    await User.deleteMany();
    await Product.deleteMany();
    await Category.deleteMany();

    console.log("Data Destroyed Successfully!");
    process.exit();
  } catch (error) {
    console.error("Error destroying data:", error);
    process.exit(1);
  }
};

// Process command line arguments
if (process.argv[2] === "-d") {
  deleteData();
} else {
  importData();
}
