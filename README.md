##My Portfolio Site

### To Deploy:
- sudo apt-get update
- ssh-keygen
  - (add to Github)
- wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
  - (install nvm)
- nvm install 16.13.0
- npm install pm2 -g
- git clone XXXX
  - git submodule init
  - git submodule update --recursive
- CERTBOT:
  - sudo snap install core; sudo snap refresh core
  - sudo snap install --classic certbot
  - sudo ln -s /snap/bin/certbot /usr/bin/certbot
  - sudo certbot certonly --webroot
  - sudo chown -R /etc/letsencrypt

- SERVER PORT BINDING
  - sudo apt-get install libcap2-bin
  - sudo setcap cap_net_bind_service=+ep [PATH/TO/NODE/EXE]
    - which node

