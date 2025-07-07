import React, { useState, useEffect } from 'react';
import './PersianTaskManager.css';

const PersianTaskManager = () => {
  const [currentView, setCurrentView] = useState('input');
  const [tasks, setTasks] = useState([]);
  const [inputText, setInputText] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  // Load tasks when app starts
  useEffect(() => {
    loadTasks();
  }, []);

  // Save tasks whenever they change
  useEffect(() => {
    if (tasks.length > 0) {
      saveTasks();
    }
  }, [tasks]);

  const loadTasks = () => {
    try {
      const savedTasks = localStorage.getItem('persianTasks');
      if (savedTasks) {
        setTasks(JSON.parse(savedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = () => {
    try {
      localStorage.setItem('persianTasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  const sampleText = `روز  بخیر

۲۴ خرداد
۱۳  جون
🌙 ۶

۱. هر چه می‌خورید قبلش یا در حین خوردنش در دل بگویید: 
" داره میاد، بگیرش ای معده‌ی عزیزم" 

۲. برای خود یک هدیه با لبخند، حداکثر به مبلغ ۱۵۰ هزار تومان بگیرید. برای تشکر از خودتان و یک آفرین و صد آفرین به خودتان.
در گروه کنار عکس هدیه تون، یک آفرین صدآفرین با ایموجی مناسب، برای خود بنویسید.‌

۳. حرکت چرخش دَوَرانی دستها به صورت باز و کشیده را برای هر سمت ۱۵ دَوَران (در هر جهتی که مایلید) به آرامی و با سرعتِ کم، انجام دهید.

۴. فردا صبح به محض هوشیار شدن از خواب، قبل از باز کردن پلک‌هاتان، عبارت قصد شخصی تان را در دل بگویید.‌

🔹  آهان، پس حق با توئه!!!

🔹 میشه به جای جمله‌ی گندیده‌ی حق با منه، بالغانه نظرت را مطرح کنی و تصمیمت را هم بگیری؟ و راهت را بکشی بری دنبال کارات؟`;

  const parsePersianTasks = (text) => {
    setIsProcessing(true);

    try {
      const lines = text.split('\n');
      const parsedTasks = [];

      lines.forEach((line) => {
        const persianNumberMatch = line.match(/^[۱۲۳۴۵۶۷۸۹۰]+\./);
        if (persianNumberMatch) {
          const taskText = line.substring(persianNumberMatch[0].length).trim();
          const today = new Date();
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);

          let taskDate = today.toISOString().split('T')[0];
          if (taskText.includes('فردا')) {
            taskDate = tomorrow.toISOString().split('T')[0];
          }

          parsedTasks.push({
            id: `task_${Date.now()}_${parsedTasks.length}`,
            text: taskText,
            date: taskDate,
            completed: false,
            priority: 'normal'
          });
        }
      });

      setTasks(parsedTasks);
      setCurrentView('daily');
      alert(`موفق! ${parsedTasks.length} کار شناسایی شد`);
    } catch (error) {
      alert('خطا در تجزیه متن');
    }

    setIsProcessing(false);
  };

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const formatDate = (date) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(date).toLocaleDateString('fa-IR', options);
  };

  const getTodayTasks = () => {
    const today = new Date().toISOString().split('T')[0];
    return tasks.filter(task => task.date === today);
  };

  const NavigationBar = () => (
    <div className="navigation-bar">
      <button
        onClick={() => setCurrentView('input')}
        className={`nav-button ${currentView === 'input' ? 'active' : ''}`}
      >
        <span className="nav-icon">➕</span>
        <span className="nav-text">افزودن</span>
      </button>

      <button
        onClick={() => setCurrentView('daily')}
        className={`nav-button ${currentView === 'daily' ? 'active' : ''}`}
      >
        <span className="nav-icon">✓</span>
        <span className="nav-text">امروز</span>
      </button>

      <button
        onClick={() => setCurrentView('stats')}
        className={`nav-button ${currentView === 'stats' ? 'active' : ''}`}
      >
        <span className="nav-icon">📊</span>
        <span className="nav-text">آمار</span>
      </button>
    </div>
  );

  const InputView = () => (
    <div className="container">
      <h1 className="title">متن کارها را وارد کنید</h1>

      <button
        className="sample-button"
        onClick={() => setInputText(sampleText)}
      >
        استفاده از متن نمونه
      </button>

      <textarea
        value={inputText}
        onChange={(e) => setInputText(e.target.value)}
        placeholder="متن کارهای روزانه خود را اینجا بنویسید..."
        className="text-input"
        rows="10"
      />

      <button
        className={`primary-button ${(!inputText.trim() || isProcessing) ? 'disabled' : ''}`}
        onClick={() => parsePersianTasks(inputText)}
        disabled={!inputText.trim() || isProcessing}
      >
        {isProcessing ? (
          <span className="spinner">⏳</span>
        ) : (
          'تجزیه و تحلیل متن'
        )}
      </button>
    </div>
  );

  const DailyView = () => {
    const todayTasks = getTodayTasks();

    return (
      <div className="container">
        <h1 className="title">کارهای امروز</h1>
        <p className="subtitle">{formatDate(new Date())}</p>

        {todayTasks.length === 0 ? (
          <div className="empty-state">
            <span className="empty-icon">📅</span>
            <p className="empty-text">کاری برای امروز تعریف نشده</p>
          </div>
        ) : (
          <div className="tasks-list">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className={`task-card ${task.completed ? 'completed' : ''}`}
                onClick={() => toggleTask(task.id)}
              >
                <span className="task-icon">
                  {task.completed ? '✅' : '⭕'}
                </span>
                <span className="task-text">
                  {task.text}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  const StatsView = () => {
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter(task => task.completed).length;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    return (
      <div className="container">
        <h1 className="title">آمار کلی</h1>

        <div className="stats-grid">
          <div className="stat-card blue">
            <div className="stat-number">{totalTasks}</div>
            <div className="stat-label">کل کارها</div>
          </div>
          <div className="stat-card green">
            <div className="stat-number">{completedTasks}</div>
            <div className="stat-label">انجام شده</div>
          </div>
        </div>

        <div className="progress-card">
          <h2 className="progress-title">درصد پیشرفت</h2>
          <div className="progress-container">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${completionRate}%` }}></div>
            </div>
            <div className="progress-text">{completionRate}%</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="app">
      <div className="content">
        {currentView === 'input' && <InputView />}
        {currentView === 'daily' && <DailyView />}
        {currentView === 'stats' && <StatsView />}
      </div>
      <NavigationBar />
    </div>
  );
};

export default PersianTaskManager;
