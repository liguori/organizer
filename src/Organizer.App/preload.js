const path = require('path')
window.addEventListener('load', (event) => {
    const customTitlebar = require('custom-electron-titlebar');
    let MyTitleBar = new customTitlebar.Titlebar({
        backgroundColor: customTitlebar.Color.fromHex('#000000'),
        shadow: true,
        icon: './assets/engament.png',
        menu: null
    });
    MyTitleBar.updateTitle('Organizer');
    MyTitleBar.setHorizontalAlignment('left');
});
