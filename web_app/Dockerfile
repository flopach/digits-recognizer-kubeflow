#
# Dockerfile for installing nginx on IOx enabled platforms
#

# ARM or x86
FROM nginx:alpine
#FROM arm64v8/nginx:alpine

# copy files
COPY nginx.conf /etc/nginx/nginx.conf
RUN mkdir -p /www/html
COPY index.html /www/html/index.html
COPY js_code.js /www/html/js_code.js
COPY stylesheet.css /www/html/stylesheet.css
COPY tf.min.js /www/html/tf.min.js

# open ports
EXPOSE 8000

ENTRYPOINT nginx -g 'daemon off;'