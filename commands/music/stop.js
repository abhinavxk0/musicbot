module.exports = {
    name: 'stop',
    category: "music",
    description: 'stops music',
    async execute(client, command, message, args, Discord) {
        if (!message.member.voice.channel) return message.lineReplyNoMention(
            new Discord.MessageEmbed()
                .setColor('#2f3136')
                .setDescription('You need to be in a voice channel to execute this command!')
        ).then(message => { message.delete({ timeout: 10000 }); })
        if (!message.member.roles.cache.some(role => role.name === 'DJ')) return message.channel.send(
            new Discord.MessageEmbed()
            .setColor('#2f3136')
            .setTitle('Error!')
            .setDescription('You need the `DJ` role to stop playback!')        
        )

        let queue = await client.distube.getQueue(message);
        if (queue) {
            client.distube.stop(message)

            message.channel.send(
                new Discord.MessageEmbed()
                    .setColor('#2f3136')
                    .setDescription('Disconnected!')
            )
        } else if (!queue) {
            return
        };
    }
}

