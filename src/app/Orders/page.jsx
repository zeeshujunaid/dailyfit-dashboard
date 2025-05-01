"use client";

import Sidebar from "../../../components/sidebar";
import { useEffect, useState } from "react";
import { db } from "../../../utils/firebase";
import { collection, getDocs, doc } from "firebase/firestore";

export default function Orders() {
  const [Orders, setOrders] = useState([]);

  useEffect(() => {
    const getorders = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "orders"));
        const allOrders = [];

        querySnapshot.forEach((doc) => {
          const userData = doc.data();
          const userOrders = userData.orders || [];

          userOrders.forEach((order) => {
            allOrders.push({
              ...order,
              userId: doc.id, // optional if you want to show who ordered
            });
          });
        });

        setOrders(allOrders);
        console.log("Orders:fetched successfully", allOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      }
    };
    getorders();
  }, []);

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          Orders
        </h1>
        {Orders.length === 0 ? (
          <p className="text-center text-gray-800">No Orders Right Now</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {Orders.map((order, index) => (
              <div key={index} className="bg-white p-4 rounded shadow mb-6">
                <h2 className="text-xl font-bold text-red-600 mb-4">
                  Order #{index + 1}
                </h2>

                {/* Order details */}
                <div className="mb-2">
                  <p className="text-gray-800">
                    <span className="font-semibold">Total Amount:</span> Rs{" "}
                    {order.totalAmount}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold">Delivery Address:</span>{" "}
                    {order.deliveryAddress || "N/A"}
                  </p>
                  <p className="text-gray-800">
                    <span className="font-semibold">Payment Method:</span>{" "}
                    {order.paymentMethod}
                  </p>
                </div>

                {/* Items in a row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                  {order.items &&
                    order.items.map((item, itemIndex) => (
                      <div
                        key={itemIndex}
                        className="flex items-center border rounded p-2"
                      >
                        <img
                          src={
                            item.imageUrl || "https://via.placeholder.com/60"
                          }
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded mr-4"
                        />
                        <div>
                          <p className="font-semibold text-gray-900">
                            {item.name}
                          </p>
                          <p className="text-sm text-gray-600">
                            Quantity: {item.quantity}
                          </p>
                        </div>
                      </div>
                    ))}
                </div>

                <p className="mt-4 text-sm font-semibold text-blue-600">
                  Status: {order.status}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
