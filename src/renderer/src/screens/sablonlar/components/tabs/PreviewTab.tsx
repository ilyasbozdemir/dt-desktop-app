import React from 'react'
import { Panel, Group as PanelGroup, Separator as PanelResizeHandle } from 'react-resizable-panels'
import { FileText, Database, GripVertical } from 'lucide-react'
import Editor from '@monaco-editor/react'

const ResizeHandle = () => (
  <PanelResizeHandle className="h-2 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors cursor-row-resize group">
    <div className="w-8 h-1 rounded-full bg-slate-300 group-hover:bg-slate-400 transition-colors" />
  </PanelResizeHandle>
)

const VerticalResizeHandle = () => (
  <PanelResizeHandle className="w-2 flex items-center justify-center bg-slate-100 hover:bg-slate-200 dark:bg-slate-800/50 dark:hover:bg-slate-700/50 transition-colors cursor-col-resize group">
    <GripVertical className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
  </PanelResizeHandle>
)

interface PreviewTabProps {
  htmlCode: string
  setHtmlCode: (code: string) => void
  testJson: string
  setTestJson: (json: string) => void
  finalHtmlForPreview: string
}

export function PreviewTab({
  htmlCode,
  setHtmlCode,
  testJson,
  setTestJson,
  finalHtmlForPreview
}: PreviewTabProps) {
  const iframeRef = React.useRef<HTMLIFrameElement>(null)

  return (
    <div className="flex-1 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
      <PanelGroup orientation="horizontal">
        {/* SOL PANEL: HTML VE TEST VERİSİ */}
        <Panel defaultSize={35} minSize={20}>
          <PanelGroup orientation="vertical">
            {/* ÜST SOL PANEL: RAW HTML */}
            <Panel defaultSize={50} minSize={20}>
              <div className="flex flex-col h-full border-r border-b border-slate-200 dark:border-slate-800">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-slate-500" />
                    <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300">Şablon (Ham HTML)</h2>
                  </div>
                </div>
                <div className="flex-1 min-h-0 relative bg-[#1e1e1e]">
                  <Editor
                    height="100%"
                    defaultLanguage="html"
                    theme="vs-dark"
                    value={htmlCode}
                    onChange={(value) => setHtmlCode(value || '')}
                    options={{
                      minimap: { enabled: false },
                      wordWrap: 'on',
                      fontSize: 13,
                      padding: { top: 16 }
                    }}
                  />
                </div>
              </div>
            </Panel>
            
            <ResizeHandle />

            {/* ALT SOL PANEL: TEST JSON */}
            <Panel defaultSize={50} minSize={20}>
              <div className="flex flex-col h-full border-r border-slate-200 dark:border-slate-800">
                <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900 flex items-center justify-between shrink-0">
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4 text-slate-500" />
                    <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300">Test Verisi (JSON)</h2>
                  </div>
                </div>
                <div className="flex-1 min-h-0 relative bg-[#1e1e1e]">
                  <Editor
                    height="100%"
                    defaultLanguage="json"
                    theme="vs-dark"
                    value={testJson}
                    onChange={(value) => setTestJson(value || '')}
                    options={{
                      minimap: { enabled: false },
                      wordWrap: 'on',
                      fontSize: 13,
                      padding: { top: 16 }
                    }}
                  />
                </div>
              </div>
            </Panel>
          </PanelGroup>
        </Panel>

        <VerticalResizeHandle />

        {/* SAĞ PANEL: CANLI ÖNİZLEME */}
        <Panel defaultSize={65} minSize={30}>
          <div className="flex flex-col h-full bg-slate-50 dark:bg-slate-900/50">
            <div className="px-4 py-2 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2 shrink-0">
              <FileText className="w-4 h-4 text-slate-500" />
              <h2 className="text-xs font-bold text-slate-700 dark:text-slate-300">İndirilecek Çıktı Önizleme (Varsayılan: A4)</h2>
            </div>
            <div className="flex-1 min-h-0 overflow-auto bg-slate-200 dark:bg-slate-800 p-8 flex justify-center custom-scrollbar">
              <div className="w-[210mm] min-h-[297mm] bg-white shadow-lg border border-slate-300 relative">
                <iframe
                  ref={iframeRef}
                  title="preview"
                  srcDoc={finalHtmlForPreview}
                  className="w-full h-full border-0 absolute inset-0"
                  sandbox="allow-same-origin allow-scripts"
                />
              </div>
            </div>
          </div>
        </Panel>
      </PanelGroup>
    </div>
  )
}
