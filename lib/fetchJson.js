import fetch from 'node-fetch';

const DEBUG = true;

export default async function fetchJson(...args) {
  try {
    DEBUG && console.log('📡 FETCH', JSON.stringify(args, null, 2));
    const response = await fetch(...args);
    console.log('response.status', response.status);

    const data = await response.json();
    let logData = data;
    if (data.object === 'customer') {
      logData = { metadata: data.metadata };
    }
    console.log('📡 RESPONSE', args[0], JSON.stringify(logData, null, 2));

    if (response.ok) {
      return data;
    } else {
      const error = new Error(response.statusText);
      error.response = response;
      error.data = data;
      throw error;
    }
  } catch (error) {
    if (!error.data) {
      error.data = { message: error.message };
    }
    throw error;
  }
}
