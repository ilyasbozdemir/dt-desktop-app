import { useEffect } from 'react'
import { Outlet, useRouterState } from '@tanstack/react-router'
import { Sidebar } from './Sidebar'
import { Header } from './Header'
import { Footer } from './Footer'
import { useWorkspaceStore } from '../../store/workspaceStore'
import { useSettingsStore } from '../../store/settingsStore'
import LauncherScreen from '../../screens/launcher/index.screen'
import LockScreen from './LockScreen'
import { useQueryClient } from '@tanstack/react-query'

export function PageWrapper(): React.ReactNode {
  const routerState = useRouterState()

  useEffect(() => {
    const path = routerState.location.pathname
    let title = 'DT Asistan'

    if (path === '/') title += ' — Gösterge Paneli'
    else if (path.startsWith('/dosyalar')) title += ' — Doğrudan Teminler'
    else if (path.startsWith('/firmalar')) title += ' — Firmalar'
    else if (path.startsWith('/personel')) title += ' — Personel'
    else if (path.startsWith('/mevzuat')) title += ' — Mevzuat & Limitler'
    else if (path.startsWith('/ayarlar')) title += ' — Ayarlar'
    else if (path.startsWith('/birimler')) title += ' — Birim Yönetimi'
    else if (path.startsWith('/ambar')) title += ' — Ambar Tanımları'
    else if (path.startsWith('/malzemeler')) title += ' — Malzeme Listesi'
    else if (path.startsWith('/kurum')) title += ' — Kurum Bilgileri'
    else if (path.startsWith('/profil')) title += ' — Kullanıcı Profili'

    document.title = title
  }, [routerState.location.pathname])

  const { activeFilePath, openWorkspace, isAuthenticated, loadActiveMeta } = useWorkspaceStore()
  const { loadSettings } = useSettingsStore()
  const queryClient = useQueryClient()

  useEffect(() => {
    if (activeFilePath && isAuthenticated) {
      loadSettings()
      loadActiveMeta()
    }
  }, [activeFilePath, isAuthenticated, loadSettings, loadActiveMeta])

  useEffect(() => {
    // Initial fetch of DB name if any (in case backend already has an open DB on soft reload)
    window.electron?.ipcRenderer.invoke('db:get-settings').then(async (res) => {
      const dbIsOpen = res && res.institutionName && !res.institutionName.includes('Hata')
      if (!dbIsOpen && activeFilePath) {
        const success = await openWorkspace(activeFilePath)
        if (success) queryClient.clear()
      }
    })

    // Check if app was launched by double clicking a .dtm file
    window.electron?.ipcRenderer.invoke('get-initial-file').then(async (filePath) => {
      if (filePath) {
        const success = await openWorkspace(filePath)
        if (success) queryClient.clear()
      }
    })

    // Listen for files opened while app is already running
    const removeListener = window.electron?.ipcRenderer.on(
      'open-external-file',
      async (_, filePath) => {
        if (filePath) {
          const success = await openWorkspace(filePath)
          if (success) queryClient.clear()
        }
      }
    )

    return () => {
      if (removeListener) removeListener()
    }
  }, [openWorkspace, queryClient])

  if (!activeFilePath) {
    return <LauncherScreen />
  }

  if (!isAuthenticated) {
    return <LockScreen />
  }

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-950 overflow-hidden font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Sidebar />
      <div className="flex flex-col flex-1 min-w-0">
        <Header />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
        <Footer />
      </div>
    </div>
  )
}
