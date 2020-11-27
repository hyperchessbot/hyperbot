# Creating a MongoDb account

## Prerequisites

Gmail account.

## Sign up

Visit https://account.mongodb.com/account/register .

Choose Sign up with Google

![](https://i.imgur.com/aO7RQjP.png)

Choose the Gmail account you want to use for signing up.

Accept privacy policy and terms of service

![](https://i.imgur.com/O4GxgLS.png)

You will be asked to name your organization and project ( in lack of better idea it is safe to accept the defaults )

![](https://i.imgur.com/hSADaqk.png)

Select your preferred programming language, then press Continue

![](https://i.imgur.com/vb9fRbA.png)

Create a FREE cluster

![](https://i.imgur.com/qr6Wxcv.png)

Edit your account details ( it is safe to accept defaults ), then press Create Cluster

![](https://i.imgur.com/j7vWBUi.png)

## Setting up database

From the Get Started guide select Create your first database user

![](https://i.imgur.com/FmjY0L4.png)

Click on Database Access

![](https://i.imgur.com/v0K5h71.png)

Click on Add New Database User

![](https://i.imgur.com/tSvDTwq.png)

For Authentication Method select "Password", and enter a username ( consisting of only small cap letters, don't use any special characters, **`YoBot_v2`** not good, **`yobotversiontwo`** good ) and password ( in the image a password containing special characters was typed in manually, which is not a good idea, because this needs url encoding due to special characters, so it is safest to press **Autogenerate Secure Password** and SHOW / Copy this auto generated password )

![](https://i.imgur.com/F5WigqF.png)

From Database User Privileges select Atlas admin, then press Add User

![](https://i.imgur.com/0n1zVVi.png)

You can add further users to your database by pressing ADD NEW DATABASE USER, but we will be content with one user

![](https://i.imgur.com/pjcDowD.png)

Click on Network Access

![](https://i.imgur.com/UPaLOOK.png)

Click on Add IP Address

![](https://i.imgur.com/8KbHrXM.png)

Select Allow access from anywhere then press Confirm

![](https://i.imgur.com/NEAYcuj.png)

From the Get Started guide select Connect to your cluster, then press Connect

![](https://i.imgur.com/a4kIDHq.png)

## Obtaining MONGODB_URI

Select Connect your application

![](https://i.imgur.com/Uflg9Y2.png)

Copy your connection string and replace the password with your database user's password, delete everything from /dbname onward, you won't need this.

![](https://i.imgur.com/6sPNvSA.png)

If you copied

```
mongodb+srv://hyperchessbot:<password>@cluster0.bv7tb.mongodb.net/<dbname>?retryWrites=true&w=majority
```

edit it to

```
mongodb+srv://hyperchessbot:youractualpassword@cluster0.bv7tb.mongodb.net
```

and save this as a Heroku config var under the key `MONGODB_URI` .

Of course instead of hyperchessbot you need your actual database user name ( but this will be filled in for you, when you copy ).

**There should be no forward slash at the end of `MONGODB_URI`!**