"use client";

import Sidebar from "../../../components/sidebar";
import { useEffect, useState } from "react";
import { db } from "../../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function LadiesPost() {
  const [ladiesProducts, setLadiesProducts] = useState([]);

  useEffect(() => {
    const fetchLadiesProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "womensproduct"));
        const data = querySnapshot.docs.map((doc) => {
          const docData = doc.data();
          const images = [];

          for (let i = 1; i <= 5; i++) {
            if (docData[`image${i}`]) {
              images.push(docData[`image${i}`]);
            }
          }

          return {
            id: doc.id,
            ...docData,
            images,
          };
        });

        console.log("Ladies Products:", data);
        localStorage.setItem("ladiesProducts", JSON.stringify(data));
        setLadiesProducts(data);
      } catch (error) {
        console.error("Error fetching ladies products:", error);
      }
    };

    fetchLadiesProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center text-pink-700 mb-8">
          Ladies Products
        </h1>

        {ladiesProducts.length === 0 ? (
          <p className="text-center text-gray-500">No products found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {ladiesProducts.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function ProductCard({ product }) {
  const [mainImage, setMainImage] = useState(product.images[0]);

  return (
    <div className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex flex-col">
      <img
        src={mainImage}
        alt={product.name}
        className="w-full h-48 object-cover rounded-xl mb-3"
      />

      {/* Thumbnails */}
      {product.images.length > 1 && (
        <div className="flex gap-2 mb-3">
          {product.images.map((img, idx) => (
            <img
              key={idx}
              src={img}
              alt={`thumbnail-${idx}`}
              className={`w-10 h-10 rounded border cursor-pointer object-cover ${
                mainImage === img ? "border-pink-600" : "border-gray-300"
              }`}
              onClick={() => setMainImage(img)}
            />
          ))}
        </div>
      )}

      {/* Product Info */}
      <div className="flex-1">
        <h2 className="text-lg font-semibold text-gray-800">{product.name}</h2>
        <p className="text-gray-500 text-sm mt-1 line-clamp-3">
          {product.description}
        </p>
      </div>

      <div className="mt-4 text-right">
        <span className="text-pink-600 font-bold text-lg">${product.price}</span>
      </div>
    </div>
  );
}
