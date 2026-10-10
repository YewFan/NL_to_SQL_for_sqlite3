import OpenAI, {toFile, toStreamingFile} from 'openai';
import {app, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import fs from 'fs';
import dotenv from 'dotenv' ;
import { fileURLToPath } from 'url';
import sqlite3 from 'sqlite3';
import Database from 'better-sqlite3';


dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const dirpath = path.join(__dirname, 'generated_file')
const hellofilepath = path.join(dirpath, 'hello.txt')
const resultfilepath = path.join(dirpath, 'result.json')
const jsonfilepath = path.join(__dirname, 'products_cls.json')
const jsonlfilepath = path.join(__dirname, 'products_cls.jsonl')
const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, 
});
//ipc-send global variables
let currentdb_path = '';
let currentdata = '';



//API CALLING FUNCTIONS
async function writeFile(_,data){
    const response = await client.responses.create({
    model: 'gpt-5.5',
    instructions: 'You are a coding assistant that writes SQL based on user input.',
    input: "根据fine-tuning,只需要sql语句。"+data,
  
});
    fs.writeFileSync(hellofilepath, response.output_text)
}

async function addjsonlFile(){
    try {
        await client.files.create({
            file: fs.createReadStream(jsonlfilepath),
            purpose: 'fine-tune'
        });
    } catch (error) {
        console.error('Error adding JSON file:', error);
    }
}



//file-relevevant functions
function readFile(){
    let res = ''
    try{
        res = fs.readFileSync(hellofilepath).toString()
    }catch(err){
        if (err.code == 'ENOENT'){
            return 'File no found!'
        }
      
    }
    return res
    
}

function readSQLoperationresult(){
    let res = ''
    try{
        res = fs.readFileSync(resultfilepath).toString()

    }catch(err){
        if (err.code == 'ENOENT'){
            return 'File no found!'
        }
      
    }
    return res
}

function json_to_jsonl(){
    const rawdata = fs.readFileSync(jsonfilepath, 'utf-8');
    const jsonarray = JSON.parse(rawdata);
    if (!Array.isArray(jsonarray)) {
      throw new Error('input top JSON must be an array');
    }
    const jsonlData = jsonarray.map(item => JSON.stringify(item)).join('\n');
    fs.writeFileSync(jsonlfilepath, jsonlData, 'utf-8');
    console.log('JSONL completed');
}



//DB-relevant functions
const execute = async (db, sql) => {
    return new Promise((resolve, reject) => {
       db.exec(sql, (err) => {
        if (err) reject(err);
        resolve();
    });
    });
};

const extract = (db_path) =>{
    const db = new Database(db_path);
    const firstrow = db.prepare('SELECT * FROM products LIMIT 1').get();
    const columns = firstrow ? Object.keys(firstrow) : [];
    const jsonData = JSON.stringify(columns, null, 2);
    fs.writeFileSync(jsonfilepath, jsonData, 'utf-8');
}


function operation_on_DB(db_path, sql){
    const db = new sqlite3.Database(db_path);
    try {
         db.all(sql, [], (err, rows) => {
            if (err) {
                throw err;
            }
            const jsondata = JSON.stringify(rows)
            fs.writeFileSync(resultfilepath, jsondata, 'utf-8');
        });
    } catch (err) {
        console.log(err);
    } finally {
        db.close();
    }
}





//NL_to_SQL
const NL_to_SQL = async (data, db_path) => {
        await extract(db_path);
        await json_to_jsonl();
        await addjsonlFile();
        await writeFile(null, data);
}


//Generated_SQL_Operation
async function Generated_SQL_Operation(db_path){
    const db = new sqlite3.Database(db_path);
    const output_text = async () => {
    return fs.promises.readFile(hellofilepath,'utf-8');
    };

    try {
        const sql = await output_text();
        await operation_on_DB(db_path, sql);
    } catch (err) {
        console.log(err);
    } finally {
        db.close();
    }
}

const show_db_operation = async (db_path) => {
    await Generated_SQL_Operation(db_path)
    return readSQLoperationresult()
} 



//interaction between frontend and backend
function createWindow() {
        const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.resolve(__dirname, './preload.js')
        }
    })
    ipcMain.on('SQL-save', async (event, data) => {
        fs.mkdirSync(dirPath, { recursive: true });
        currentdata = data;
        console.log('Received data from renderer:', currentdata);
    })

   
    ipcMain.on('DB-path', async (event, db_path) => {
        currentdb_path = db_path;
        console.log('Received db path from renderer:', currentdb_path);
    })
    ipcMain.handle('NL-to-SQL', async () => {
        if (!currentdata || !currentdb_path){
            return "require input!"
        }
        else{
            await NL_to_SQL(currentdata, currentdb_path);
            return 'NL_to_SQL completed';
        }

    })
    ipcMain.handle('file-read', readFile)
    ipcMain.handle('show_operation', async() => {
        if(!currentdata || !currentdb_path){
            return "require input!"
        }
        return await show_db_operation(currentdb_path)
    })
    win.loadFile('./pages/index.html')
}

app.on('ready', () => {
    console.log('ready!!!')
createWindow()
app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
        const win = new BrowserWindow
    }
})
})


app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit()
    }
})
