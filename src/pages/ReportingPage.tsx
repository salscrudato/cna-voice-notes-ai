import React, { memo, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiArrowLeft, FiPlus } from '../utils/icons'
import { ThemeSelector } from '../components/ThemeSelector'
import { useTheme } from '../hooks/useTheme'
import { getAccentColor } from '../utils/accentColors'

interface ActionItem {
  id: string
  title: string
  assignee: string
  dueDate: string
  status: 'pending' | 'in-progress' | 'completed'
  priority: 'low' | 'medium' | 'high'
  source: string
}

const initialActions: ActionItem[] = [
  { id: '1', title: 'Review coverage limits with broker', assignee: 'John Smith', dueDate: '2025-12-15', status: 'pending', priority: 'high', source: 'Call #247' },
  { id: '2', title: 'Update property valuation report', assignee: 'Sarah Johnson', dueDate: '2025-12-18', status: 'in-progress', priority: 'medium', source: 'Call #243' },
  { id: '3', title: 'Schedule follow-up with client', assignee: 'Mike Davis', dueDate: '2025-12-20', status: 'pending', priority: 'low', source: 'Call #241' },
  { id: '4', title: 'Verify deductible requirements', assignee: 'Emily Chen', dueDate: '2025-12-14', status: 'completed', priority: 'high', source: 'Call #239' },
  { id: '5', title: 'Send policy renewal reminder', assignee: 'John Smith', dueDate: '2025-12-22', status: 'pending', priority: 'medium', source: 'Call #235' },
]

const ReportingPageComponent: React.FC = () => {
  const navigate = useNavigate()
  const { accentColor } = useTheme()
  const [actions, setActions] = useState<ActionItem[]>(initialActions)
  const [filter, setFilter] = useState<'all' | 'pending' | 'in-progress' | 'completed'>('all')

  const filteredActions = actions.filter(action => filter === 'all' || action.status === filter)

  const toggleStatus = useCallback((id: string) => {
    setActions(prev => prev.map(action => {
      if (action.id === id) {
        const statusOrder: ActionItem['status'][] = ['pending', 'in-progress', 'completed']
        const currentIndex = statusOrder.indexOf(action.status)
        const nextStatus = statusOrder[(currentIndex + 1) % statusOrder.length]
        return { ...action, status: nextStatus }
      }
      return action
    }))
  }, [])

  const getStatusColor = (status: ActionItem['status']) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'in-progress': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
    }
  }

  const getPriorityColor = (priority: ActionItem['priority']) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'medium': return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      default: return 'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-300'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-white via-white/95 to-slate-50/50 dark:from-slate-950 dark:via-slate-950/95 dark:to-slate-900/50 flex flex-col transition-colors duration-300">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-slate-200/50 dark:border-slate-700/50 bg-white/95 dark:bg-slate-950/95 shadow-sm backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 sm:h-20">
            <button
              onClick={() => navigate('/')}
              className="flex items-center gap-3 group hover:scale-105 transition-all duration-200 focus-visible:ring-2 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950 rounded-lg px-3 py-2 active:scale-95"
              style={{
                '--tw-ring-color': getAccentColor(accentColor, '500')
              } as React.CSSProperties}
              aria-label="EVR home"
              type="button"
            >
              <div className="w-9 h-9 rounded-lg flex items-center justify-center shadow-lg border group-hover:shadow-xl group-hover:scale-110 transition-all duration-200"
                style={{ background: `linear-gradient(135deg, ${getAccentColor(accentColor, '600')}, ${getAccentColor(accentColor, '700')})`, borderColor: `${getAccentColor(accentColor, '500')}4d` }}>
                <span className="text-white font-bold text-sm">E</span>
              </div>
              <span className="font-bold text-base text-slate-900 dark:text-slate-50 group-hover:text-accent-600 dark:group-hover:text-accent-400 transition-colors duration-200">EVR</span>
            </button>
            <ThemeSelector />
          </div>
        </div>
      </header>

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8">
        {/* Back Button & Title */}
        <div className="mb-8">
          <button onClick={() => navigate('/')} className="inline-flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-50 font-medium mb-4 transition-colors">
            <FiArrowLeft className="h-4 w-4" /> Back to Home
          </button>
          <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-slate-50">Action Tracker</h1>
          <p className="text-slate-600 dark:text-slate-400 mt-2">Track action items, follow-ups, and commitments from your conversations.</p>
        </div>

        {/* Filters & Actions */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex gap-2 flex-wrap">
            {(['all', 'pending', 'in-progress', 'completed'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${filter === status
                  ? 'text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
                style={filter === status ? { background: `linear-gradient(135deg, ${getAccentColor(accentColor, '500')}, ${getAccentColor(accentColor, '700')})` } : {}}
              >
                {status.charAt(0).toUpperCase() + status.slice(1).replace('-', ' ')}
              </button>
            ))}
          </div>
          <button
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg text-white font-medium shadow-md hover:shadow-lg transition-all duration-200"
            style={{ background: `linear-gradient(135deg, ${getAccentColor(accentColor, '500')}, ${getAccentColor(accentColor, '700')})` }}
          >
            <FiPlus className="w-4 h-4" /> Add Action
          </button>
        </div>

        {/* Table */}
        <div className="rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 dark:bg-slate-900/50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Action</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Assignee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Due Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Priority</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Status</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Source</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {filteredActions.map((action) => (
                  <tr key={action.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors">
                    <td className="px-4 py-4 text-sm font-medium text-slate-900 dark:text-slate-50">{action.title}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{action.assignee}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 dark:text-slate-300">{action.dueDate}</td>
                    <td className="px-4 py-4"><span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getPriorityColor(action.priority)}`}>{action.priority}</span></td>
                    <td className="px-4 py-4">
                      <button onClick={() => toggleStatus(action.id)} className={`px-2.5 py-1 rounded-full text-xs font-medium cursor-pointer hover:opacity-80 transition-opacity ${getStatusColor(action.status)}`}>
                        {action.status.replace('-', ' ')}
                      </button>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500 dark:text-slate-400">{action.source}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filteredActions.length === 0 && (
            <div className="px-4 py-12 text-center">
              <p className="text-slate-500 dark:text-slate-400">No action items found for this filter.</p>
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-slate-200/50 dark:border-slate-700/50 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">© {new Date().getFullYear()} Marmalade. AI-powered insights for your conversations.</p>
        </div>
      </footer>
    </div>
  )
}

export const ReportingPage = memo(ReportingPageComponent)

