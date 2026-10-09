import React, { useState, useRef, useEffect } from 'react';
import {
  Sparkles,
  Send,
  Bot,
  User,
  Star,
  MapPin,
  Bookmark,
  Volume2,
  VolumeX,
  Copy,
  Check,
  RefreshCw,
  BookOpen,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import { AIChatMessage, CityInfo, Place } from '../types';

interface CopilotViewProps {
  city: CityInfo;
  onSelectPlace: (place: Place) => void;
  savedPlaceIds: string[];
  onToggleSave: (placeId: string) => void;
}

export const CopilotView: React.FC<CopilotViewProps> = ({
  city,
  onSelectPlace,
  savedPlaceIds,
  onToggleSave,
}) => {
  const getInitialSuggestions = (c: CityInfo) => {
    if (c.id === 'talegaon') {
      return [
        'Tell me about Induri Fort & Ghorawadeshwar Ancient Buddhist Caves',
        'Where can I visit Birla Ganpati 54-ft statue & Prati Shirdi Shirgaon?',
        'Show me the famous Misal spots at Somatane Phata & Urse Toll',
        'What are the features of MCA International Cricket Stadium Gahunje?',
        'Where is the closest mega mall (Elpro City Square) to Talegaon?',
      ];
    }
    if (c.id === 'pune') {
      return [
        'Which are the most celebrated temples (Dagdusheth, Kasba Ganpati, Sarasbaug)?',
        'Show me the biggest shopping malls (Phoenix Marketcity, Amanora, Seasons)',
        'What is the history of Shaniwar Wada & Parvati Hill Temple?',
        'Recommend cultural food spots on FC Road and student landmarks',
        'Compare Talegaon 670m cool altitude microclimate with central Pune',
      ];
    }
    return [
      `Where can I eat budget food under ${c.currency}20?`,
      `Show wheelchair accessible cultural monuments`,
      `Are there active road hazards reported near my route?`,
    ];
  };

  const [messages, setMessages] = useState<AIChatMessage[]>([
    {
      id: 'welcome',
      role: 'assistant',
      content: `Hello! I am **CityPulse Copilot**, your spatial urban guide for **${city.name}**.\n\nI have real-time access to our verified local directory, accessibility audits, active road hazard reports, and historical archives. How can I help you navigate or explore today?`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      suggestedFollowUps: getInitialSuggestions(city),
    },
  ]);

  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [speakingId, setSpeakingId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSend = async (messageText: string) => {
    if (!messageText.trim() || loading) return;

    const userMessage: AIChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: messageText.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: messageText.trim(),
          cityId: city.id,
        }),
      });

      const data = await res.json();

      if (data.success) {
        const aiMessage: AIChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'assistant',
          content: data.answer,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          relevantPlaces: data.relevantPlaces,
          citations: data.citations,
          suggestedFollowUps: data.suggestedFollowUps,
          toolUsed: data.model,
        };
        setMessages((prev) => [...prev, aiMessage]);
      } else {
        throw new Error(data.error || 'Failed to fetch AI answer');
      }
    } catch (err: any) {
      const errorMessage: AIChatMessage = {
        id: `err-${Date.now()}`,
        role: 'assistant',
        content: `I encountered an issue connecting to the urban intelligence network: ${err?.message || 'Network error'}. Please try again.`,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleSpeak = (id: string, text: string) => {
    if ('speechSynthesis' in window) {
      if (speakingId === id) {
        window.speechSynthesis.cancel();
        setSpeakingId(null);
        return;
      }

      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text.replace(/[#*`_]/g, ''));
      utterance.onend = () => setSpeakingId(null);
      utterance.onerror = () => setSpeakingId(null);
      setSpeakingId(id);
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="h-[calc(100vh-140px)] flex flex-col rounded-3xl glass-panel border border-white/10 overflow-hidden shadow-2xl animate-in fade-in">
      {/* Header Bar */}
      <div className="px-6 py-4 border-b border-white/10 glass-surface-subtle flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-2xl bg-gradient-to-tr from-cyan-500 to-teal-400 text-slate-950 font-black shadow-lg shadow-cyan-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-base font-bold font-display text-white flex items-center gap-2">
              <span>CityPulse Copilot</span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                Grounding Active
              </span>
            </h2>
            <p className="text-[11px] text-slate-400">
              Conversational Urban Assistant · {city.name}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="https://aistudio.google.com/app/apikey"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[11px] font-mono px-2.5 py-1 rounded-xl bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 flex items-center gap-1.5 transition-colors"
            title="Get your official Google AI Studio Gemini API key"
          >
            <Sparkles className="w-3 h-3 text-amber-400" />
            <span>Get Gemini API Key</span>
          </a>

          <button
            onClick={() =>
              setMessages([
                {
                  id: 'welcome-reset',
                  role: 'assistant',
                  content: `Conversation reset. How can I assist you with ${city.name} today?`,
                  timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
                },
              ])
            }
            className="text-xs text-slate-400 hover:text-white flex items-center gap-1.5 p-2 rounded-xl hover:bg-white/5 transition-colors"
            title="Clear Conversation"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5">
        {messages.map((msg) => {
          const isAI = msg.role === 'assistant';

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-3 ${
                isAI ? 'justify-start' : 'justify-end'
              }`}
            >
              {isAI && (
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center flex-shrink-0 mt-1">
                  <Bot className="w-4 h-4" />
                </div>
              )}

              <div
                className={`max-w-2xl rounded-3xl p-4 sm:p-5 text-xs sm:text-sm space-y-3 shadow-lg ${
                  isAI
                    ? 'glass-card border border-white/10 text-slate-200'
                    : 'bg-cyan-500/20 border border-cyan-400/40 text-cyan-100'
                }`}
              >
                {/* Content prose with markdown formatting */}
                <div className="whitespace-pre-line leading-relaxed space-y-2">
                  {msg.content}
                </div>

                {/* Relevant Place Cards embedded inline */}
                {msg.relevantPlaces && msg.relevantPlaces.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-2">
                    <div className="text-[10px] font-mono uppercase text-cyan-300 tracking-wider">
                      Grounding Places
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {msg.relevantPlaces.map((place) => (
                        <div
                          key={place.id}
                          onClick={() => onSelectPlace(place)}
                          className="p-3 rounded-2xl glass-surface-subtle border border-white/5 flex items-center justify-between gap-3 cursor-pointer hover:border-cyan-400/30 transition-all"
                        >
                          <div className="flex items-center gap-2.5 min-w-0">
                            <img
                              src={place.photos[0]}
                              alt={place.name}
                              className="w-10 h-10 rounded-xl object-cover flex-shrink-0"
                            />
                            <div className="min-w-0">
                              <div className="font-bold text-white text-xs truncate">
                                {place.name}
                              </div>
                              <div className="text-[10px] text-slate-400 flex items-center gap-1">
                                <Star className="w-3 h-3 text-amber-400 fill-current" />
                                <span>{place.rating}</span>
                                <span>·</span>
                                <span>{place.neighborhood}</span>
                              </div>
                            </div>
                          </div>
                          <span className="text-cyan-400 font-semibold text-xs flex-shrink-0">
                            →
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Citations & Disclaimers */}
                {msg.citations && msg.citations.length > 0 && (
                  <div className="pt-2 border-t border-white/5 flex flex-wrap gap-2 text-[10px] text-slate-400">
                    {msg.citations.map((c, idx) => (
                      <span key={idx} className="flex items-center gap-1 font-mono">
                        <BookOpen className="w-3 h-3 text-cyan-400" />
                        <span>{c.title} ({c.detail})</span>
                      </span>
                    ))}
                  </div>
                )}

                {/* Suggested Follow-Ups */}
                {msg.suggestedFollowUps && msg.suggestedFollowUps.length > 0 && (
                  <div className="pt-2 border-t border-white/5 space-y-1.5">
                    <div className="text-[10px] font-mono text-slate-400">
                      Suggested Next Inquiries:
                    </div>
                    <div className="flex flex-wrap gap-1.5">
                      {msg.suggestedFollowUps.map((prompt, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleSend(prompt)}
                          className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-white/10 text-cyan-300 text-[11px] border border-white/5 transition-colors text-left"
                        >
                          "{prompt}"
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Bar (Audio Read-out, Copy, Timestamp) */}
                <div className="flex items-center justify-between pt-2 border-t border-white/5 text-[10px] text-slate-400">
                  <span className="font-mono">{msg.timestamp}</span>
                  {isAI && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleSpeak(msg.id, msg.content)}
                        className="hover:text-cyan-300 transition-colors"
                        title="Read aloud"
                      >
                        {speakingId === msg.id ? (
                          <VolumeX className="w-3.5 h-3.5 text-cyan-300 animate-pulse" />
                        ) : (
                          <Volume2 className="w-3.5 h-3.5" />
                        )}
                      </button>
                      <button
                        onClick={() => handleCopy(msg.id, msg.content)}
                        className="hover:text-cyan-300 transition-colors"
                        title="Copy answer"
                      >
                        {copiedId === msg.id ? (
                          <Check className="w-3.5 h-3.5 text-teal-400" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {!isAI && (
                <div className="w-8 h-8 rounded-xl bg-cyan-400/20 border border-cyan-400/30 text-cyan-200 flex items-center justify-center flex-shrink-0 mt-1">
                  <User className="w-4 h-4" />
                </div>
              )}
            </div>
          );
        })}

        {loading && (
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 flex items-center justify-center flex-shrink-0">
              <Bot className="w-4 h-4" />
            </div>
            <div className="glass-card rounded-2xl p-4 text-xs text-slate-400 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              <span>Synthesizing city intelligence & verified groundings...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Composer Form */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          handleSend(input);
        }}
        className="p-4 border-t border-white/10 glass-surface-subtle flex items-center gap-3"
      >
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Ask about ${city.name}: 'accessible museums', 'budget dining', 'hazard alerts' ...`}
          className="flex-1 px-4 py-3 rounded-2xl glass-input text-xs sm:text-sm"
        />
        <button
          type="submit"
          disabled={!input.trim() || loading}
          className="p-3 rounded-2xl bg-cyan-500 hover:bg-cyan-400 disabled:opacity-40 text-slate-950 font-bold transition-all flex items-center justify-center flex-shrink-0"
          aria-label="Send message"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
