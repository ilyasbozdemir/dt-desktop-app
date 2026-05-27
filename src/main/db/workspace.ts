import AdmZip from 'adm-zip'
import Database from 'better-sqlite3'
import { app } from 'electron'
import fs from 'fs'
import path from 'path'
import { initializeDatabase, schema } from '../database/index'

export interface WorkspaceMeta {
  version: string
  schemaVersion: number
  institutionName: string
  createdAt: string
  updatedAt: string
}

export class DtmWorkspace {
  private tempDir: string
  private db: Database.Database | null = null
  private currentFilePath: string | null = null

  constructor() {
    // Generate a unique temp directory for this workspace session
    this.tempDir = path.join(app.getPath('userData'), 'dtm_temp', Date.now().toString())
  }

  /**
   * Opens an existing .dtm file, extracts it to the temp directory, and connects to the database.
   */
  public openWorkspace(filePath: string): WorkspaceMeta {
    this.currentFilePath = filePath
    this.ensureTempDir()

    // 1. Extract the .dtm zip file
    const zip = new AdmZip(filePath)
    zip.extractAllTo(this.tempDir, true)

    // 2. Connect to the SQLite database
    const dbPath = path.join(this.tempDir, 'database.sqlite')
    this.db = new Database(dbPath)

    // 3. Read metadata
    const metaPath = path.join(this.tempDir, 'meta.json')
    if (fs.existsSync(metaPath)) {
      const rawMeta = fs.readFileSync(metaPath, 'utf-8')
      return JSON.parse(rawMeta) as WorkspaceMeta
    }

    throw new Error('Geçersiz dosya: meta.json bulunamadı.')
  }

  /**
   * Creates a brand new .dtm workspace
   */
  public createWorkspace(filePath: string, institutionName: string): WorkspaceMeta {
    this.currentFilePath = filePath
    this.ensureTempDir()

    // 1. Create a new SQLite database
    const dbPath = path.join(this.tempDir, 'database.sqlite')
    this.db = new Database(dbPath)

    // Initialize Schema using our new centralized index.ts logic
    initializeDatabase(this.db, institutionName)

    // 2. Create metadata
    const meta: WorkspaceMeta = {
      version: schema.version,
      schemaVersion: 1,
      institutionName,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    const metaPath = path.join(this.tempDir, 'meta.json')
    fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2))

    // 3. Create attachments folder
    fs.mkdirSync(path.join(this.tempDir, 'attachments'))

    // 4. Save to the actual .dtm file
    this.saveWorkspace()

    return meta
  }

  /**
   * Packages the temp directory back into the .dtm file.
   */
  public saveWorkspace(): void {
    if (!this.currentFilePath || !this.db) {
      throw new Error('Hiçbir veri dosyası açık değil.')
    }

    // Close db before zipping, or wait, if we are saving while open we can force a checkpoint
    // Actually, it's safer to just zip it. better-sqlite3 uses synchronous file writes.
    // If WAL mode is used, we might need to checkpoint. For now, assume journal mode or force checkpoint.
    this.db.pragma('wal_checkpoint(TRUNCATE)')

    // Update updated_at in meta
    const metaPath = path.join(this.tempDir, 'meta.json')
    if (fs.existsSync(metaPath)) {
      const meta = JSON.parse(fs.readFileSync(metaPath, 'utf-8')) as WorkspaceMeta
      meta.updatedAt = new Date().toISOString()
      fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2))
    }

    const zip = new AdmZip()
    zip.addLocalFolder(this.tempDir)
    zip.writeZip(this.currentFilePath)
  }

  /**
   * Closes the workspace and cleans up the temp directory.
   */
  public closeWorkspace(): void {
    if (this.db) {
      this.db.close()
      this.db = null
    }
    this.currentFilePath = null

    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true, force: true })
    }
  }

  public getDb(): Database.Database {
    if (!this.db) throw new Error('Veritabanı bağlı değil.')
    return this.db
  }

  private ensureTempDir() {
    if (fs.existsSync(this.tempDir)) {
      fs.rmSync(this.tempDir, { recursive: true, force: true })
    }
    fs.mkdirSync(this.tempDir, { recursive: true })
  }
}

// Global active workspace manager
let activeWorkspace: DtmWorkspace | null = null

export const workspaceManager = {
  create: (filePath: string, institutionName: string) => {
    if (activeWorkspace) activeWorkspace.closeWorkspace()
    activeWorkspace = new DtmWorkspace()
    return activeWorkspace.createWorkspace(filePath, institutionName)
  },
  open: (filePath: string) => {
    if (activeWorkspace) activeWorkspace.closeWorkspace()
    activeWorkspace = new DtmWorkspace()
    return activeWorkspace.openWorkspace(filePath)
  },
  save: () => {
    if (activeWorkspace) activeWorkspace.saveWorkspace()
  },
  close: () => {
    if (activeWorkspace) {
      activeWorkspace.closeWorkspace()
      activeWorkspace = null
    }
  },
  getDb: () => {
    if (!activeWorkspace) throw new Error('Açık bir veri dosyası yok.')
    return activeWorkspace.getDb()
  }
}
