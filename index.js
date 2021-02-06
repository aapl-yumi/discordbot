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

const ytdl = require("ytdl-core");
const queue = new Map();

const Discord = require("discord.js");
const client = new Discord.Client();

const prefix = "y!";

const Console = console;

var fs = require("fs");

wordnikapi = process.env.wordnikApiKey;

var quotes = [
  "I love you the more in that I believe you had liked me for my own sake and for nothing else.",
  "But man is not made for defeat. A man can be destroyed but not defeated.",
  "When you reach the end of your rope, tie a knot in it and hang on.",
  "There is nothing permanent except change.",
  "You cannot shake hands with a clenched fist.",
  "Let us sacrifice our today so that our children can have a better tomorrow.",
  "It is better to be feared than loved, if you cannot be both.",
  "The most difficult thing is the decision to act, the rest is merely tenacity. The fears are paper tigers. You can do anything you decide to do. You can act to change and control your life; and the procedure, the process is its own reward.",
  "Do not mind anything that anyone tells you about anyone else. Judge everyone and everything for yourself.",
];

function findDef(word) {
  let data = fetch(
    `https://api.wordnik.com/v4/word.json/` +
      word +
      `/definitions?limit=5&includeRelated=false&useCanonical=false&includeTags=false&api_key=` +
      wordnikapi
  )
    .then((response) => response.json())
    .catch((err) => console.log(err));
  console.log(
    `https://api.wordnik.com/v4/word.json/` +
      word +
      `/definitions?limit=5&includeRelated=false&useCanonical=false&includeTags=false&api_key=` +
      wordnikapi
  );
  return (
    `https://api.wordnik.com/v4/word.json/` +
    word +
    `/definitions?limit=5&includeRelated=false&useCanonical=false&includeTags=false&api_key=` +
    wordnikapi
  );
  let def = data.find((i) => i.text != null);
  console.log(def.text);
  return (
    def.text ||
    `Cannot find definition. Visit <https://www.wordnik.com/words/` +
      word +
      `>.`
  );
}

client.once("ready", () => {
  client.user.setPresence({
    activity: {
      name: "with an Apple | y!help",
    },
    status: "online",
  });
  Console.log("Ready.");
});

client.once("reconnecting", () => {
  Console.log("Reconnecting.");
});

client.once("disconnect", () => {
  Console.log("Disconnect.");
});

client.on("message", (message) => {
  if (!message.content) return;
  if (message.author.bot) {
    return;
  } else {
    const serverQueue = queue.get(message.guild.id);

    if (message.content.startsWith(`${prefix}play`)) {
      execute(message, serverQueue).catch((err) => Console.log(err));
      return;
    } else if (message.content.startsWith(`${prefix}skip`)) {
      skip(message, serverQueue).catch((err) => Console.log(err));
      return;
    } else if (message.content.startsWith(`${prefix}stop`)) {
      stop(message, serverQueue).catch((err) => Console.log(err));
      return;
    }

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
            !inque.res &&
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
              'Do you want this auto response to be wild card? Reply with "yes" or "no". If you want to cancel, type in "CANCEL".'
            );
          } else if (
            inque.mes &&
            inque.res &&
            message.channel.id == inque.channel &&
            message.author.id == inque.author &&
            message.content !== `${prefix}ar`
          ) {
            if (message.content === "CANCEL") {
              guild.child("autoresque/inque").remove();
              return message.channel.send("Autoresponder setup was cancelled.");
            }
            if (lowerCaseMessageContent === "yes") {
              guild.child("autoresque/inque").remove();
              key = guild.child("autoreswc/" + inque.mes).set(inque.res);
              return message.channel.send(
                "Autoresonder has been set with wild card. When you type in \n```" +
                  inque.mes +
                  "```the response will be```" +
                  inque.res +
                  "```"
              );
            } else if (lowerCaseMessageContent === "no") {
              guild.child("autoresque/inque").remove();
              key = guild.child("autores/" + inque.mes).set(inque.res);
              return message.channel.send(
                "Autoresonder has been set. When you type in \n```" +
                  inque.mes +
                  "```the response will be```" +
                  inque.res +
                  "```"
              );
            } else {
              return message.channel.send(
                'Please reply with "yes" or "no". If you want to cancel, type in "CANCEL".'
              );
            }
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
      });

    guild
      .child("autoreswc")
      .orderByValue()
      .on("value", function (data) {
        data.forEach(function (data) {
          if (lowerCaseMessageContent.search(data.key) >= 0) {
            return message.channel.send(data.val());
          }
        });
      });

    guild
      .child("typing/" + message.author.id)
      .once("value")
      .then(function (snapshot) {
        if (snapshot) {
          inque = snapshot.val();
          rn = Math.floor(Date.now());
          numWord = inque.original.length / 5;
          timeTook = (rn - inque.time) / 60000;
          wpm = Math.floor(numWord / timeTook);
          if (
            message.channel.id == inque.channel &&
            Math.floor(numWord / timeTook) < 500
          ) {
            guild.child("typing/" + message.author.id).remove();
            acc =
              Math.round(similarity(message.content, inque.original) * 10000) /
              100;
            oldwpm = 0;
            guild
              .child("typing/leaderboard/" + message.author.id)
              .on("value", function (data) {
                oldwpm = data.wpm || 0;
              });
            if (acc > 95 && wpm > oldwpm) {
              guild.child("typing/leaderboard/" + message.author.id).set({
                user: message.author.toString(),
                wpm: Math.floor(numWord / timeTook),
                accuracy: acc,
              });
            }
            return message.channel.send(wpm + "wpm, accuracy: " + acc + "%");
          }
        }
      });

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
      } else if (
        message.content === `${prefix}tl` ||
        message.content === `${prefix}typeleaderboard`
      ) {
        lb = "Leaderboard:\n";
        guild
          .child("typing/leaderboard")
          .orderByChild("wpm")
          .limitToFirst(5)
          .on("value", function (snapshot) {
            snapshot.forEach((snap) => {
              console.log(snap.val());
              lb +=
                "<@" +
                snap.val().user +
                ">: " +
                snap.val().wpm +
                "wpm, accuracy: " +
                snap.val().accuracy +
                "%\n";
            });
          });
        return message.channel.send(lb);
      } else if (message.content.startsWith(`${prefix}type`)) {
        qnum = Math.floor(Math.random() * quotes.length);
        text = quotes[qnum];
        guild.child("typing/" + message.author.id).set({
          author: message.author.id,
          time: Math.floor(Date.now()),
          channel: message.channel.id,
          original: text,
        });
        return message.channel.send(
          "https://yumi.to/images/discordbot/" + qnum + ".png"
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
            'What should the message that initializes an autoresponse? If you want to canchel, type in "CANCEL".'
          );
        }
      } else if (
        message.content.startsWith(`${prefix}def`) ||
        message.content.startsWith(`${prefix}define`)
      ) {
        return message.channel.send(findDef(args));
      } else {
        return message.channel.send('Invalid command. For help use "y!help".');
      }
    }
  }
});

