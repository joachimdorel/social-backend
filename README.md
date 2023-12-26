# Social backend

A backend coded in Node JS for a small social network.

## How to start the project

### In development mode
In this mode, nodemon is used to recompile the code each time a change is saved.  
```npm run dev```

### Normal start
```npm start```

## To start the database

The backend works with PostgreSQL. To install and start the database on mac os:

```npm install pg```

```brew services start postgresql```

And then to connect to the database:
```psql -U database_names```

Now you can interact with the database (create table, datas, queries...).