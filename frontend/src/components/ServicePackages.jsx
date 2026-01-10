import { useState } from 'react';
import './ServicePackages.css';

const ServicePackages = () => {
  // Service packages data array
  const servicePackages = [
    {
      id: 1,
      packageName: 'Basic Service',
      price: 2999,
      servicesIncluded: ['Engine Oil Change', 'Oil Filter Replacement', 'Basic Inspection', 'Tire Pressure Check'],
      validity: '3 months or 5,000 km',
      status: 'Available'
    },
    {
      id: 2,
      packageName: 'Standard Service',
      price: 5999,
      servicesIncluded: ['Engine Oil Change', 'Oil & Air Filter Replacement', 'Brake Inspection', 'Battery Check', 'AC Gas Top-up', 'Wheel Alignment'],
      validity: '6 months or 10,000 km',
      status: 'Available'
    },
    {
      id: 3,
      packageName: 'Premium Service',
      price: 9999,
      servicesIncluded: ['Complete Engine Service', 'All Filters Replacement', 'Brake Pad Replacement', 'AC Deep Cleaning', 'Wheel Balancing', 'Interior Detailing', 'Exterior Wash & Polish'],
      validity: '12 months or 15,000 km',
      status: 'Available'
    },
    {
      id: 4,
      packageName: 'Winter Special',
      price: 4499,
      servicesIncluded: ['Antifreeze Check', 'Battery Health Check', 'Tire Inspection', 'Heater System Check', 'Wiper Blade Replacement'],
      validity: '4 months or 6,000 km',
      status: 'Available'
    },
    {
      id: 6,
      packageName: 'Luxury Package',
      price: 15999,
      servicesIncluded: ['Complete Vehicle Inspection', 'Premium Engine Oil', 'All Filters Replacement', 'Full Detailing', 'Paint Protection', 'AC Deep Service', 'Suspension Check'],
      validity: '12 months or 20,000 km',
      status: 'Available'
    }
  ];

  // useState to store selected package
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [expandedPackageId, setExpandedPackageId] = useState(null);
  const [bookingForm, setBookingForm] = useState({
    customerName: '',
    vehicleType: ''
  });
  const [bookingStatus, setBookingStatus] = useState(null);

  // Toggle package expansion
  const toggleExpand = (id) => {
    setExpandedPackageId(expandedPackageId === id ? null : id);
  };

  // Handle "Book Service" click
  const handleBookService = (pkg) => {
    if (pkg.status === 'Expired') {
      alert('This package has expired and is no longer available for booking.');
      return;
    }
    setSelectedPackage(pkg);
    setBookingStatus(null);
  };

  // Handle form input changes
  const handleInputChange = (e) => {
    setBookingForm({
      ...bookingForm,
      [e.target.name]: e.target.value
    });
  };

  // Handle booking submission
  const handleSubmitBooking = async (e) => {
    e.preventDefault();

    if (!bookingForm.customerName || !bookingForm.vehicleType) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const response = await fetch('http://localhost:3000/api/bookService', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          customerName: bookingForm.customerName,
          packageName: selectedPackage.packageName,
          vehicleType: bookingForm.vehicleType,
          totalPrice: selectedPackage.price,
          servicesIncluded: selectedPackage.servicesIncluded,
          validityPeriod: selectedPackage.validity
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setBookingStatus({
          success: true,
          message: data.message,
          bookingId: data.bookingId
        });
        setBookingForm({ customerName: '', vehicleType: '' });
      } else {
        setBookingStatus({
          success: false,
          message: data.error || 'Booking failed'
        });
      }
    } catch (error) {
      setBookingStatus({
        success: false,
        message: 'Failed to connect to server. Please ensure the backend is running.'
      });
    }
  };

  // Close package details
  const handleCloseDetails = () => {
    setSelectedPackage(null);
    setBookingForm({ customerName: '', vehicleType: '' });
    setBookingStatus(null);
  };

  return (
    <div className="service-packages-container">
      <div className="header">
        <h1>Vehicle Service Packages</h1>
        <p>Premium care solutions for your automotive needs</p>
      </div>

      <div className="packages-scroll-wrapper">
        <div className="packages-grid">
          {servicePackages.map((pkg) => (
            <div
              key={pkg.id}
              className={`package-card ${pkg.status === 'Expired' ? 'expired' : ''}`}
            >
              <div className="package-header">
                <h2>{pkg.packageName}</h2>
                <span className={`status-badge ${pkg.status.toLowerCase()}`}>
                  {pkg.status}
                </span>
              </div>

              <div className="package-price">
                <span className="currency">₹</span>
                <span className="amount">{pkg.price.toLocaleString()}</span>
              </div>

              <div className="package-validity">
                <span className="validity-badge">{pkg.validity}</span>
              </div>

              <button
                className="view-details-btn"
                onClick={() => toggleExpand(pkg.id)}
              >
                {expandedPackageId === pkg.id ? 'Hide Details ▲' : 'View Details ▼'}
              </button>

              <div className={`collapsible-section ${expandedPackageId === pkg.id ? 'expanded' : ''}`}>
                <div className="services-list">
                  <h3>Included Services:</h3>
                  <ul>
                    {pkg.servicesIncluded.map((service, index) => (
                      <li key={index}>
                        <span className="checkmark">✓</span>
                        {service}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="card-actions">
                <button
                  className="book-btn"
                  onClick={() => handleBookService(pkg)}
                  disabled={pkg.status === 'Expired'}
                >
                  {pkg.status === 'Expired' ? 'Expired' : 'Book Now'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Package Details Modal */}
      {selectedPackage && (
        <div className="modal-overlay" onClick={handleCloseDetails}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={handleCloseDetails}>×</button>

            <h2>Book {selectedPackage.packageName}</h2>

            <div className="package-summary">
              <div className="detail-row">
                <strong>Package</strong>
                <span>{selectedPackage.packageName}</span>
              </div>
              <div className="detail-row">
                <strong>Total Price</strong>
                <span>₹{selectedPackage.price.toLocaleString()}</span>
              </div>
            </div>

            <form onSubmit={handleSubmitBooking} className="booking-form">
              <div className="form-group">
                <label htmlFor="customerName">Full Name</label>
                <input
                  type="text"
                  id="customerName"
                  name="customerName"
                  value={bookingForm.customerName}
                  onChange={handleInputChange}
                  placeholder="Enter your name"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="vehicleType">Vehicle Type</label>
                <select
                  id="vehicleType"
                  name="vehicleType"
                  value={bookingForm.vehicleType}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Select type</option>
                  <option value="Hatchback">Hatchback</option>
                  <option value="Sedan">Sedan</option>
                  <option value="SUV">SUV</option>
                  <option value="Bike">Bike</option>
                  <option value="Luxury Car">Luxury Car</option>
                  <option value="Electric Vehicle">Electric Vehicle</option>
                </select>
              </div>

              <button type="submit" className="submit-btn">
                Confirm Booking
              </button>
            </form>

            {bookingStatus && (
              <div className={`booking-status ${bookingStatus.success ? 'success' : 'error'}`}>
                <p>{bookingStatus.message}</p>
                {bookingStatus.bookingId && (
                  <p className="booking-id">ID: {bookingStatus.bookingId}</p>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default ServicePackages;
