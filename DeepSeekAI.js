


class DeepSeekAI {

  constructor() {
    const { OpenAI } = require("openai");
    this.openai = new OpenAI({
      baseURL: 'https://api.deepseek.com',
      apiKey: 'sk-0a3827d644ee46ba811779eedfe05bed'
    });
  }

  async getChatResult(content) {
    try {
      const completion = await this.openai.chat.completions.create({
        messages: [{ role: "system", content: content }],
        model: "deepseek-chat",
      });
      console.log(completion.choices[0].message.content);
      return completion.choices[0].message.content;
    } catch (error) {
      return null;
    }
  }

}

module.exports = DeepSeekAI;






