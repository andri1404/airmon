// File: netlify/functions/analyze.js

exports.handler = async function(event) {
  // Hanya izinkan permintaan POST
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    // Gunakan dynamic import yang lebih modern
    const fetch = (await import('node-fetch')).default;
    
    const { prompt } = JSON.parse(event.body);
    // Mengambil API key dari Environment Variable yang aman di Netlify
    const geminiApiKey = process.env.GEMINI_API_KEY;

    if (!geminiApiKey) {
      throw new Error("API Key Gemini tidak dikonfigurasi di server.");
    }

    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-05-20:generateContent?key=${geminiApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] })
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Gemini API Error:", errorBody);
      return { statusCode: response.status, body: "Error saat berkomunikasi dengan Gemini API." };
    }

    const data = await response.json();

    return {
      statusCode: 200,
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error("Server Function Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
      body: JSON.stringify(data)
    };

  } catch (error) {
    console.error("Server Function Error:", error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};
      
