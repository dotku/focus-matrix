import React, { useState, useEffect } from 'react';
import { PlusCircle, Trash2, Languages, Edit2 } from 'lucide-react';

interface Task {
  id: string;
  text: string;
  quadrant: 'q1' | 'q2' | 'q3' | 'q4';
}

type Language = 'en' | 'zh';

const translations = {
  en: {
    title: 'Focus Matrix',
    subtitle: 'Prioritize your tasks using the Eisenhower Matrix method',
    addTask: 'Add Task',
    addTaskPlaceholder: 'Add a new task...',
    edit: 'Edit',
    save: 'Save',
    cancel: 'Cancel',
    quadrants: {
      q1: {
        title: 'Do First',
        description: 'Urgent and important tasks that require immediate attention'
      },
      q2: {
        title: 'Schedule',
        description: 'Important but not urgent tasks to plan for later'
      },
      q3: {
        title: 'Delegate',
        description: 'Urgent but not important tasks that can be delegated'
      },
      q4: {
        title: "Don't Do",
        description: 'Neither urgent nor important tasks to eliminate'
      }
    },
    options: {
      q1: 'Urgent & Important',
      q2: 'Important, Not Urgent',
      q3: 'Urgent, Not Important',
      q4: 'Not Urgent or Important'
    }
  },
  zh: {
    title: '专注矩阵',
    subtitle: '使用艾森豪威尔矩阵方法安排任务优先级',
    addTask: '添加任务',
    addTaskPlaceholder: '添加新任务...',
    edit: '编辑',
    save: '保存',
    cancel: '取消',
    quadrants: {
      q1: {
        title: '立即执行',
        description: '紧急且重要的任务，需要立即处理'
      },
      q2: {
        title: '计划安排',
        description: '重要但不紧急的任务，需要规划时间'
      },
      q3: {
        title: '委托他人',
        description: '紧急但不重要的任务，可以委托他人'
      },
      q4: {
        title: '删减任务',
        description: '既不紧急也不重要的任务，考虑删减'
      }
    },
    options: {
      q1: '紧急且重要',
      q2: '重要不紧急',
      q3: '紧急不重要',
      q4: '不紧急不重要'
    }
  }
};

interface TaskItemProps {
  task: Task;
  onDelete: (id: string) => void;
  onUpdate: (id: string, quadrant: Task['quadrant']) => void;
  t: typeof translations['en'] | typeof translations['zh'];
}

function TaskItem({ task, onDelete, onUpdate, t }: TaskItemProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editQuadrant, setEditQuadrant] = useState(task.quadrant);

  const handleSave = () => {
    onUpdate(task.id, editQuadrant);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditQuadrant(task.quadrant);
    setIsEditing(false);
  };

  return (
    <li className="flex items-center justify-between bg-gray-50 p-2 rounded group">
      <span className="flex-1">{task.text}</span>
      <div className="flex items-center gap-2">
        {isEditing ? (
          <>
            <select
              value={editQuadrant}
              onChange={(e) => setEditQuadrant(e.target.value as Task['quadrant'])}
              className="p-1 text-sm border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="q1">{t.options.q1}</option>
              <option value="q2">{t.options.q2}</option>
              <option value="q3">{t.options.q3}</option>
              <option value="q4">{t.options.q4}</option>
            </select>
            <button
              onClick={handleSave}
              className="text-green-500 hover:text-green-700 px-2 py-1 text-sm"
            >
              {t.save}
            </button>
            <button
              onClick={handleCancel}
              className="text-gray-500 hover:text-gray-700 px-2 py-1 text-sm"
            >
              {t.cancel}
            </button>
          </>
        ) : (
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 hover:text-blue-700 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <Edit2 size={18} />
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Trash2 size={18} />
        </button>
      </div>
    </li>
  );
}

function App() {
  const [tasks, setTasks] = useState<Task[]>(() => {
    const saved = localStorage.getItem('focusMatrixTasks');
    return saved ? JSON.parse(saved) : [];
  });
  const [newTask, setNewTask] = useState('');
  const [activeQuadrant, setActiveQuadrant] = useState<Task['quadrant']>('q2'); // Changed from 'q1' to 'q2'
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('focusMatrixLanguage');
    return (saved as Language) || 'en';
  });

  useEffect(() => {
    localStorage.setItem('focusMatrixTasks', JSON.stringify(tasks));
  }, [tasks]);

  useEffect(() => {
    localStorage.setItem('focusMatrixLanguage', language);
  }, [language]);

  const t = translations[language];

  const addTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTask.trim()) return;

    const task: Task = {
      id: crypto.randomUUID(),
      text: newTask,
      quadrant: activeQuadrant,
    };

    setTasks([...tasks, task]);
    setNewTask('');
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const updateTask = (id: string, quadrant: Task['quadrant']) => {
    setTasks(tasks.map(task =>
      task.id === id ? { ...task, quadrant } : task
    ));
  };

  const getQuadrantTasks = (quadrant: Task['quadrant']) => {
    return tasks.filter(task => task.quadrant === quadrant);
  };

  const toggleLanguage = () => {
    setLanguage(current => current === 'en' ? 'zh' : 'en');
  };

  const QuadrantSection = ({ quadrant }: { quadrant: Task['quadrant'] }) => {
    const quadrantTasks = getQuadrantTasks(quadrant);

    return (
      <div className="bg-white rounded-lg p-4 shadow-md">
        <h2 className="text-xl font-bold mb-2">{t.quadrants[quadrant].title}</h2>
        <p className="text-sm text-gray-600 mb-4">{t.quadrants[quadrant].description}</p>
        <ul className="space-y-2 min-h-[100px]">
          {quadrantTasks.map(task => (
            <TaskItem
              key={task.id}
              task={task}
              onDelete={deleteTask}
              onUpdate={updateTask}
              t={t}
            />
          ))}
        </ul>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2">{t.title}</h1>
            <p className="text-gray-600">{t.subtitle}</p>
          </div>
          <button
            onClick={toggleLanguage}
            className="flex items-center gap-2 px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <Languages size={20} />
            {language === 'en' ? '中文' : 'English'}
          </button>
        </div>

        <form onSubmit={addTask} className="mb-8 bg-white p-4 rounded-lg shadow-md">
          <div className="flex gap-4">
            <input
              type="text"
              value={newTask}
              onChange={(e) => setNewTask(e.target.value)}
              placeholder={t.addTaskPlaceholder}
              className="flex-1 p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={activeQuadrant}
              onChange={(e) => setActiveQuadrant(e.target.value as Task['quadrant'])}
              className="p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="q1">{t.options.q1}</option>
              <option value="q2">{t.options.q2}</option>
              <option value="q3">{t.options.q3}</option>
              <option value="q4">{t.options.q4}</option>
            </select>
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center gap-2"
            >
              <PlusCircle size={20} />
              {t.addTask}
            </button>
          </div>
        </form>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <QuadrantSection quadrant="q1" />
          <QuadrantSection quadrant="q2" />
          <QuadrantSection quadrant="q3" />
          <QuadrantSection quadrant="q4" />
        </div>
      </div>
    </div>
  );
}

export default App;