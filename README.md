# Website
My personal website, find it at TODO

### Technologies:
- Django

### Helpful resources used:
- official [Django docs](https://docs.djangoproject.com)
- InternetingIsHard.com's [HTML/CSS tutorial](https://www.internetingishard.com/html-and-css/)

### Project Structure
`bio/`: app handling the static 'Home' and 'About' pages

### Deployment
To run the webserver locally
1. Verify you have python3 installed ([How to install](https://realpython.com/installing-python/)). You can test with the following command

        $ python3 --version
        Python 3.10.6

2. Clone this repository and `cd` into the dir
3. Create a virtual environment with Python's `venv`

        $ python3 -m venv env

4. Activate the virtual environment

        $ source env/bin/activate

5. Install dependencies

        $ pip install -r requirements.txt

6. Start the server

        $ python manage.py runserver

The website will be live at http://localhost:8000/
