import React, { useRef, useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { Send, User, Bot, Loader2 } from "lucide-react";
import { chatOnFile } from "../../../../Service/Operations/AiAPI";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Adjust path

const bg1 =
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face";
const bg2 =
  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face";

// Chat Bubble
const ChatBubble = ({ isUser = false, userName, content, profileImage, timestamp }) => (
  <div
    className={`flex w-full gap-3 px-4 py-3 ${
      isUser ? "justify-end" : "justify-start"
    } animate-fadeIn opacity-0 animate-slideUp`}
    style={{ animation: "slideUp 0.3s ease-out forwards" }}
  >
    {!isUser && (
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-blue-300/20">
          {profileImage ? (
            <img src={profileImage} alt="profile" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <Bot className="w-5 h-5 text-white" />
          )}
        </div>
      </div>
    )}

    <div className={`flex flex-col max-w-[75%] sm:max-w-[500px] ${isUser ? "items-end" : "items-start"}`}>
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">{userName}</span>
        <div className="w-4 h-0.5 bg-gradient-to-r from-blue-400 to-purple-400 rounded"></div>
        {timestamp && <span className="text-xs text-slate-400">{timestamp}</span>}
      </div>

      <div
        className={`relative px-4 py-3 rounded-2xl border text-sm sm:text-base whitespace-pre-wrap break-words transition-all duration-300 group overflow-hidden backdrop-blur-sm ${
          isUser
            ? "bg-gradient-to-r from-blue-100 to-purple-100 text-slate-800 border-blue-200 shadow-sm"
            : "bg-slate-100/70 text-slate-700 border-slate-200 hover:bg-slate-100"
        }`}
      >
        <div className="relative z-10">
            <ReactMarkdown
              components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || "");
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={oneDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, "")}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        {!isUser && (
          <div className="absolute inset-0 bg-gradient-to-r from-slate-200/20 to-slate-100/20 translate-x-full group-hover:translate-x-0 transition-transform duration-300 rounded-2xl"></div>
        )}
      </div>
    </div>

    {isUser && (
      <div className="flex-shrink-0">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md ring-2 ring-purple-300/20">
          {profileImage ? (
            <img src={profileImage} alt="profile" className="w-8 h-8 rounded-full object-cover" />
          ) : (
            <User className="w-5 h-5 text-white" />
          )}
        </div>
      </div>
    )}
  </div>
);

// Button
const Button = ({ click, content, condition, data, style, loading = false, icon: Icon }) => (
  <button
    onClick={click}
    disabled={!condition || !data || loading}
    className={`px-4 py-2 font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg hover:scale-105 active:scale-95 flex items-center gap-2 ${style}`}
  >
    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : Icon ? <Icon className="w-4 h-4" /> : null}
    {content}
  </button>
);

// Typing Indicator
const TypingIndicator = () => (
  <div className="flex items-center gap-3 px-4 py-3">
    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-md">
      <Bot className="w-5 h-5 text-white" />
    </div>
    <div className="bg-slate-100 border border-slate-300 rounded-2xl px-4 py-3">
      <div className="flex space-x-1">
        {[0, 150, 300].map((delay, i) => (
          <div
            key={i}
            className="w-2 h-2 bg-slate-500 rounded-full animate-bounce"
            style={{ animationDelay: `${delay}ms` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const ChatWithFile = () => {
  const [topic, setTopic] = useState("");
  const [messages, setMessages] = useState([]);
  const [isTyping, setIsTyping] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const textareaRef = useRef(null);
  const messagesEndRef = useRef(null);
  const dispatch = useDispatch();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isTyping]);

  const onChangeHandler = (e) => {
    setTopic(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      textarea.style.height = Math.min(textarea.scrollHeight, 192) + "px";
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      submitHandler();
    }
  };

const submitHandler = async () => {
  const trimmed = topic.trim();
  if (!trimmed || isLoading) return;

  const userMessage = {
    sender: "user",
    content: trimmed,
    userName: "You",
    profileImage: bg1,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
  };

  setMessages((prev) => [...prev, userMessage]);
  setTopic(""); // clear input
  if (textareaRef.current) textareaRef.current.style.height = "auto";

  setIsLoading(true);
  setIsTyping(true);

  try {
    const payload = { topic: trimmed };
    // Dispatch async thunk and wait for response
    const responseData = await dispatch(chatOnFile(payload));

    console.log(responseData);
    

    // Safely get answer from response
    const botReply = responseData?.answer || "Sorry, no response from bot.";

    const botMessage = {
      sender: "agent",
      content: botReply,
      userName: "AI Assistant",
      profileImage: bg2,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, botMessage]);
  } catch (error) {
    // Error toast handled inside thunk, you can optionally handle more here
  } finally {
    setIsTyping(false);
    setIsLoading(false);
  }
};


  return (
    <div className="min-h-screen bg-white text-slate-800">
      <style jsx>{`
        @keyframes slideUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .scroll-hide::-webkit-scrollbar {
          width: 6px;
        }
        .scroll-hide::-webkit-scrollbar-track {
          background: #f1f1f1;
          border-radius: 3px;
        }
        .scroll-hide::-webkit-scrollbar-thumb {
          background: #ccc;
          border-radius: 3px;
        }
        .scroll-hide::-webkit-scrollbar-thumb:hover {
          background: #bbb;
        }
      `}</style>

      <div className="flex flex-col h-screen max-w-6xl mx-auto">
        <div className="flex-shrink-0 px-6 py-6 border-b border-slate-200">
          <div className="text-center space-y-4">
            <div className="flex items-center justify-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-md ring-2 ring-blue-300/20">
                <span className="text-white font-bold text-xl">🧠</span>
              </div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-500 to-purple-500 bg-clip-text text-transparent">
                Chat
              </h1>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto scroll-hide px-2">
          <div className="flex flex-col py-4">
            {messages.length === 0 ? (
              <div className="flex items-center justify-center h-full min-h-[300px]">
                <div className="text-center space-y-4">
                  <div className="w-20 h-20 bg-blue-100 rounded-2xl flex items-center justify-center mx-auto border border-blue-200">
                    <span className="text-3xl">💬</span>
                  </div>
                  <p className="text-lg font-medium text-slate-700">Start a conversation!</p>
                  <p className="text-sm text-slate-500">
                    Ask me anything and I’ll help you find the answers.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {messages.map((msg, idx) => (
                  <ChatBubble key={idx} {...msg} isUser={msg.sender === "user"} />
                ))}
                {isTyping && <TypingIndicator />}
                <div ref={messagesEndRef} />
              </>
            )}
          </div>
        </div>

        <div className="flex-shrink-0 px-6 py-4 border-t border-slate-200">
          <div className="bg-white border border-slate-300 rounded-2xl p-4 shadow-md">
            <div className="flex items-end gap-3">
              <div className="flex-1 relative">
                <textarea
                  ref={textareaRef}
                  rows={1}
                  value={topic}
                  onChange={onChangeHandler}
                  onKeyPress={handleKeyPress}
                  placeholder="Type your question..."
                  disabled={isLoading}
                  className="w-full bg-white text-slate-800 px-4 py-3 rounded-xl focus:outline-none resize-none overflow-y-auto max-h-[192px] scroll-hide border border-slate-300 focus:border-blue-400 focus:ring-2 focus:ring-blue-200 placeholder-slate-400"
                />
              </div>

              <Button
                click={submitHandler}
                content="Send"
                condition={true}
                data={topic.trim().length > 0}
                loading={isLoading}
                icon={Send}
                style="rounded-xl px-6 py-2.5 bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md hover:from-blue-600 hover:to-purple-600"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatWithFile;
