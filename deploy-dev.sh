# !/bin/bash
# Get servers list:
set — f
# Variables from GitLab server:
string=$SERVER_DEV
echo "${string}"

# Iterate servers for deploy and pull last commit
# Careful with the ; https://stackoverflow.com/a/20666248/1057052
echo "Deploy project on server ${string}"
ssh ${string} "rm -rf app &&  mkdir app && cd front-end-react && git pull origin master && npm install && npm run build && cd build && cp -r * ../../app && cd /var/www/artificio.ai/app && sudo rm -rf * && sudo cp -R /home/ec2-user/app/* . && sudo chown -R nginx:nginx * && sudo systemctl restart nginx.service"