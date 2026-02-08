import React, { useState } from "react";
import axios from "axios";

const Hp = () => {
  const [formData, setFormData] = useState({
    nama: "",
    deliveryAddress: "",
    deliveryDate: "",
    eventStartTime: "",
    eventEndTime: "",
    rentalUnit: "",
    hpNumber1: "",
    hpNumber2: "",
    personInCharge: "",
    salesPerson: "",
    locationMap: "",
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: "", text: "" });

    // Prepare hp numbers array
    const hpNumbers = [formData.hpNumber1, formData.hpNumber2].filter(
      (num) => num.trim() !== ""
    );

    if (hpNumbers.length < 2) {
      setMessage({
        type: "error",
        text: "Please provide at least 2 phone numbers",
      });
      setLoading(false);
      return;
    }

    try {
      const rentalData = {
        nama: formData.nama,
        deliveryAddress: formData.deliveryAddress,
        deliveryDate: formData.deliveryDate,
        eventStartTime: formData.eventStartTime,
        eventEndTime: formData.eventEndTime,
        rentalUnit: parseInt(formData.rentalUnit),
        hpNumbers,
        personInCharge: formData.personInCharge,
        salesPerson: formData.salesPerson,
        locationMap: formData.locationMap,
      };

      const response = await axios.post(
        "http://localhost:5001/api/air-cooler-rentals",
        rentalData
      );

      setMessage({
        type: "success",
        text: "Air cooler rental booking submitted successfully!",
      });

      // Reset form
      setFormData({
        nama: "",
        deliveryAddress: "",
        deliveryDate: "",
        eventStartTime: "",
        eventEndTime: "",
        rentalUnit: "",
        hpNumber1: "",
        hpNumber2: "",
        personInCharge: "",
        salesPerson: "",
        locationMap: "",
      });
    } catch (error) {
      setMessage({
        type: "error",
        text: error.response?.data?.message || "Failed to submit booking",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">
        Air Cooler Rental (Event)
      </h2>

      {message.text && (
        <div
          className={`mb-4 p-3 rounded ${
            message.type === "success"
              ? "bg-green-100 text-green-700"
              : "bg-red-100 text-red-700"
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="nama"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Name
          </label>
          <input
            type="text"
            id="nama"
            name="nama"
            value={formData.nama}
            onChange={handleChange}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter name"
          />
        </div>

        <div>
          <label
            htmlFor="deliveryAddress"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Delivery Address
          </label>
          <textarea
            id="deliveryAddress"
            name="deliveryAddress"
            value={formData.deliveryAddress}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter delivery address"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="deliveryDate"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Delivery Date
            </label>
            <input
              type="date"
              id="deliveryDate"
              name="deliveryDate"
              value={formData.deliveryDate}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="rentalUnit"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Rental Unit
            </label>
            <input
              type="number"
              id="rentalUnit"
              name="rentalUnit"
              value={formData.rentalUnit}
              onChange={handleChange}
              required
              min="1"
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Number of units"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="eventStartTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Starting Time
            </label>
            <input
              type="time"
              id="eventStartTime"
              name="eventStartTime"
              value={formData.eventStartTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label
              htmlFor="eventEndTime"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Event Ending Time
            </label>
            <input
              type="time"
              id="eventEndTime"
              name="eventEndTime"
              value={formData.eventEndTime}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="hpNumber1"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              HP Number 1 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="hpNumber1"
              name="hpNumber1"
              value={formData.hpNumber1}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number 1"
            />
          </div>

          <div>
            <label
              htmlFor="hpNumber2"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              HP Number 2 <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              id="hpNumber2"
              name="hpNumber2"
              value={formData.hpNumber2}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter phone number 2"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="personInCharge"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Person in Charge
            </label>
            <input
              type="text"
              id="personInCharge"
              name="personInCharge"
              value={formData.personInCharge}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter person in charge"
            />
          </div>

          <div>
            <label
              htmlFor="salesPerson"
              className="block text-sm font-medium text-gray-700 mb-1"
            >
              Sales Person
            </label>
            <input
              type="text"
              id="salesPerson"
              name="salesPerson"
              value={formData.salesPerson}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter sales person"
            />
          </div>
        </div>

        <div>
          <label
            htmlFor="locationMap"
            className="block text-sm font-medium text-gray-700 mb-1"
          >
            Location Map (Please provide location map link or details)
          </label>
          <textarea
            id="locationMap"
            name="locationMap"
            value={formData.locationMap}
            onChange={handleChange}
            required
            rows="3"
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter Google Maps link or location details"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`w-full py-2 px-4 rounded-md text-white font-medium ${
            loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-blue-500 hover:bg-blue-600"
          } transition-colors`}
        >
          {loading ? "Submitting..." : "Submit Booking"}
        </button>
      </form>
    </div>
  );
};

export default Hp;