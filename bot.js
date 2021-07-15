const Discord = require('discord.js');
const client = new Discord.Client();
const fetch = require('node-fetch')
require('dotenv').config();
const settings = {
    prefix: "&",
    token: process.env.TOKEN
};

const { Player } = require("discord-player");

// Create a new Player (you don't need any API Key)
const player = new Player(client);

// To easily access the player
client.player = player;

const channel = client.channels.cache.get('<id>');

client.on('ready', () => {
	console.log(`Logged in as ${client.user.tag}!`);
});

// add the trackStart event so when a song will be played this message will be sent
client.player.on("trackStart", (message, track) => message.channel.send(`Now playing ${track.title}...`))


client.on('interactionCreate', async interaction => {
	if (!interaction.isCommand()) return;
	if (interaction.commandName === 'ping') {
		await interaction.reply('Pong!😂');
	}
});
client.on("message", async (message) => {
    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    // const browser = await puppeteer.launch();
    // let page = await browser.newPage();
    // await page.goto('https://www.youtube.com/results?search_query=despacito', {'waitUntil':'networkidle0'});
    // //await waitTillHTMLRendered(page)
    // //await page.waitForSelector("#contents")
    // const newPage = await page.evaluate(() => {
    //     return  document.getElementById("contents").innerHTML;
    // });

    //console.log(newPage)
    if(command === "play" || command === "p"){
        if (validURL(args[0])){
            client.player.play(message, args[0]);
        }else{
            message.reply('❌Invalid url')
        }

        
    }
    if(command === "skip" || command === "s"){
        player.skip(message)
    }
    if (command === "meme" || command === "m"){
        let nrOfMemes = args[0] || 1; 
        let url = `https://meme-api.herokuapp.com/gimme/${nrOfMemes}`
        const res = await fetch(url)
        const data = await res.json()
        data.memes.forEach(async meme=>{
            message.channel.send(meme.url)
        })
        
    }

});

function validURL(str) {
  var pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
    '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ // domain name
    '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
    '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
    '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
    '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
  return !!pattern.test(str);
}
const waitTillHTMLRendered = async (page, timeout = 30000) => {
  const checkDurationMsecs = 1000;
  const maxChecks = timeout / checkDurationMsecs;
  let lastHTMLSize = 0;
  let checkCounts = 1;
  let countStableSizeIterations = 0;
  const minStableSizeIterations = 3;

  while(checkCounts++ <= maxChecks){
    let html = await page.content();
    let currentHTMLSize = html.length; 

    let bodyHTMLSize = await page.evaluate(() => document.body.innerHTML.length);

    console.log('last: ', lastHTMLSize, ' <> curr: ', currentHTMLSize, " body html size: ", bodyHTMLSize);

    if(lastHTMLSize != 0 && currentHTMLSize == lastHTMLSize) 
      countStableSizeIterations++;
    else 
      countStableSizeIterations = 0; //reset the counter

    if(countStableSizeIterations >= minStableSizeIterations) {
      console.log("Page rendered fully..");
      break;
    }

    lastHTMLSize = currentHTMLSize;
    await page.waitFor(checkDurationMsecs);
  }  
};

client.login(settings.token);