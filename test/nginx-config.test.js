import { test, describe } from 'node:test';
import assert from 'node:assert';
import fs from 'fs';
import path from 'path';

describe('Nginx Load Balancer Configuration Tests', () => {
  const nginxConfPath = path.resolve('nginx/nginx.conf');
  const vhostConfPath = path.resolve('nginx/conf.d/default.conf');
  const dockerComposePath = path.resolve('docker-compose.yml');

  test('nginx.conf should define upstream block with least_conn and failover policies', () => {
    const content = fs.readFileSync(nginxConfPath, 'utf-8');
    assert.ok(content.includes('upstream backend_nodes {'), 'Missing upstream backend_nodes block');
    assert.ok(content.includes('least_conn;'), 'Missing least_conn balancing directive');
    assert.ok(content.includes('max_fails=3'), 'Missing max_fails directive');
    assert.ok(content.includes('fail_timeout=10s'), 'Missing fail_timeout directive');
    assert.ok(content.includes('limit_req_zone'), 'Missing rate limiting zone');
  });

  test('default.conf should proxy requests to upstream backend_nodes with security headers', () => {
    const content = fs.readFileSync(vhostConfPath, 'utf-8');
    assert.ok(content.includes('proxy_pass http://backend_nodes;'), 'Missing proxy_pass to backend_nodes');
    assert.ok(content.includes('X-Forwarded-For'), 'Missing X-Forwarded-For header');
    assert.ok(content.includes('X-Frame-Options'), 'Missing security header X-Frame-Options');
    assert.ok(content.includes('location /lb-status'), 'Missing /lb-status health check endpoint');
  });

  test('docker-compose.yml should declare 3 backend replicas behind nginx-lb', () => {
    const content = fs.readFileSync(dockerComposePath, 'utf-8');
    assert.ok(content.includes('nginx-lb:'), 'Missing nginx-lb service');
    assert.ok(content.includes('app_1:'), 'Missing app_1 service');
    assert.ok(content.includes('app_2:'), 'Missing app_2 service');
    assert.ok(content.includes('app_3:'), 'Missing app_3 service');
  });
});
