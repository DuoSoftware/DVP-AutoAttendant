#FROM ubuntu
#RUN apt-get update
#RUN apt-get install -y git nodejs npm
#RUN git clone git://github.com/DuoSoftware/DVP-AutoAttendant.git /usr/local/src/autoattendant
#RUN cd /usr/local/src/autoattendant; npm install
#CMD ["nodejs", "/usr/local/src/autoattendant/app.js"]

#EXPOSE 8824

FROM node:argon
RUN git clone git://github.com/DuoSoftware/DVP-AutoAttendant.git /usr/local/src/autoattendant
RUN cd /usr/local/src/autoattendant;
WORKDIR /usr/local/src/autoattendant
RUN npm install
EXPOSE 8824
CMD [ "node", "/usr/local/src/autoattendant/app.js" ]
