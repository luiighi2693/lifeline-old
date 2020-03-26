FROM nginx:alpine

COPY /dist /usr/share/nginx/html/
#COPY /glammy_full_noimage /usr/share/nginx/html/
#docker run --rm -d --name nginx -p 80:80 -v c:/sources/e4gslab/claro-lifeline/dist:/usr/share/nginx/html nginx:alpine

EXPOSE 80
