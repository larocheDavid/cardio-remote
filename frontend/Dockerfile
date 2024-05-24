# Étape 1: Construire l'application React
FROM node:alpine AS build

WORKDIR /app
COPY ./package.json ./package-lock.json ./
RUN npm install
COPY . ./
RUN npm run build

# Étape 2: Servir l'application React construite avec Nginx
FROM nginx:alpine

# Copie des fichiers construits à partir de l'étape de build
COPY --from=build /app/build /usr/share/nginx/html

#Copie des configurations Nginx et des certificats SSL
COPY ./nginx/nginx.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/nginx.crt /etc/nginx/ssl/nginx.crt
COPY ./nginx/nginx.key /etc/nginx/ssl/nginx.key

#EXPOSE 443
#EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

