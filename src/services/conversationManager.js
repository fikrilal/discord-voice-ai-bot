class ConversationManager {
  constructor() {
    this.conversations = new Map();
    this.maxMessages = 10;
    this.timeout = 15 * 60 * 1000;
  }

  getContext(userId) {
    const conversation = this.conversations.get(userId);

    if (!conversation) {
      return [];
    }

    // check if conversation has timed out
    if (Date.now() - conversation.lastActivity > this.timeout) {
      this.conversations.delete(userId);
      return [];
    }

    return conversation.messages.slice();
  }

  addMessage(userId, role, content) {
    let conversation = this.conversations.get(userId);

    if (!conversation) {
      conversation = {
        messages: [],
        lastActivity: Date.now(),
      };
      this.conversations.set(userId, conversation);
    }

    conversation.messages.push({ role, content });
    conversation.lastActivity = Date.now();

    // keep only the last N messages to prevent context from growing too large
    if (conversation.messages.length > this.maxMessages) {
      conversation.messages = conversation.messages.slice(-this.maxMessages);
    }
  }

  clearConversation(userId) {
    this.conversations.delete(userId);
  }

  getAllActiveConversations() {
    const active = [];
    const now = Date.now();

    for (const [userId, conversation] of this.conversations.entries()) {
      if (now - conversation.lastActivity <= this.timeout) {
        active.push({
          userId,
          messageCount: conversation.messages.length,
          lastActivity: conversation.lastActivity,
        });
      } else {
        // clean up expired conversations
        this.conversations.delete(userId);
      }
    }

    return active;
  }

  cleanup() {
    // clean up expired conversations
    const now = Date.now();

    for (const [userId, conversation] of this.conversations.entries()) {
      if (now - conversation.lastActivity > this.timeout) {
        this.conversations.delete(userId);
      }
    }
  }

  getStats() {
    return {
      activeConversations: this.conversations.size,
      totalMessages: Array.from(this.conversations.values()).reduce(
        (total, conv) => total + conv.messages.length,
        0
      ),
    };
  }
}

module.exports = ConversationManager;
