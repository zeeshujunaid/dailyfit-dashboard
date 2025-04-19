"use client";

import Sidebar from "../../../components/sidebar";
import { useEffect, useState } from "react";
import { db } from "../../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function KidsPost() {
  const [kidsProducts, setKidsProducts] = useState([]);

  useEffect(() => {
    const getKidsProducts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "kidsproduct"));
        const data = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        console.log("kidsproduct", data);
        setKidsProducts(data);
      } catch (error) {
        console.error("Error fetching kids products:", error);
      }
    };

    getKidsProducts();
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-gray-50">
      {/* Sidebar */}
      <div className="w-full md:w-64 bg-white shadow-md">
        <Sidebar />
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6">
        <h1 className="text-3xl font-bold text-center text-green-700 mb-8">
          Kids Products
        </h1>

        {kidsProducts.length === 0 ? (
          <p className="text-center text-gray-500">No kids products available.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {kidsProducts.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-300 p-4 flex flex-col"
              >
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800">{item.name}</h2>
                  <p className="text-gray-500 text-sm mt-1 line-clamp-3">
                    {item.description}
                  </p>
                </div>
                <div className="mt-4 text-right">
                  <span className="text-green-600 font-bold text-lg">${item.price}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
