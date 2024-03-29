#!/usr/bin/env bash
# exit on error
set -o errexit

pip install -r requirements.txt

npm install
npm run build

python manage.py migrate
python manage.py createsuperuser --no-input || true
python manage.py collectstatic --no-input
