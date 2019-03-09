const Discord = require("discord.js");


const client = new Discord.Client();


var prefix = ("frx!")

client.on("ready", () => {

  console.log(`Bot has started, with ${client.users.size} users, in ${client.channels.size} channels of ${client.guilds.size} guilds.`);

  client.user.setActivity(`frx!help | ${client.users.size} utilisateurs`);
});

client.on("guildCreate", guild => {

  console.log(`New guild joined: ${guild.name} (id: ${guild.id}). This guild has ${guild.memberCount} members!`);
  client.user.setActivity(`frx!help | ${client.users.size} utilisateurs`);
});

client.on("guildDelete", guild => {

  console.log(`I have been removed from: ${guild.name} (id: ${guild.id})`);
  client.user.setActivity(`frx!help | ${client.users.size} utilisateurs`);
});


client.on("message", async message => {

  if(message.author.bot) return;

  if(message.content.indexOf(config.prefix) !== 0) return;

  const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
  const command = args.shift().toLowerCase();

  if(command === "ping") {

    const m = await message.channel.send("Chargement en cours...");
    m.edit(`La latence vers ce serveur est de ${m.createdTimestamp - message.createdTimestamp}ms. La latence de mes serveurs sont de ${Math.round(client.ping)}ms !`);
  }

  if(command === "kick") {

    if(!message.member.roles.some(r=>["Administrator", "Moderator"].includes(r.name)) )
      return message.reply("Erreur : Votre rôle n'est pas listé comme autorisé à expulser des membres.");


    let member = message.mentions.members.first() || message.guild.members.get(args[0]);
    if(!member)
      return message.reply("Erreur : Veuillez saisir une mention correcte.");
    if(!member.kickable)
      return message.reply("Erreur : Le membre sélectionné semble être un de mes supérieurs, je ne peux pas faire cela !.");


    let reason = args.slice(1).join(' ');
    if(!reason) reason = "pas spécifiée";


    await member.kick(reason)
      .catch(error => message.reply(`Erreur : Désolé, une erreur est survenue. ( ${error} )`));
    message.reply(`KICK : ${member.user.tag} à été expulsé du serveur par ${message.author.tag}. Raison : ${reason}`);

  }

  if(command === "ban") {

    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Erreur : Votre rôle n'est pas listé comme autorisé à bannir des membres.");

    let member = message.mentions.members.first();
    if(!member)
      return message.reply("Erreur : Veuillez saisir une mention correcte.");
    if(!member.bannable)
      return message.reply("Erreur : Le membre sélectionné semble être un de mes supérieurs, je ne peux pas faire cela !.");

    let reason = args.slice(1).join(' ');
      if(!reason) reason = "pas spécifiée";

    await member.ban(reason)
      .catch(error => message.reply(`Erreur : Désolé, une erreur est survenue. ( ${error} )`));
    message.reply(`${member.user.tag} has been banned by ${message.author.tag} because: ${reason}`);
  }

  if(command === "purge") {

    if(!message.member.roles.some(r=>["Administrator"].includes(r.name)) )
      return message.reply("Erreur : Votre rôle n'est pas listé comme autorisé à bannir des membres.");

    const deleteCount = parseInt(args[0], 10);

    if(!deleteCount || deleteCount < 2 || deleteCount > 100)
      return message.reply("Erreur : Veuillez spécifier un nombre qui est entre 2 et 100.");

    const fetched = await message.channel.fetchMessages({limit: deleteCount});
    message.channel.bulkDelete(fetched)
      .catch(error => message.reply(`Erreur : Désolé, une erreur est survenue. ( ${error} )`));
  }
});

client.login(process.env.TOKEN);
