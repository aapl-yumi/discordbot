const Discord = require("discord.js");
const client = new Discord.Client();

const prefix = "y!";

const Console = console;

let options = {
  total: "721679994581024768",
  users: "channel id",
  bots: "channel id",
};

client.once("ready", () => {
  client.user.setPresence({
    activity: {
      name: "with an Apple | y!help",
    },
    status: "online",
  });
  Console.log("Ready");
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

client.on("guildMemberAdd", (member) => {
  //All choices are optional here. Bot wont work if the channel ID's are wrong. How to properly get ID's read in README.md
  try {
    member.guild.channels
      .get(options.total)
      .setName(`Total Members: ${member.guild.memberCount}`); // You can change this text, but still keep ${guild.memberCount}, as it defines total members.
    member.guild.channels
      .get(options.users)
      .setName(
        `Users: ${member.guild.members.filter((m) => !m.user.bot).size}`
      ); // This text is also changeable, still keep the code in ${}
    member.guild.channels
      .get(options.bots)
      .setName(`Bots: ${member.guild.members.filter((m) => m.user.bot).size}`); // This text is also changeable, still keep the code in ${}
  } catch (e) {
    Console.log(e);
  }
});

client.on("guildMemberRemove", (member) => {
  //All choices are optional here. Bot wont work if the channel ID's are wrong. How to properly get ID's read in README.md
  try {
    member.guild.channels
      .get(options.total)
      .setName(`Total Members: ${member.guild.memberCount}`); // You can change this text, but still keep ${guild.memberCount}, as it defines total members.
    member.guild.channels
      .get(options.users)
      .setName(
        `Users: ${member.guild.members.filter((m) => !m.user.bot).size}`
      ); // This text is also changeable, still keep the code in ${}'s
    member.guild.channels
      .get(options.bots)
      .setName(`Bots: ${member.members.filter((m) => m.user.bot).size}`); // This text is also changeable, still keep the code in ${}'s
  } catch (e) {
    Console.log(e);
  }
});

client.login(process.env.BOT_TOKEN);
