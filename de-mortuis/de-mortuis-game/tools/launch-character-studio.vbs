' Starts the De Mortuis character-studio as a desktop app. Uses Node by its full path,
' because double-clicking from Explorer doesn't always have Node on the PATH.
Set sh = CreateObject("WScript.Shell")
Set fs = CreateObject("Scripting.FileSystemObject")
here = fs.GetParentFolderName(WScript.ScriptFullName)
node = ""
For Each p In Array(sh.ExpandEnvironmentStrings("%ProgramFiles%") & "\nodejs\node.exe", sh.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\nodejs\node.exe", sh.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\Programs\nodejs\node.exe", sh.ExpandEnvironmentStrings("%APPDATA%") & "\nvm\current\node.exe")
  If node = "" And fs.FileExists(p) Then node = p
Next
If node = "" Then
  ' no Node.js found: open the tool in the browser instead (saving then asks for a folder)
  sh.Run """" & here & "\character-studio.html""", 1, False
Else
  sh.Run """" & node & """ """ & here & "\launch.cjs"" char", 0, False
End If
