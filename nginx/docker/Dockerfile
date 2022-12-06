FROM nginx

RUN apt-get -yq update && \
    apt-get -yq upgrade

COPY ./allow-cloudflare-only.sh /docker-entrypoint.d/allow-cloudflare-only.sh

WORKDIR /app

RUN chown -R nginx:nginx /app && chmod -R 755 /app && \
        chown -R nginx:nginx /var/cache/nginx && \
        chown -R nginx:nginx /var/log/nginx && \
        chown -R nginx:nginx /etc/nginx/conf.d && \
        chown -R nginx:nginx /docker-entrypoint.d

RUN touch /var/run/nginx.pid && \
        chown -R nginx:nginx /var/run/nginx.pid

USER nginx
