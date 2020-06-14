const Discord = require("discord.js");
const client = new Discord.Client();

const prefix = "y!";

client.once("ready", () => {
  client.user
    .setPresence({ activity: { name: "Epic VALORANT" }, status: "online" })
    .then(console.log)
    .catch(console.error);
  console.log("Ready!");
});

client.on("message", (message) => {
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  if (message.content === `${prefix}ping`) {
    // send back "Pong." to the channel the message was sent in
    message.channel.send("Pong.");
  } else if (message.content === `${prefix}server`) {
    message.channel.send(`This server's name is: ${message.guild.name}`);
  } else if (message.content === `${prefix}user-info`) {
    message.channel.send(
      `Your username: ${message.author.username}\nYour ID: ${message.author.id}`
    );
  } else if (message.content === `${prefix}hello`) {
    message.channel.send(`ブンブンハロー ${message.author.username}`);
  } else if (message.content === `${prefix}help`) {
    message.channel.send(
      `For help, please visit https://yumiizumi.com/discordbot.`
    );
  }
});

client.login(process.env.BOT_TOKEN);
