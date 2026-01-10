const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const client = require('prom-client');

const app = express();
const PORT = process.env.PORT || 3000;

// Prometheus Metrics Setup
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.use(cors());

// Health Check
app.get('/health', (req, res) => {
    res.json({ status: 'API Gateway OK' });
});

const AUTH_SERVICE_URL = process.env.AUTH_SERVICE_URL || 'http://auth-service:3001';
const BOOKING_SERVICE_URL = process.env.BOOKING_SERVICE_URL || 'http://booking-service:3002';

// Auth Service Routes
const authProxy = createProxyMiddleware({
    target: AUTH_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Auth Proxy: ${req.method} ${req.url} -> ${AUTH_SERVICE_URL}`);
    }
});
app.use(['/api/login', '/api/register'], authProxy);

// Booking Service Routes
const bookingProxy = createProxyMiddleware({
    target: BOOKING_SERVICE_URL,
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Booking Proxy: ${req.method} ${req.url} -> ${BOOKING_SERVICE_URL}`);
    }
});
app.use(['/api/bookings', '/api/bookService'], bookingProxy);

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
});
