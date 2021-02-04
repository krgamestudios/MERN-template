//setup
const readline = require('readline');
const fs = require('fs');

var rl = readline.createInterface({
	input: process.stdin,
	output: process.stdout,
	terminal: false
});

//manually promisify this (util didn't work)
const question = (prompt, def) => {
	return new Promise((resolve, reject) => {
		rl.question(`${prompt} (${def}): `, answer => {
			resolve(answer || def);
		});
	});
};

//questions
(async () => {
	//project configuration
	const projectName = await question('Project Name', 'template');
	const projectWebAddress = await question('Project Web Address', 'example.com');
	const projectMailSMTP = await question('Project Mail SMTP', 'smtp.example.com');
	const projectMailUser = await question('Project Mail Username', 'foobar@example.com');
	const projectMailPass = await question('Project Mail Password', 'foobar');
	const projectDBUser = await question('Project Database Username', projectName);
	const projectDBPass = await question('Project Database Password', 'pikachu');

	//news configuration
	const newsName = await question('News Name', 'news');
	const newsDBUser = await question('News Database Username', newsName);
	const newsDBPass = await question('News Database Password', 'charizard');
	const newsKey = await question('News Query Key', 'key');

	//TODO: chat configuration

	//database configuration
	const databaseRootPassword = await question('Database Root Password', 'password');
	const databaseTimeZone = await question('Database Timezone', 'Australia/Sydney');

	//traefic configuration
	const supportEmail = await question('Support Email', 'postmaster@example.com');

const yml = `
services:
  ${projectName}:
    build: .
    ports:
      - "3000:3000"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${projectName}router.rule=Host('${projectWebAddress}')"
      - "traefik.http.routers.${projectName}router.entrypoints=websecure"
      - "traefik.http.routers.${projectName}router.tls.certresolver=myresolver"
      - "traefik.http.routers.${projectName}router.service=${projectName}service@docker"
      - "traefik.http.services.${projectName}service.loadbalancer.server.port=3000"
    environment:
      - WEB_PROTOCOL=https
      - WEB_ADDRESS=localhost
      - WEB_PORT=3000
      - MAIL_SMTP=${projectMailSMTP}
      - MAIL_USERNAME=${projectMailUser}
      - MAIL_PASSWORD=${projectMailPass}
      - DB_HOSTNAME=database
      - DB_DATABASE=${projectName}
      - DB_USERNAME=${projectDBUser}
      - DB_PASSWORD=${projectDBPass}
      - DB_TIMEZONE=${databaseTimeZone}
      - SESSION_SECRET=secret
	  - SESSION_ADMIN=adminsecret
	  - NEWS_URI=http://news:3100/news
	  - NEWS_KEY=${newsKey}
    networks:
      - app-network
    depends_on:
      - database

  news:
    image: krgamestudios/news-server:v1.0.0
    ports:
      - "3100:3100"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.newsrouter.rule=Host('${projectWebAddress}')"
      - "traefik.http.routers.newsrouter.entrypoints=websecure"
      - "traefik.http.routers.newsrouter.tls.certresolver=myresolver"
      - "traefik.http.routers.newsrouter.service=newsservice@docker"
      - "traefik.http.services.newsservice.loadbalancer.server.port=3100"
    environment:
      - WEB_PORT=3100
      - DB_HOSTNAME=database
      - DB_DATABASE=news
      - DB_USERNAME=${newsDBUser}
      - DB_PASSWORD=${newsDBPass}
      - DB_TIMEZONE=${databaseTimeZone}
      - QUERY_LIMIT=10
      - QUERY_KEY=${newsKey}
    networks:
      - app-network
    depends_on:
      - database

  #chat:
  #  image: krgamestudios/chat-server
  #  ports:
  #    - "3200:3200"

  database:
    image: mariadb
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: ${databaseRootPassword}
    volumes:
      - ./mysql:/var/lib/mysql
    networks:
      - app-network

  traefik:
    image: "traefik:v2.4"
    container_name: "traefik"
    command: >
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=${supportEmail}
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "./letsencrypt:/letsencrypt"
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge
`;

	fs.writeFileSync('docker-compose.yml', yml);
})()
	.then(() => rl.close())
	.catch(e => console.error(e))
;

/* Default below

services:
  template:
    build: .
    ports:
      - "3000:3000"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.templaterouter.rule=Host('template.com')"
      - "traefik.http.routers.templaterouter.entrypoints=websecure"
      - "traefik.http.routers.templaterouter.tls.certresolver=myresolver"
      - "traefik.http.routers.templaterouter.service=templateservice@docker"
      - "traefik.http.services.templateservice.loadbalancer.server.port=3000"
    environment:
      - WEB_PROTOCOL=https
      - WEB_ADDRESS=localhost
      - WEB_PORT=3000
      - MAIL_SMTP=smtp.example.com
      - MAIL_USERNAME=foobar@example.com
      - MAIL_PASSWORD=foobar
      - DB_HOSTNAME=database
      - DB_DATABASE=template
      - DB_USERNAME=template
      - DB_PASSWORD=pikachu
      - DB_TIMEZONE=Australia/Sydney
      - SESSION_SECRET=secret
      - SESSION_ADMIN=adminsecret
    networks:
      - app-network
    depends_on:
      - database

  news:
    image: krgamestudios/news-server:v1.0.0
    ports:
      - "3100:3100"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.newsrouter.rule=Host('template.com')"
      - "traefik.http.routers.newsrouter.entrypoints=websecure"
      - "traefik.http.routers.newsrouter.tls.certresolver=myresolver"
      - "traefik.http.routers.newsrouter.service=newsservice@docker"
      - "traefik.http.services.newsservice.loadbalancer.server.port=3100"
    environment:
      - WEB_PORT=3100
      - DB_HOSTNAME=database
      - DB_DATABASE=news
      - DB_USERNAME=news
      - DB_PASSWORD=charizard
      - DB_TIMEZONE=Australia/Sydney
      - QUERY_LIMIT=10
      - QUERY_KEY=key
    networks:
      - app-network
    depends_on:
      - database

  #chat:
  #  image: krgamestudios/chat-server
  #  ports:
  #    - "3200:3200"

  database:
    image: mariadb
    restart: always
    environment:
      MYSQL_ROOT_PASSWORD: example
    volumes:
      - ./mysql:/var/lib/mysql
    networks:
      - app-network

  traefik:
    image: "traefik:v2.4"
    container_name: "traefik"
    command:
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=postmaster@example.com"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
    ports:
      - "80:80"
      - "443:443"
    volumes:
      - "./letsencrypt:/letsencrypt"
      - "/var/run/docker.sock:/var/run/docker.sock:ro"
    networks:
      - app-network

networks:
  app-network:
    driver: bridge

*/