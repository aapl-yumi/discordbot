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
  if (!message.content) return;
  if (message.author.bot) {
    return;
  } else {
    lowerCaseMessageContent = message.content.toLowerCase();

    guild = firebase
      .database()
      .ref()
      .child("servers/" + message.guild.id);
    guild
      .child("channels/" + message.channel.id)
      .set({ name: message.channel.name });

    if (message.member.hasPermission("ADMINISTRATOR")) {
      guild
        .child("autoresque/inque")
        .once("value")
        .then(function (snapshot) {
          inque = snapshot.val();
          if (
            !inque.mes &&
            message.channel.id == inque.channel &&
            message.author.id == inque.author &&
            message.content !== `${prefix}ar`
          ) {
            if (message.content === "CANCEL") {
              guild.child("autoresque/inque").remove();
              return message.channel.send("Autoresponder setup was cancelled.");
            }
            guild.child("autoresque/inque").set({
              author: inque.author,
              time: inque.time,
              channel: inque.channel,
              mes: message.content,
            });
            return message.channel.send(
              'What should the response be? If you want to cancel, type in "CANCEL".'
            );
          } else if (
            inque.mes &&
            message.channel.id == inque.channel &&
            message.author.id == inque.author &&
            message.content !== `${prefix}ar`
          ) {
            if (message.content === "CANCEL") {
              guild.child("autoresque/inque").remove();
              return message.channel.send("Autoresponder setup was cancelled.");
            }
            guild.child("autoresque/inque").set({
              author: inque.author,
              time: inque.time,
              channel: inque.channel,
              mes: inque.mes,
              res: message.content,
            });
            return message.channel.send(
              "Do you want this auto response to be wild card?"
            );
            key = guild.child("autores/" + inque.mes).set(message.content);
            guild.child("autoresque/inque").remove();
            return message.channel.send(
              "Autoresonder has been set. When you type in \n```" +
                inque.mes +
                "```the response will be```" +
                message.content +
                "```"
            );
          }
        });
    }

    guild
      .child("autores")
      .orderByValue()
      .on("value", function (data) {
        data.forEach(function (data) {
          if (data.key.toLowerCase() == lowerCaseMessageContent) {
            return message.channel.send(data.val());
          }
        });
        // data.forEach(function (data) {
        //   if (lowerCaseMessageContent.search(data.key) >= 0) {
        //     return message.channel.send(data.val());
        //   }
        // });
      });

    if (message.content === "testtest") {
      return message.channel.send(JSON.stringify(message));
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
        !message.channel
          .permissionsFor(message.guild.me)
          .missing("SEND_MESSAGES")
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
      } else if (
        message.content === (`${prefix}aboutme` || `${prefix}whoami`)
      ) {
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
      } else if (message.content.startsWith(`${prefix}ar`)) {
        if (args == "list") {
          return message.channel.send(
            "Check the list of autoresponses for this server at https://yumiizumi.com/discordbot/?s=" +
              message.guild.id +
              "."
          );
        } else if (message.member.hasPermission("ADMINISTRATOR")) {
          guild.child("autoresque/inque").set({
            author: message.author.id,
            time: Math.floor(Date.now() / 1000),
            channel: message.channel.id,
          });
          return message.channel.send(
            'What should the message that initializes an autoresponse? If you want to cancel, type in "CANCEL".'
          );
        }
      }
    }
  }
});

client.login(process.env.BOT_TOKEN);
