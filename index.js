const discord = require("discord.js");
const bot = new discord.Client({
    disableEveryone: true
});
bot.commands = new discord.Collection();
bot.background = new discord.Collection();
const fs = require("fs");
const config = require("./config.json");

bot.on("ready", async () => {
    console.log(`We're live!`);
});

//read the commands folder and add commands to discord collection
fs.readdir("./Commands", (err, files) => {
    if (err) console.log(err);

    let jsfile = files.filter(f => f.split(".").pop() === "js");
    if (jsfile.length <= 0) {
        console.log("Couldn't find commands.");
        return;
    }

    jsfile.forEach((f, i) => {
        let props = require(`./Commands/${f}`);
        bot.commands.set(props.help.name, props);

        console.log(`${f} loaded!`);
    })
});

bot.on("message", async message => {
    //return if channel type is not text, dm channels are not text channels
    if (message.channel.type !== "text") return;

    //return if message author is a bot
    if (message.author.bot) return;

    //return if message does not use prefix
    let prefix = config.prefix;
    if (!message.content.startsWith(prefix)) return;

    //split and format message for use in commands
    let messageArray = message.content.split(" ");
    let cmd = messageArray[0].slice(prefix.length);
    let args = messageArray.slice(1);
    
    //find and run requested command
    let commandfile = bot.commands.get(cmd);

    if (commandfile) {
        commandfile.run(bot, message, args);
    }
});

bot.login(config.token);