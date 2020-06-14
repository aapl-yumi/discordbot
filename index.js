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
  if (!message.guild) return;
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  if (message.content === `${prefix}ping`) {
    message.channel.send("Pong.");
  } else if (message.content === `${prefix}server`) {
    message.channel.send(`This server's name is: ${message.guild.name}`);
  } else if (message.content === `${prefix}user-info`) {
    message.channel.send(
      `Your username: ${message.author.tag}\nYour ID: ${message.author.id}`
    );
  } else if (message.content === `${prefix}hello`) {
    message.channel.send(`ブンブンハロー ${message.author}`);
  } else if (message.content === `${prefix}help`) {
    message.channel.send(
      `For help, please visit https://yumiizumi.com/discordbot.`
    );
  }
});

client.login(process.env.BOT_TOKEN);
