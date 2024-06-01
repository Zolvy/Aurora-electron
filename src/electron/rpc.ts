import { AutoClient } from 'discord-auto-rpc';
import { clientid } from './index.json';


const client = new AutoClient({ transport: 'ipc' });

const setActivity = () => {
  client.setActivity({
    details: 'Aurora',
    state: 'Listening to',
    startTimestamp: new Date(),
    largeImageKey: 'aruora',
    buttons: [
      { label: 'Github', url: 'https://github.com/Zolvy/Aurora' },
    ],
  });
};

client.once('ready', () => {
  setActivity();
  setInterval(setActivity, 99999);
});

client.endlessLogin({ clientId: clientid });

console.log('Rpc Loaded with Client ID:', clientid);