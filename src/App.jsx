import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { setTheme, setUser } from './store/slices/appSlice'
import { supabase } from './lib/supabase'

function App() {
  const [session, setSession] = useState(null)
  const theme = useSelector((state) => state.app.theme)
  const dispatch = useDispatch()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  return (
    <div className={`min-h-screen flex items-center justify-center p-4 ${theme === 'dark' ? 'bg-gray-900 text-white' : 'bg-slate-50 text-gray-900'}`}>
      <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden backdrop-blur-sm bg-white/70">
        <div className="p-8">
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-6 text-center">
            React App Setup
          </h1>
          
          <div className="space-y-6">
            <div className="p-4 bg-blue-50/50 rounded-xl border border-blue-100">
              <h2 className="text-xl font-semibold text-blue-800 mb-2">Supabase Status</h2>
              <p className="text-sm text-gray-600">
                {session ? '✅ Logged In' : 'Logged Out (Ready)'}
              </p>
            </div>

            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100">
              <h2 className="text-xl font-semibold text-purple-800 mb-2">Redux Toolkit Status</h2>
              <p className="text-sm text-gray-600 mb-3">Current Theme: <span className="font-bold uppercase">{theme}</span></p>
              <button 
                onClick={() => dispatch(setTheme(theme === 'light' ? 'dark' : 'light'))}
                className="w-full py-2.5 px-4 bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-600 hover:to-indigo-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-[1.02] active:scale-[0.98] shadow-md"
              >
                Toggle Theme
              </button>
            </div>
            
            <div className="p-4 bg-green-50/50 rounded-xl border border-green-100">
              <h2 className="text-xl font-semibold text-green-800 mb-2">Tailwind CSS v4 Status</h2>
              <p className="text-sm text-gray-600">
                ✅ Utility classes are working
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
