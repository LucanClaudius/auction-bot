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

                //remove bidder from list
                delete auction.bidders[`${bidder.id}`];

                //update auction json file without bidder
                fs.writeFile(`./auction-${auction.name}.json`, JSON.stringify(auction), function () {
                    return message.channel.send(`User \`${bidder.nickname}\` was removed from the bidder list.`);
                });
            }
        });
    }
    else {
        message.channel.send("Provide the name of the auction.");
    }
}

module.exports.help = {
    name: "removebidder"
}