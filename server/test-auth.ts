import axios from 'axios';

const API_URL = 'http://localhost:3001/api/auth';

async function testAuth() {
  const email = `test_${Date.now()}@example.com`;
  const password = 'password123';
  const name = 'Test User';

  console.log('--- 1. Testing Registration ---');
  try {
    const regRes = await axios.post(`${API_URL}/register`, { email, password, name });
    console.log('Registration Success:', regRes.status);
    console.log('Token received:', !!regRes.data.token);
    
    const token = regRes.data.token;

    console.log('\n--- 2. Testing Login ---');
    const loginRes = await axios.post(`${API_URL}/login`, { email, password });
    console.log('Login Success:', loginRes.status);
    console.log('Token match:', loginRes.data.token === token); // Might be different if new sign

    console.log('\n--- 3. Testing /me (Protected Route) ---');
    const meRes = await axios.get(`${API_URL}/me`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    console.log('Me Success:', meRes.status);
    console.log('User ID:', meRes.data.id);
    console.log('Role:', meRes.data.role);

  } catch (error: any) {
    console.error('Test Failed:', error.response?.data || error.message);
  }
}

testAuth();
