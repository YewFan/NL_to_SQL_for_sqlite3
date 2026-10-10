const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('abc',
    {
        version: process.version,
        saveSQL:(data) =>{
            ipcRenderer.send('SQL-save', data)

        },
        saveDBpath:(db_path) =>{
            ipcRenderer.send('DB-path', db_path)
        },
        NL_to_SQL(){
            return ipcRenderer.invoke('NL-to-SQL')
        },
        readFile(){
           return ipcRenderer.invoke('file-read') 
        },
        show_db_operation(){
            return ipcRenderer.invoke('show_operation')
        }
    }
);