FROM ubuntu
RUN apt-get update
RUN apt-get install -y git nodejs npm
RUN git clone git://github.com/DuoSoftware/DVP-AutoAttendant.git /usr/local/src/autoattendant
RUN cd /usr/local/src/autoattendant; npm install
CMD ["nodejs", "/usr/local/src/autoattendant/app.js"]

EXPOSE 8824