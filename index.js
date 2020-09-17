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

client.once("ready", () => {
  client.user.setPresence({
    activity: {
      name: "with an Apple | y!help",
    },
    status: "idle",
  });
  client.channels.cache
    .get("755832089764691979")
    .send("Ready at " + new Date());
  Console.log("Ready");
});

client.on("message", (message) => {
  if (message.content) {
    guild = firebase
    .database()
    .ref()
    .child("servers/" + message.guild.id)
    guild
      .child("channels/" + message.channel.id)
      .set({ name: message.channel.name });
  }

  if (message.content === "testtest") {
    return message.channel.send(JSON.stringify(message));
  }
  lowerCaseMessageContent = message.content.toLowerCase();

  if (message.author.bot) return;

  if (lowerCaseMessageContent.search("sad") >= 0) {
    return message.channel.send(`omg so sad alexa play despacito`);
  }
  if (message.content === `${prefix}help`) {
    return message.channel.send(
      `For help, please visit https://yumiizumi.com/discordbot, and hope there is any help there.`
    );
  }

  if (!message.guild) {
    return message.channel.send(`no.`);
  } else {
    if (!message.content.startsWith(prefix)) return;
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
      return message.channel.send(
        `This server's name is: ${message.guild.name}`
      );
    } else if (message.content === (`${prefix}aboutme` || `${prefix}whoami`)) {
      return message.channel.send(
        `${message.author}\nYour username: ${message.author.tag}\nYour ID: ${message.author.id}`
      );
    } else if (message.content === `${prefix}hello`) {
      return message.channel.send(`ブンブンハロー ${message.author}`);
    } else if (message.content === `${prefix}no`) {
      return message.channel.send(`Because no.`);
    } else if (
      message.content.startsWith(`${prefix}calc ` || `${prefix}calculate `) &&
      args.length > 0
    ) {
      return message.channel.send(`That's too hard for me`);
    } else if (message.content === `${prefix}umi`) {
      return message.channel.send(
        `Visit <https://yumiizumi.com> for more information on Yumi.`
      );
    } else if (message.content.startsWith(`${prefix}autores`)) {
        queinfo = {author: message.author.id, time: Math.floor(Date.now() / 1000)}
        var newPostKey = guild.child('autoresque').push().key;
        var updates = {};
        updates['/autoresque/' + newPostKey] = postData;
        guild.update(updates);
        return message.channel.send("What should the message that initializes a autoresponse?");
    }
  }
});

client.login(process.env.BOT_TOKEN);
