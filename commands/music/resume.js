module.exports = {
    name: 'resume',
    aliases: ['unpause'],
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
            .setDescription('You need the `DJ` role to toggle \`resume\`!')        
        )

        client.distube.resume(message);
        message.react('▶')
    }
}