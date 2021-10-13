const Discord = require('discord.js');
require('discord-reply');
const client = new Discord.Client();
const fs = require('fs');
const Distube = require('distube');
const prefix = '.';
require('dotenv').config();


client.cooldowns = new Discord.Collection();
client.commands = new Discord.Collection();
client.distube = new Distube(
    client,
    {
        searchSongs: false,
        emitNewSongOnly: true
    }
)


client.distube.on("playSong", (message, queue, song) => message.channel.send(
    new Discord.MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`**Now Playing:**\n[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
        .setFooter(`Added by: ${song.user.username}`, song.user.displayAvatarURL({ size: 4096, dynamic: true }))
).then(message => { message.delete({ timeout: 60000 }); }))

client.distube.on("addSong", (message, queue, song) => message.channel.send(
    new Discord.MessageEmbed()
        .setColor('#2f3136')
        .setDescription(`**Added:**\n[${song.name}](${song.url}) - \`${song.formattedDuration}\``)
        .setFooter(`Added by: ${song.user.username}`, song.user.displayAvatarURL({ size: 4096, dynamic: true }))
).then(message => { message.delete({ timeout: 10000 }); }))

client.distube.on("empty", message => message.channel.send(
    new Discord.MessageEmbed()
        .setColor('#2f3136')
        .setAuthor('Clearing queue and leaving channel!')
        .setFooter('Reason: Disconnect because voice channel is empty!')
))
client.distube.on("initQueue", queue => {
    queue.autoplay = false;
    queue.volume = 100;
});


const commandFolders = fs.readdirSync('./commands');
for (const folder of commandFolders) {
    const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
    for (const file of commandFiles) {
        const command = require(`./commands/${folder}/${file}`);
        client.commands.set(command.name, command);
    }
}


client.once('ready', () => {
    console.log('Online.')
    client.user.setPresence({
        status: 'idle'
    })
        .catch(console.error);
})


client.on('message', async message => {
    if (!message.content.startsWith(prefix) || message.author.bot || (!message.guild)) return;
    const args = message.content.slice(prefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();
    const command = client.commands.get(commandName) || client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));
    if (!command) return;
    if (command.args && !args.length) {
        return message.channel.send(`You didn't provide any arguments, ${message.author}!`);
    }
    const { cooldowns } = client;
    if (!cooldowns.has(command.name)) {
        cooldowns.set(command.name, new Discord.Collection());
    }
    const now = Date.now();
    const timestamps = cooldowns.get(command.name);
    const cooldownAmount = (command.cooldown || 3) * 1000;
    if (timestamps.has(message.author.id)) {
        const expirationTime = timestamps.get(message.author.id) + cooldownAmount;
        if (now < expirationTime) {
            const timeLeft = (expirationTime - now) / 1000;
            return message.channel.send(`A little too fast here!\n Wait ${timeLeft.toFixed(1)} more second(s) before reusing the \`${command.name}\` command.`);
        }
    }
    timestamps.set(message.author.id, now);
    setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

    try {
        command.execute(client, command, message, args, Discord);
    } catch (error) {
        console.error(error);
        message.channel.send(
            new Discord.MessageEmbed()
                .setColor('#defafe')
                .setDescription(`There was an error performing this task.`)
        );
    }
})


client.login(process.env.BOT_TOKEN)