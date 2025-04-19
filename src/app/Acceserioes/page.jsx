"use client";

import Sidebar from "../../../components/sidebar";
import { useEffect, useState } from "react";
import { db } from "../../../utils/firebase";
import { collection, getDocs } from "firebase/firestore";

export default function Accessories() {
    const [accessories, setAccessories] = useState([]);

    useEffect(() => {
        const fetchAccessories = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, "acceseroies"));
                const accessoriesData = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    ...doc.data(),
                }));
                console.log("Accessories", accessoriesData);
                setAccessories(accessoriesData);
            } catch (error) {
                console.error("Error fetching accessories:", error);
            }
        };

        fetchAccessories();
    }, []);

    return (
        <div className="min-h-screen bg-green-50 flex flex-col md:flex-row">
            {/* Sidebar */}
            <div className="w-full md:w-64 bg-white shadow-md">
                <Sidebar />
            </div>

            {/* Main Content */}
            <main className="flex-1 p-6">
                <h1 className="text-3xl font-bold text-center text-green-700 mb-10">
                    Accessories Collection
                </h1>

                {accessories.length === 0 ? (
                    <p className="text-center text-gray-600">No accessories available.</p>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {accessories.map((item) => (
                            <div
                                key={item.id}
                                className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-shadow duration-300"
                            >
                                <img
                                    src={item.image}
                                    alt={item.name}
                                    className="w-full h-48 object-cover"
                                />
                                <div className="p-4">
                                    <h2 className="text-xl font-semibold text-green-800">
                                        {item.name}
                                    </h2>
                                    <p className="text-gray-600 text-sm mt-2 line-clamp-2">
                                        {item.description}
                                    </p>
                                    <p className="text-lg font-bold text-green-700 mt-3">
                                        ${item.price}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
