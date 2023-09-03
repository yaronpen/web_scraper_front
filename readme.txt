Instructions for setting up this solution:
Back end:
Clone from Github.
Open a terminal, navigate to project's folder and enter 'composer install', afterwards, set up your .env file (I didn't upload mine out of security reasons).
I assume you already have MongoDB and PHP installed and modified for this set up
Please write in the terminal 'php artisan serve'. That's it, the back end is up.
If you want to test the back end with Postman, the requests will look like this:
{
	"url": <number>,
	"depth": <number>
}
The http method for this request is post, if you want to update an existing record, the request looks exactly the same, only the method is put.

Front:
Clone from Github
Open a terminal, navigate to project's folder and press 'npm install'. If you wish to run the development version, write 'npm run start', open a web browser and navigate to this address:
http://localhost:4200/

Some discussion:
1. I used Laravel 9 and not 10, because I didn't want to compile by my self the php extension for MongoDB (couldn't find already compiled version that was suited to
the Laravel MongoDB package), making you doing it as well, as I don't know how your environment look like. Hope this is fine.
2. I separated the front from the back completley although I know I could've bundle them with laravel, I didn't do it as I wanted to create a sort of a micro service
environment (This way it's easier to set it up with containers or to replace one service more easily).
3. I really enjoyed writing this solution and hope to hear from you, or to hear some feedback.
Thanks,
Yaron.