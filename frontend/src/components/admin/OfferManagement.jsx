"use client"

import { useState, useEffect } from "react"
import { offerAPI } from "../../services/api"
import { toast } from "react-toastify"

const OfferManagement = () => {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEditing, setIsEditing] = useState(false)
  const [currentOffer, setCurrentOffer] = useState(null)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    discount: "",
    validUntil: "",
    bgColor: "from-blue-400 to-blue-600",
    isActive: true,
  })

  const bgColorOptions = [
    { value: "from-blue-400 to-blue-600", label: "Blue" },
    { value: "from-green-400 to-green-600", label: "Green" },
    { value: "from-red-400 to-red-600", label: "Red" },
    { value: "from-purple-400 to-purple-600", label: "Purple" },
    { value: "from-orange-400 to-pink-500", label: "Orange to Pink" },
    { value: "from-purple-500 to-indigo-600", label: "Purple to Indigo" },
    { value: "from-green-400 to-blue-500", label: "Green to Blue" },
  ]

  useEffect(() => {
    fetchOffers()
  }, [])

  const fetchOffers = async () => {
    try {
      setLoading(true)
      const response = await offerAPI.getAllOffers()
      setOffers(response.data.data)
    } catch (error) {
      toast.error("Failed to fetch offers")
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    })
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      discount: "",
      validUntil: "",
      bgColor: "from-blue-400 to-blue-600",
      isActive: true,
    })
    setIsEditing(false)
    setCurrentOffer(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      if (isEditing && currentOffer) {
        await offerAPI.updateOffer(currentOffer._id, formData)
        toast.success("Offer updated successfully")
      } else {
        await offerAPI.createOffer(formData)
        toast.success("Offer created successfully")
      }

      resetForm()
      fetchOffers()
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save offer")
    }
  }

  const handleEdit = (offer) => {
    setIsEditing(true)
    setCurrentOffer(offer)
    setFormData({
      title: offer.title,
      description: offer.description,
      discount: offer.discount,
      validUntil: new Date(offer.validUntil).toISOString().split("T")[0],
      bgColor: offer.bgColor,
      isActive: offer.isActive,
    })
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this offer?")) {
      try {
        await offerAPI.deleteOffer(id)
        toast.success("Offer deleted successfully")
        fetchOffers()
      } catch (error) {
        toast.error("Failed to delete offer")
      }
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="spinner"></div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">{isEditing ? "Edit Offer" : "Create New Offer"}</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
              <input
                type="text"
                name="title"
                required
                className="input-field"
                value={formData.title}
                onChange={handleInputChange}
                placeholder="e.g. Summer Sale"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Discount</label>
              <input
                type="text"
                name="discount"
                required
                className="input-field"
                value={formData.discount}
                onChange={handleInputChange}
                placeholder="e.g. 40% OFF or ₹1000"
              />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <input
                type="text"
                name="description"
                required
                className="input-field"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="e.g. Save up to 40% on domestic flights"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Valid Until</label>
              <input
                type="date"
                name="validUntil"
                required
                className="input-field"
                value={formData.validUntil}
                onChange={handleInputChange}
                min={new Date().toISOString().split("T")[0]}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Background Color</label>
              <select name="bgColor" className="input-field" value={formData.bgColor} onChange={handleInputChange}>
                {bgColorOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex items-center">
              <input
                type="checkbox"
                id="isActive"
                name="isActive"
                checked={formData.isActive}
                onChange={handleInputChange}
                className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
              />
              <label htmlFor="isActive" className="ml-2 block text-sm text-gray-900">
                Active
              </label>
            </div>
          </div>

          <div className="flex space-x-4">
            <button type="submit" className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-md">
              {isEditing ? "Update Offer" : "Create Offer"}
            </button>
            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold mb-4">All Offers</h2>
        {offers.length === 0 ? (
          <p className="text-gray-500">No offers found. Create your first offer above.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Discount
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Valid Until
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {offers.map((offer) => (
                  <tr key={offer._id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{offer.title}</div>
                      <div className="text-sm text-gray-500">{offer.description}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{offer.discount}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {new Date(offer.validUntil).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                          offer.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
                        }`}
                      >
                        {offer.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button onClick={() => handleEdit(offer)} className="text-indigo-600 hover:text-indigo-900 mr-4">
                        Edit
                      </button>
                      <button onClick={() => handleDelete(offer._id)} className="text-red-600 hover:text-red-900">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}

export default OfferManagement
