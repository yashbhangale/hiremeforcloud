import React, { useEffect, useState } from 'react';
import './Live2DWidget.css';

declare global {
  interface Window {
    L2Dwidget: any;
  }
}

const models = [
  {
    name: 'Shizuku',
    path: 'https://unpkg.com/live2d-widget-model-shizuku@1.0.5/assets/shizuku.model.json'
  },
  {
    name: 'Hijiki',
    path: 'https://unpkg.com/live2d-widget-model-hijiki@1.0.5/assets/hijiki.model.json'
  },
  {
    name: 'Wanko',
    path: 'https://unpkg.com/live2d-widget-model-wanko@1.0.5/assets/wanko.model.json'
  },
  {
    name: 'Miku',
    path: 'https://unpkg.com/live2d-widget-model-miku@1.0.5/assets/miku.model.json'
  },
  {
    name: 'Haruto',
    path: 'https://unpkg.com/live2d-widget-model-haruto@1.0.5/assets/haruto.model.json'
  },
  {
    name: 'Koharu',
    path: 'https://unpkg.com/live2d-widget-model-koharu@1.0.5/assets/koharu.model.json'
  },
  {
    name: 'Epsilon',
    path: 'https://unpkg.com/live2d-widget-model-epsilon2_1@1.0.5/assets/Epsilon2.1.model.json'
  },
  {
    name: 'Z16',
    path: 'https://unpkg.com/live2d-widget-model-z16@1.0.5/assets/z16.model.json'
  },
  {
    name: 'Chitose',
    path: 'https://unpkg.com/live2d-widget-model-chitose@1.0.5/assets/chitose.model.json'
  },
  {
    name: 'Unity-chan',
    path: 'https://unpkg.com/live2d-widget-model-unitychan@1.0.5/assets/unitychan.model.json'
  },
  {
    name: 'Nipsilon',
    path: 'https://unpkg.com/live2d-widget-model-nipsilon@1.0.5/assets/nipsilon.model.json'
  },
  {
    name: 'Tororo',
    path: 'https://unpkg.com/live2d-widget-model-tororo@1.0.5/assets/tororo.model.json'
  },
  {
    name: 'Nito',
    path: 'https://unpkg.com/live2d-widget-model-nito@1.0.5/assets/nito.model.json'
  }
];

const Live2DWidget: React.FC = () => {
  // Generate a random index on component mount
  const [currentModelIndex, setCurrentModelIndex] = useState(() => {
    return Math.floor(Math.random() * models.length);
  });

  useEffect(() => {
    // Load Live2D widget script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/live2d-widget@3.1.4/lib/L2Dwidget.min.js';
    script.async = true;
    document.body.appendChild(script);

    script.onload = () => {
      initializeModel();
    };

    return () => {
      document.body.removeChild(script);
    };
  }, [currentModelIndex]);

  const initializeModel = () => {
    if (window.L2Dwidget) {
      window.L2Dwidget.init({
        model: {
          jsonPath: models[currentModelIndex].path,
        },
        display: {
          position: 'right',
          width: 250,
          height: 300,
          hOffset: -20,
          vOffset: -20,          
        },
        mobile: {
          show: false,
          scale: 0.5
        },
        react: {
          opacityDefault: 0.8,
          opacityOnHover: 0.2
        }
      });
    }
  };

  const handleModelClick = () => {
    setCurrentModelIndex((currentModelIndex + 1) % models.length);
  };

  // Tip rotation logic
  useEffect(() => {
    const tips = [
      "Type 'help' to see all available commands!",
      "Want to chat? Type 'ask' to start a conversation with me!",
      "Type 'projects' to see Yash's impressive projects!",
      "Curious about skills? Type 'skills' to see Yash's technical expertise!",
      "Type 'experience' to learn about Yash's work experience!",
      "Want to know about education? Type 'education'!",
      "Type 'achievements' to see Yash's awards and accomplishments!",
      "Need to contact? Type 'contact' for Yash's contact information!",
      "Type 'social' to find Yash on social media platforms!",
      "Type 'whoami' to learn more about Yash!",
      "Type 'neofetch' to see a fun system info display!",
      "Type 'clear' to clear the terminal!",
      "Type 'ls' to list all available commands!",
      "Type 'date' to see the current date and time!",
      "Type 'uname' to see system information!"
    ];

    let tipIndex = 0;
    const tipBox = document.getElementById('tip-box');

    function showNextTip() {
      if (tipBox) {
        tipBox.textContent = tips[tipIndex];
        tipIndex = (tipIndex + 1) % tips.length;
      }
    }

    // Show first tip immediately
    showNextTip();

    const tipInterval = setInterval(showNextTip, 8000);

    return () => {
      clearInterval(tipInterval);
    };
  }, []);

  return (
    <div className="live2d-container" onClick={handleModelClick}>
      <div id="tip-box" className="tip-box">
        Hello! I'm your assistant. Click me to change my appearance!
      </div>
      <div className="model-name">
        Current Model: {models[currentModelIndex].name}
      </div>
    </div>
  );
};

export default Live2DWidget; 