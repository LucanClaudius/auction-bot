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
                else if (!auction.bidders[`${bidder.id}`]) {
                    return message.channel.send("User not in list of bidders.");
                }
                if (isNaN(args[2])) {
                    return message.channel.send("Please provide a valid amount of money this user receives.")
                }

                //update money
                auction.bidders[`${bidder.id}`].money = args[2];

                //update auction json file with new money count
                fs.writeFile(`./auction-${auction.name}.json`, JSON.stringify(auction), function () {
                    return message.channel.send(`\`${bidder.nickname}\` now has \`${args[2]}\` money.`);
                });
            }
        });
    }
    else {
        return message.channel.send("Provide a name for the auction.");
    }
}

module.exports.help = {
    name: "setmoney"
}