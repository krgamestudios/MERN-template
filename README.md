# MERN-template

A website template using the MERN stack.

# Setup Development

To set up this template, please ensure mariadb is running on the host computer, and run `npm install` as normal.

1. Run `sql/create_database.sql`
2. Run `cp .envdev .env` and enter your details into the new file
3. Execute `npm run dev`

This should get the template working in development mode.

# Setup Deployment

Eventually, a clean install will be this easy:

```
git clone https://github.com/krgamestudios/MERN-template.git
npm run configure
docker-compose up --build
```

# Microservices

There are external components to this template referred to as "microservices". These can be omitted entirely by simply removing the React component that accesses them.

* News Server: https://github.com/krgamestudios/news-server
* Auth Server: https://github.com/krgamestudios/auth-server
* Chat Server: https://github.com/krgamestudios/chat-server

# TODO list

- Account system
	- A separate authentication server
- Administration Panel
	- inspect aggregate user data
	- Moderation tools for banning, suspending, or chat-banning users
- Chat system (microservice)
	- Based on usernames
	- Chat logs
	- Custom emoji
	- Moderation tools
	- Global chat channels
	- User-created chat channels with an invite/search system
	- Private messages
	- Icons/roles next to username
- Better compression for client files
- Some form of bot/alt account detection?
- A payment system
- Backend for energy systems
- Backend for trading and leaderboards
- inventory 
- stats
- shop
- currency
- random events
- Dcumentation and tutorials
- Server-side actions to allow offline progress or progress on spotty internet connections
- Full tutorial for setting up and using the site
	- Start here page
	- Security holes
		- HTTPS
		- Default admin account
	- Information about legal requirements of the developers using this template
		- Privacy policy & data collection notices

# DONE list

- Legal Requirements:
	- ~~Physical Mailing Address Config (for emails)~~
	- ~~Opt-out option (for emails)~~
	- ~~Privacy policy & data collection notices~~
	- ~~LICENSE file~~
	- ~~annoying "This site uses cookies" message~~
- Account system
	- ~~sign up~~
	- ~~validate email~~
	- ~~login (with cookies)~~
	- ~~logout (with cookies)~~
	- ~~account deletion~~
	- ~~Change passwords~~
- Administration Panel
	- ~~Default admin account~~
	- ~~Exclusive to admin accounts~~
- News blog system (microservice)
	- ~~build the microservice to provide the news feed~~
	- ~~access an external news feed~~
	- ~~admin panel for publishing and editing news~~
	- ~~"created at" and "updated at" in the response~~
- Configuraton Script:
	- ~~Default UUID keys~~
	- ~~Docker, docker, docker.~~

# Email settings

Some of the external requirements can be tricky, so let me outline what is needed. If you decide to use gmail as your email provider, then use the following `.env` settings:

	MAIL_SMTP=smtp.gmail.com
	MAIL_USERNAME=you@gmail.com
	MAIL_PASSWORD=yourpassword

you'll also need to enable "less secure apps" for the specified email address. Remember - don't ever commit the `.env` file! You might even want to create a dedicated email address just for your project.

