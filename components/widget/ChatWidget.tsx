'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  Sparkles,
  UserCheck,
  ShieldCheck,
  Truck,
  RotateCcw,
  CheckCircle2,
  Package,
} from 'lucide-react';
import { Message } from '@/lib/types';

interface ChatWidgetProps {
  initialPrompt?: string;
}

export default function ChatWidget({ initialPrompt }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [customerId, setCustomerId] = useState('');
  const [conversationStatus, setConversationStatus] = useState('active_ai');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Suggested Quick Chips
  const quickChips = [
    'Black shirt medium me mil jayegi?',
    'Show Summer Polos',
    'What is your COD & return policy?',
    'Yes confirm my order',
    'Speak to Human Agent',
  ];

  // Initialize customer session ID
  useEffect(() => {
    let id = localStorage.getItem('aura_shopper_id');
    if (!id) {
      id = `shopper_${Math.random().toString(36).substring(2, 9)}`;
      localStorage.setItem('aura_shopper_id', id);
    }
    setCustomerId(id);

    // Fetch existing messages
    fetch(`/api/chat/message?customerId=${id}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.messages && data.messages.length > 0) {
          setMessages(data.messages);
        } else {
          // Welcome default message
          setMessages([
            {
              id: 'init_welcome',
              conversation_id: 'new',
              tenant_id: 'default',
              sender: 'agent',
              content:
                'Assalam-o-Alaikum! 🌟 Welcome to Aura Fashion. Main Ayesha hoon, aapki personal sales associate. Main aapko hamare best-selling summer cotton shirts, sizing, aur Cash-on-Delivery (COD) offers me guide kar sakti hoon. Aaj aap kya dekhna chahein ge?',
              created_at: new Date().toISOString(),
            },
          ]);
        }
        if (data.status) {
          setConversationStatus(data.status);
        }
      })
      .catch(() => {
        // Fallback welcome message
        setMessages([
          {
            id: 'init_welcome',
            conversation_id: 'new',
            tenant_id: 'default',
            sender: 'agent',
            content:
              'Assalam-o-Alaikum! 🌟 Welcome to Aura Fashion. Main Ayesha hoon, aapki personal sales associate. Cash-on-Delivery aur 7-day doorstep size exchange available hai! Aaj aap kya dekhna chahein ge?',
            created_at: new Date().toISOString(),
          },
        ]);
      });
  }, []);

  // Scroll to bottom on new messages
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isOpen, isLoading]);

  // Handle auto-send initialPrompt if provided
  useEffect(() => {
    if (initialPrompt && customerId && !messages.some((m) => m.content === initialPrompt)) {
      setIsOpen(true);
      sendMessage(initialPrompt);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialPrompt, customerId]);

  const sendMessage = async (textToSend: string) => {
    const text = textToSend.trim();
    if (!text || isLoading) return;

    setInput('');
    const tempUserMsg: Message = {
      id: `temp_${Date.now()}`,
      conversation_id: 'active',
      tenant_id: 'default',
      sender: 'customer',
      content: text,
      created_at: new Date().toISOString(),
    };

    setMessages((prev) => [...prev, tempUserMsg]);
    setIsLoading(true);

    try {
      const res = await fetch('/api/chat/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId,
          message: text,
          customerName: 'Valued Shopper',
        }),
      });

      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      } else if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: `reply_${Date.now()}`,
            conversation_id: data.conversationId,
            tenant_id: 'default',
            sender: data.isMuted ? 'human_staff' : 'agent',
            content: data.reply,
            created_at: new Date().toISOString(),
          },
        ]);
      }
      if (data.status) {
        setConversationStatus(data.status);
      }
    } catch (err) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          conversation_id: 'active',
          tenant_id: 'default',
          sender: 'system',
          content: 'Internet connection unstable. Please try again.',
          created_at: new Date().toISOString(),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      sendMessage(input);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 font-sans">
      {/* Floating Launcher Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center gap-3 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-5 py-3.5 text-white shadow-2xl shadow-emerald-950/50 transition-all duration-300 hover:scale-105 hover:from-emerald-500 hover:to-teal-500 active:scale-95"
        >
          <div className="relative">
            <MessageSquare className="h-6 w-6 transition-transform group-hover:rotate-6" />
            <span className="absolute -top-1 -right-1 flex h-3 w-3">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-400"></span>
            </span>
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold tracking-wider uppercase text-emerald-100 flex items-center gap-1">
              <Sparkles className="h-3 w-3" />
              Chat with Sales AI
            </div>
            <div className="text-sm font-medium leading-tight">Instant Sizing & COD Orders</div>
          </div>
        </button>
      )}

      {/* Expandable Conversation Drawer */}
      {isOpen && (
        <div className="flex h-[620px] w-[390px] max-w-[calc(100vw-32px)] flex-col rounded-2xl border border-slate-800 bg-slate-900/95 shadow-2xl backdrop-blur-xl animate-slide-up overflow-hidden">
          {/* Header */}
          <div className="relative border-b border-slate-800 bg-gradient-to-r from-slate-900 via-slate-850 to-slate-900 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-tr from-emerald-600 to-teal-500 text-white shadow-md">
                  <UserCheck className="h-5 w-5" />
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-slate-900 bg-emerald-400"></span>
                </div>
                <div>
                  <div className="flex items-center gap-1.5">
                    <h3 className="font-semibold text-slate-100 text-sm">Ayesha</h3>
                    <span className="rounded bg-emerald-950 px-1.5 py-0.5 text-[10px] font-semibold text-emerald-400 border border-emerald-800/60">
                      {conversationStatus === 'human_takeover' ? 'Human Staff' : 'AI Sales'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-400">Aura Fashion Concierge • Online</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-slate-100 transition-colors"
                aria-label="Close chat"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {/* Trust Badges Bar */}
            <div className="mt-3 flex items-center justify-between border-t border-slate-800/80 pt-2 text-[10px] text-slate-400">
              <span className="flex items-center gap-1 text-emerald-400">
                <ShieldCheck className="h-3.5 w-3.5" /> Cash on Delivery
              </span>
              <span className="flex items-center gap-1 text-teal-400">
                <Truck className="h-3.5 w-3.5" /> 2-3 Days TCS
              </span>
              <span className="flex items-center gap-1 text-slate-300">
                <RotateCcw className="h-3.5 w-3.5" /> 7-Day Exchange
              </span>
            </div>

            {/* Human Takeover Notice Banner */}
            {conversationStatus === 'human_takeover' && (
              <div className="mt-2 rounded-lg bg-amber-950/70 border border-amber-800/60 p-2 text-xs text-amber-200 flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                Senior Human Sales Agent is handling this chat.
              </div>
            )}
          </div>

          {/* Message Stream */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3.5 text-sm">
            {messages.map((m) => {
              const isUser = m.sender === 'customer';
              const isOrderConfirmation = m.content.includes('Mubarak ho!') || m.content.includes('Order ID:');

              return (
                <div key={m.id} className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}>
                  <div
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm leading-relaxed ${
                      isUser
                        ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                        : isOrderConfirmation
                        ? 'bg-slate-850 border border-emerald-500/50 text-slate-100 rounded-bl-none'
                        : m.sender === 'human_staff'
                        ? 'bg-amber-950/60 border border-amber-700/50 text-slate-100 rounded-bl-none'
                        : 'bg-slate-800 border border-slate-700/50 text-slate-200 rounded-bl-none'
                    }`}
                  >
                    {isOrderConfirmation && (
                      <div className="mb-2 flex items-center gap-1.5 text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                        <CheckCircle2 className="h-4 w-4" />
                        Order Confirmed!
                      </div>
                    )}
                    <div className="whitespace-pre-wrap">{m.content}</div>
                    <div className="mt-1 text-[10px] opacity-60 text-right">
                      {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start">
                <div className="flex items-center gap-1.5 rounded-2xl rounded-bl-none bg-slate-800 px-4 py-3 text-slate-400 border border-slate-700/40">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-bounce [animation-delay:0.4s]"></span>
                  <span className="ml-1 text-xs text-slate-400">Ayesha is checking stock...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Reply Chips */}
          <div className="border-t border-slate-800/80 bg-slate-900/60 p-2 overflow-x-auto whitespace-nowrap flex gap-1.5 scrollbar-none">
            {quickChips.map((chip, i) => (
              <button
                key={i}
                onClick={() => sendMessage(chip)}
                disabled={isLoading}
                className="rounded-full bg-slate-800/90 border border-slate-700/60 px-3 py-1 text-xs text-slate-300 hover:border-emerald-500 hover:text-emerald-400 transition-colors flex-shrink-0"
              >
                {chip}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="border-t border-slate-800 bg-slate-900 p-3">
            <div className="flex items-center gap-2 rounded-xl bg-slate-800/90 border border-slate-700/80 px-3 py-1.5 focus-within:border-emerald-500 transition-colors">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type your message in English or Urdu..."
                className="flex-1 bg-transparent text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <button
                onClick={() => sendMessage(input)}
                disabled={!input.trim() || isLoading}
                className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white transition-all hover:bg-emerald-500 disabled:opacity-40 disabled:hover:bg-emerald-600"
              >
                <Send className="h-4 w-4" />
              </button>
            </div>
            <div className="mt-1.5 flex items-center justify-between text-[10px] text-slate-400 px-1">
              <span>Press Enter to send</span>
              <span className="flex items-center gap-1">
                <Package className="h-3 w-3 text-emerald-400" /> Powered by AI Sales Employee
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
