import { useState, useEffect, useRef } from "react";
import "./App.css";
import { Configuration, OpenAIApi } from "openai";

const configuration = new Configuration({
  organization: "org-0nmrFWw6wSm6xIJXSbx4FpTw",
  apiKey: "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",
});
const openai = new OpenAIApi(configuration);

function App() {
  const [message, setMessage] = useState("");
  const [chats, setChats] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const chatSectionRef = useRef(null);
  const [isGeneratingResponse, setIsGeneratingResponse] = useState(false);

  useEffect(() => {
    // Scroll to the latest chat message whenever chats are updated
    if (chatSectionRef.current) {
      chatSectionRef.current.scrollTop = chatSectionRef.current.scrollHeight;
    }
  }, [chats]);

  const chat = async (e, message) => {
    e.preventDefault();

    if (!message || isGeneratingResponse) return;

    setIsGeneratingResponse(true);
    setIsTyping(true);

    let msgs = [...chats]; // Make a copy of the current chats array
    msgs.push({ role: "user", content: message });
    setChats(msgs);

    setMessage("");

    try {
      const response = await openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content:
              "You are a Telemedicine chatbot. You can predict disease using symptoms as input and predict disease by giving answers not more than 10 words and you will not answer question other than the medical domain.If any user ask other question not related to symtoms or disease then dont answer that",
          },
          ...msgs, // Use the updated msgs array, not the original chats array
        ],
      });

      msgs.push({ role: "assistant", content: response.data.choices[0].message.content }); // Add assistant's response to msgs array
      setChats(msgs);
    } catch (error) {
      console.log(error);
    } finally {
      setIsGeneratingResponse(false);
      setIsTyping(false);
    }
  };

  return (
    <main>
      <h1>AI chatbot for Telemedicine</h1>

      <section ref={chatSectionRef}>
        {chats.map((chat, index) => (
          <p
            key={index}
            className={chat.role === "user" ? "user_msg" : "assistant_msg"}
          >
            <span>
              <b>{chat.role.toUpperCase()}</b>
            </span>
            <span> : </span>
            <span>{chat.content}</span>
          </p>
        ))}
      </section>

      <div className={isTyping || isGeneratingResponse ? "" : "hide"}>
        <p>
          <i>{isTyping ? "Typing" : isGeneratingResponse ? "Generating response..." : ""}</i>
        </p>
      </div>

      <form action="" onSubmit={(e) => chat(e, message)}>
        <input
          type="text"
          name="message"
          value={message}
          placeholder="Type a message here..."
          onChange={(e) => setMessage(e.target.value)}
          disabled={isTyping || isGeneratingResponse}
        />
      </form>
    </main>
  );
}

export default App;
