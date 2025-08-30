# Docker Nginx Load Balancer

Production-grade containerized high-availability reverse proxy and load balancing infrastructure topology using Nginx and Docker Compose. Balances incoming HTTP requests across multiple Node.js backend cluster replicas with automatic failover, rate limiting, and connection pooling.

## Architecture & Features

- **Upstream Balancing Algorithms**: Configured with `least_conn` load balancing to route traffic to instances with lowest active connection count.
- **Circuit Breaking & Failover**: Automatic detection of unhealthy nodes via `max_fails=3 fail_timeout=10s`.
- **DDoS & Rate Limiting Defense**: Leaky bucket rate limiting at `30 req/sec` with burst capacity of `20` requests per client IP.
- **WebSocket Upgrade Readiness**: Full support for bidirectional WebSocket upgrades (`Upgrade $http_upgrade`).
- **Health Check Probe**: Dedicated zero-overhead `/lb-status` endpoint returning instant 200 responses for cloud infrastructure monitoring.

## Topology Setup

```
                     [ Incoming Web Traffic :80 ]
                                  │
                                  ▼
                         [ Nginx Load Balancer ]
                                  │
             ┌────────────────────┼────────────────────┐
             ▼                    ▼                    ▼
     [ Backend App 1 ]    [ Backend App 2 ]    [ Backend App 3 ]
       (:3000 Alpha)        (:3000 Beta)         (:3000 Gamma)
```

## Starting the Topology

```bash
docker compose up -d --build
```

## Testing Configuration Integrity

```bash
npm test
```
