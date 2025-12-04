
import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { TaskStatus, TaskPriority, Task, Project } from '../types';
import { Plus, Filter, MoreVertical, Calendar, User as UserIcon, Briefcase, Folder } from 'lucide-react';

export const Tasks: React.FC = () => {
  const { tasks, users, projects, addTask, addProject, updateTaskStatus } = useApp();
  const [selectedProjectId, setSelectedProjectId] = useState<string | 'ALL'>('ALL');
  const [filter, setFilter] = useState<TaskStatus | 'ALL'>('ALL');
  
  const [showAddModal, setShowAddModal] = useState(false);
  const [showProjectModal, setShowProjectModal] = useState(false);

  // New Task State
  const [newTaskTitle, setNewTaskTitle] = useState('');
  const [newTaskDesc, setNewTaskDesc] = useState('');
  const [newTaskAssignee, setNewTaskAssignee] = useState<string>('');
  const [newTaskPriority, setNewTaskPriority] = useState<TaskPriority>(TaskPriority.MEDIUM);
  const [newTaskDueDate, setNewTaskDueDate] = useState('');
  const [newTaskProject, setNewTaskProject] = useState<string>('');

  // New Project State
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDesc, setNewProjectDesc] = useState('');

  // Filtered Tasks
  const filteredTasks = tasks.filter(t => 
    (filter === 'ALL' || t.status === filter) &&
    (selectedProjectId === 'ALL' || t.projectId === selectedProjectId)
  );

  const handleCreateTask = () => {
      if(!newTaskTitle || !newTaskAssignee) return;
      addTask({
          title: newTaskTitle,
          description: newTaskDesc,
          assigneeId: newTaskAssignee,
          creatorId: 'u1', 
          projectId: newTaskProject || undefined,
          status: TaskStatus.TODO,
          priority: newTaskPriority,
          dueDate: newTaskDueDate || new Date(Date.now() + 86400000 * 3).toISOString()
      });
      setShowAddModal(false);
      resetTaskForm();
  };

  const handleCreateProject = () => {
    if(!newProjectName) return;
    addProject({
      name: newProjectName,
      description: newProjectDesc,
      status: 'ACTIVE',
      progress: 0
    });
    setShowProjectModal(false);
    setNewProjectName('');
    setNewProjectDesc('');
  };

  const resetTaskForm = () => {
      setNewTaskTitle('');
      setNewTaskDesc('');
      setNewTaskAssignee('');
      setNewTaskPriority(TaskPriority.MEDIUM);
      setNewTaskDueDate('');
      setNewTaskProject('');
  }

  const getPriorityColor = (p: TaskPriority) => {
      switch(p) {
          case TaskPriority.HIGH: return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300';
          case TaskPriority.MEDIUM: return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300';
          default: return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300';
      }
  };

  const getStatusColor = (s: TaskStatus) => {
      switch(s) {
          case TaskStatus.DONE: return 'border-green-500 text-green-600';
          case TaskStatus.IN_PROGRESS: return 'border-blue-500 text-blue-600';
          case TaskStatus.REVIEW: return 'border-purple-500 text-purple-600';
          default: return 'border-slate-300 text-slate-500';
      }
  };

  return (
    <div className="flex flex-col lg:flex-row h-full gap-6">
      
      {/* Left Sidebar: Projects List */}
      <div className="w-full lg:w-1/4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 p-4 flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg dark:text-white flex items-center gap-2">
            <Folder size={20} className="text-blue-600" />
            Dự án (Sub-projects)
          </h2>
          <button onClick={() => setShowProjectModal(true)} className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg text-blue-600">
            <Plus size={20} />
          </button>
        </div>
        
        <div className="space-y-2 overflow-y-auto flex-1 no-scrollbar max-h-[300px] lg:max-h-none">
           <button
             onClick={() => setSelectedProjectId('ALL')}
             className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors ${selectedProjectId === 'ALL' ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
           >
             Tất cả công việc
           </button>
           {projects.map(p => (
             <button
              key={p.id}
              onClick={() => setSelectedProjectId(p.id)}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm font-medium transition-colors group flex justify-between items-center ${selectedProjectId === p.id ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700'}`}
             >
               <span className="truncate">{p.name}</span>
               {p.progress === 100 && <span className="w-2 h-2 rounded-full bg-green-500"></span>}
             </button>
           ))}
        </div>
      </div>

      {/* Right Content: Task Grid */}
      <div className="flex-1 flex flex-col space-y-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
                <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
                  {selectedProjectId === 'ALL' ? 'Tất cả công việc' : projects.find(p => p.id === selectedProjectId)?.name}
                </h1>
                <p className="text-sm text-slate-500">
                  {selectedProjectId === 'ALL' ? 'Quản lý toàn bộ nhiệm vụ' : projects.find(p => p.id === selectedProjectId)?.description}
                </p>
            </div>
            <button 
                onClick={() => setShowAddModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-2 shadow-lg shadow-blue-600/20 transition-all"
            >
            <Plus size={18} /> Giao việc mới
            </button>
        </div>

        {/* Status Filters */}
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
            {['ALL', 'TODO', 'IN_PROGRESS', 'REVIEW', 'DONE'].map((s) => (
                <button
                    key={s}
                    onClick={() => setFilter(s as any)}
                    className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                        filter === s 
                        ? 'bg-blue-600 text-white shadow-md' 
                        : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-50'
                    }`}
                >
                    {s === 'ALL' ? 'Tất cả' : s}
                </button>
            ))}
        </div>

        {/* Task Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 pb-20">
            {filteredTasks.length > 0 ? filteredTasks.map(task => {
                const assignee = users.find(u => u.id === task.assigneeId);
                const project = projects.find(p => p.id === task.projectId);
                return (
                    <div key={task.id} className="bg-white dark:bg-slate-800 p-5 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-shadow group flex flex-col">
                        <div className="flex justify-between items-start mb-3">
                            <span className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${getPriorityColor(task.priority)}`}>
                                {task.priority}
                            </span>
                            {project && (
                                <span className="text-[10px] text-slate-500 bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded-full truncate max-w-[100px]">
                                    {project.name}
                                </span>
                            )}
                        </div>
                        
                        <h3 className="font-semibold text-slate-900 dark:text-white mb-2 line-clamp-2 flex-1">{task.title}</h3>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mb-4 line-clamp-2">{task.description}</p>
                        
                        <div className="flex items-center gap-2 text-xs text-slate-500 mb-4">
                            <Calendar size={14} />
                            <span>Hạn: {new Date(task.dueDate).toLocaleDateString()}</span>
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-700 mt-auto">
                            <div className="flex items-center gap-2" title={assignee?.name}>
                                {assignee ? (
                                    <img src={assignee.avatar} alt={assignee.name} className="w-6 h-6 rounded-full object-cover" />
                                ) : (
                                    <div className="w-6 h-6 rounded-full bg-slate-200 flex items-center justify-center"><UserIcon size={12}/></div>
                                )}
                                <span className="text-xs text-slate-600 dark:text-slate-300 max-w-[80px] truncate">{assignee?.name || 'Unassigned'}</span>
                            </div>
                            <select 
                                value={task.status}
                                onChange={(e) => updateTaskStatus(task.id, e.target.value as TaskStatus)}
                                className={`text-[10px] font-bold border rounded px-2 py-1 bg-transparent ${getStatusColor(task.status)} outline-none cursor-pointer`}
                            >
                                <option value={TaskStatus.TODO}>TODO</option>
                                <option value={TaskStatus.IN_PROGRESS}>DOING</option>
                                <option value={TaskStatus.REVIEW}>REVIEW</option>
                                <option value={TaskStatus.DONE}>DONE</option>
                            </select>
                        </div>
                    </div>
                );
            }) : (
                <div className="col-span-full py-10 text-center text-slate-400 flex flex-col items-center">
                    <Briefcase size={48} className="mb-2 opacity-50" />
                    <p>Chưa có công việc nào trong danh mục này.</p>
                </div>
            )}
        </div>
      </div>

      {/* Add Task Modal */}
      {showAddModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
              <div className="bg-white dark:bg-slate-800 w-full max-w-lg rounded-2xl p-6 shadow-2xl">
                  <h2 className="text-xl font-bold mb-6 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-4">Giao việc mới</h2>
                  <div className="space-y-4">
                      <div>
                          <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Tiêu đề công việc <span className="text-red-500">*</span></label>
                          <input 
                            type="text" 
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            value={newTaskTitle}
                            onChange={(e) => setNewTaskTitle(e.target.value)}
                          />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Dự án</label>
                            <select 
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTaskProject}
                                onChange={(e) => setNewTaskProject(e.target.value)}
                            >
                                <option value="">-- Không thuộc dự án --</option>
                                {projects.map(p => (
                                    <option key={p.id} value={p.id}>{p.name}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Người thực hiện</label>
                            <select 
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTaskAssignee}
                                onChange={(e) => setNewTaskAssignee(e.target.value)}
                            >
                                <option value="">-- Chọn nhân viên --</option>
                                {users.map(u => (
                                    <option key={u.id} value={u.id}>{u.name}</option>
                                ))}
                            </select>
                        </div>
                      </div>
                      {/* ... other fields like priority/date/desc similar to before ... */}
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Độ ưu tiên</label>
                            <select 
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTaskPriority}
                                onChange={(e) => setNewTaskPriority(e.target.value as TaskPriority)}
                            >
                                <option value={TaskPriority.LOW}>Thấp</option>
                                <option value={TaskPriority.MEDIUM}>Trung bình</option>
                                <option value={TaskPriority.HIGH}>Cao</option>
                            </select>
                        </div>
                         <div>
                            <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Hạn hoàn thành</label>
                            <input 
                                type="date"
                                className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                                value={newTaskDueDate}
                                onChange={(e) => setNewTaskDueDate(e.target.value)}
                            />
                        </div>
                      </div>
                      <div>
                          <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Mô tả chi tiết</label>
                          <textarea 
                            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg dark:bg-slate-700 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                            rows={3}
                            value={newTaskDesc}
                            onChange={(e) => setNewTaskDesc(e.target.value)}
                          />
                      </div>

                      <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-slate-700">
                          <button onClick={() => setShowAddModal(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium">Hủy bỏ</button>
                          <button onClick={handleCreateTask} disabled={!newTaskTitle || !newTaskAssignee} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">Giao việc</button>
                      </div>
                  </div>
              </div>
          </div>
      )}

      {/* Add Project Modal */}
      {showProjectModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
             <div className="bg-white dark:bg-slate-800 w-full max-w-md rounded-2xl p-6 shadow-2xl">
                 <h2 className="text-xl font-bold mb-6 dark:text-white">Tạo dự án mới</h2>
                 <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Tên dự án</label>
                        <input 
                          type="text" 
                          className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                          value={newProjectName}
                          onChange={(e) => setNewProjectName(e.target.value)}
                          placeholder="Nhập tên dự án..."
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1.5 dark:text-slate-300">Mô tả ngắn</label>
                        <textarea 
                          className="w-full px-3 py-2 border rounded-lg dark:bg-slate-700 dark:border-slate-600 dark:text-white outline-none focus:ring-2 focus:ring-blue-500"
                          rows={2}
                          value={newProjectDesc}
                          onChange={(e) => setNewProjectDesc(e.target.value)}
                          placeholder="Mục tiêu của dự án là..."
                        />
                    </div>
                    <div className="flex justify-end gap-3 mt-6 pt-4 border-t dark:border-slate-700">
                        <button onClick={() => setShowProjectModal(false)} className="px-4 py-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg font-medium">Hủy</button>
                        <button onClick={handleCreateProject} disabled={!newProjectName} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium disabled:opacity-50">Tạo dự án</button>
                    </div>
                 </div>
             </div>
        </div>
      )}
    </div>
  );
};
