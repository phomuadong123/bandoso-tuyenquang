FROM node:20-alpine as build

WORKDIR /app

# Copy toàn bộ project vào
COPY package*.json ./
RUN npm install

COPY . .

# Build Vite → dist
RUN npm run build

FROM nginx:alpine

# Copy dist → html
COPY --from=build /app/dist/ /usr/share/nginx/html/

# Copy public → html (ảnh nằm trong public/images)
COPY --from=build /app/public/ /usr/share/nginx/html/

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]