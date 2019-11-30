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

                //format args
                let item = args[1];
                let startBid = Number(args[2]);
                let minIncrease = Number(args[3]);
                let maxBid = Number(args[4]);
                let bidTimer = Number(args[5]);
                
                //check if args are valid
                if (item && !isNaN(startBid) && !isNaN(minIncrease) && !isNaN(maxBid) && !isNaN(bidTimer)) {
                    //define variables keeping track of current bid & bidder
                    let currentBid = startBid;
                    let currentBidder;

                    //post current bid in the channel topic
                    message.channel.setTopic(`Current bid: ${currentBid} by -. Bidding for: ${item}`);

                    //create message collector to track bids
                    const collector = new discord.MessageCollector(message.channel, m => !isNaN(m.content) && Object.keys(auction.bidders).includes(m.author.id));

                    //set auction timer
                    let auctionCountdown = setTimeout(function () {
                        collector.stop();
                        message.channel.send(`${item} was not bought by anyone.`);
                        return message.channel.setTopic("");
                    }, bidTimer);

                    collector.on("collect", async bidMessage => {
                        let bid = Number(bidMessage.content);
                        
                        //check if the bid is valid
                        if (bid >= (currentBid + minIncrease) && auction.bidders[`${bidMessage.author.id}`].money >= bid) {
                            //clear initial auction timer
                            clearTimeout(auctionCountdown);

                            //update bid and bidder
                            currentBid = Number(bidMessage.content);
                            currentBidder = bidMessage.author.id;
                            bidMessage.channel.setTopic(`Current bid: ${currentBid} by ${auction.bidders[`${bidMessage.author.id}`].nickname}. Bidding for: ${item}`);

                            //reset auction timer
                            auctionCountdown = setTimeout(function () {
                                collector.stop();

                                //add sold item to auction sold list
                                auction.sold.push(`${item} bought by ${auction.bidders[`${bidMessage.author.id}`].nickname}`)

                                //remove bidders money, add item to bidder and send confimation message
                                auction.bidders[`${bidMessage.author.id}`].money -= currentBid;
                                auction.bidders[`${bidMessage.author.id}`].items.push(`${item}`);

                                bidMessage.channel.send(`\`${auction.bidders[`${bidMessage.author.id}`].nickname}\` has bought \`${item}\` for \`${currentBid}\` money.`);

                                fs.writeFile(`./auction-${auction.name}.json`, JSON.stringify(auction), function () {
                                    return bidMessage.channel.setTopic("");
                                });
                            }, bidTimer);
                        }
                    });
                }
                else {
                    message.channel.send("Incorrect format.");
                }
            }
        });
    }
    else {
        message.channel.send("Provide the name of the auction.");
    }
}

module.exports.help = {
    name: "startauction"
}