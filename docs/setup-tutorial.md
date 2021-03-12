# Setup Tutorial

Last Updated February 15th 2021

Hello! This is the tutorial for setting up the MERN-template. If you haven't already, I recommend you download the MERN-template from here:

https://github.com/krgamestudios/MERN-template

Remember: This project isn't ready for deployment yet - it still has bugs galore.

## The What-Template?

MERN can stand for a few things, but in this case it means "MariaDB, Express, React and Nodejs". This are a series of technologies commonly used to create websites.

I determined that I might want to reuse some parts of the website I was planning to make, so I wrote the template first, to make it easier to reuse. Then, I released it so other people could use it too.

You're currently reading the tutorial on how to set up the template website, both in development mode and deployment mode. This tutorial will likely evolve over time as the template does - and there will likely be other guides going into how the template is built and how to modify it.

## Requirements

There are some requirements for this template, such as required software and a dedicated email. Software needed includes:

* Git
* Nodejs
* MariaDB
* Docker
* docker-compose

You'll also need an email address - if you use google, you'll need to enable "[less secure apps](https://support.google.com/accounts/answer/6010255?hl=en#zippy=%2Cif-less-secure-app-access-is-off-for-your-account%2Cif-less-secure-app-access-is-on-for-your-account)" so external apps can access it. I've only used this site with google so far, but feel free to experiment with other mail hosts.

## Setting Up Development

For development, you'll need Nodejs and MariaDB installed and working. Remember to run `npm install` in the git repo after cloning.

First, run `sql/create_database.sql` on your mariaDB instance - this will create a database called `template` and a user called `template`@`%`. You can of course mess with this, but everything else here assumes you do so consistently.

Next, copy `.envdev` into `.env`, then fill out `.env` with your details. Here's a breakdown of each field and what they mean:

```
WEB_PROTOCOL=http             # are you using HTTP or HTTPS?
WEB_ADDRESS=localhost         # what is your web domain?
WEB_PORT=3000                 # what port is the game running on?
```

The first two are used mainly for the email validation link at the moment - but they should still be configured correctly. `WEB_PORT` is used to specify which port the game operates on - when you reach the webpack stage, you won't access this port directly.

```
MAIL_SMTP=smtp.example.com                                    # SMTP server
MAIL_USERNAME=foobar@example.com                              # Email to be used
MAIL_PASSWORD=foobar                                          # Password of that email account
MAIL_PHYSICAL=42 Placeholder Ave, Placeholder, 0000, USA      # Your physical mailing address
```

Now, I've use exclusively google for this - and it shows. The first argument is usually set to `smtp.gmail.com`. The second is to your email account (a fake one is set in the code, `signup@WEB_ADDRESS`, but google overwrites this). The third is the plaintext password for this account (so you should almost certainly use a dedicated email for this). The fourth is actually included in the validation email itself - it's a legal requirement of the USA's [CAN-SPAM](https://en.wikipedia.org/wiki/CAN-SPAM_Act_of_2003) act of 2003, which goes over my head just a little (I try to appease as many jurisdictions as possible).

```
DB_HOSTNAME=127.0.0.1          # Database address
DB_DATABASE=template           # database name
DB_USERNAME=template           # database user
DB_PASSWORD=pikachu            # database password
DB_TIMEZONE=Australia/Sydney   # database timezone
```

This is fairly simple - but if you tinkered in `sql/create_database.sql`, do so here as well. `127.0.0.1` just means "this machine", of course. The timezone is my own timezone, but can be set to [any of these values](https://en.wikipedia.org/wiki/List_of_tz_database_time_zones) (I think - haven't tested them).

```
SESSION_SECRET=secret
SESSION_ADMIN=adminsecret
```

Finally, these are crucial in production - so much so that they're completely randomized by the configure script. Here, however, you can set them to anything. `SESSION_SECRET` is used by `express-session` to save user session details, while `SESSION_ADMIN` is used as a sort of password for the administrator accounts.

Finally, it's time to run `npm run dev`. This will begin the server in dev mode - it'll use the `concurrently` library to run both client and server in the same window, so you don't need two monitor terminals. If all goes well, the server should start pretty quickly, though the client will take a moment to compile.

When they're both ready, you can access `http://localhost:3001/` in a browser (NOT 3000) and the template site should load.

At this stage, your brand new website will call out to the `dev-news` server for news postings, so you'll get some lorem ipsum, and possibly other content (it's a publicly available server - don't blame me!).

The server should've created a default administration account (and outputted the email and password). By logging in with this, you can access `http://localhost:3001/admin` and post to or edit existing news posts.

From here, you can now start exploring and fiddling with the code. Feel free to contribute any changes via pull requests on github; I'm likely to accept them if they improve the overall experience. Even these docs (and this tutorial) are subject to updates, so check back if you need to.

## Setting Up Deployment

In a perfect world, deploying to a server would be as easy as:

```
git clone https://github.com/krgamestudios/MERN-template.git
npm run configure
docker-compose up --build
```

Sadly, this isn't a perfect world. So let's instead break down what I did for the tentative deployment.

First, you'll need a server with a domain name. I personally pointed both `dev.eggtrainer.com` and `news.eggtrainer.com` at the same server (You might be able to separate the news server later - that's why there's two URLs). I'm using linode for this, but be aware that linode blocks email access until you open a ticket requesting permission to use emails from their servers. It's easy - just don't abuse their goodwill. I ended up using debian as the OS, but anything that runs node and docker should work.

Then, I installed git, node (for npm) and docker-compose on the new server. Then I cloned the MERN-template into the server. Note that I didn't install mariaDB or run `npm install` - docker-compose handles these.

Next I ran `npm run configure`, which takes in a number of arguments and spits out a number of config files. Here's the default prompts:

```
Project Name (template): 
Project Web Address (example.com): 
Project Mail SMTP (smtp.example.com): 
Project Mail Username (foobar@example.com): 
Project Mail Password (foobar): 
Project Physical Mailing Address (<empty>): 
Project Database Username (template): 
Project Database Password (pikachu): 
News Name (news): 
News Web Address (news.example.com): 
News Database Username (news): 
News Database Password (charizard): 
News Query Key (<random>): 
Database Root Password (password): 
Database Timezone (Australia/Sydney): 
Support Email (foobar@example.com): 
```

These should generally be fairly self-explanatory, except the values in the parentheses can changed based on previous entries. If you make a mistake here, just re-run this. This script produces three files:

* docker-compose.yml
* Dockerfile
* setup.sql

`setup.sql` is invoked by Dockerfile to create the database if it doesn't already exist, and `docker-compose.yml` invokes Dockerfile, among a number of other built-in containers (mariaDB and news-server). This will update regularly so check back often. If you want to delete any files created by configure, just run `npm run clean`.

Finally, it's time to run `sudo docker-compose up --build`. You might actually need to run it several times, killing the first attempts, as I haven't weeded out certain bugs yet. Remember - it's only in alpha, and not ready for prime time just yet.

You now have a self-contained MERN-template container, mariaDB container, news-server container and [traefik](https://traefik.io/) container.

## Troubleshooting

**Deploying the project didn't work?**

Try again. There are timing issues between the different containers that I still need to sort out. If it still doesn't work after 5-ish attempts, keep reading.

**Sequelize throws an error that a certain field is missing?**

If you just upgraded the template, try checking if any changes to the sequelize models have occured. If so, you'll have to go into the mariaDB container and alter the database directly.

