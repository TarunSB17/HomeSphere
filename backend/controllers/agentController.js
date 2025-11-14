import Property from '../models/Property.js';

// Simple rule-based agent to avoid external dependencies
export const chatWithAgent = async (req, res) => {
  try {
    const { message } = req.body || {};
    if (!message || typeof message !== 'string') {
      return res.status(400).json({ reply: "Please type a message." });
    }

    const text = message.toLowerCase();
    let reply = '';

    // Very light heuristics
    if (/(hi|hello|hey)\b/.test(text)) {
      reply = "Hi! I'm here to help you find your dream home. Tell me the city, price range, or property type you're looking for.";
    } else if (/price|budget|cost/.test(text)) {
      reply = "What price range are you comfortable with? For example: 30-50 lakhs or 50-80 lakhs.";
    } else if (/villa|apartment|house|condo|commercial|land/.test(text)) {
      // Try to recommend 3 recent properties of that type
      const type = (text.match(/villa|apartment|house|condo|commercial|land/) || [])[0];
      const results = await Property.find({ propertyType: type }).sort({ createdAt: -1 }).limit(3).select('title location price images');
      if (results.length) {
        reply = `Here are some recent ${type} listings you may like: ` + results.map(p => `${p.title} at ${p.location} (₹${p.price})`).join('; ') + ". You can view details on the Properties page.";
      } else {
        reply = `I couldn't find ${type} listings right now. You can try another type or check the Properties page.`;
      }
    } else if (/help|support|contact/.test(text)) {
      reply = "You can send us a message on the Contact page, or tell me your query and I can forward it.";
    } else {
      reply = "Thanks! I noted your message. You can also specify city, budget, and property type for better suggestions.";
    }

    res.json({ reply });
  } catch (err) {
    res.status(500).json({ reply: 'Sorry, I had trouble responding just now.' });
  }
};
