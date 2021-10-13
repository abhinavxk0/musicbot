module.exports = {
    name: 'ping',
    async execute(client, command, message, args, Discord){
        message.lineReplyNoMention('ping!')
    }
}