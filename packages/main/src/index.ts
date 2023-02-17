import { BrowserWindow, app } from 'electron';
import path from 'path';
import rendererURL from './utils/rendererURL';

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.resolve('./preload.js')
        }
    });

    mainWindow.loadURL(rendererURL(__RENDERERS__.APP));
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', function () {
        if (BrowserWindow.getAllWindows().length === 0) createWindow()
    });
})

app.on('window-all-closed', function () {
    if (process.platform !== 'darwin') app.quit()
});
