//setup
const readline = require('readline');
const fs = require('fs');
const crypto = require("crypto");

const uuid = (bytes = 16) => crypto.randomBytes(bytes).toString("hex");

const rl = readline.createInterface({
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
	const projectMailPhysical = await question('Project Physical Mailing Address', '');
	const projectDBUser = await question('Project Database Username', projectName);
	const projectDBPass = await question('Project Database Password', 'pikachu');

	//news configuration
	const newsName = await question('News Name', 'news');
	const newsWebAddress = await question('News Web Address', 'news.example.com');
	const newsDBUser = await question('News Database Username', newsName);
	const newsDBPass = await question('News Database Password', 'charizard');
	const newsKey = await question('News Query Key', uuid());

	//TODO: chat configuration

	//database configuration
	const databaseRootPassword = await question('Database Root Password', 'password');
	const databaseTimeZone = await question('Database Timezone', 'Australia/Sydney');

	//traefic configuration
	const supportEmail = await question('Support Email', projectMailUser);

	//other random values
	const sessionSecret = uuid(); //for session randomness
	const sessionAdmin = uuid(128); //for checking if user is admin

const yml = `
version: "3.6"
services:
  ${projectName}:
    build: .
    ports:
      - "3000"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${projectName}router.rule=Host(\`${projectWebAddress}\`)"
      - "traefik.http.routers.${projectName}router.entrypoints=websecure"
      - "traefik.http.routers.${projectName}router.tls.certresolver=myresolver"
      - "traefik.http.routers.${projectName}router.service=${projectName}service@docker"
      - "traefik.http.services.${projectName}service.loadbalancer.server.port=3000"
    environment:
      - WEB_PROTOCOL=https
      - WEB_ADDRESS=${projectWebAddress}
      - WEB_PORT=3000
      - MAIL_SMTP=${projectMailSMTP}
      - MAIL_USERNAME=${projectMailUser}
      - MAIL_PASSWORD=${projectMailPass}
      - MAIL_PHYSICAL=${projectMailPhysical}
      - DB_HOSTNAME=database
      - DB_DATABASE=${projectName}
      - DB_USERNAME=${projectDBUser}
      - DB_PASSWORD=${projectDBPass}
      - DB_TIMEZONE=${databaseTimeZone}
      - SESSION_SECRET=${sessionSecret}
      - SESSION_ADMIN=${sessionAdmin}
      - NEWS_URI=https://${newsWebAddress}/news
      - NEWS_KEY=${newsKey}
    networks:
      - app-network
    depends_on:
      - database
      - traefik

  ${newsName}:
    image: krgamestudios/news-server:latest
    ports:
      - "3100"
    labels:
      - "traefik.enable=true"
      - "traefik.http.routers.${newsName}router.rule=Host(\`${newsWebAddress}\`)"
      - "traefik.http.routers.${newsName}router.entrypoints=websecure"
      - "traefik.http.routers.${newsName}router.tls.certresolver=myresolver"
      - "traefik.http.routers.${newsName}router.service=newsservice@docker"
      - "traefik.http.services.${newsName}service.loadbalancer.server.port=3100"
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
      - traefik

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
    command:
      - "--log.level=ERROR"
      - "--api.insecure=false"
      - "--providers.docker=true"
      - "--providers.docker.exposedbydefault=false"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.myresolver.acme.tlschallenge=true"
      - "--certificatesresolvers.myresolver.acme.email=${supportEmail}"
      - "--certificatesresolvers.myresolver.acme.storage=/letsencrypt/acme.json"
      - " traefik.docker.network=app-network"
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

	const dockerfile = `
FROM node:15
WORKDIR "/app"
COPY package*.json ./
RUN npm install
RUN apt-get update
RUN apt-get install -y mariadb-client
COPY . /app
EXPOSE 3000

ENTRYPOINT ["bash", "-c"]
CMD ["mysql --host=database --user=root --password=${databaseRootPassword} < ./startup.sql && npm start"]
`;

	const scriptfile = `
CREATE DATABASE IF NOT EXISTS ${projectName};
CREATE USER IF NOT EXISTS '${projectDBUser}'@'%' IDENTIFIED BY '${projectDBPass}';
GRANT ALL PRIVILEGES ON ${projectName}.* TO '${projectDBUser}'@'%';

CREATE DATABASE IF NOT EXISTS ${newsName};
CREATE USER IF NOT EXISTS '${newsDBUser}'@'%' IDENTIFIED BY '${newsDBPass}';
GRANT ALL PRIVILEGES ON ${newsName}.* TO '${newsDBUser}'@'%';

FLUSH PRIVILEGES;
`;

	fs.writeFileSync('docker-compose.yml', yml);
	fs.writeFileSync('Dockerfile', dockerfile);
	fs.writeFileSync('startup.sql', scriptfile);
})()
	.then(() => rl.close())
	.catch(e => console.error(e))
;

