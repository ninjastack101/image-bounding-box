### App : Draw the border box on image :


Heroku url : https://immense-depths-26985.herokuapp.com/


### Techstack :

1. Python 3.x

2. Django 1.11

3. Postgres


### Setup :

Create virtual environment :


> virtualenv -p python3.6 envs


Activate virtual environment :


> . envs/bin/activate


Clone the repo :


> git clone <repo-url>


Install the dependencies :


> pip install -r requirements.txt


Run db migrations :


> python manage.py migrate


Run local server :


> python manage.py runserver 



### Functionality :


1. Save button : When finish the drawing click the save button, it saves your drawing in db. 

2. Reset button : When want to reset the drawing click the reset button, it reset your drawing from db.

3. To draw the rectangle/line select the rectangle shape and click on the image box. 


