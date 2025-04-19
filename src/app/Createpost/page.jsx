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
      // Upload image to Cloudinary
      const formData = new FormData();
      formData.append("file", productImage);
      formData.append("upload_preset", "product_upload"); // 🔁 Replace this
      formData.append("cloud_name", "dudx3of1n");       // 🔁 Replace this

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
      console.log("Product added successfully to", selectedCategory);

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
    <div className="flex flex-row justify-around items-start h-screen bg-gray-100">
      <div className="w-1/4">
        <Sidebar />
      </div>

      <div className="w-3/4 p-8">
        <h1 className="text-4xl font-extrabold text-center text-green-600 mb-8">
          Create New Product Post
        </h1>

        <form onSubmit={handleCreatePost} className="space-y-6 max-w-lg mx-auto bg-white p-8 rounded-lg shadow-lg">
          {/* Category Select Dropdown */}
          <div>
            <label className="block text-lg font-medium text-gray-700 mb-2">
              Select Category
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="featuredproduct">Featured Products</option>
              <option value="mensproduct">Mens Products</option>
              <option value="womensproduct">Womens Products</option>
              <option value="kidsproduct">Kids Products</option>
            </select>
          </div>

          {/* Product Name */}
          <div>
            <label htmlFor="productName" className="block text-lg font-medium text-gray-700 mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="productName"
              placeholder="Enter product name"
              value={productName}
              onChange={(e) => setProductName(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Product Price */}
          <div>
            <label htmlFor="productPrice" className="block text-lg font-medium text-gray-700 mb-2">
              Product Price ($)
            </label>
            <input
              type="number"
              id="productPrice"
              value={productPrice}
              onChange={(e) => setProductPrice(e.target.value)}
              placeholder="Enter product price"
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Product Description */}
          <div>
            <label htmlFor="productDescription" className="block text-lg font-medium text-gray-700 mb-2">
              Product Description
            </label>
            <textarea
              id="productDescription"
              placeholder="Enter product description"
              value={productDescription}
              onChange={(e) => setProductDescription(e.target.value)}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              rows="4"
              required
            ></textarea>
          </div>

          {/* Product Image */}
          <div>
            <label htmlFor="productImage" className="block text-lg font-medium text-gray-700 mb-2">
              Upload Product Image
            </label>
            <input
              type="file"
              id="productImage"
              accept="image/*"
              onChange={(e) => setProductImage(e.target.files[0])}
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              className="w-full py-3 mt-6 text-white bg-green-600 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Submit Post
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
