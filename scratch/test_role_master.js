const http = require('http');
const jwt = require('jsonwebtoken');

const token = jwt.sign(
  { id: 1, id_role: 1, role: 'Super Admin', tipe_role: 'admin', username: 'admin' },
  'arsip_digital_secret_key_2026',
  { expiresIn: '1h' }
);

function makeRequest(path, method = 'GET', data = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: path,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => body += chunk);
      res.on('end', () => resolve({ statusCode: res.statusCode, body: JSON.parse(body || '{}') }));
    });

    req.on('error', reject);
    if (data) {
      req.write(JSON.stringify(data));
    }
    req.end();
  });
}

async function testRoleEndpoints() {
  try {
    console.log('Testing GET /api/role...');
    const rolesRes = await makeRequest('/api/role', 'GET');
    console.log('GET Roles Result:', rolesRes.statusCode, rolesRes.body?.datas?.length, 'roles found:');
    console.log(rolesRes.body?.datas);

    console.log('\nTesting POST /api/role (Tambah Role Kepala Subbagian)...');
    const createRes = await makeRequest('/api/role', 'POST', { nama: 'Kepala Subbagian', tipe_role: 'admin' });
    console.log('Create Role Result:', createRes.statusCode, createRes.body);

    const createdId = createRes.body?.data?.id_role;
    if (createdId) {
      console.log('\nTesting PUT /api/role/' + createdId + '...');
      const updateRes = await makeRequest('/api/role/' + createdId, 'PUT', { nama: 'Kepala Subbagian IT', tipe_role: 'admin' });
      console.log('Update Role Result:', updateRes.statusCode, updateRes.body);

      console.log('\nTesting DELETE /api/role/' + createdId + '...');
      const deleteRes = await makeRequest('/api/role/' + createdId, 'DELETE');
      console.log('Delete Role Result:', deleteRes.statusCode, deleteRes.body);
    }

    console.log('\nAll Role Master API Tests Passed Successfully!');
    process.exit(0);
  } catch (err) {
    console.error('Test Failed:', err);
    process.exit(1);
  }
}

testRoleEndpoints();
