FROM node:12.18.3
WORKDIR /code
COPY . /code/
RUN npm i
RUN npm build
CMD npm start
EXPOSE 5000