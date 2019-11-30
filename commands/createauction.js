const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    //return if author is not an admin
    if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send("Insufficient permissions.");

    //check if name is present
    if (args[0]) {
        //add basic values
        let auction = {};
        auction.name = args[0];
        auction.bidders = {};
        
        //create auction json file
        fs.writeFile(`./auction-${auction.name}.json`, JSON.stringify(auction), function () {
            return message.channel.send(`Auction created with name \`${auction.name}\``);
        });
    }
    else {
        return message.channel.send("Provide the name of the auction.");
    }
}

module.exports.help = {
    name: "createauction"
}