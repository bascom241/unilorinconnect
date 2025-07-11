import React, { useEffect } from "react";
import { authStore } from "../store/useAuthStore";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

const Profile = () => {
  const { user, userProfile } = authStore();

  useEffect(() => {
    userProfile();
  }, []);

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen text-lg font-medium">
        Loading your profile...
      </div>
    );
  }
  console.log("User Profile Data:", user);

  const {
    fullName,
    email,
    matricNumber,
    role,
    isVerified,
    lastLogin,
    createdAt,
    verificationToken,
    marketItems = [],
    resources = [],
  } = user;

  return (
    <div className="max-w-6xl mx-auto px-6 py-10 space-y-10">
      {/* Profile Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-4xl font-bold text-gray-900">👤 Hello, {user?.user?.fullName}</h1>
          <p className="text-gray-600 text-sm mt-1">Welcome back to your dashboard</p>
        </div>
      </div>

      {/* User Details */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="bg-white shadow-xl rounded-2xl p-6"
      >
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Your Information</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 text-sm">
          <div><strong>Full Name:</strong> {user?.user?.fullName}</div>
          <div><strong>Email:</strong> {user?.user?.email}</div>
          <div><strong>Matric Number:</strong> {user?.user?.matricNumber}</div>
          {/* <div><strong>Role:</strong> {role}</div> */}
          <div>
            <strong>Verified:</strong>{" "}
            {isVerified ? (
              <span className="text-green-600">✅ Yes</span>
            ) : (
              <span className="text-red-600">❌ No (Token: {user?.user?.verificationToken})</span>
            )}
          </div>
          {/* <div><strong>Last Login:</strong> {new Date(lastLogin).toLocaleString()}</div>
          <div><strong>Account Created:</strong> {new Date(createdAt).toLocaleDateString()}</div> */}
        </div>
      </motion.div>

      {/* Market Items Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-900">🛒 Your Market Items</h2>
        {marketItems.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {marketItems.map((item) => (
              <motion.div
                key={item._id}
                whileHover={{ scale: 1.03 }}
                className="bg-white rounded-xl shadow-lg p-4 transition"
              >
                <img
                  src={item.itemImage}
                  alt={item.Title}
                  className="h-40 w-full object-cover rounded-lg mb-3"
                />
                <h3 className="text-lg font-semibold text-gray-800">{item.Title}</h3>
                <p className="text-sm text-gray-600 mb-2">{item.Description}</p>
                <div className="flex justify-between text-xs">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">{item.category}</span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded">₦{item.price}</span>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No market items added yet.</p>
        )}
      </motion.div>

      {/* Resources Section */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-4"
      >
        <h2 className="text-2xl font-bold text-gray-900">📚 Your Resources</h2>
        {resources.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {resources.map((res) => (
              <div key={res._id} className="bg-white p-5 rounded-lg shadow-md">
                <h3 className="text-lg font-semibold text-gray-800">{res.Title}</h3>
                <p className="text-sm text-gray-600 mb-2">{res.Description}</p>
                <a
                  href={res.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-600 hover:underline text-sm"
                >
                  🔗 View / Download
                </a>
                <p className="text-xs text-gray-500 mt-1">
                  📘 Course: {res.courseCode} | 🎓 Level: {res.YearLevel}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">No resources uploaded yet.</p>
        )}
      </motion.div>
    </div>
  );
};

export default Profile;
