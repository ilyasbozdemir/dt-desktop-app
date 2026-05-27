import { app, shell, BrowserWindow, ipcMain, dialog } from 'electron'
import { join } from 'path'
import { electronApp, optimizer, is } from '@electron-toolkit/utils'
import { autoUpdater } from 'electron-updater'
import icon from '../../resources/icon.png?asset'
import { workspaceManager } from './db/workspace'
import nodemailer from 'nodemailer'
import fs from 'fs'
import {
  isSupportedFile,
  allFormatsFilter,
  perFormatFilters,
  defaultFormat
} from './config/fileFormats'

function createWindow(): void {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 1280,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    show: false,
    autoHideMenuBar: true,
    frame: false,
    titleBarStyle: 'hidden',
    titleBarOverlay: false,
    icon: icon,
    webPreferences: {
      preload: join(__dirname, '../preload/index.js'),
      sandbox: false
    }
  })

  mainWindow.on('ready-to-show', () => {
    mainWindow.show()
  })

  ipcMain.on('window-minimize', () => {
    mainWindow.minimize()
  })

  ipcMain.on('window-maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize()
    } else {
      mainWindow.maximize()
    }
  })

  ipcMain.on('window-close', () => {
    mainWindow.close()
  })

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url)
    return { action: 'deny' }
  })

  // HMR for renderer base on electron-vite cli.
  // Load the remote URL for development or the local html file for production.
  if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
    mainWindow.loadURL(process.env['ELECTRON_RENDERER_URL'])
  } else {
    mainWindow.loadFile(join(__dirname, '../renderer/index.html'))
  }
}

// Single Instance Lock
const gotTheLock = app.requestSingleInstanceLock()

