import React, { useState } from 'react';
import { Terminal as TermIcon, X, Send, ShieldAlert, Cpu } from 'lucide-react';
import { soundSynth } from '../game/audio/SoundSynth';

interface TerminalDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  onRunCommand: (cmd: string) => { success: boolean; message: string; action?: string };
}

export const TerminalDrawer: React.FC<TerminalDrawerProps> = ({
  isOpen,
  onClose,
  onRunCommand,
}) => {
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<Array<{ text: string; isOutput: boolean; success?: boolean }>>([
    { text: 'VX-01 OPERATING SYSTEM // ROOT CONSOLE ENGAGED', isOutput: true, success: true },
    { text: 'Type "help" to display accessible diagnostic commands and override sequences.', isOutput: true },
  ]);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const cmd = input.trim();
    const result = onRunCommand(cmd);
    soundSynth.playUiClick();

    setHistory((prev) => [
      ...prev,
      { text: `> ${cmd}`, isOutput: false },
      { text: result.message, isOutput: true, success: result.success },
    ]);
    setInput('');
  };

  return (
    <div
      id="terminal-drawer-overlay"
      className="absolute inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 font-mono select-none"
    >
      <div className="w-full max-w-2xl bg-[#070907] border-2 border-[#00ff9f]/50 p-5 shadow-[0_0_30px_rgba(0,255,159,0.2)] flex flex-col max-h-[85vh]">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#00ff9f]/30 pb-3 mb-4">
          <div className="flex items-center gap-2 text-[#00ff9f] font-black text-sm tracking-wider">
            <TermIcon className="w-4 h-4 text-[#00ff9f]" />
            <span>KERNEL DIRECT OVERRIDE // SHELL [~]</span>
          </div>
          <button
            id="btn-close-terminal"
            onClick={() => {
              soundSynth.playUiClick();
              onClose();
            }}
            className="text-white/60 hover:text-[#00ff9f] cursor-pointer p-1 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Command Suggestions */}
        <div className="flex flex-wrap gap-2 mb-3 text-[10px]">
          <span className="text-white/40 self-center">QUICK CODES:</span>
          {['help', 'sys.override', 'overclock.unlimit', 'lore.logs', 'secret.colorway'].map((cmd) => (
            <button
              key={cmd}
              type="button"
              onClick={() => {
                setInput(cmd);
                soundSynth.playUiClick();
              }}
              className="px-2 py-0.5 bg-[#0a1a14] hover:bg-[#00ff9f]/20 border border-[#00ff9f]/30 text-[#00ff9f] cursor-pointer transition-colors"
            >
              {cmd}
            </button>
          ))}
        </div>

        {/* Output Feed */}
        <div className="flex-1 bg-black/90 border border-[#00ff9f]/20 p-3 text-xs overflow-y-auto space-y-2 mb-4 max-h-[50vh] text-slate-300 select-text font-mono leading-relaxed">
          {history.map((line, idx) => (
            <div
              key={idx}
              className={
                !line.isOutput
                  ? 'text-[#00ff9f] font-bold'
                  : line.success === true
                  ? 'text-emerald-300'
                  : line.success === false
                  ? 'text-[#ff3e3e]'
                  : 'text-white/80'
              }
            >
              {line.text}
            </div>
          ))}
        </div>

        {/* Command Input Form */}
        <form onSubmit={handleSubmit} className="flex gap-2">
          <div className="flex items-center text-[#00ff9f] font-bold text-sm px-1">&gt;</div>
          <input
            id="terminal-console-input"
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Type command ('help', 'sys.override', etc.)"
            autoFocus
            className="flex-1 bg-black/70 border border-[#00ff9f]/40 px-3 py-2 text-xs text-[#00ff9f] placeholder-[#00ff9f]/30 focus:outline-none focus:border-[#00ff9f] shadow-inner"
          />
          <button
            type="submit"
            className="px-4 py-2 bg-[#00ff9f] hover:bg-[#00ff9f]/80 text-black font-black text-xs tracking-wider flex items-center gap-1 cursor-pointer transition-colors shadow-[0_0_10px_#00ff9f]"
          >
            <Send className="w-3.5 h-3.5" />
            EXEC
          </button>
        </form>
      </div>
    </div>
  );
};
