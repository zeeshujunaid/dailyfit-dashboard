"use client";

import Sidebar from "../../../components/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../utils/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CreatePost() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [productDescription, setProductDescription] = useState("");
  const [productImage, setProductImage] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("featuredproduct");

  const router = useRouter();

  const handleCreatePost = async (e) => {
    e.preventDefault();

    if (!productImage) {
      alert("Please select an image");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("file", productImage);
      formData.append("upload_preset", "product_upload");
      formData.append("cloud_name", "dudx3of1n");

      const res = await fetch("https://api.cloudinary.com/v1_1/dudx3of1n/image/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      const imageUrl = data.secure_url;

      const productData = {
        name: productName,
        price: productPrice,
        description: productDescription,
        image: imageUrl,
        createdAt: new Date(),
      };

      await addDoc(collection(db, selectedCategory), productData);
      console.log("Product added successfully");

      // Reset form
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setProductImage(null);
      setSelectedCategory("featuredproduct");
    } catch (err) {
      console.error("Error uploading image or adding product:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col md:flex-row">
      {/* Sidebar */}
      <div className="md:w-1/4">
        <Sidebar />
      </div>

      {/* Form Area */}
      <div className="flex-1 flex justify-center items-start p-4 sm:p-8">
        <form
          onSubmit={handleCreatePost}
          className="w-full max-w-2xl bg-white rounded-2xl shadow-lg p-8 space-y-6"
        >
          <h1 className="text-3xl font-bold text-green-600 text-center mb-4">Create Product</h1>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="featuredproduct">Featured Products</option>
              <option value="mensproduct">Men's Products</option>
              <option value="womensproduct">Women's Products</option>
              <option value="kidsproduct">Kids Products</option>
              <option value="acceseroies">Accessories</option>
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
            <input
              type="text"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              placeholder="Enter product name"
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Product Price */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price ($)</label>
            <input
              type="number"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Enter price"
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
            <textarea
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              placeholder="Product description"
              rows={4}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Upload Image</label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setProductImage(e.target.files[0])}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-md font-medium text-lg transition"
            >
              Submit Product
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
