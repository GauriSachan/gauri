import axios from 'axios';

const getAIReview = async ({ code, language, problemTitle, problemDescription }) => {
  const prompt = `
You are a programming tutor. A user submitted the following solution in ${language} for the problem titled "${problemTitle}".
Description:
${problemDescription}

Here is the user's code:
${code}

Can you explain possible mistakes in the code and suggest how to fix them?
`;

  const response = await axios.post('https://api.openai.com/v1/chat/completions', {
    model: 'gpt-4',
    messages: [{ role: 'user', content: prompt }],
  }, {
    headers: {
      Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      'Content-Type': 'application/json'
    }
  });

  return response.data.choices[0].message.content;
};

export default getAIReview;
