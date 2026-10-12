' Runs tools\update-images.cjs and shows what it did.
Set sh = CreateObject("WScript.Shell")
Set fs = CreateObject("Scripting.FileSystemObject")
here = fs.GetParentFolderName(WScript.ScriptFullName)
node = ""
For Each p In Array(sh.ExpandEnvironmentStrings("%ProgramFiles%") & "\nodejs\node.exe", sh.ExpandEnvironmentStrings("%ProgramFiles(x86)%") & "\nodejs\node.exe", sh.ExpandEnvironmentStrings("%LOCALAPPDATA%") & "\Programs\nodejs\node.exe")
  If node = "" And fs.FileExists(p) Then node = p
Next
If node = "" Then
  MsgBox "Node.js isn't installed, so the images can't be updated.", 48, "Update Story Images"
  WScript.Quit
End If
report = sh.ExpandEnvironmentStrings("%TEMP%") & "\dm-update-images.txt"
sh.Run """" & node & """ """ & here & "\update-images.cjs"" """ & report & """", 0, True
text = "Done."
If fs.FileExists(report) Then text = fs.OpenTextFile(report).ReadAll()
MsgBox text, 64, "Update Story Images"
