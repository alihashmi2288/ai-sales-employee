'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  MessageSquare,
  UserCheck,
  Send,
  AlertCircle,
  RefreshCw,
  Clock,
  Play,
  Hand,
  CheckCircle2,
} from 'lucide-react';
import { Conversation, Message, ConversationStatus } from '@/lib/types';

export default function LiveInboxPage() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [filter, setFilter] = useState<'all' | 'active_ai' | 'human_takeover'>('all');
  const [staffInput, setStaffInput] = useState('');
  const [sending, setSending] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Fetch list of conversations
  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/conversations');
      const data = await res.json();
      if (data.conversations) {
        setConversations(data.conversations);
        if (!selectedId && data.conversations.length > 0) {
          setSelectedId(data.conversations[0].id);
        }
      }
    } catch (err) {
      console.error(err);
    }
  }, [selectedId]);

  // Fetch thread messages for selected conversation
  const fetchThread = useCallback(async (convId: string) => {
    try {
      const res = await fetch(`/api/conversations?id=${convId}`);
      const data = await res.json();
      if (data.conversation) setSelectedConv(data.conversation);
      if (data.messages) setMessages(data.messages);
    } catch (err) {
      console.error(err);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
    const interval = setInterval(fetchConversations, 4000);
    return () => clearInterval(interval);
  }, [fetchConversations]);

  useEffect(() => {
    if (selectedId) {
      fetchThread(selectedId);
      const interval = setInterval(() => fetchThread(selectedId), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedId, fetchThread]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Handle 1-Click Takeover / Resume Toggle
  const handleToggleTakeover = async () => {
    if (!selectedId || !selectedConv) return;
    const isCurrentlyMuted = selectedConv.status === 'human_takeover';
    const action = isCurrentlyMuted ? 'resume' : 'takeover';

    try {
      const res = await fetch(`/api/conversations/${selectedId}/takeover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action }),
      });
      const data = await res.json();
      if (data.success) {
        setSelectedConv((prev) => (prev ? { ...prev, status: data.status as ConversationStatus } : null));
        fetchConversations();
      }
    } catch (err) {
      console.error(err);
    }
  };

  // Handle sending staff message
  const handleSendStaffMessage = async () => {
    if (!selectedId || !staffInput.trim() || sending) return;
    const text = staffInput.trim();
    setStaffInput('');
    setSending(true);

    try {
      const res = await fetch(`/api/conversations/${selectedId}/takeover`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reply', message: text }),
      });
      const data = await res.json();
      if (data.messages) {
        setMessages(data.messages);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSendStaffMessage();
    }
  };

  const filtered = conversations.filter((c) => {
    if (filter === 'all') return true;
    return c.status === filter;
  });

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] md:h-screen overflow-hidden">
      {/* Top Bar */}
      <div className="border-b border-slate-800 bg-slate-900/60 p-4 flex items-center justify-between shrink-0">
        <div>
          <h1 className="text-lg font-bold text-white flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-emerald-400" />
            Live Customer Inbox
          </h1>
          <p className="text-xs text-slate-400">
            Real-time chat monitor with instant 1-click human takeover to mute the AI.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setIsRefreshing(true);
              fetchConversations().then(() => setIsRefreshing(false));
            }}
            className="flex items-center gap-1.5 rounded-lg border border-slate-700 bg-slate-800 px-3 py-1.5 text-xs text-slate-300 hover:text-white transition"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* Main Split View */}
      <div className="flex-1 flex min-h-0">
        {/* Left Column: Conversation List */}
        <div className="w-80 sm:w-96 border-r border-slate-800 flex flex-col bg-slate-900/40">
          {/* Filter Tabs */}
          <div className="p-3 border-b border-slate-800 flex gap-1.5 overflow-x-auto scrollbar-none">
            <button
              onClick={() => setFilter('all')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition shrink-0 ${
                filter === 'all'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              All ({conversations.length})
            </button>
            <button
              onClick={() => setFilter('active_ai')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition shrink-0 ${
                filter === 'active_ai'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Active AI
            </button>
            <button
              onClick={() => setFilter('human_takeover')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition shrink-0 ${
                filter === 'human_takeover'
                  ? 'bg-amber-600 text-white'
                  : 'bg-slate-800/80 text-slate-400 hover:text-white'
              }`}
            >
              Human Takeover
            </button>
          </div>

          {/* List items */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60">
            {filtered.map((conv) => {
              const isSelected = conv.id === selectedId;
              const isMuted = conv.status === 'human_takeover';

              return (
                <div
                  key={conv.id}
                  onClick={() => setSelectedId(conv.id)}
                  className={`p-4 cursor-pointer transition ${
                    isSelected ? 'bg-slate-800/90 border-l-4 border-emerald-500' : 'hover:bg-slate-850/50'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h4 className="font-semibold text-xs text-white truncate">
                      {conv.customer_name || conv.customer_identifier}
                    </h4>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-semibold border ${
                        isMuted
                          ? 'bg-amber-950/80 text-amber-300 border-amber-800'
                          : 'bg-emerald-950/80 text-emerald-300 border-emerald-800'
                      }`}
                    >
                      {isMuted ? 'Muted' : 'AI Active'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-[11px] text-slate-400">
                    <span className="capitalize">{conv.channel.replace('_', ' ')}</span>
                    <span className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      {new Date(conv.last_message_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  {conv.handoff_reason && (
                    <div className="mt-1.5 text-[10px] text-amber-300/90 truncate flex items-center gap-1">
                      <AlertCircle className="h-3 w-3 shrink-0" />
                      {conv.handoff_reason}
                    </div>
                  )}
                </div>
              );
            })}

            {filtered.length === 0 && (
              <div className="p-8 text-center text-xs text-slate-400">
                No conversations in this filter.
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Chat Thread & Live Controls */}
        <div className="flex-1 flex flex-col bg-slate-950 min-w-0">
          {selectedConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-slate-800 bg-slate-900/60 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="h-9 w-9 rounded-full bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-200 font-semibold text-xs">
                    {(selectedConv.customer_name || 'U')[0]}
                  </div>
                  <div>
                    <h3 className="font-bold text-sm text-white flex items-center gap-2">
                      {selectedConv.customer_name || selectedConv.customer_identifier}
                      <span className="text-xs font-normal text-slate-400">
                        ({selectedConv.customer_identifier})
                      </span>
                    </h3>
                    <p className="text-[11px] text-slate-400">
                      Channel: <span className="text-slate-300 font-medium">{selectedConv.channel}</span>
                    </p>
                  </div>
                </div>

                {/* 1-Click Human Takeover Toggle Button */}
                <div className="flex items-center gap-3">
                  {selectedConv.status === 'human_takeover' ? (
                    <button
                      onClick={handleToggleTakeover}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-emerald-500 hover:to-teal-500 transition active:scale-95"
                    >
                      <Play className="h-3.5 w-3.5 fill-current" />
                      Resume AI Agent
                    </button>
                  ) : (
                    <button
                      onClick={handleToggleTakeover}
                      className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 px-4 py-2 text-xs font-bold text-white shadow-md hover:from-amber-500 hover:to-orange-500 transition active:scale-95"
                    >
                      <Hand className="h-3.5 w-3.5" />
                      Take Over (Mute AI)
                    </button>
                  )}
                </div>
              </div>

              {/* Status Banner when Muted */}
              {selectedConv.status === 'human_takeover' && (
                <div className="bg-amber-950/70 border-b border-amber-800/80 px-4 py-2 text-xs text-amber-200 flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse"></span>
                    <strong>AI IS MUTED:</strong> You are chatting directly with the customer as human staff.
                  </span>
                  <span className="text-[10px] text-amber-300/80">Click &quot;Resume AI Agent&quot; when finished</span>
                </div>
              )}

              {/* Thread Messages */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {messages.map((m) => {
                  const isUser = m.sender === 'customer';
                  const isStaff = m.sender === 'human_staff';
                  const isOrderConfirmed = m.content.includes('Mubarak ho!') || m.content.includes('Order ID:');

                  return (
                    <div
                      key={m.id}
                      className={`flex ${isUser ? 'justify-end' : 'justify-start'}`}
                    >
                      <div
                        className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm leading-relaxed text-xs sm:text-sm ${
                          isUser
                            ? 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-br-none'
                            : isStaff
                            ? 'bg-amber-950/80 border border-amber-700/60 text-amber-100 rounded-bl-none'
                            : 'bg-slate-850 border border-slate-700/60 text-slate-200 rounded-bl-none'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-4 mb-1 text-[10px] font-semibold opacity-75">
                          <span>
                            {isUser
                              ? 'Shopper'
                              : isStaff
                              ? 'Human Staff (You)'
                              : 'AI Sales Associate (Ayesha)'}
                          </span>
                          <span>
                            {new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>

                        {isOrderConfirmed && (
                          <div className="mb-2 flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                            <CheckCircle2 className="h-4 w-4" />
                            Confirmed COD Order
                          </div>
                        )}

                        <div className="whitespace-pre-wrap">{m.content}</div>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Staff Input Box */}
              <div className="p-4 border-t border-slate-800 bg-slate-900/80">
                <div className="flex items-center gap-2 rounded-xl bg-slate-800 border border-slate-700 px-3 py-2 focus-within:border-emerald-500 transition">
                  <input
                    type="text"
                    value={staffInput}
                    onChange={(e) => setStaffInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={
                      selectedConv.status === 'human_takeover'
                        ? 'Type reply as Human Staff (AI is muted)...'
                        : 'Take over or send message directly...'
                    }
                    className="flex-1 bg-transparent text-xs sm:text-sm text-slate-100 placeholder-slate-400 focus:outline-none"
                  />
                  <button
                    onClick={handleSendStaffMessage}
                    disabled={!staffInput.trim() || sending}
                    className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-600 text-white transition hover:bg-emerald-500 disabled:opacity-40"
                  >
                    <Send className="h-4 w-4" />
                  </button>
                </div>
                <div className="mt-1 text-[10px] text-slate-400 px-1">
                  Replies are delivered instantly to the shopper&apos;s active session.
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-center p-8 text-slate-400">
              <UserCheck className="h-12 w-12 text-slate-600 mb-3" />
              <p className="text-sm font-medium">Select a conversation from the left to view messages</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
