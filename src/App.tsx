import React, { useState, useRef, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";
import { BrowserRouter as Router, Routes, Route, useNavigate } from 'react-router-dom';
import './App.css';
import Live2DWidget from './components/Live2DWidget';
import SnakeGame from './components/SnakeGame';
import ReactDOM from 'react-dom/client';

// Initialize Gemini AI
const genAI = new GoogleGenerativeAI("AIzaSyAN6AR-DdyFhDzvWBgE46AUvpRxaw9RZzk");

// Define types
interface ChatMessage {
  type: 'user' | 'ai';
  text: string;
}

// Predefined responses based on keywords
const getFallbackResponse = (query: string): string => {
  const lowerQuery = query.toLowerCase();
  
  // Define keyword-based responses
  if (lowerQuery.includes('experience') || lowerQuery.includes('work')) {
    return "Yash has experience as a DevOps Intern at Scogo Networks where he worked with monitoring solutions, SecOps tools, and deployed AI applications on Azure Kubernetes Service. He also interned at Raydium Labs as a Software Developer, building a DAO using React, Node.js, and blockchain technologies.";
  }
  
  if (lowerQuery.includes('project') || lowerQuery.includes('built') || lowerQuery.includes('create')) {
    return "Yash has built several impressive projects including Fusion Linux (a Debian-based distribution for AI Engineers), a Distribution Builder tool, an Infrastructure Monitoring Suite using Signoz and Grafana, and Lenovo Vantage for Linux (power management tools for Lenovo laptops).";
  }
  
  if (lowerQuery.includes('skill') || lowerQuery.includes('technology') || lowerQuery.includes('tech')) {
    return "Yash is skilled in cloud platforms (Azure, DigitalOcean), container orchestration (Kubernetes, Docker, Helm, ArgoCD), CI/CD tools (Jenkins, CircleCI, GitHub Actions), various operating systems, monitoring tools (Prometheus, Grafana, Signoz), and programming languages like Python, Bash, JavaScript, and Java.";
  }
  
  if (lowerQuery.includes('education') || lowerQuery.includes('study') || lowerQuery.includes('degree')) {
    return "Yash is pursuing a B.Tech in Artificial Intelligence and Data Science from University of Mumbai, Datta Meghe College of Engineering. He's expected to graduate in 2025 with a CGPA of 8.2/10. His coursework includes NLP, Machine Learning, Deep Learning, Computer Vision, and more.";
  }
  
  if (lowerQuery.includes('achievement') || lowerQuery.includes('award') || lowerQuery.includes('win')) {
    return "Yash has won several hackathons including Mumbai Hacks 2024 (for an AI-Powered Inventory management system) and AI Sparks (for Fusion Linux). He was also a runner-up in Smart India Hackathon for a Drug inventory management system.";
  }
  
  if (lowerQuery.includes('contact') || lowerQuery.includes('email') || lowerQuery.includes('reach')) {
    return "You can contact Yash via email at yash@duck.com, by phone at +91 8169362024, or find him in Mumbai, India. He's open to collaboration opportunities and job inquiries.";
  }
  
  if (lowerQuery.includes('social') || lowerQuery.includes('github') || lowerQuery.includes('linkedin')) {
    return "You can find Yash on GitHub at github.com/yashbhangale, on LinkedIn at linkedin.com/in/yashbhangale, on Twitter at twitter.com/ttrubleshooter, and on Medium at medium.com/@yashbhangale.";
  }

  if (lowerQuery.includes('who') || lowerQuery.includes('about you') || lowerQuery.includes('yourself')) {
    return "I'm an AI assistant for Yash Bhangale's portfolio. Yash is a 21-year-old DevOps Engineer and Linux enthusiast who's passionate about cloud infrastructure, containerization, and automation. He's skilled in Kubernetes, Docker, and has experience with various cloud platforms.";
  }
  
  if (lowerQuery.includes('hobby') || lowerQuery.includes('interest') || lowerQuery.includes('free time')) {
    return "When not optimizing infrastructure or automating deployments, Yash enjoys participating in hackathons, contributing to open-source projects, and experimenting with the latest DevOps tools and technologies.";
  }
  
  // Default fallback response
  return "As Yash's assistant, I can tell you he's a 21-year-old DevOps Engineer and Linux enthusiast who's passionate about cloud infrastructure, containerization, and automation. He's built projects like Fusion Linux and has experience with Kubernetes, Docker, and Azure. You can ask me about his skills, projects, experience, education, or achievements if you'd like to know more!";
};

const App: React.FC = () => {
  const [history, setHistory] = useState<string[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [inChatMode, setInChatMode] = useState(false);
  const [chatHistory, setChatHistory] = useState<ChatMessage[]>([]);
  const terminalRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const [showRecruiterPopup, setShowRecruiterPopup] = useState(true);
  const [isPopupClosing, setIsPopupClosing] = useState(false);
  const [currentView, setCurrentView] = useState<React.ReactNode>(null);
  const [showBlog, setShowBlog] = useState(false);

  const showWelcome = () => {
    const asciiArt = `Y88b   d88P                888     \n Y88b d88P                 888     \n  Y88o88P                  888     \n   Y888P  8888b.  .d8888b  88888b. \n    888      "88b 88K      888 "88b\n    888  .d888888 "Y8888b. 888  888\n    888  888  888      X88 888  888\n    888  "Y888888  88888P' 888  888\n`;
    addToHistory(`<pre class=\"ascii-art\">${asciiArt}</pre>`);
    addToHistory('<div class="command-output typing">Keeping Systems Resilient, Scalable, and Blazing Fast ⚡.</div>');
    addToHistory('<div class="command-output typing">I Build, I Automate, I Optimize – Welcome to My Digital Playground 🛠️.</div>');
    addToHistory('<div class="command-output">Type <span class="highlight">help</span> to see available commands or <span class="highlight">about</span> to learn more about me.</div>');
    addToHistory('<div class="command-output">=================================================================</div>');
  };

  const showHelp = () => {
    const helpContent = `
<div class="command-output">Available commands:</div>
<div class="help-grid" style="margin-top:10px;">
  <div class="help-item" data-cmd="about" style="cursor: pointer;"> <div class="command">about</div> <div class="description">About me</div> </div>
  <div class="help-item" data-cmd="achievements" style="cursor: pointer;"> <div class="command">achievements</div> <div class="description">Awards & achievements</div> </div>
  <div class="help-item" data-cmd="ask" style="cursor: pointer;"> <div class="command">ask</div> <div class="description">Ask me anything about myself</div> </div>
  <div class="help-item" data-cmd="blog" style="cursor: pointer;"> <div class="command">blog</div> <div class="description">Visit my blog</div> </div>
  <div class="help-item" data-cmd="clear" style="cursor: pointer;"> <div class="command">clear</div> <div class="description">Clear terminal</div> </div>
  <div class="help-item" data-cmd="contact" style="cursor: pointer;"> <div class="command">contact</div> <div class="description">Contact information</div> </div>
  <div class="help-item" data-cmd="date" style="cursor: pointer;"> <div class="command">date</div> <div class="description">Current date and time</div> </div>
  <div class="help-item" data-cmd="education" style="cursor: pointer;"> <div class="command">education</div> <div class="description">Educational background</div> </div>
  <div class="help-item" data-cmd="experience" style="cursor: pointer;"> <div class="command">experience</div> <div class="description">Work experience</div> </div>
  <div class="help-item" data-cmd="game" style="cursor: pointer;"> <div class="command">game</div> <div class="description">Play the classic Snake game</div> </div>
  <div class="help-item" data-cmd="help" style="cursor: pointer;"> <div class="command">help</div> <div class="description">Show this help menu</div> </div>
  <div class="help-item" data-cmd="ls" style="cursor: pointer;"> <div class="command">ls</div> <div class="description">List commands</div> </div>
  <div class="help-item" data-cmd="neofetch" style="cursor: pointer;"> <div class="command">neofetch</div> <div class="description">System info</div> </div>
  <div class="help-item" data-cmd="projects" style="cursor: pointer;"> <div class="command">projects</div> <div class="description">My projects</div> </div>
  <div class="help-item" data-cmd="resume" style="cursor: pointer;"> <div class="command">resume</div> <div class="description">View my resume</div> </div>
  <div class="help-item" data-cmd="skills" style="cursor: pointer;"> <div class="command">skills</div> <div class="description">My technical skills</div> </div>
  <div class="help-item" data-cmd="social" style="cursor: pointer;"> <div class="command">social</div> <div class="description">Social media links</div> </div>
  <div class="help-item" data-cmd="uname" style="cursor: pointer;"> <div class="command">uname</div> <div class="description">System information</div> </div>
  <div class="help-item" data-cmd="whoami" style="cursor: pointer;"> <div class="command">whoami</div> <div class="description">My identity</div> </div>
</div>`;
    addToHistory(helpContent);
  };

  const showAbout = () => {
    const aboutContent = `
<div class="command-output">
  <div class="info-section">
    <div class="info-row"><span class="highlight">Name:</span> Yash Bhangale</div>
    <div class="info-row"><span class="highlight">Role:</span> Final-year Engineering Grad | 21 y/o tech enthusiast</div>
    <div class="info-row"><span class="highlight">Focus:</span> Building scalable, resilient infrastructure and automated CI/CD pipelines</div>
    <div class="info-row"><span class="highlight">Expertise:</span> Cloud & DevOps Engineer | Kubernetes Enthusiast | Linux Power User</div>
    <div class="info-row"><span class="highlight">Achievements:</span> Multiple Hackathons Winner | 1 Year of Industry Experience</div>
  </div>
  <div class="description-section">
    <p>I'm a passionate DevOps Engineer and Linux enthusiast with expertise in containerization, CI/CD pipelines, and cloud infrastructure. My journey in tech started with a fascination for automation and has evolved into a commitment to building scalable and resilient systems.</p>
    <p>When I'm not optimizing infrastructure or automating deployments, you can find me participating in hackathons, contributing to open-source projects, or experimenting with the latest DevOps tools and technologies.</p>
  </div>
</div>`;
    addToHistory(aboutContent);
  };

  const showProjects = () => {
    const projectsContent = `
<div class="command-output">
  <div class="section-title">Notable Projects</div>
  <div class="project-list">
    <div class="project-item">
      <div class="project-title">Fusion Linux</div>
      <div class="project-description">Debian-based Linux Distribution for AI Engineers, Data Engineers, and DevOps Engineers</div>
      <div class="tech-stack">
        <span class="tech-tag">Live-Build</span>
        <span class="tech-tag">Custom-Scripts</span>
        <span class="tech-tag">Custom-Packages</span>
        <span class="tech-tag">Python</span>
        <span class="tech-tag">KVM</span>
        <span class="tech-tag">Docker</span>
        <span class="tech-tag">CICD</span>
        <span class="tech-tag">GitOps</span>
      </div>
    </div>
    <div class="project-item">
      <div class="project-title">Distribution Builder</div>
      <div class="project-description">Custom Distribution Builder with GUI for creating custom Linux distributions</div>
      <div class="tech-stack">
        <span class="tech-tag">Python</span>
        <span class="tech-tag">Shell-Scripts</span>
        <span class="tech-tag">Git</span>
        <span class="tech-tag">Docker</span>
        <span class="tech-tag">Open-AI</span>
      </div>
    </div>
    <div class="project-item">
      <div class="project-title">Infrastructure Monitoring Suite</div>
      <div class="project-description">Comprehensive monitoring solution using Signoz, Loki, and Grafana</div>
      <div class="tech-stack">
        <span class="tech-tag">Signoz</span>
        <span class="tech-tag">Grafana</span>
        <span class="tech-tag">AlertManager</span>
        <span class="tech-tag">Node Exporter</span>
        <span class="tech-tag">ClickHouse</span>
        <span class="tech-tag">Kubernetes</span>
        <span class="tech-tag">Helm</span>
      </div>
    </div>
    <div class="project-item">
      <div class="project-title">Lenovo Vantage for Linux</div>
      <div class="project-description">Power management features for Lenovo laptops on Linux</div>
      <div class="tech-stack">
        <span class="tech-tag">Shell-Scripts</span>
        <span class="tech-tag">Linux-utils</span>
        <span class="tech-tag">Python</span>
        <span class="tech-tag">Git</span>
      </div>
    </div>
  </div>
</div>`;
    addToHistory(projectsContent);
  };

  const showSkills = () => {
    const skillsContent = `
<div class="command-output">
  <div class="section-title">Technical Skills</div>
  <div class="skills-grid">
    <div class="skill-category">
      <div class="category-title">Cloud Platforms</div>
      <div class="skill-items">
        <span class="skill-tag">Azure</span>
        <span class="skill-tag">DigitalOcean</span>
      </div>
    </div>
    <div class="skill-category">
      <div class="category-title">Container Orchestration</div>
      <div class="skill-items">
        <span class="skill-tag">Kubernetes</span>
        <span class="skill-tag">Docker</span>
        <span class="skill-tag">Helm</span>
        <span class="skill-tag">ArgoCD</span>
      </div>
    </div>
    <div class="skill-category">
      <div class="category-title">CI/CD</div>
      <div class="skill-items">
        <span class="skill-tag">Jenkins</span>
        <span class="skill-tag">CircleCI</span>
        <span class="skill-tag">GitHub Actions</span>
      </div>
    </div>
    <div class="skill-category">
      <div class="category-title">Operating Systems</div>
      <div class="skill-items">
        <span class="skill-tag">Linux (Ubuntu, CentOS, Debian)</span>
        <span class="skill-tag">Red Hat</span>
        <span class="skill-tag">Windows Server</span>
        <span class="skill-tag">MacOS</span>
      </div>
    </div>
    <div class="skill-category">
      <div class="category-title">Monitoring & Logging</div>
      <div class="skill-items">
        <span class="skill-tag">Prometheus</span>
        <span class="skill-tag">Grafana</span>
        <span class="skill-tag">Signoz</span>
        <span class="skill-tag">Loki</span>
      </div>
    </div>
    <div class="skill-category">
      <div class="category-title">Programming Languages</div>
      <div class="skill-items">
        <span class="skill-tag">Python</span>
        <span class="skill-tag">Bash</span>
        <span class="skill-tag">JavaScript</span>
        <span class="skill-tag">Java</span>
      </div>
    </div>
  </div>
</div>`;
    addToHistory(skillsContent);
  };

  const showExperience = () => {
    const experienceContent = `
<div class="command-output">
  <div class="section-title">Work Experience</div>
  <div class="experience-list">
    <div class="experience-item">
      <div class="job-title">DevOps Intern - Scogo Networks Pvt. Ltd.</div>
      <div class="job-period">Jan 2025 - Present</div>
      <ul class="job-responsibilities">
        <li>Set up monitoring and alerting solutions using Signoz</li>
        <li>Set up SecOps tools like trivy for vulnerability scanning</li>
        <li>Argocd for CI/CD pipelines and GitOps workflows</li>
        <li>Contributed to the deployment of AI-powered applications using vllm and langchain libraries in Azure Kubernetes Service (AKS)</li>
      </ul>
    </div>
    <div class="experience-item">
      <div class="job-title">Software Developer Intern - Raydium Labs</div>
      <div class="job-period">June 2024 - August 2024</div>
      <ul class="job-responsibilities">
        <li>Developed a DAO using React and Node.js</li>
        <li>Nft Api Integration for minting Nfts on Ethereum Blockchain using Solidity</li>
        <li>Deployed the Dapp on Vercel</li>
        <li>Deployed the Smart Contract on Base Sepolia Testnet</li>
        <li>Smart Contract abi for interaction with Dapp using ethers.js</li>
        <li>Created Voting System for DAO Proposals</li>
      </ul>
    </div>
  </div>
</div>`;
    addToHistory(experienceContent);
  };

  const showEducation = () => {
    const educationContent = `
<div class="command-output">
  <div class="section-title">Educational Background</div>
  <div class="education-list">
    <div class="education-item">
      <div class="degree-title">B.Tech in Artificial Intelligence and Data Science</div>
      <div class="institution">University of Mumbai, Datta Meghe College of Engineering</div>
      <div class="period">2021 - Present (Expected Graduation: 2025)</div>
      <ul class="education-details">
        <li><span class="highlight">CGPA:</span> 8.2/10</li>
        <li><span class="highlight">Coursework:</span> Natural Language Processing, Machine Learning, Deep Learning, Computer Vision, Artificial Intelligence, Advance AI, Computer Networks, Operating Systems, Database Management</li>
        <li><span class="highlight">Senior Project:</span> Cryptway - A Decentralized Crypto Exchange Platform</li>
      </ul>
    </div>
    <div class="education-item">
      <div class="section-subtitle">Relevant Certifications</div>
      <ul class="certification-list">
        <li>Azure Fundamentals</li>
        <li>Azure Ai Fundamentals</li>
      </ul>
    </div>
  </div>
</div>`;
    addToHistory(educationContent);
  };

  const showAchievements = () => {
    const achievementsContent = `
<div class="command-output">
  <div class="section-title">Awards & Achievements</div>
  <div class="achievements-list">
    <div class="achievement-item">
      <div class="achievement-title">Hackathon Winner - Mumbai Hacks 2024</div>
      <div class="achievement-description">Saas Solution for AI-Powered Inventory management system</div>
    </div>
    <div class="achievement-item">
      <div class="achievement-title">Hackathon winner - AI Sparks</div>
      <div class="achievement-description">Fusion Linux Distribution for AI Engineers</div>
    </div>
    <div class="achievement-item">
      <div class="achievement-title">Smart India Hackathon runner up</div>
      <div class="achievement-description">Drug inventory management system</div>
    </div>
  </div>
</div>`;
    addToHistory(achievementsContent);
  };

  const showContact = () => {
    const contactContent = `
<div class="command-output">
  <div class="section-title">Contact Information</div>
  <div class="contact-info">
    <div class="contact-item">
      <span class="highlight">Email:</span> yash@duck.com
    </div>
    <div class="contact-item">
      <span class="highlight">Phone:</span> +91 8169362024
    </div>
    <div class="contact-item">
      <span class="highlight">Location:</span> Mumbai, India
    </div>
  </div>
  <div class="contact-message">
    Feel free to reach out to me for collaboration opportunities, job inquiries, or just to chat about technology!
  </div>
</div>`;
    addToHistory(contactContent);
  };

  const showSocial = () => {
    const socialContent = `
<div class="command-output">
  <div class="section-title">Social Media Links</div>
  <div class="social-links">
    <div class="social-item">
      <span class="highlight">GitHub:</span> <a href="https://github.com/yashbhangale" target="_blank" class="social-link">github.com/yashbhangale</a>
    </div>
    <div class="social-item">
      <span class="highlight">LinkedIn:</span> <a href="https://linkedin.com/in/yashbhangale" target="_blank" class="social-link">linkedin.com/in/yashbhangale</a>
    </div>
    <div class="social-item">
      <span class="highlight">Twitter:</span> <a href="https://twitter.com/ttrubleshooter" target="_blank" class="social-link">twitter.com/ttrubleshooter</a>
    </div>
    <div class="social-item">
      <span class="highlight">Medium:</span> <a href="https://medium.com/@yashbhangale" target="_blank" class="social-link">medium.com/@yashbhangale</a>
    </div>
  </div>
</div>`;
    addToHistory(socialContent);
  };

  const showWhoami = () => {
    const whoamiContent = `
Cloud & DevOps Engineer | Kubernetes Enthusiast | Linux Power User
A 21-year-old final-year engineering student with a passion for automation, scalable infrastructure, and optimizing deployment workflows.
    `;
    addToHistory(whoamiContent);
  };

  const showNeofetch = () => {
    const neofetchContent = `
<div class="command-output neofetch-container">
  <div class="neofetch-ascii">
    <pre>
                    .---.
                   /     \\
                   \\.@-@./
                   /\`\\_/\`\\
                  //  _  \\\\
                 | \\     )|_
                /\`\\_\`>  <_/ \\
                \\__/'---'\\__/
    </pre>
  </div>
  <div class="neofetch-info">
    <div class="neofetch-row"><span class="neofetch-label">OS:</span> DevOps Linux x86_64</div>
    <div class="neofetch-row"><span class="neofetch-label">Host:</span> Cloud Native Machine</div>
    <div class="neofetch-row"><span class="neofetch-label">Kernel:</span> 5.15.0-geeky-custom</div>
    <div class="neofetch-row"><span class="neofetch-label">Uptime:</span> 1 year of dev experience</div>
    <div class="neofetch-row"><span class="neofetch-label">Packages:</span> aws, k8s, docker, terraform</div>
    <div class="neofetch-row"><span class="neofetch-label">Shell:</span> bash 5.1.16</div>
    <div class="neofetch-row"><span class="neofetch-label">CPU:</span> Final Year Engineering Student @ 3.8GHz</div>
    <div class="neofetch-row"><span class="neofetch-label">GPU:</span> Kubernetes Cluster RTX 9000</div>
    <div class="neofetch-row"><span class="neofetch-label">Memory:</span> Multiple Hackathon Wins</div>
  </div>
</div>`;
    addToHistory(neofetchContent);
  };

  const showDate = () => {
    const now = new Date();
    const dateString = now.toLocaleDateString() + ' ' + now.toLocaleTimeString();
    addToHistory(dateString);
  };

  const showUname = () => {
    const unameContent = `
Portfolio OS Release 1.0 (terminal-portfolio) #1 SMP PREEMPT
Linux 5.15.0-geeky-custom x86_64 GNU/Linux
    `;
    addToHistory(unameContent);
  };

  const listCommands = () => {
    const commands = [
      'about', 'projects', 'skills', 'experience', 'education',
      'achievements', 'contact', 'social', 'whoami', 'neofetch',
      'clear', 'ls', 'ask', 'help', 'date', 'uname', 'game', 'blog'
    ];
    addToHistory(commands.join(' '));
  };

  const openBlog = () => {
    window.open('https://yashbhangale.hashnode.dev/', '_blank');
    addToHistory('<div class="command-output">Opening blog in new tab...</div>');
  };

  const startChatMode = () => {
    setInChatMode(true);
    setChatHistory([]);
    
    // Create unique container ID
    const chatContainerId = `chat-container-${Date.now()}`;
    
    // Add the chat container with proper styling
    const chatContainerHTML = `
      <div class="terminal-output">
        <div class="chat-header">
          <div class="chat-title">💬 Interactive AI Assistant</div>
          <div class="chat-subtitle">Ask me anything about Yash Bhangale, his skills, projects, or experience</div>
          <div class="chat-hint">Type 'exit' to quit chat mode or 'clear' to clear chat history</div>
        </div>
        <div class="chat-container" id="${chatContainerId}"></div>
      </div>
    `;
    
    addToHistory(chatContainerHTML);
    
    // Force console logging to be visible
    console.log('%c Chat Mode Started! ', 'background: #222; color: #bada55; font-size: 16px;');
    
    // Store the container ID for future reference
    setTimeout(() => {
      const chatContainer = document.getElementById(chatContainerId);
      if (chatContainer) {
        console.log("%c Chat container created successfully! ", "background: green; color: white");
        console.log("%c Chat container ID: " + chatContainerId, "color: green");
        
        // Add a welcome message directly
        const welcomeMessage = "Hi! I'm Yash's AI assistant. Ask me anything about his skills, projects, or experience!";
        setChatHistory([{ type: 'ai', text: welcomeMessage }]);
        
        // Force update to be sure the container is visible
        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      } else {
        console.error("%c CRITICAL ERROR: Chat container not found! ", "background: red; color: white");
        console.error("%c Looking for element with ID: " + chatContainerId, "color: red");
        // Try to find the container again after a short delay
        setTimeout(() => {
          const retryContainer = document.getElementById(chatContainerId);
          if (retryContainer) {
            console.log("%c Chat container found on retry! ", "background: green; color: white");
            const welcomeMessage = "Hi! I'm Yash's AI assistant. Ask me anything about his skills, projects, or experience!";
            setChatHistory([{ type: 'ai', text: welcomeMessage }]);
          }
        }, 500);
      }
    }, 100);
  };

  const exitChatMode = () => {
    setInChatMode(false);
    addToHistory('<div class="command-output">Exited AI assistant mode.</div>');
  };

  const handleChatMessage = async (message: string): Promise<void> => {
    console.log('%c Processing chat message: ' + message, 'background: #222; color: #58a6ff');
    
    if (message.toLowerCase() === 'exit') {
      console.log('%c Exiting chat mode', 'color: orange');
      exitChatMode();
      return;
    }
    
    if (message.toLowerCase() === 'clear') {
      console.log('%c Clearing chat history', 'color: orange');
      setChatHistory([]);
      return;
    }

    // Add user message to chat history
    setChatHistory((prev: ChatMessage[]) => [...prev, {type: 'user', text: message}]);
    
    // Find all chat containers
    const chatContainers = document.querySelectorAll('.chat-container');
    console.log('%c Found ' + chatContainers.length + ' chat containers', 'color: #58a6ff');
    
    if (chatContainers.length === 0) {
      console.error("%c ERROR: No chat containers found! ", "background: red; color: white");
      // Create a new chat container if none exists
      startChatMode();
      // Try again after a delay
      setTimeout(() => {
        const retryContainers = document.querySelectorAll('.chat-container');
        if (retryContainers.length > 0) {
          handleChatMessage(message);
        }
      }, 500);
      return;
    }
    
    // Get the most recent chat container
    const chatContainer = chatContainers[chatContainers.length - 1];
    console.log('%c Using chat container: ' + chatContainer.id, 'color: green');

    setIsLoading(true);
    
    // Get response from predefined answers
    const lowerCaseMessage = message.toLowerCase();
    console.log('%c Getting response for: ' + lowerCaseMessage, 'color: #58a6ff');
    
    let response = getFallbackResponse(lowerCaseMessage);
    console.log('%c Response generated: ' + response, 'color: green');
    
    // Add a slight delay to simulate thinking
    setTimeout(() => {
      // Add AI response to chat history
      setChatHistory((prev: ChatMessage[]) => [...prev, {type: 'ai', text: response}]);
      
      setIsLoading(false);
      
      // Ensure terminal is scrolled to show the latest messages
      if (terminalRef.current) {
        terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
      }
    }, 1000);
  };

  // Add this useEffect to render chat messages
  useEffect(() => {
    if (inChatMode) {
      const chatContainers = document.querySelectorAll('.chat-container');
      if (chatContainers.length > 0) {
        const chatContainer = chatContainers[chatContainers.length - 1];
        chatContainer.innerHTML = ''; // Clear existing messages
        
        chatHistory.forEach((message: ChatMessage, index: number) => {
          const messageDiv = document.createElement('div');
          messageDiv.className = `ai-chat-message ${message.type === 'user' ? 'user-question' : 'ai-response'}`;
          messageDiv.textContent = message.text;
          chatContainer.appendChild(messageDiv);
        });

        if (isLoading) {
          const thinkingDiv = document.createElement('div');
          thinkingDiv.className = 'ai-thinking';
          thinkingDiv.innerHTML = 'Thinking<div class="loading-dots"><span></span><span></span><span></span></div>';
          chatContainer.appendChild(thinkingDiv);
        }

        if (terminalRef.current) {
          terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
      }
    }
  }, [chatHistory, isLoading, inChatMode]);

  useEffect(() => {
    // Matrix rain effect
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setupMatrix = () => {
      if (!canvas || !ctx) return;
      
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;

      const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン';
      const latin = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      const nums = '0123456789';
      const symbols = '~/\|•√π÷×¶∆£¢€¥©®™℅[]{}()=+*&%$#@!?;:,.<>';
      
      const chars = katakana + latin + nums + symbols;
      const fontSize = 16;
      const columns = canvas.width / fontSize;
      
      const drops: number[] = [];
      for (let x = 0; x < columns; x++) {
        drops[x] = 1;
      }
      
      function drawMatrix() {
        if (!canvas || !ctx) return;
        
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        ctx.fillStyle = '#0f0';
        ctx.font = fontSize + 'px monospace';
        
        for (let i = 0; i < drops.length; i++) {
          const text = chars.charAt(Math.floor(Math.random() * chars.length));
          ctx.fillText(text, i * fontSize, drops[i] * fontSize);
          
          if (drops[i] * fontSize > canvas.height && Math.random() > 0.975) {
            drops[i] = 0;
          }
          
          drops[i]++;
        }
        
        requestAnimationFrame(drawMatrix);
      }
      
      drawMatrix();
    };

    setupMatrix();
    showWelcome();
    
    // Add a small delay before showing help to ensure welcome message is visible
    setTimeout(() => {
      showHelp();
    }, 100);

    // Handle window resize to adjust canvas
    const handleResize = () => {
      if (canvas) {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
    };

    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
    }
    
    // Focus input when clicking anywhere in the terminal
    const handleTerminalClick = () => {
      if (inputRef.current) {
        inputRef.current.focus();
      }
    };

    document.addEventListener('click', handleTerminalClick);

    return () => {
      document.removeEventListener('click', handleTerminalClick);
    };
  }, [history]);

  const addToHistory = (html: string): void => {
    setHistory((prev: string[]) => [...prev, `<div class=\"terminal-output\">${html}</div>`]);
  };

  const handleCommand = async (command: string): Promise<void> => {
    // If in chat mode, handle input as chat message
    if (inChatMode) {
      handleChatMessage(command);
      return;
    }

    const parts = command.split(' ');
    const cmd = parts[0].toLowerCase();
    const args = parts.slice(1);

    addToHistory(`<div class="terminal-prompt"><span class="username">user</span>@<span class="hostname">portfolio</span>:<span class="prompt-path">~</span>$ ${command}</div>`);

    switch (cmd) {
      case 'ask':
        if (args.length === 0) {
          addToHistory('<div class="command-output">Starting AI assistant mode. Ask me anything about Yash, or type "exit" to quit.</div>');
          startChatMode();
        } else {
          const question = args.join(' ');
          setInChatMode(true);
          setChatHistory([]);
          startChatMode();
          // Use a small timeout to ensure the chat container is rendered
          setTimeout(() => {
            handleChatMessage(question);
          }, 300);
        }
        break;
      case 'clear':
        setHistory([]);
        setTimeout(() => showWelcome(), 0);
        break;
      case 'help':
        showHelp();
        break;
      case 'about':
        showAbout();
        break;
      case 'projects':
        showProjects();
        break;
      case 'skills':
        showSkills();
        break;
      case 'experience':
        showExperience();
        break;
      case 'education':
        showEducation();
        break;
      case 'achievements':
        showAchievements();
        break;
      case 'contact':
        showContact();
        break;
      case 'social':
        showSocial();
        break;
      case 'whoami':
        showWhoami();
        break;
      case 'neofetch':
        showNeofetch();
        break;
      case 'date':
        showDate();
        break;
      case 'uname':
        showUname();
        break;
      case 'ls':
        listCommands();
        break;
      case 'resume':
        window.open('https://drive.google.com/file/d/1n-1y_jhFgNIF7MCfV0ktf_QFfucBD5cX/view?usp=sharing', '_blank');
        addToHistory('<div class="command-output">Opening resume in new tab...</div>');
        break;
      case 'game':
        const gameContainer = document.createElement('div');
        gameContainer.className = 'game-popup';
        gameContainer.innerHTML = `
          <div class="game-popup-header">
            <div class="game-popup-title">Snake Game</div>
            <button class="game-popup-close">×</button>
          </div>
          <div class="game-popup-body">
            <div id="snake-game"></div>
          </div>
        `;
        
        const closeButton = gameContainer.querySelector('.game-popup-close');
        if (closeButton) {
          closeButton.addEventListener('click', () => {
            gameContainer.remove();
          });
        }
        
        const outputDiv = document.querySelector('.terminal-body');
        if (outputDiv) {
          outputDiv.appendChild(gameContainer);
          const gameRoot = ReactDOM.createRoot(document.getElementById('snake-game')!);
          gameRoot.render(<SnakeGame />);
        }
        break;
      case 'blog':
        openBlog();
        break;
      default:
        addToHistory(`<div class="command-output error">Command not found: ${cmd}. Type 'help' for available commands.</div>`);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter' && input.trim()) {
      handleCommand(input.trim());
      // Don't add chat messages to command history
      if (!inChatMode) {
        setCommandHistory((prev: string[]) => [...prev, input.trim()]);
        setHistoryIndex(commandHistory.length + 1);
      }
      setInput('');
    } else if (e.key === 'ArrowUp' && !inChatMode) {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      }
    } else if (e.key === 'ArrowDown' && !inChatMode) {
      e.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1;
        setHistoryIndex(newIndex);
        setInput(commandHistory[newIndex]);
      } else {
        setHistoryIndex(commandHistory.length);
        setInput('');
      }
    } else if (e.key === 'Tab' && !inChatMode) {
      e.preventDefault();
      autoCompleteCommand();
    }
  };

  const autoCompleteCommand = () => {
    const commands = [
      'about', 'projects', 'skills', 'experience', 'education',
      'achievements', 'contact', 'social', 'whoami', 'neofetch',
      'clear', 'ls', 'ask', 'help', 'date', 'uname', 'game', 'blog'
    ];
    
    if (input.trim()) {
      const possibleCommands = commands.filter(cmd => cmd.startsWith(input.trim()));
      if (possibleCommands.length === 1) {
        setInput(possibleCommands[0]);
      }
    }
  };

  // Click handler for help menu
  const handleHelpClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    const helpItem = target.closest('.help-item');
    if (helpItem) {
      const cmd = helpItem.getAttribute('data-cmd');
      if (cmd) {
        handleCommand(cmd);
      }
    }
  };

  const closeRecruiterPopup = () => {
    setIsPopupClosing(true);
    setTimeout(() => {
      setShowRecruiterPopup(false);
      setIsPopupClosing(false);
    }, 500);
  };

  return (
    <Router basename={process.env.PUBLIC_URL}>
      <div className="App">
        <Routes>
          <Route path="/" element={
            <>
              <Live2DWidget />
              {showRecruiterPopup && (
                <>
                  <div className={`recruiter-popup-overlay ${isPopupClosing ? 'closing' : ''}`} />
                  <div className={`recruiter-popup ${isPopupClosing ? 'closing' : ''}`}>
                    <div className="recruiter-popup-header">
                      <div className="recruiter-popup-title">Welcome to My Portfolio</div>
                      <button className="recruiter-popup-close" onClick={closeRecruiterPopup}>
                        CLOSE
                      </button>
                    </div>
                    <div className="recruiter-popup-content">
                      
                      <p>Key Features:</p>
                      <ul>
                        <li>• <span className="highlight">AI-Powered Assistant</span>: Type <span className="command">ask</span> to start a conversation with my AI assistant about my skills and experience</li>
                        <li>• <span className="highlight">Interactive Terminal</span>: Type commands or click on the help menu to explore my portfolio</li>
                      </ul>

                      <div className="tip">
                        <p>Try these commands to get started:</p>
                        <p><span className="command">help</span> - Show available commands</p>
                        <p><span className="command">about</span> - Learn more about me</p>
                        <p><span className="command">projects</span> - View my projects</p>
                        <p><span className="command">ask</span> - Start a conversation with my AI assistant</p>
                      </div>
                    </div>
                  </div>
                </>
              )}
              <div className="matrix-container">
                <canvas ref={canvasRef} />
              </div>
              <div className="terminal-window">
                <div className="terminal-header">
                  <div className="terminal-buttons">
                    <div className="terminal-button close"></div>
                    <div className="terminal-button minimize"></div>
                    <div className="terminal-button maximize"></div>
                  </div>
                  <div className="terminal-title">
                    {inChatMode ? 'AI Assistant - Chat Mode' : 'yash@portfolio ~ - bash'}
                  </div>
                </div>
                <div className="terminal-body" ref={terminalRef} onClick={handleHelpClick}>
                  {history.map((line: string, index: number) => (
                    <div key={index} dangerouslySetInnerHTML={{ __html: line }} />
                  ))}
                </div>
                <div className="terminal-input-line">
                  <div className="terminal-prompt">
                    {inChatMode ? (
                      <span style={{ color: '#58a6ff' }}>chat&gt;</span>
                    ) : (
                      <>
                        <span className="username">user</span>@<span className="hostname">portfolio</span>:<span className="prompt-path">~</span>$
                      </>
                    )}
                  </div>
                  <input
                    ref={inputRef}
                    type="text"
                    className="terminal-input"
                    value={input}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={inChatMode ? "Type your question or 'exit' to quit chat mode..." : ""}
                    autoFocus
                  />
                </div>
              </div>
            </>
          } />
        </Routes>
      </div>
    </Router>
  );
};

export default App;