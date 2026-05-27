!macro customInstall
  ; --- 1. Uzantı -> ProgID Bağlantısı (HKCU ile güvenli, UAC'ye takılmaz) ---
  WriteRegStr HKCU "Software\Classes\.dtm" "" "DTAsistan.Document"
  WriteRegStr HKCU "Software\Classes\.dtm" "Content Type" "application/x-dtm"

  ; --- 2. Sağ Tık -> Yeni Menüsü ---
  WriteRegStr HKCU "Software\Classes\.dtm\ShellNew" "NullFile" ""
  WriteRegStr HKCU "Software\Classes\.dtm\ShellNew" "ItemName" "Doğrudan Temin Dosyası"
  WriteRegStr HKCU "Software\Classes\.dtm\ShellNew" "IconPath" '"$INSTDIR\DTAsistan.exe",0'

  ; --- 3. ProgID Tanımı ve Açma Komutu ---
  WriteRegStr HKCU "Software\Classes\DTAsistan.Document" "" "DT Asistan Veri Dosyası"
  WriteRegStr HKCU "Software\Classes\DTAsistan.Document\DefaultIcon" "" '"$INSTDIR\DTAsistan.exe",0'
  WriteRegStr HKCU "Software\Classes\DTAsistan.Document\shell\open\command" "" '"$INSTDIR\DTAsistan.exe" "%1"'

  ; --- Windows Explorer'ı yenile (hemen görünsün) ---
  System::Call 'Shell32::SHChangeNotify(i 0x8000000, i 0, i 0, i 0)'
!macroend

!macro customUnInstall
  DeleteRegKey HKCU "Software\Classes\.dtm"
  DeleteRegKey HKCU "Software\Classes\DTAsistan.Document"
  System::Call 'Shell32::SHChangeNotify(i 0x8000000, i 0, i 0, i 0)'
!macroend
