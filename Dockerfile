# Dockerfile
FROM node:18-alpine

# Carpeta de trabajo dentro del contenedor
WORKDIR /app

# Copiar los archivos necesarios
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar el resto del código
COPY . .

# Exponer el puerto de NestJS
EXPOSE 3000

# Comando por defecto
CMD ["npm", "run", "start:dev"]
