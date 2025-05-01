"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const dummyemail = "admin@gmail.com";
  const dummypassword = "987654321";

  const handleLogin = (e) => {
    e.preventDefault();
    if (email === dummyemail && password === dummypassword) {
      alert("Login Successful");
      router.push("/Createpost");
    } else {
      alert("Login Failed");
    }
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <div className="w-full max-w-sm p-6 bg-white rounded-lg shadow-lg">
        <h1 className="mb-6 text-3xl font-bold text-center text-red-600">
          The <span className="text-gray-800">Daily</span> Fit
        </h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 border rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 text-gray-900 border rounded-md"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 mt-4 text-gry-800 bg-red-500 rounded-md hover:bg-red-600"
          >
            Login
          </button>
        </form>
      </div>
    </div>
  );
}
