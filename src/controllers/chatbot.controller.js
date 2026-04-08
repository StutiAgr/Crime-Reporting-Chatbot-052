import axios from "axios";

const RASA_SERVER_URL = process.env.RASA_SERVER_URL || "http://localhost:5005";

// Send message to Rasa and get response
export const sendMessage = async (req, res) => {
  try {
    const { sender, message } = req.body;

    // Validate input
    if (!sender || !message) {
      return res.status(400).json({
        success: false,
        message: "Sender and message are required",
      });
    }

    // Forward the message to Rasa
    const response = await axios.post(
      `${RASA_SERVER_URL}/webhooks/rest/webhook`,
      {
        sender: sender,
        message: message,
      },
    );

    // Return Rasa's response
    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error communicating with Rasa:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to communicate with chatbot server",
      error: error.message,
    });
  }
};

// Get chat history for a user
export const getChatHistory = async (req, res) => {
  try {
    const { sender } = req.params;

    if (!sender) {
      return res.status(400).json({
        success: false,
        message: "Sender ID is required",
      });
    }

    // Fetch conversation from Rasa
    const response = await axios.get(
      `${RASA_SERVER_URL}/conversations/${sender}/tracker`,
      {
        headers: {
          Authorization: `Bearer ${process.env.RASA_TOKEN || ""}`,
        },
      },
    );

    return res.status(200).json({
      success: true,
      data: response.data,
    });
  } catch (error) {
    console.error("Error fetching chat history:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to fetch chat history",
      error: error.message,
    });
  }
};
