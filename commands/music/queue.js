const DisTube = require('distube');

module.exports = {
    name: 'queue',
    aliases: ['q'],
    category: "music",
    description: 'shows song queue',
    async execute(client, command, message, args, Discord) {

        let queue = client.distube.getQueue(message);

        if (!queue) return message.channel.send(
            new Discord.MessageEmbed()
                .setColor('#defafe')
                .setDescription('The queue is empty!')
        )

        message.channel.send(
            new Discord.MessageEmbed()
                .setColor('#2f3136')
                .setAuthor('Queue')
                .setDescription(queue.songs.map((song, id) =>
                    `**${id + 1}**. [${song.user}]: ${song.name} - \`${song.formattedDuration}\``
                ).slice(0, 10).join("\n") )
        );
    }
}   