if (!gotTheLock) {
  app.quit()
} else {
  app.on('second-instance', (_event, commandLine) => {
    const windows = BrowserWindow.getAllWindows()
    if (windows.length > 0) {
      const mainWindow = windows[0]
      if (mainWindow.isMinimized()) mainWindow.restore()
      mainWindow.focus()

      // Eğer desteklenen bir dosya çift tıklandıysa
      const filePath = commandLine.find((arg) => isSupportedFile(arg))
      if (filePath) {
        mainWindow.webContents.send('open-external-file', filePath)
      }
    }
  })

  // This method will be called when Electron has finished
  // initialization and is ready to create browser windows.
  // Some APIs can only be used after this event occurs.
  app.whenReady().then(() => {
    // İlk açılışta desteklenen bir dosyanın çift tıklanarak açılıp açılmadığını kontrol et
    const initialFilePath = process.argv.find((arg) => isSupportedFile(arg)) ?? null
    // Use handle (not handleOnce) so renderer HMR reloads don't cause "No handler" errors.
    // The handler removes itself after the first real call to stay clean.
    const initialFileHandler = (): string | null => {
      ipcMain.removeHandler('get-initial-file')
      ipcMain.handle('get-initial-file', () => null) // subsequent calls always return null
      return initialFilePath
    }
    ipcMain.handle('get-initial-file', initialFileHandler)
    // Set app user model id for windows
    electronApp.setAppUserModelId('com.electron')

    // Default open or close DevTools by F12 in development
    // and ignore CommandOrControl + R in production.
    // see https://github.com/alex8088/electron-toolkit/tree/master/packages/utils
    app.on('browser-window-created', (_, window) => {
      optimizer.watchWindowShortcuts(window)
    })

    // IPC test
    ipcMain.on('ping', () => console.log('pong'))

    // --- Workspace & SQLite Handlers ---
    // --- Workspace & SQLite Handlers ---
    ipcMain.handle('workspace:create', async (_, filePath: string, institutionName: string) => {
      try {
        const meta = workspaceManager.create(filePath, institutionName)
        return { success: true, meta }
      } catch (error: any) {
        console.error('Create workspace error:', error)
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('workspace:open', async (_, filePath: string) => {
      try {
        const meta = workspaceManager.open(filePath)
        return { success: true, meta }
      } catch (error: any) {
        console.error('Open workspace error:', error)
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('workspace:close', async () => {
      try {
        workspaceManager.close()
        return { success: true }
      } catch (error: any) {
        console.error('Close workspace error:', error)
        return { success: false, error: error.message }
      }
    })

    // --- NATIVE DIALOG HANDLERS ---
    ipcMain.handle('dialog:showSaveDialog', async () => {
      const mainWindow = BrowserWindow.getAllWindows()[0]
      const { canceled, filePath } = await dialog.showSaveDialog(mainWindow, {
        title: 'Yeni Veri Dosyası Oluştur',
        defaultPath: `Yeni Dosya.${defaultFormat.ext}`,
        filters: [...perFormatFilters]
      })
      return { canceled, filePath }
    })

    ipcMain.handle('dialog:showOpenDialog', async () => {
      const mainWindow = BrowserWindow.getAllWindows()[0]
      const { canceled, filePaths } = await dialog.showOpenDialog(mainWindow, {
        title: 'Veri Dosyası Seç',
        filters: [allFormatsFilter, ...perFormatFilters],
        properties: ['openFile']
      })
      return { canceled, filePath: filePaths && filePaths.length > 0 ? filePaths[0] : null }
    })

    ipcMain.handle('db:get-settings', async () => {
      try {
        const db = workspaceManager.getDb()
        const rows = db.prepare('SELECT key, value FROM settings').all() as {
          key: string
          value: string
        }[]
        const settingsObj: Record<string, string> = {}
        for (const row of rows) {
          settingsObj[row.key] = row.value
        }

        // Set defaults if keys are missing
        return {
          institutionName: settingsObj.institutionName || 'Bilinmeyen Kurum',
          institutionLogo: settingsObj.institutionLogo || null,
          logoLeft: settingsObj.logoLeft || null,
          logoRight: settingsObj.logoRight || null,
          adminName: settingsObj.adminName || 'Sistem Yöneticisi',
          adminTitle: settingsObj.adminTitle || 'Destek Sorumlusu',
          adminUsername: settingsObj.adminUsername || 'admin',
          institutionCode: settingsObj.institutionCode || '',
          themeLightVars: settingsObj.themeLightVars || '',
          themeDarkVars: settingsObj.themeDarkVars || '',
          ...settingsObj
        }
      } catch {
        // DB henüz açık değil — beklenen durum, sessizce varsayılanları döndür
        return {
          institutionName: null,
          institutionLogo: null,
          logoLeft: null,
          logoRight: null,
          adminName: 'Sistem Yöneticisi',
          adminTitle: 'Destek Sorumlusu',
          adminUsername: 'admin',
          institutionCode: '',
          themeLightVars: '',
          themeDarkVars: ''
        }
      }
    })

    ipcMain.handle('db:check-auth-setup', async () => {
      try {
        const db = workspaceManager.getDb()
        const codeRow = db
          .prepare("SELECT value FROM settings WHERE key = 'institutionCode'")
          .get() as { value: string } | undefined
        const userRow = db
          .prepare("SELECT value FROM settings WHERE key = 'adminUsername'")
          .get() as { value: string } | undefined
        const passRow = db
          .prepare("SELECT value FROM settings WHERE key = 'adminPassword'")
          .get() as { value: string } | undefined

        const hasCode = !!codeRow?.value
        const hasUser = !!userRow?.value
        const hasPass = !!passRow?.value

        return { hasCredentials: hasCode && hasUser && hasPass }
      } catch (error: any) {
        console.error('Check auth setup error:', error)
        return { hasCredentials: false, error: error.message }
      }
    })

    ipcMain.handle('db:setup-auth', async (_, code: string, user: string, pass: string) => {
      try {
        const db = workspaceManager.getDb()
        db.exec(`
          INSERT OR REPLACE INTO settings (key, value) VALUES ('institutionCode', '${code.replace(/'/g, "''")}');
          INSERT OR REPLACE INTO settings (key, value) VALUES ('adminUsername', '${user.replace(/'/g, "''")}');
          INSERT OR REPLACE INTO settings (key, value) VALUES ('adminPassword', '${pass.replace(/'/g, "''")}');
        `)
        workspaceManager.save()
        return { success: true }
      } catch (error: any) {
        console.error('Setup auth error:', error)
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db:login', async (_, code: string, user: string, pass: string) => {
      try {
        const db = workspaceManager.getDb()
        const codeRow = db
          .prepare("SELECT value FROM settings WHERE key = 'institutionCode'")
          .get() as { value: string } | undefined
        const userRow = db
          .prepare("SELECT value FROM settings WHERE key = 'adminUsername'")
          .get() as { value: string } | undefined
        const passRow = db
          .prepare("SELECT value FROM settings WHERE key = 'adminPassword'")
          .get() as { value: string } | undefined

        const expectedCode = codeRow?.value || ''
        const expectedUser = userRow?.value || ''
        const expectedPass = passRow?.value || ''

        if (code === expectedCode && user === expectedUser && pass === expectedPass) {
          return { success: true }
        }
        return { success: false, error: 'Kurum kodu, kullanıcı adı veya şifre hatalı!' }
      } catch (error: any) {
        console.error('Login error:', error)
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db:save-settings', async (_, settingsMap: Record<string, string>) => {
      try {
        const db = workspaceManager.getDb()
        const insertStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)')
        const transaction = db.transaction((settings: Record<string, string>) => {
          for (const [key, value] of Object.entries(settings)) {
            insertStmt.run(key, value)
          }
        })
        transaction(settingsMap)
        workspaceManager.save()
        return { success: true }
      } catch (error: unknown) {
        console.error('Save settings error:', error)
        return { success: false, error: error instanceof Error ? error.message : String(error) }
      }
    })

    let activeRecoveryState: { code: string; expiresAt: number } | null = null

    ipcMain.handle('db:send-recovery-email', async () => {
      try {
        const db = workspaceManager.getDb()
        const hostRow = db.prepare("SELECT value FROM settings WHERE key = 'smtp_host'").get() as
          | { value: string }
          | undefined
        const portRow = db.prepare("SELECT value FROM settings WHERE key = 'smtp_port'").get() as
          | { value: string }
          | undefined
        const userRow = db.prepare("SELECT value FROM settings WHERE key = 'smtp_user'").get() as
          | { value: string }
          | undefined
        const passRow = db.prepare("SELECT value FROM settings WHERE key = 'smtp_pass'").get() as
          | { value: string }
          | undefined
        const secureRow = db
          .prepare("SELECT value FROM settings WHERE key = 'smtp_secure'")
          .get() as { value: string } | undefined
        const emailRow = db
          .prepare("SELECT value FROM settings WHERE key = 'institutionEmail'")
          .get() as { value: string } | undefined

        if (
          !hostRow?.value ||
          !portRow?.value ||
          !userRow?.value ||
          !passRow?.value ||
          !emailRow?.value
        ) {
          return {
            success: false,
            error:
              'SMTP Ayarları veya Kurum E-posta adresi eksik! Lütfen önce ayarlardan yapılandırın.'
          }
        }

        const code = Math.floor(100000 + Math.random() * 900000).toString()
        activeRecoveryState = {
          code,
          expiresAt: Date.now() + 10 * 60 * 1000 // 10 minutes expiry
        }

        const transporter = nodemailer.createTransport({
          host: hostRow.value,
          port: parseInt(portRow.value) || 587,
          secure: secureRow?.value === 'true',
          auth: {
            user: userRow.value,
            pass: passRow.value
          }
        })

        await transporter.sendMail({
          from: `"DT Asistan" <${userRow.value}>`,
          to: emailRow.value,
          subject: 'DT Asistan Şifre Sıfırlama Kodu',
          text: `Kurum dosyası şifre sıfırlama kodunuz: ${code}\nBu kod 10 dakika boyunca geçerlidir.`,
          html: `<div style="font-family: sans-serif; padding: 20px; color: #1e293b;">
            <h2 style="color: #2563eb;">DT Asistan Şifre Sıfırlama</h2>
            <p>Kurum dosyası şifre sıfırlama kodunuz aşağıdadır:</p>
            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; font-size: 24px; font-weight: bold; letter-spacing: 4px; text-align: center; margin: 20px 0; color: #0f172a;">
              ${code}
            </div>
            <p style="font-size: 12px; color: #64748b;">Bu kod 10 dakika boyunca geçerlidir. Eğer bu talebi siz yapmadıysanız lütfen bu e-postayı dikkate almayın.</p>
          </div>`
        })

        return { success: true, email: emailRow.value }
      } catch (error: any) {
        console.error('Send recovery email error:', error)
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db:verify-recovery-code', async (_, enteredCode: string) => {
      try {
        if (!activeRecoveryState) {
          return { success: false, error: 'Sıfırlama talebi bulunamadı!' }
        }
        if (Date.now() > activeRecoveryState.expiresAt) {
          activeRecoveryState = null
          return { success: false, error: 'Sıfırlama kodunun süresi dolmuş!' }
        }
        if (enteredCode.trim() === activeRecoveryState.code) {
          return { success: true }
        }
        return { success: false, error: 'Sıfırlama kodu hatalı!' }
      } catch (error: any) {
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db:export-smtp', async () => {
      try {
        const db = workspaceManager.getDb()
        const keys = [
          'smtp_host',
          'smtp_port',
          'smtp_user',
          'smtp_pass',
          'smtp_secure',
          'institutionEmail'
        ]
        const config: Record<string, string> = {}

        for (const key of keys) {
          const row = db.prepare('SELECT value FROM settings WHERE key = ?').get(key) as
            | { value: string }
            | undefined
          config[key] = row?.value || ''
        }

        const { filePath, canceled } = await dialog.showSaveDialog({
          title: 'SMTP Ayarlarını Dışa Aktar',
          defaultPath: 'smtp_ayarlari.json',
          filters: [{ name: 'JSON Files', extensions: ['json'] }]
        })

        if (canceled || !filePath) return { success: false, error: 'İptal edildi' }

        fs.writeFileSync(filePath, JSON.stringify(config, null, 2), 'utf-8')
        return { success: true }
      } catch (error: any) {
        console.error('Export SMTP error:', error)
        return { success: false, error: error.message }
      }
    })

    ipcMain.handle('db:import-smtp', async () => {
      try {
        const { filePaths, canceled } = await dialog.showOpenDialog({
          title: 'SMTP Ayarlarını İçe Aktar',
          filters: [{ name: 'JSON Files', extensions: ['json'] }],
          properties: ['openFile']
        })

        if (canceled || !filePaths || filePaths.length === 0)
          return { success: false, error: 'İptal edildi' }

        const content = fs.readFileSync(filePaths[0], 'utf-8')
        const config = JSON.parse(content)

        const keys = [
          'smtp_host',
          'smtp_port',
          'smtp_user',
          'smtp_pass',
          'smtp_secure',
          'institutionEmail'
        ]
        const db = workspaceManager.getDb()

        db.transaction(() => {
          for (const key of keys) {
            if (config[key] !== undefined) {
              db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)').run(
                key,
                String(config[key])
              )
            }
          }
        })()

        workspaceManager.save()
        return { success: true }
      } catch (error: any) {
        console.error('Import SMTP error:', error)
        return { success: false, error: error.message }
      }
    })

    // Genel okuma işlemi (SELECT)
    ipcMain.handle('db:query', async (_, sql: string, params: any[] = []) => {
      try {
        const db = workspaceManager.getDb()
        const stmt = db.prepare(sql)
        const rows = stmt.all(...params)
        return { success: true, data: rows }
      } catch (error: any) {
        return { success: false, error: error.message }
      }
    })

    // Genel yazma işlemi (INSERT, UPDATE, DELETE)
    ipcMain.handle('db:run', async (_, sql: string, params: any[] = []) => {
      try {
        const db = workspaceManager.getDb()
        const stmt = db.prepare(sql)
        const info = stmt.run(...params)
        return { success: true, lastInsertRowid: info.lastInsertRowid, changes: info.changes }
      } catch (error: any) {
        return { success: false, error: error.message }
      }
    })

    createWindow()

    // --- Auto Updater Logic ---
    // Uygulama açıldıktan saniyeler sonra güncellemeleri kontrol et (Geliştirme modunda atlar)
    if (!is.dev) {
      autoUpdater.checkForUpdatesAndNotify()
    }

    autoUpdater.on('checking-for-update', () => {
      console.log('Güncellemeler kontrol ediliyor...')
    })

    autoUpdater.on('update-available', (info) => {
      console.log(`Yeni sürüm bulundu! Sürüm: ${info.version}`)
      // İleride buraya: mainWindow.webContents.send('update-available') ekleyeceğiz.
    })

    autoUpdater.on('update-not-available', () => {
      console.log('Güncelleme yok, en güncel sürümdesiniz.')
    })

    autoUpdater.on('update-downloaded', (info) => {
      console.log('Güncelleme başarıyla indirildi. Kurulum için hazır.', info.version)
      // İleride buraya: "Kapatıp Kur" butonu için IPC gönderimi ekleyeceğiz.
      // Şimdilik sadece log atıyoruz, ileride kullanıcı onay verince `autoUpdater.quitAndInstall()` çağrılacak.
    })
    autoUpdater.on('error', (err) => {
      console.error('Güncelleme sırasında hata oluştu:', err)
    })

    app.on('activate', function () {
      // On macOS it's common to re-create a window in the app when the
      // dock icon is clicked and there are no other windows open.
      if (BrowserWindow.getAllWindows().length === 0) createWindow()
    })
  })
}
// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and require them here.
