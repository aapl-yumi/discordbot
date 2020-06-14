const Discord = require("discord.js");
const client = new Discord.Client();

const prefix = "y!";

client.once("ready", () => {
  client.user.setPresence({
    activity: {
      name: "with an Apple | y!help",
    },
    status: "online",
  });
  const text = `
    ------------------------------
    Ready since: ${moment(Date.now()).format("dddd, MMMM do YYYY, HH:mm:ss")}
    Server: ${client.guilds.first().name}
    Total server members: ${client.guilds.first().memberCount}
    ------------------------------
    `; //The text that displays to console, when client is ready.
  Console.log(text);
});

client.on("message", (message) => {
  if (!message.guild) return;
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  if (message.content === `${prefix}ping`) {
    message.channel.send("Pong.", command);
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
