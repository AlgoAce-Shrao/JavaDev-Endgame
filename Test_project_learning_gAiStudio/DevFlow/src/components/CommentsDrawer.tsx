import React, { useState } from 'react';
import { Comment, Task, User, Role } from '../types/devflow';
import { MessageSquare, Send, Trash2, X, User as UserIcon } from 'lucide-react';

interface CommentsDrawerProps {
  task: Task | null;
  comments: Comment[];
  currentUser: User;
  onClose: () => void;
  onAddComment: (taskId: number, content: string) => void;
  onDeleteComment: (commentId: number) => void;
}

export const CommentsDrawer: React.FC<CommentsDrawerProps> = ({
  task,
  comments,
  currentUser,
  onClose,
  onAddComment,
  onDeleteComment
}) => {
  const [newCommentText, setNewCommentText] = useState('');

  if (!task) return null;

  const taskComments = comments.filter((c) => c.taskId === task.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;
    onAddComment(task.id, newCommentText.trim());
    setNewCommentText('');
  };

  const getRoleBadge = (role: Role) => {
    switch (role) {
      case 'ADMIN':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300';
      case 'MANAGER':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300';
      case 'DEVELOPER':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300';
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex justify-end">
      <div className="bg-white dark:bg-slate-900 w-full max-w-md h-full shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col animate-in slide-in-from-right duration-200">
        {/* Header */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            <div>
              <h3 className="font-bold text-sm text-slate-900 dark:text-slate-100">
                Task Discussion
              </h3>
              <p className="text-xs text-slate-500 line-clamp-1 max-w-[260px]">
                {task.title}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Comment List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {taskComments.length === 0 ? (
            <div className="text-center py-12 text-slate-400 text-xs italic">
              No comments on this task yet. Start the conversation!
            </div>
          ) : (
            taskComments.map((comment) => (
              <div
                key={comment.id}
                className="bg-slate-50 dark:bg-slate-800/80 rounded-xl p-3 border border-slate-200/80 dark:border-slate-700/80 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img
                      src={comment.author.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
                      alt={comment.author.name}
                      className="w-5 h-5 rounded-full object-cover"
                    />
                    <span className="font-bold text-slate-900 dark:text-slate-100">
                      {comment.author.name}
                    </span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.2 rounded uppercase ${getRoleBadge(comment.author.role)}`}>
                      {comment.author.role}
                    </span>
                  </div>

                  {comment.author.id === currentUser.id && (
                    <button
                      onClick={() => onDeleteComment(comment.id)}
                      className="text-slate-400 hover:text-rose-500 transition-colors p-1"
                      title="Delete comment"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-normal">
                  {comment.content}
                </p>

                <div className="text-[10px] text-slate-400 text-right">
                  {new Date(comment.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* New Comment Input Form */}
        <form onSubmit={handleSubmit} className="p-3 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 flex gap-2">
          <input
            type="text"
            placeholder="Write a comment..."
            value={newCommentText}
            onChange={(e) => setNewCommentText(e.target.value)}
            className="flex-1 bg-white dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl px-3 py-2 text-xs text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
          <button
            type="submit"
            disabled={!newCommentText.trim()}
            className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all flex items-center justify-center"
          >
            <Send className="w-3.5 h-3.5" />
          </button>
        </form>
      </div>
    </div>
  );
};
