import { useState, useEffect } from 'react';
import './BookingsList.css';

const BookingsList = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchBookings = async () => {
        try {
            const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
            const response = await fetch(`${API_URL}/api/bookings`);
            const data = await response.json();

            if (response.ok) {
                setBookings(data.bookings);
            } else {
                setError(data.error || 'Failed to fetch bookings');
            }
        } catch (err) {
            setError('Could not connect to the server');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookings();

        // Refresh every 30 seconds
        const interval = setInterval(fetchBookings, 30000);
        return () => clearInterval(interval);
    }, []);

    if (loading) return <div className="loading">Loading bookings...</div>;
    if (error) return <div className="error">{error}</div>;

    return (
        <div className="bookings-list-container">
            <h2>Recent Bookings</h2>

            {bookings.length === 0 ? (
                <div className="no-bookings">No bookings found yet.</div>
            ) : (
                <div className="bookings-table-wrapper">
                    <table className="bookings-table">
                        <thead>
                            <tr>
                                <th>Customer</th>
                                <th>Package</th>
                                <th>Vehicle</th>
                                <th>Date</th>
                                <th>Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((booking) => (
                                <tr key={booking._id}>
                                    <td><strong>{booking.customerName}</strong></td>
                                    <td>{booking.packageName}</td>
                                    <td>{booking.vehicleType}</td>
                                    <td>{new Date(booking.createdAt).toLocaleDateString()}</td>
                                    <td>
                                        <span className={`status-pill ${booking.bookingStatus.toLowerCase()}`}>
                                            {booking.bookingStatus === 'Pending' ? 'Booked' : booking.bookingStatus}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default BookingsList;
