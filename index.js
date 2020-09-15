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

const prefix = "y!" || "hey yumi ";

const Console = console;

client.once("ready", () => {
  client.user.setPresence({
    activity: {
      name: "with an Apple | y!help",
    },
    status: "idle",
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
  if (
    message.guild &&
    !message.channel.permissionsFor(message.guild.me).missing("SEND_MESSAGES")
  )
    return;

  const args = message.content.slice(prefix.length).split(" ");
  const command = args.shift().toLowerCase();

  if (message.content === `${prefix}ping`) {
    return message.channel.send(`Pong. ${client.ws.ping} ms`);
  } else if (message.content === `${prefix}server`) {
    return message.channel.send(`This server's name is: ${message.guild.name}`);
  } else if (message.content === `${prefix}aboutme`) {
    return message.channel.send(
      `${message.author}\nYour username: ${message.author.tag}\nYour ID: ${message.author.id}`
    );
  } else if (message.content === `${prefix}hello`) {
    return message.channel.send(`ブンブンハロー ${message.author}`);
  } else if (message.content === `${prefix}no`) {
    return message.channel.send(`Because no.`);
  }
});

client.on("messageReactionAdd", addRole);

client.login(process.env.BOT_TOKEN);

async function addRole({ message, _emoji }, user) {
  if (user.bot || message.id !== config.message_id) {
    return;
  }

  if (message.partial) {
    try {
      await message.fetch();
    } catch (err) {
      console.error("Error fetching message", err);
      return;
    }
  }

  const { guild } = message;

  const member = guild.members.get(user.id);
  const role = guild.roles.find(
    (role) => role.name === config.roles[_emoji.name]
  );

  if (!role) {
    console.error(`Role not found for '${_emoji.name}'`);
    return;
  }

  try {
    member.roles.add(role.id);
  } catch (err) {
    console.error("Error adding role", err);
    return;
  }
}
