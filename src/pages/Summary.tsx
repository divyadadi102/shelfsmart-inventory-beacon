import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import Navigation from "@/components/Navigation";
import { 
  Send, 
  Bot,
  User,
  Loader2,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const Summary = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Hello! I'm your AI business assistant. Ask me anything about your inventory, sales, forecasts, or business insights. For example:\n\n• What products should I order this week?\n• Give me today's sales summary\n• Which category is performing best?\n• Show me low-stock alerts",
      timestamp: new Date()
    }
  ]);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Mock AI response based on common business queries
      const response = await generateAIResponse(inputMessage);
      
      const assistantMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: response,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to get AI response. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const generateAIResponse = async (question: string): Promise<string> => {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    const lowerQuestion = question.toLowerCase();

    // Mock responses based on keywords - replace with actual AI API call
    if (lowerQuestion.includes('today') && lowerQuestion.includes('sales')) {
      return `**Today's Sales Summary:**

📊 **Total Items Sold:** 147 units
💰 **Revenue:** $3,420.50
📈 **Profit:** $1,254.80

**Top Categories:**
• Electronics: 45 items, $1,250.00
• Clothing: 32 items, $890.30
• Food & Beverages: 28 items, $560.40

**Performance:** +12% increase compared to yesterday`;
    }

    if (lowerQuestion.includes('order') && (lowerQuestion.includes('week') || lowerQuestion.includes('reorder'))) {
      return `**Products to Order This Week:**

🔴 **High Priority:**
• Coffee Beans - Current: 8 units → Order: 100 units
• iPhone Cases - Current: 12 units → Order: 50 units  
• Garden Tools - Current: 6 units → Order: 20 units

🟡 **Medium Priority:**
• Winter Jackets - Current: 15 units → Order: 30 units
• Notebooks - Current: 25 units → Order: 75 units

**Total Estimated Cost:** $2,840
**Expected Delivery:** 3-5 business days`;
    }

    if (lowerQuestion.includes('category') && lowerQuestion.includes('best')) {
      return `**Best Performing Categories:**

🥇 **Electronics** - $1,250 revenue (36.5% of total)
• 45 items sold today
• 15% profit margin increase
• Top product: iPhone Cases

🥈 **Clothing** - $890 revenue (26% of total)  
• 32 items sold today
• Seasonal boost from winter items
• Top product: Winter Jackets

🥉 **Food & Beverages** - $560 revenue (16.4% of total)
• 28 items sold today
• Consistent daily performance
• Top product: Coffee Beans`;
    }

    if (lowerQuestion.includes('low stock') || lowerQuestion.includes('alert')) {
      return `**Critical Stock Alerts:**

⚠️ **Immediate Action Required:**
• Coffee Beans: 8 units left (2 days remaining)
• Garden Tools: 6 units left (1.5 days remaining)

🟡 **Monitor Closely:**
• iPhone Cases: 12 units left (3 days remaining)
• Winter Jackets: 15 units left (4 days remaining)

**Recommendation:** Place orders for critical items within 24 hours to avoid stockouts.`;
    }

    if (lowerQuestion.includes('profit') || lowerQuestion.includes('margin')) {
      return `**Profit Analysis:**

💰 **Today's Profit:** $1,254.80 (36.7% margin)
📈 **Trend:** +15% vs yesterday

**Profit by Category:**
• Electronics: $458.25 (36.7% margin)
• Clothing: $267.09 (30% margin)  
• Food & Beverages: $224.16 (40% margin)
• Books: $114.06 (30% margin)
• Home & Garden: $101.88 (30% margin)

**Best Margin:** Food & Beverages at 40%
**Improvement Opportunity:** Electronics volume with better sourcing`;
    }

    if (lowerQuestion.includes('forecast') || lowerQuestion.includes('predict')) {
      return `**AI Forecast for Next 7 Days:**

📈 **Expected Sales:** $28,500 (+8% vs last week)
📦 **Units to Sell:** 1,030 items

**Daily Breakdown:**
• Mon-Wed: High demand (Electronics surge)
• Thu-Fri: Moderate demand  
• Weekend: Focus on Clothing & Home items

**Weather Impact:** Rain forecasted - expect 20% boost in indoor products

**Recommendation:** Increase Coffee Beans and Electronics inventory by 15%`;
    }

    // Default response for unrecognized queries
    return `I can help you with business insights! Here are some things you can ask me:

📊 **Sales & Performance:**
• "Give me today's sales summary"
• "Which category is performing best?"
• "Show me profit margins"

📦 **Inventory & Orders:**
• "What products should I order this week?"
• "Show me low stock alerts"
• "When will I run out of [product]?"

🔮 **Forecasting:**
• "Predict next week's sales"
• "What's the demand forecast?"

Try asking a specific question about your business data!`;
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">AI Business Assistant</h1>
          <p className="text-gray-600">Ask me anything about your business data, inventory, and insights</p>
        </div>

        {/* Chat Interface */}
        <Card className="bg-white shadow-sm h-[600px] flex flex-col">
          <CardHeader className="border-b">
            <CardTitle className="flex items-center">
              <MessageSquare className="w-5 h-5 mr-2 text-blue-600" />
              Chat with AI Assistant
            </CardTitle>
          </CardHeader>
          
          {/* Messages Area */}
          <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex max-w-[80%] ${message.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                    message.role === 'user' 
                      ? 'bg-blue-600 ml-2' 
                      : 'bg-purple-600 mr-2'
                  }`}>
                    {message.role === 'user' ? (
                      <User className="w-4 h-4 text-white" />
                    ) : (
                      <Bot className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div
                    className={`rounded-lg px-4 py-2 ${
                      message.role === 'user'
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-100 text-gray-900'
                    }`}
                  >
                    <div className="whitespace-pre-wrap text-sm">{message.content}</div>
                    <div className={`text-xs mt-1 ${
                      message.role === 'user' ? 'text-blue-100' : 'text-gray-500'
                    }`}>
                      {message.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              </div>
            ))}
            
            {isLoading && (
              <div className="flex justify-start">
                <div className="flex">
                  <div className="bg-purple-600 w-8 h-8 rounded-full flex items-center justify-center mr-2">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="bg-gray-100 rounded-lg px-4 py-2">
                    <div className="flex items-center space-x-2">
                      <Loader2 className="w-4 h-4 animate-spin text-gray-600" />
                      <span className="text-sm text-gray-600">AI is thinking...</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </CardContent>

          {/* Input Area */}
          <div className="border-t p-4">
            <div className="flex space-x-2">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ask me about your business... (e.g., 'What products should I order this week?')"
                className="flex-1"
                disabled={isLoading}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || isLoading}
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Send className="w-4 h-4" />
                )}
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Press Enter to send • Shift+Enter for new line
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default Summary;