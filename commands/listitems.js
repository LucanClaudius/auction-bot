const discord = require("discord.js");
const fs = require("fs");

module.exports.run = async (bot, message, args) => {
    //return if author is not an admin
    if (!message.member.permissions.has('ADMINISTRATOR')) return message.channel.send("Insufficient permissions.");

    if (args[0]) {
        //load action json file, return error if not found
        fs.readFile(`./auction-${args[0]}.json`, function(err, data) {
            if (err) {
                return message.channel.send(`No auction found with name \`${args[0]}\``);
            }
            else if (data) {
                let auction = JSON.parse(data);

                //check if args are valid
                let bidder = message.guild.member(message.mentions.users.first());
                if (!bidder) {
                    return message.channel.send("User not found.");
                }

                return message.channel.send(`**${auction.bidders[bidder.id].nickname} has bought the following items:**\n${auction.bidders[bidder.id].items.join("\n")}`);
            }
        });
    }
    else {
        return message.channel.send("Provide a name for the auction.");
    }
}

module.exports.help = {
    name: "listitems"
}