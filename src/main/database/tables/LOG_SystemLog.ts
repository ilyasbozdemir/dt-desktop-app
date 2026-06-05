export const LOG_SystemLog = {
  name: 'LOG_SystemLog',
  description: 'Sistem üzerindeki işlem loglarını ve otomatik bildirimleri tutar',
  columns: [
    { name: 'id', type: 'INTEGER', primaryKey: true, autoIncrement: true },
    { name: 'title', type: 'TEXT', notNull: true },
    { name: 'message', type: 'TEXT', notNull: true },
    { name: 'type', type: 'TEXT', notNull: true, default: "'info'" }, // 'info', 'success', 'warning', 'error'
    { name: 'created_at', type: 'DATETIME', default: 'CURRENT_TIMESTAMP' }
  ],
  initialData: []
}
