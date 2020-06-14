var firebase = require("firebase");
var firebaseConfig = {
  apiKey: process.env.apiKey,
  authDomain: process.env.authDomain,
  databaseURL: process.env.databaseURL,
  projectId: process.env.projectId,
  storageBucket: process.env.storageBucket,
  messagingSenderId: process.env.messagingSenderId,
  appId: process.env.appId,
};
firebase.initializeApp(firebaseConfig);

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
  if (message.content === `${prefix}help`) {
    return message.channel.send(
      `For help, please visit https://yumiizumi.com/discordbot.`
    );
  }
  if (!message.guild) return;
  if (!message.content.startsWith(prefix) || message.author.bot) return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  if (message.content === `${prefix}ping`) {
    message.channel.send(
      `Pong. ${message.author}'s ping is ${client.ws.ping} ms`,
      command
    );
  } else if (message.content === `${prefix}server`) {
    message.channel.send(`This server's name is: ${message.guild.name}`);
  } else if (message.content === `${prefix}user-info`) {
    message.channel.send(
      `Your username: ${message.author.tag}\nYour ID: ${message.author.id}`
    );
  } else if (message.content === `${prefix}hello`) {
    message.channel.send(`ブンブンハロー ${message.author}`);
  }
});

client.login(process.env.BOT_TOKEN);
