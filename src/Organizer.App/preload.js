const { Titlebar, TitlebarColor } = require('custom-electron-titlebar')

window.addEventListener('DOMContentLoaded', () => {
    const titlebar = new Titlebar({
        backgroundColor: TitlebarColor.fromHex('#000000'),
        shadow: true,
        icon: './assets/engament.png',
        menu: null,
        menuPosition: 'left'
    });
    titlebar.updateTitle('Organizer');
});
