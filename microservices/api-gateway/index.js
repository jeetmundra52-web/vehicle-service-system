const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const client = require('prom-client');

const app = express();
const PORT = 3000;

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

// Auth Service Routes
const authProxy = createProxyMiddleware({
    target: 'http://auth-service:3001',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Auth Proxy: ${req.method} ${req.originalUrl}`);
    }
});
app.use(['/api/login', '/api/register'], authProxy);

// Booking Service Routes
const bookingProxy = createProxyMiddleware({
    target: 'http://booking-service:3002',
    changeOrigin: true,
    onProxyReq: (proxyReq, req, res) => {
        console.log(`Booking Proxy: ${req.method} ${req.originalUrl}`);
    }
});
app.use(['/api/bookings', '/api/bookService'], bookingProxy);

app.listen(PORT, () => {
    console.log(`🚀 API Gateway running on port ${PORT}`);
});
