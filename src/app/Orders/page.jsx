"use client";

import Sidebar from "../../../components/sidebar";
import { useEffect, useState } from "react";
import { db } from "../../../utils/firebase";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Orders() {
  const [Orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deliveryDay, setDeliveryDay] = useState("");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryYear, setDeliveryYear] = useState("");

  const getOrders = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "orders"));
      const allOrders = [];

      querySnapshot.forEach((docSnap) => {
        const userData = docSnap.data();
        const userOrders = userData.orders || [];

        userOrders.forEach((order) => {
          allOrders.push({
            ...order,
            userId: docSnap.id,
          });
        });
      });

      setOrders(allOrders);
    } catch (error) {
      console.error("Error fetching orders:", error);
    }
  };

  useEffect(() => {
    getOrders();
  }, []);

  const handleAcceptOrder = (order) => {
    setSelectedOrder(order);
    setShowModal(true);
  };

  const handleCancelOrder = async (orderId, userId) => {
    try {
      // Get the reference of the user document using the userId
      const userRef = doc(db, "orders", userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const orders = userData.orders || [];

        // Find the order that matches the orderId and update its status
        const updatedOrders = orders.map((order) =>
          order.orderId === orderId ? { ...order, status: "cancelled" } : order
        );

        // Update the Firestore document with the updated orders array
        await updateDoc(userRef, {
          orders: updatedOrders,
        });

        // Update the local state to reflect the canceled order status
        setOrders((prevOrders) =>
          prevOrders.map((order) =>
            order.orderId === orderId
              ? { ...order, status: "cancelled" }
              : order
          )
        );

        alert("Order status updated to 'cancelled'");
      }
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  const handleDeliverySubmit = async () => {
    if (!deliveryDay || !deliveryDate || !deliveryYear) {
      alert("Please fill in all delivery fields.");
      return;
    }

    const deliveryString = `${deliveryDay} ${deliveryDate} ${deliveryYear}`;

    try {
      const userRef = doc(db, "orders", selectedOrder.userId);
      const docSnap = await getDoc(userRef);

      if (docSnap.exists()) {
        const userData = docSnap.data();
        const orders = userData.orders || [];

        const updatedOrders = orders.map((o) =>
          o.orderId === selectedOrder.orderId
            ? {
                ...o,
                status: "delivering",
                deliveryDate: deliveryString,
              }
            : o
        );

        await updateDoc(userRef, {
          orders: updatedOrders,
        });

        setShowModal(false);
        setDeliveryDay("");
        setDeliveryDate("");
        setDeliveryYear("");
        alert("Order accepted and delivery date added.");
        getOrders(); // Refresh UI
      }
    } catch (error) {
      console.error("Error updating delivery info:", error);
    }
  };

  const renderOrderCard = (order, index) => (
    <div key={index} className="bg-white p-4 rounded shadow mb-6">
      <h2 className="text-xl font-bold text-red-600 mb-4">
        Order #{index + 1}
      </h2>

      <div className="mb-2 text-gray-800">
        <p>
          <span className="font-semibold">Total Amount:</span> Rs{" "}
          {order.totalAmount}
        </p>
        <p>
          <span className="font-semibold">Delivery Address:</span>{" "}
          {order.deliveryAddress || "N/A"}
        </p>
        <p>
          <span className="font-semibold">Payment Method:</span>{" "}
          {order.paymentMethod}
        </p>
        {order.deliveryDate && (
          <p>
            <span className="font-semibold">Delivery Date:</span>{" "}
            {order.deliveryDate}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {order.items &&
          order.items.map((item, itemIndex) => (
            <div
              key={itemIndex}
              className="flex items-center border rounded p-2"
            >
              <div>
                <p className="font-semibold text-gray-900">{item.name}</p>
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

      {order.status === "pending" && (
        <div className="mt-4 flex gap-3">
          <button
            onClick={() => handleAcceptOrder(order)}
            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600 text-sm"
          >
            Accept Order
          </button>
          <button
            onClick={() => handleCancelOrder(order.orderId, order.userId)} // Pass orderId and userId
            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 text-sm"
          >
            Cancel Order
          </button>
        </div>
      )}
    </div>
  );

  return (
    <div className="flex flex-col lg:flex-row h-screen">
      <Sidebar />
      <div className="flex-1 p-4 bg-gray-100 overflow-y-auto">
        <h1 className="text-3xl font-bold text-center text-red-600 mb-6">
          Orders
        </h1>

        {/* Pending Orders */}
        <section>
          <h2 className="text-2xl font-semibold mb-4 text-yellow-600">
            Pending Orders
          </h2>
          {Orders.filter((o) => o.status === "pending").length === 0 ? (
            <p className="text-center text-gray-800">No Pending Orders</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Orders.filter((o) => o.status === "pending").map(
                (order, index) => renderOrderCard(order, index)
              )}
            </div>
          )}
        </section>

        {/* Delivering Orders */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-green-600">
            Delivering Orders
          </h2>
          {Orders.filter((o) => o.status === "delivering").length === 0 ? (
            <p className="text-center text-gray-800">No Delivering Orders</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Orders.filter((o) => o.status === "delivering").map(
                (order, index) => renderOrderCard(order, index)
              )}
            </div>
          )}
        </section>

        {/* Cancelled Orders */}
        <section className="mt-10">
          <h2 className="text-2xl font-semibold mb-4 text-red-600">
            Cancelled Orders
          </h2>
          {Orders.filter((o) => o.status === "cancelled").length === 0 ? (
            <p className="text-center text-gray-800">No Cancelled Orders</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {Orders.filter((o) => o.status === "cancelled").map(
                (order, index) => renderOrderCard(order, index)
              )}
            </div>
          )}
        </section>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded shadow-lg w-80">
            <h3 className="text-lg font-bold mb-4 text-center">
              Enter Delivery Info
            </h3>
            <input
              type="text"
              placeholder="Delivery Day (e.g. Monday)"
              value={deliveryDay}
              onChange={(e) => setDeliveryDay(e.target.value)}
              className="mb-2 w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Delivery Date (e.g. 19)"
              value={deliveryDate}
              onChange={(e) => setDeliveryDate(e.target.value)}
              className="mb-2 w-full px-3 py-2 border rounded"
            />
            <input
              type="text"
              placeholder="Delivery Year (e.g. 2025)"
              value={deliveryYear}
              onChange={(e) => setDeliveryYear(e.target.value)}
              className="mb-4 w-full px-3 py-2 border rounded"
            />
            <div className="flex justify-end gap-3">
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleDeliverySubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
