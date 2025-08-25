import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { User, Palette, Shield } from "lucide-react";
import UpdatePassword from "../../Auth/UpdatePassword";

const Settings = () => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);

  const settingsCards = [
    {
      title: "Profile Information",
      description: "Manage your personal details and contact information",
      icon: <User className="w-8 h-8" />,
      color: "from-blue-500 to-cyan-500",
      actions: [
        { label: "Edit Profile", action: () => navigate("/edit-profile"), primary: true },
        { label: "View Profile", action: () => navigate("/profile"), primary: false }
      ]
    },
    {
      title: "Preferences",
      description: "Customize your app experience with theme and language settings",
      icon: <Palette className="w-8 h-8" />,
      color: "from-purple-500 to-indigo-500",
      actions: [
        { label: "Edit Preferences", action: () => navigate("/edit-preferences"), primary: true }
      ]
    },
    {
      title: "Security & Privacy",
      description: "Manage your account security and privacy settings",
      icon: <Shield className="w-8 h-8" />,
      color: "from-emerald-500 to-teal-500",
      actions: [
        { label: "Change Password", action: () => setShowModal(true), primary: true },
        { label: "Privacy Settings", action: () => navigate("/privacy"), primary: false }
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900">
      <div className="flex flex-col w-full h-full px-6 py-8 gap-8">
        {/* Header */}
        <div className="space-y-2">
          <h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
            ⚙️ Settings
          </h1>
          <p className="text-gray-600 text-lg">Manage your account and preferences</p>
        </div>

        {/* Settings Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {settingsCards.map((card, index) => (
            <div
              key={index}
              className="group bg-gray-50 rounded-2xl border border-gray-200 p-6 hover:shadow-md transition-all duration-300"
            >
              <div className="flex items-start gap-6">
                {/* Icon */}
                <div className={`p-4 rounded-2xl bg-gradient-to-r ${card.color} shadow-md group-hover:scale-105 transition-transform`}>
                  {React.cloneElement(card.icon, { className: "w-8 h-8 text-white" })}
                </div>

                {/* Content */}
                <div className="flex-1 space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800 mb-1">{card.title}</h3>
                    <p className="text-gray-600">{card.description}</p>
                  </div>

                  {/* Actions */}
                  <div className="flex flex-wrap gap-3">
                    {card.actions.map((action, actionIndex) => (
                      <button
                        key={actionIndex}
                        onClick={action.action}
                        className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                          action.primary
                            ? `bg-gradient-to-r ${card.color} text-white hover:shadow-md`
                            : "bg-gray-100 border border-gray-300 text-gray-700 hover:bg-gray-200"
                        }`}
                      >
                        {action.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Modal */}
        {showModal && (
          <div className="fixed inset-0 flex items-center justify-center z-[9999] bg-black/50 backdrop-blur-sm">
            <UpdatePassword onClose={() => setShowModal(false)} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
