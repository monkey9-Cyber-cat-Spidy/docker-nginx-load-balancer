import express from 'express';
import os from 'os';

const app = express();
const instanceId = process.env.INSTANCE_ID || os.hostname();
const port = process.env.PORT || 3000;
let requestCount = 0;

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    instanceId,
    timestamp: new Date().toISOString()
  });
});

app.get('/', (req, res) => {
  requestCount++;
  res.json({
    message: 'Response served from load balanced upstream instance',
    instanceId,
    requestCount,
    hostname: os.hostname(),
    uptimeSeconds: Math.floor(process.uptime()),
    clientIp: req.headers['x-forwarded-for'] || req.socket.remoteAddress
  });
});

app.listen(port, () => {
  console.log(`Cluster backend node ${instanceId} active on port ${port}`);
});
