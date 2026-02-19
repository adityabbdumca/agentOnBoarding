echo "Injecting runtime environment variables..."

sed -i "s|__VITE_APP_NAME__|${VITE_APP_NAME}|g" /usr/share/nginx/html/env.js
sed -i "s|__VITE_API_URL__|${VITE_API_URL}|g" /usr/share/nginx/html/env.js
sed -i "s|__VITE_EXCEL_URL__|${VITE_EXCEL_URL}|g" /usr/share/nginx/html/env.js
sed -i "s|__VITE_APP_BASE_PATH__|${VITE_APP_BASE_PATH}|g" /usr/share/nginx/html/env.js

exec nginx -g "daemon off;"