async function execute(message, serverQueue) {
  const args = message.content.split(" ");

  const voiceChannel = message.member.voice.channel;
  if (!voiceChannel)
    return message.channel.send(
      "You need to be in a voice channel to play music!"
    );
  const permissions = voiceChannel.permissionsFor(message.client.user);
  if (!permissions.has("CONNECT") || !permissions.has("SPEAK")) {
    return message.channel.send(
      "I need the permissions to join and speak in your voice channel!"
    );
  }

  const songInfo = await ytdl.getInfo(args[1]);
  const song = {
    title: songInfo.title,
    url: songInfo.video_url,
  };

  if (!serverQueue) {
    const queueContruct = {
      textChannel: message.channel,
      voiceChannel: voiceChannel,
      connection: null,
      songs: [],
      volume: 5,
      playing: true,
    };

    queue.set(message.guild.id, queueContruct);

    queueContruct.songs.push(song);

    try {
      var connection = await voiceChannel.join();
      queueContruct.connection = connection;
      play(message.guild, queueContruct.songs[0]);
    } catch (err) {
      console.log(err);
      queue.delete(message.guild.id);
      return message.channel.send(err);
    }
  } else {
    serverQueue.songs.push(song);
    return message.channel.send(`${song.title} has been added to the queue!`);
  }
}

function skip(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  if (!serverQueue)
    return message.channel.send("There is no song that I could skip!");
  serverQueue.connection.dispatcher.end();
}

function stop(message, serverQueue) {
  if (!message.member.voice.channel)
    return message.channel.send(
      "You have to be in a voice channel to stop the music!"
    );
  serverQueue.songs = [];
  serverQueue.connection.dispatcher.end();
}

function play(guild, song) {
  const serverQueue = queue.get(guild.id);
  if (!song) {
    serverQueue.voiceChannel.leave();
    queue.delete(guild.id);
    return;
  }

  const dispatcher = serverQueue.connection
    .play(ytdl(song.url))
    .on("finish", () => {
      serverQueue.songs.shift();
      play(guild, serverQueue.songs[0]);
    })
    .on("error", (error) => console.error(error));
  dispatcher.setVolumeLogarithmic(serverQueue.volume / 5);
  serverQueue.textChannel.send(`Start playing: **${song.title}**`);
}

function similarity(s1, s2) {
  var longer = s1;
  var shorter = s2;
  if (s1.length < s2.length) {
    longer = s2;
    shorter = s1;
  }
  var longerLength = longer.length;
  if (longerLength === 0) {
    return 1.0;
  }
  return (
    (longerLength - editDistance(longer, shorter)) / parseFloat(longerLength)
  );
}

function editDistance(s1, s2) {
  s1 = s1.toLowerCase();
  s2 = s2.toLowerCase();

  var costs = new Array();
  for (var i = 0; i <= s1.length; i++) {
    var lastValue = i;
    for (var j = 0; j <= s2.length; j++) {
      if (i == 0) costs[j] = j;
      else {
        if (j > 0) {
          var newValue = costs[j - 1];
          if (s1.charAt(i - 1) != s2.charAt(j - 1))
            newValue = Math.min(Math.min(newValue, lastValue), costs[j]) + 1;
          costs[j - 1] = lastValue;
          lastValue = newValue;
        }
      }
    }
    if (i > 0) costs[s2.length] = lastValue;
  }
  return costs[s2.length];
}

client.login(process.env.BOT_TOKEN);
