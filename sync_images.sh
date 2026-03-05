#!/bin/bash

# Define paths and credentials
frontend_dir="velnox-frontend"
server="user@mail.irbis.ua"
remote_dir="/srv/projects/velnox/frontend/"
pass="12345678"

# Safety check for basePath in next.config.mjs to avoid double prepending
if ! grep -q "basePath: \"/velnox\"" $frontend_dir/next.config.mjs; then
  sed -i '' 's/const nextConfig = {/const nextConfig = {\n    basePath: "\/velnox",/' $frontend_dir/next.config.mjs
fi

# Prepend /velnox to all occurrences of /images
find $frontend_dir/src -type f \( -name "*.tsx" -o -name "*.ts" -o -name "*.css" \) -print0 | xargs -0 sed -i '' -e 's|src="/images|src="/velnox/images|g' -e 's|url("/images|url("/velnox/images|g' -e "s|url('/images|url('/velnox/images|g"

# Using rsync to transfer the updated source folder efficiently
echo "Pushing updated frontend to server..."
sshpass -p "$pass" rsync -av --exclude="node_modules" --exclude=".next" --exclude=".git" $frontend_dir/ $server:$remote_dir

# Remotely rebuild Next.js and restart the service
echo "Rebuilding the Next.js application remotely..."
sshpass -p "$pass" ssh -o StrictHostKeyChecking=no $server "echo '$pass' | sudo -S chown -R user:user $remote_dir && cd $remote_dir && npm run build && echo '$pass' | sudo -S systemctl restart velnox-frontend"

echo "Done!"
