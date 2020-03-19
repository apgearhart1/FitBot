const PERMISSIONS = require('./permissions.json');
const cheerio = require('cheerio');
const request = require('request');
const Discord = require('discord.js');
const randompuppy = require('random-puppy');
const client = new Discord.Client();
const token = PERMISSIONS['permissions'];
const youtubeAPI = PERMISSIONS['YouTube-API'];
const nodefetch = require('node-fetch');
const search = require('youtube-search');
const PREFIX = '!';
const options = {
    key: youtubeAPI,
    type: 'video',
    videoDuration: 'medium',
    maxResults: 1
}
client.login(token);



client.on('ready', ()=> {
    console.log("This bot is online");
});

client.on("message", msg => {
    
    let args = msg.content.substring(PREFIX.length).split(" ");
    
    
    const embed = new Discord.MessageEmbed();
    const exercises = ["High Knees", "Mountain Climbers", "Push-ups", "Jumping Jacks", "Squats", "Pull-ups", "Burpees", "Lunges", "Jump Squats", "Jump Lunges", "Calf Raises", "Flutter Kicks", "Bicycles", "Wall Sits", "Plank"];
    const ytSearch = ['motivational videos', 'get things done', 'movie workout montages', 'motivational movie scenes', 'motivational speeches'];

    
    switch(args[0]){
        case 'minute':
            var ex = exercises[Math.floor(Math.random() * exercises.length)];
                
            embed.setTitle("WHAT's UP BROTHEERR")
            .setColor(0xf82033)
            .addField("For the next 60 seconds...", "You will do " + ex, true);
            msg.reply(embed);
            setTimeout(function(){ 
                msg.reply("DONE");
            }, 60000);

            
            break;

        case 'motivation':
            msg.channel.startTyping();
            const subreddits = ["GetMotivated", "GetDisciplined", "DecidingToBeBetter", "motivation", "inspiration", "motivateme", "fitness", "NoFap"];
            var rand = subreddits[Math.floor(Math.random() * subreddits.length)];
            randompuppy(rand).then(url => {
                nodefetch(url).then(async res =>{
                    await msg.channel.send("From /r/" + rand + '\n', {
                        files: [{
                            attachment: res.body,
                            name: 'mot.png'
                        }]
                    }).then(() => msg.channel.stopTyping());
                }).catch(err => console.error(err));
            }).catch(err => console.error(err));
            break;
        
        case 'search':
            async function searching() {
                let filter = m => m.author.id === msg.author.id;
                let col =  msg.channel.createMessageCollector(filter, {max:1});
                let query = ytSearch[Math.floor(Math.random() * ytSearch.length)];
                let res = await search(query, options).catch(err => console.log(err));
                if(res){
                    let youtubeResult = res.results[0];

                    embed.setTitle(`${youtubeResult.title}`)
                    .setColor(0xa83246)
                    .setURL(`${youtubeResult.link}`)
                    .setThumbnail(`${youtubeResult.thumbnails.default.url}`);
                    msg.channel.send(embed);
                }
            }
            searching();

            
            break;

        case 'help':
            msg.reply("**COMMANDS FOR FITBOT**\n1) *!minute* - get a random exercise to do for a minute\n2) *!motivation* - get a motivational quote\n3) *!search* - get a random video");

            break;

    }
})

function Image(msg){
    var options = {
        url: "http://results.dogpile.com/serp?qc=images&q=" + 'hulk hogan',
        method: "GET",
        headers: {
            'Accept': 'text/html',
            'User-Agent': 'Chrome'
        }
    };
    request(options, function(error, response, responseBody){
        if(error){
            return;
        }
        $ = cheerio.load(responseBody);
        var links = $(".image a.link");
        var urls = new Array(links.length).fill(0).map((v,i) => links.eq(i).attr("href"));
        console.log(urls);
        if(urls.length == 0){
            return;
        }


        
        msg.channel.send(urls[Math.floor(Math.random() * urls.length)]);

    });

}

