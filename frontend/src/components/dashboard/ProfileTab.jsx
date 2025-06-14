"use client"

import { useState } from "react"
import { authAPI } from "../../services/api"
import { toast } from "react-toastify"

const ProfileTab = ({ user, onUpdateProfile }) => {
  const [isEditing, setIsEditing] = useState(false)
  const [isChangingPassword, setIsChangingPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || "",
    phone: user?.phone || "",
    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
  })
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handlePasswordChange = (e) => {
    setPasswordData({
      ...passwordData,
      [e.target.name]: e.target.value,
    })
  }

  const handleProfileSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    const result = await onUpdateProfile(formData)
    if (result.success) {
      setIsEditing(false)
    }

    setLoading(false)
  }

  const handlePasswordSubmit = async (e) => {
    e.preventDefault()

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error("New passwords do not match")
      return
    }

    if (passwordData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long")
      return
    }

    setLoading(true)

    try {
      await authAPI.changePassword({
        currentPassword: passwordData.currentPassword,
        newPassword: passwordData.newPassword,
      })
      toast.success("Password changed successfully")
      setIsChangingPassword(false)
      setPasswordData({
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      })
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to change password")
    }

    setLoading(false)
  }

  const formatDate = (dateString) => {
    if (!dateString) return "Not provided"
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
  }

  return (
    <div className="space-y-8">
      {/* Profile Information */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Edit Profile
            </button>
          )}
        </div>

        {isEditing ? (
          <form onSubmit={handleProfileSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  required
                  className="input-field"
                  value={formData.name}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  className="input-field"
                  value={formData.phone}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  type="date"
                  id="dateOfBirth"
                  name="dateOfBirth"
                  className="input-field"
                  value={formData.dateOfBirth}
                  onChange={handleInputChange}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input type="email" className="input-field bg-gray-100" value={user?.email} disabled />
                <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-primary-600 hover:bg-primary-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false)
                  setFormData({
                    name: user?.name || "",
                    phone: user?.phone || "",
                    dateOfBirth: user?.dateOfBirth ? user.dateOfBirth.split("T")[0] : "",
                  })
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-sm text-gray-600">Full Name</p>
                <p className="font-medium text-gray-900">{user?.name}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Email</p>
                <p className="font-medium text-gray-900">{user?.email}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Phone</p>
                <p className="font-medium text-gray-900">{user?.phone || "Not provided"}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Date of Birth</p>
                <p className="font-medium text-gray-900">{formatDate(user?.dateOfBirth)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Account Type</p>
                <span className="inline-flex px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800 capitalize">
                  {user?.role}
                </span>
              </div>
              <div>
                <p className="text-sm text-gray-600">Member Since</p>
                <p className="font-medium text-gray-900">{formatDate(user?.createdAt)}</p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Password Change */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h3 className="text-lg font-semibold text-gray-900">Security</h3>
          {!isChangingPassword && (
            <button
              onClick={() => setIsChangingPassword(true)}
              className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Change Password
            </button>
          )}
        </div>

        {isChangingPassword ? (
          <form onSubmit={handlePasswordSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Current Password
                </label>
                <input
                  type="password"
                  id="currentPassword"
                  name="currentPassword"
                  required
                  className="input-field"
                  value={passwordData.currentPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div>
                <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  New Password
                </label>
                <input
                  type="password"
                  id="newPassword"
                  name="newPassword"
                  required
                  minLength="6"
                  className="input-field"
                  value={passwordData.newPassword}
                  onChange={handlePasswordChange}
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  id="confirmPassword"
                  name="confirmPassword"
                  required
                  minLength="6"
                  className="input-field"
                  value={passwordData.confirmPassword}
                  onChange={handlePasswordChange}
                />
              </div>
            </div>

            <div className="flex space-x-4">
              <button
                type="submit"
                disabled={loading}
                className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg transition-colors disabled:opacity-50"
              >
                {loading ? "Changing..." : "Change Password"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false)
                  setPasswordData({
                    currentPassword: "",
                    newPassword: "",
                    confirmPassword: "",
                  })
                }}
                className="bg-gray-300 hover:bg-gray-400 text-gray-700 px-6 py-2 rounded-lg transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        ) : (
          <div className="bg-gray-50 rounded-lg p-6">
            <p className="text-gray-600">
              Keep your account secure by using a strong password and changing it regularly.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProfileTab
