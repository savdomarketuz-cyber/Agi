/**
 * TINIMSIZ AGI - BRAIN v1.1
 * AI ning asosiy miyasi
 * 
 * VERSIYA: v1.1
 * SANA: 2025-10-21
 * MODUL: Core Brain
 */

class AI_Brain {
  constructor() {
    this.version = "1.1";
    this.name = "Tinimsiz AGI";
    
    // Asosiy holatlar
    this.state = {
      active: true,
      learning: false,
      thinking: false,
      conversationCount: 0
    };
    
    // Vaqtinchalik xotira (oxirgi 10 ta xabar)
    this.workingMemory = [];
    this.maxWorkingMemory = 10;
    
    // O'rganilgan bilimlar (keyingi versiyada Sheets'ga o'tadi)
    this.knowledge = new Map();
    
    console.log(`🧠 ${this.name} v${this.version} ishga tushdi`);
  }
  
  // ============================================
  // ASOSIY FUNKSIYA: Xabarni qayta ishlash
  // ============================================
  async processMessage(userMessage) {
    console.log("📥 Xabar qabul qilindi:", userMessage);
    
    this.state.thinking = true;
    this.state.conversationCount++;
    
    // 1. Xabarni tushunish
    const understanding = this.understand(userMessage);
    console.log("🧩 Tushunish:", understanding);
    
    // 2. Kontekstni olish
    const context = this.getContext();
    
    // 3. Javob generatsiya
    const response = await this.generateResponse(understanding, context);
    
    // 4. Xotiraga saqlash
    this.saveToMemory(userMessage, response);
    
    this.state.thinking = false;
    
    return response;
  }
  
  // ============================================
  // TUSHUNISH: Xabarni tahlil qilish
  // ============================================
  understand(message) {
    const lowerMessage = message.toLowerCase();
    
    // Intent aniqlash (niyat)
    let intent = "unknown";
    
    if (this.isGreeting(lowerMessage)) {
      intent = "greeting";
    } else if (this.isQuestion(lowerMessage)) {
      intent = "question";
    } else if (this.isCommand(lowerMessage)) {
      intent = "command";
    } else if (this.isStatement(lowerMessage)) {
      intent = "statement";
    }
    
    // Kalit so'zlarni ajratish
    const keywords = this.extractKeywords(message);
    
    // Emotsiya aniqlash (oddiy)
    const emotion = this.detectEmotion(lowerMessage);
    
    return {
      original: message,
      intent: intent,
      keywords: keywords,
      emotion: emotion,
      timestamp: Date.now()
    };
  }
  
  // Salom aytishni aniqlash
  isGreeting(message) {
    const greetings = ['salom', 'assalomu', 'hello', 'hi', 'hey'];
    return greetings.some(g => message.includes(g));
  }
  
  // Savolni aniqlash
  isQuestion(message) {
    const questionWords = ['nima', 'qanday', 'qachon', 'qayer', 'kim', 'nega', '?'];
    return questionWords.some(q => message.includes(q));
  }
  
  // Buyruqni aniqlash
  isCommand(message) {
    const commands = ['yarat', 'qil', 'ber', 'ko\'rsat', 'top', 'izla'];
    return commands.some(c => message.includes(c));
  }
  
  // Bayonotni aniqlash
  isStatement(message) {
    return true; // Default
  }
  
  // Kalit so'zlarni ajratish
  extractKeywords(message) {
    // Oddiy versiya: so'zlarni bo'lish
    const words = message.toLowerCase()
      .replace(/[.,!?;]/g, '') // Belgilarni olib tashlash
      .split(/\s+/); // Bo'sh joydan bo'lish
    
    // Stop words (keraksiz so'zlar)
    const stopWords = ['va', 'yoki', 'bu', 'u', 'men', 'sen', 'biz'];
    
    return words.filter(w => 
      w.length > 2 && !stopWords.includes(w)
    );
  }
  
  // Emotsiya aniqlash (oddiy)
  detectEmotion(message) {
    if (message.includes('rahmat') || message.includes('ajoyib') || message.includes('zo\'r')) {
      return 'happy';
    }
    if (message.includes('qiyin') || message.includes('tushunmadim')) {
      return 'confused';
    }
    if (message.includes('!')) {
      return 'excited';
    }
    return 'neutral';
  }
  
  // ============================================
  // KONTEKST: Oldingi suhbatlardan
  // ============================================
  getContext() {
    // Oxirgi 3 ta xabarni kontekst sifatida olish
    const recent = this.workingMemory.slice(-3);
    
    return {
      recentMessages: recent,
      conversationCount: this.state.conversationCount,
      knowledgeSize: this.knowledge.size
    };
  }
  
  // ============================================
  // JAVOB GENERATSIYA
  // ============================================
  async generateResponse(understanding, context) {
    const { intent, keywords, emotion } = understanding;
    
    console.log(`🎯 Intent: ${intent}, Emotion: ${emotion}`);
    
    // Intent'ga qarab javob berish
    switch(intent) {
      case "greeting":
        return this.respondToGreeting(emotion);
      
      case "question":
        return await this.respondToQuestion(keywords, context);
      
      case "command":
        return this.respondToCommand(keywords);
      
      case "statement":
        return this.respondToStatement(keywords);
      
      default:
        return this.respondDefault();
    }
  }
  
  // Salom javoblari
  respondToGreeting(emotion) {
    const greetings = [
      "Salom! Men Tinimsiz AGI man. Sizga qanday yordam bera olaman? 😊",
      "Assalomu alaykum! Nima haqida gaplashmoqchisiz?",
      "Salom! Bugun nimani o'rganamiz? 🚀"
    ];
    
    return this.randomChoice(greetings);
  }
  
  // Savollarga javob
  async respondToQuestion(keywords, context) {
    console.log("❓ Savol: keywords =", keywords);
    
    // Bilimdan qidirish
    for (let keyword of keywords) {
      if (this.knowledge.has(keyword)) {
        const info = this.knowledge.get(keyword);
        return `${keyword} haqida bilganim: ${info}`;
      }
    }
    
    // Agar bilimda yo'q bo'lsa
    const responses = [
      `${keywords.join(', ')} haqida menda hozircha ma'lumot yo'q. Lekin agar o'rgatsangiz, eslab qolaman! 📚`,
      `Qiziq savol! ${keywords[0]} haqida ko'proq ma'lumot berishingiz mumkinmi?`,
      `Bu haqda o'rganishni xohlayman. Menga aytib bering! 🤔`
    ];
    
    return this.randomChoice(responses);
  }
  
  // Buyruqlarga javob
  respondToCommand(keywords) {
    console.log("⚡ Buyruq: keywords =", keywords);
    
    const responses = [
      `${keywords[0]} qilishga harakat qilaman. Bu funksiya keyingi versiyalarda qo'shiladi! 🚀`,
      `Tushunarli! ${keywords.join(' ')} uchun ishlayapman...`,
      `Bu vazifa qiziqarli! Hozircha bu qobiliyat yo'q, lekin o'rganaman! 💡`
    ];
    
    return this.randomChoice(responses);
  }
  
  // Bayonotlarga javob
  respondToStatement(keywords) {
    console.log("💬 Bayonot: keywords =", keywords);
    
    // Bilim sifatida saqlash
    if (keywords.length >= 2) {
      const key = keywords[0];
      const value = keywords.slice(1).join(' ');
      this.knowledge.set(key, value);
      
      return `✅ Tushundim va eslab qoldim: "${key}" haqida. Rahmat! 📝`;
    }
    
    const responses = [
      "Qiziqarli! Davom eting... 🤔",
      "Tushunarli. Yana nima demoqchisiz?",
      "Men tinglayapman! 👂"
    ];
    
    return this.randomChoice(responses);
  }
  
  // Default javob
  respondDefault() {
    const responses = [
      "Tushunmadim, boshqacha tushuntirib bera olasizmi? 🤔",
      "Qiziq... bu haqda ko'proq aytib bering!",
      "Meni bu haqda o'rgating! Men o'rganishni yaxshi ko'raman! 📚"
    ];
    
    return this.randomChoice(responses);
  }
  
  // ============================================
  // XOTIRA
  // ============================================
  saveToMemory(userMessage, aiResponse) {
    this.workingMemory.push({
      user: userMessage,
      ai: aiResponse,
      timestamp: Date.now()
    });
    
    // Agar ko'p bo'lsa, eskisini o'chirish
    if (this.workingMemory.length > this.maxWorkingMemory) {
      this.workingMemory.shift();
    }
    
    console.log(`💾 Xotirada: ${this.workingMemory.length} ta suhbat`);
  }
  
  // ============================================
  // O'RGANISH: Matn/PDF dan
  // ============================================
  learnFromText(text) {
    console.log("📖 Matndan o'rganish...");
    
    this.state.learning = true;
    
    // Oddiy pattern: "X - bu Y" yoki "X nima? Y"
    const lines = text.split(/[.\n]/);
    let learnedCount = 0;
    
    lines.forEach(line => {
      // Pattern 1: "X - bu Y"
      const match1 = line.match(/(.+?)\s*[-–—]\s*(.+)/);
      if (match1) {
        const key = match1[1].trim().toLowerCase();
        const value = match1[2].trim();
        this.knowledge.set(key, value);
        learnedCount++;
      }
      
      // Pattern 2: "X degani Y"
      const match2 = line.match(/(.+?)\s+degan[i]?\s+(.+)/);
      if (match2) {
        const key = match2[1].trim().toLowerCase();
        const value = match2[2].trim();
        this.knowledge.set(key, value);
        learnedCount++;
      }
    });
    
    this.state.learning = false;
    
    console.log(`✅ ${learnedCount} ta narsa o'rgandim!`);
    
    return {
      success: true,
      learned: learnedCount,
      totalKnowledge: this.knowledge.size
    };
  }
  
  // ============================================
  // HELPER FUNCTIONS
  // ============================================
  
  // Tasodifiy tanlov
  randomChoice(array) {
    return array[Math.floor(Math.random() * array.length)];
  }
  
  // Holatni olish
  getStatus() {
    return {
      version: this.version,
      active: this.state.active,
      conversationCount: this.state.conversationCount,
      knowledgeSize: this.knowledge.size,
      memorySize: this.workingMemory.length
    };
  }
  
  // Debug ma'lumot
  debug() {
    console.log("=== AI BRAIN DEBUG ===");
    console.log("Version:", this.version);
    console.log("State:", this.state);
    console.log("Knowledge:", Array.from(this.knowledge.entries()));
    console.log("Working Memory:", this.workingMemory);
    console.log("=====================");
  }
}

// ============================================
// EXPORT (global scope uchun)
// ============================================
window.AI_Brain = AI_Brain;

console.log("✅ AI Brain v1.1 yuklandi!");
