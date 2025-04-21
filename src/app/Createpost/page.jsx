"use client";

import Sidebar from "../../../components/sidebar";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../../utils/firebase";
import { collection, addDoc } from "firebase/firestore";

export default function CreatePost() {
  const [productName, setProductName] = useState("");
  const [productPrice, setProductPrice] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [productDescription, setProductDescription] = useState("");
  const [productImages, setProductImages] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("featuredproduct");

  const router = useRouter();

  const handleCreatePost = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    if (productImages.length === 0) {
      alert("Please select at least one image (max 5)");
      setIsLoading(false);
      return;
    }

    try {
      const imageUrls = {};

      for (let i = 0; i < productImages.length && i < 5; i++) {
        const formData = new FormData();
        formData.append("file", productImages[i]);
        formData.append("upload_preset", "product_upload");
        formData.append("cloud_name", "dudx3of1n");

        const res = await fetch(
          "https://api.cloudinary.com/v1_1/dudx3of1n/image/upload",
          {
            method: "POST",
            body: formData,
          }
        );

        const data = await res.json();
        imageUrls[`image${i + 1}`] = data.secure_url;
      }

      const productData = {
        name: productName,
        price: productPrice,
        description: productDescription,
        ...imageUrls,
        createdAt: new Date(),
      };

      await addDoc(collection(db, selectedCategory), productData);
      console.log("Product added successfully");

      // Reset form
      setProductName("");
      setProductPrice("");
      setProductDescription("");
      setProductImages([]);
      setSelectedCategory("featuredproduct");
    } catch (err) {
      console.error("Error uploading images or adding product:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRemoveImage = (index) => {
    const updatedImages = [...productImages];
    updatedImages.splice(index, 1);
    setProductImages(updatedImages);
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
          <h1 className="text-3xl font-bold text-green-600 text-center mb-4">
            Create Product
          </h1>

          {/* Category */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Category
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Product Name
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($)
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
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
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Upload Images (Max 5)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              onChange={(e) => {
                const newFiles = Array.from(e.target.files);
                const totalFiles = [...productImages, ...newFiles].slice(0, 5);
                setProductImages(totalFiles);
              }}
              className="w-full border px-4 py-2 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
            />

            {/* Image Previews */}
            <div className="flex flex-wrap gap-2 mt-3">
              {productImages.map((img, index) => (
                <div
                  key={index}
                  className="relative w-20 h-20 rounded overflow-hidden border"
                >
                  <img
                    src={URL.createObjectURL(img)}
                    alt={`preview-${index}`}
                    className="object-cover w-full h-full"
                  />
                  <button
                    type="button"
                    onClick={() => handleRemoveImage(index)}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Submit Button */}
          <div className="text-center">
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-md font-medium text-lg transition ${
                isLoading
                  ? "bg-green-400 cursor-not-allowed"
                  : "bg-green-600 hover:bg-green-700"
              } text-white`}
            >
              {isLoading ? "Uploading..." : "Submit Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
