module.exports = {
    name: 'help',
    aliases: ['commands'],
    async execute(client, command, message, args, Discord){
        message.lineReplyNoMention(
            new Discord.MessageEmbed()
                .setColor('RANDOM')
                .setTitle('all available commands for tunes')
                .setDescription('autoplay, jump, loop, pause, play, queue, resume, shuffle, skip, stop, volume')
        )
    }
}